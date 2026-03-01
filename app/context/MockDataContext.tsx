"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Society = {
    id: string; name: string; acronym: string; members: number; status: string;
    description?: string; email?: string; website?: string; whatsapp?: string;
    logo?: string;
};

export type GlobalAdmin = { id: string; name: string; email: string; role: string; scope: string };

export type AppUser = {
    id: string; name: string; email: string;
    societyIds: string[];
    joined: string; role: string; team: string; status: string;
};

export type PendingUser = { id: string; name: string; email: string; society: string; societyId: string; time: string; status: string };


export type Team = { id: string; name: string; members: number; leads: string[]; color: string; type: string };

export type OBPosition = "President" | "General Secretary" | "Press Secretary" | "Treasurer" | string;

export type OfficeBearerRole = {
    id: string;
    name: string;
    email: string;
    position: OBPosition;
    assignedTeamIds: string[];
};

export type TeamRole = "Director" | "Deputy Director" | "HR" | "Executive";

export type TeamMember = {
    id: string;
    name: string;
    email: string;
    teamRole: TeamRole;
    joinedAt: string;
};

export const TEAM_ROLE_PERMISSIONS: Record<TeamRole, { canAddToBoard: boolean; canAssign: boolean; canComment: boolean; canManageMembers: boolean }> = {
    "Director": { canAddToBoard: true, canAssign: true, canComment: true, canManageMembers: false },
    "Deputy Director": { canAddToBoard: true, canAssign: true, canComment: true, canManageMembers: false },
    "HR": { canAddToBoard: true, canAssign: true, canComment: true, canManageMembers: true },
    "Executive": { canAddToBoard: false, canAssign: false, canComment: true, canManageMembers: false },
};

// ─── Context type ─────────────────────────────────────────────────────────────

type MockDataContextType = {
    societies: Society[];
    admins: GlobalAdmin[];
    users: AppUser[];
    pendingUsers: PendingUser[];
    teams: Team[];
    officeBearers: OfficeBearerRole[];
    teamMembers: Record<string, TeamMember[]>;
    boardLists: any[];
    boardCards: any[];
    isLoading: boolean;

    addSociety: (soc: Society) => void;
    updateSociety: (id: string, updates: Partial<Society>) => void;
    addAdmin: (admin: GlobalAdmin) => Promise<void>;
    removeAdmin: (id: string) => Promise<void>;
    makeSocietyAdmin: (userId: string, societyId: string, role: string) => Promise<void>;
    revokeSocietyAdmin: (userId: string, societyId: string) => Promise<void>;
    addUser: (user: AppUser) => void;
    removeUser: (id: string) => void;
    approvePendingUser: (id: string, role: string, team: string) => void;
    rejectPendingUser: (id: string) => void;

    addTeam: (team: Team & { society_id: string }) => Promise<void>;
    addOfficeBearerRole: (ob: OfficeBearerRole) => void;
    updateOfficeBearerRole: (id: string, updates: Partial<OfficeBearerRole>) => void;
    removeOfficeBearerRole: (id: string) => void;
    addTeamMember: (teamId: string, member: TeamMember) => void;
    removeTeamMember: (teamId: string, memberId: string) => void;
    updateTeamMemberRole: (teamId: string, memberId: string, role: TeamRole) => void;

    // Board Actions
    addBoardList: (teamId: string, title: string) => Promise<void>;
    addBoardCard: (listId: string, title: string) => Promise<void>;
    updateCardStatus: (cardId: string, isCompleted: boolean) => Promise<void>;
    moveCard: (cardId: string, newListId: string) => Promise<void>;
};

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export function MockDataProvider({ children }: { children: ReactNode }) {
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(true);
    const [societies, setSocieties] = useState<Society[]>([]);
    const [admins, setAdmins] = useState<GlobalAdmin[]>([]);
    const [users, setUsers] = useState<AppUser[]>([]);
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [officeBearers, setOfficeBearers] = useState<OfficeBearerRole[]>([]);
    const [teamMembers, setTeamMembers] = useState<Record<string, TeamMember[]>>({});
    const [boardLists, setBoardLists] = useState<any[]>([]);
    const [boardCards, setBoardCards] = useState<any[]>([]);

    // ─── Fetch Data ───────────────────────────────────────────────────────────
    // ─── Fetch Data (Wrapped in useCallback for Realtime) ───────────────────
    const fetchData = React.useCallback(async () => {
        // We only set loading on initial fetch to avoid flickering
        try {
            // Fetch Societies
            const { data: socData } = await supabase.from('societies').select('*');
            if (socData) setSocieties(socData);

            // Fetch Teams
            const { data: teamData } = await supabase.from('teams').select('*');
            if (teamData) setTeams(teamData);

            // Fetch Global Admins
            const { data: globalAdminData } = await supabase.from('profiles').select('*').eq('is_global_admin', true);

            // Fetch Society Admins
            const { data: societyAdminData } = await supabase
                .from('user_societies')
                .select('*, profiles(full_name, email), societies(name)')
                .in('role', ['Admin', 'Director', 'Deputy Director', 'HR', 'Society President', 'Vice President', 'Secretary', 'Treasurer', 'General Admin']);

            const allAdmins: GlobalAdmin[] = [];

            if (globalAdminData) {
                globalAdminData.forEach(p => {
                    allAdmins.push({
                        id: p.id,
                        name: p.full_name,
                        email: p.email,
                        role: "Super Admin",
                        scope: "Global"
                    });
                });
            }

            if (societyAdminData) {
                societyAdminData.forEach((m: any) => {
                    if (!allAdmins.some(a => a.id === m.user_id && a.scope === "Global")) {
                        allAdmins.push({
                            id: m.user_id,
                            name: m.profiles.full_name,
                            email: m.profiles.email,
                            role: m.role,
                            scope: m.societies.name
                        });
                    }
                });
            }
            setAdmins(allAdmins);

            // Fetch User Societies
            const { data: membershipData } = await supabase
                .from('user_societies')
                .select('*, profiles(full_name, email, created_at, primary_team), societies(name)');

            if (membershipData) {
                const activeMembers: AppUser[] = [];
                const pendingMembers: PendingUser[] = [];

                membershipData.forEach((m: any) => {
                    const profile = m.profiles;
                    const society = m.societies;
                    if (!profile) return;

                    if (m.status === 'Active') {
                        activeMembers.push({
                            id: m.user_id,
                            name: profile.full_name || "Unknown User",
                            email: profile.email || "No Email",
                            societyIds: [m.society_id],
                            joined: profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A',
                            role: m.role || "Member",
                            team: profile.primary_team || "Unassigned",
                            status: "Active"
                        });
                    } else {
                        pendingMembers.push({
                            id: m.user_id,
                            name: profile.full_name || "New Applicant",
                            email: profile.email || "No Email",
                            society: society?.name || "Unknown Society",
                            societyId: m.society_id,
                            time: profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Just now',
                            status: "Pending"
                        });
                    }
                });

                setUsers(activeMembers);
                setPendingUsers(pendingMembers);
            }

            // Fetch Office Bearers
            const { data: obData } = await supabase.from('office_bearers').select('*, profiles(full_name, email)');
            if (obData) {
                setOfficeBearers(obData.map(ob => ({
                    id: ob.id,
                    name: ob.profiles.full_name,
                    email: ob.profiles.email,
                    position: ob.position,
                    assignedTeamIds: ob.assigned_team_ids || []
                })));
            }

            // Fetch Board Lists/Cards
            const { data: listData } = await supabase.from('board_lists').select('*').order('position');
            if (listData) setBoardLists(listData);

            const { data: cardData } = await supabase.from('board_cards').select('*').order('position');
            if (cardData) setBoardCards(cardData);

        } catch (err) {
            console.error("Error fetching context data:", err);
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchData();

        // ─── Realtime Subscriptions ──────────────────────────────────────────
        const channel = supabase
            .channel('db-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'user_societies' }, () => fetchData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, () => fetchData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'board_lists' }, () => fetchData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'board_cards' }, () => fetchData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'societies' }, () => fetchData())
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, fetchData]);


    // ─── Actions (Now wired to Supabase) ───────────────────────────

    const addSociety = async (soc: Society) => {
        const { error } = await supabase.from('societies').insert([soc]);
        if (!error) setSocieties([...societies, soc]);
    };

    const updateSociety = async (id: string, updates: Partial<Society>) => {
        const { error } = await supabase.from('societies').update(updates).eq('id', id);
        if (!error) setSocieties(societies.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const addGlobalAdmin = async (admin: GlobalAdmin) => {
        const { error } = await supabase.from('profiles').update({ is_global_admin: true }).eq('id', admin.id);
        if (!error) setAdmins(prev => [...prev, { ...admin, scope: "Global", role: "Super Admin" }]);
    };

    const removeGlobalAdmin = async (id: string) => {
        const { error } = await supabase.from('profiles').update({ is_global_admin: false }).eq('id', id);
        if (!error) setAdmins(prev => prev.filter(a => !(a.id === id && a.scope === "Global")));
    };

    const makeSocietyAdmin = async (userId: string, societyId: string, role: string) => {
        const { error } = await supabase
            .from('user_societies')
            .upsert({
                user_id: userId,
                society_id: societyId,
                role: role,
                status: 'Active' // Auto-approve when made admin from super panel
            }, { onConflict: 'user_id,society_id' });

        if (!error) {
            const user = users.find(u => u.id === userId);
            const society = societies.find(s => s.id === societyId);
            if (user && society) {
                setAdmins(prev => [...prev.filter(a => !(a.id === userId && a.scope === society.name)), {
                    id: userId,
                    name: user.name,
                    email: user.email,
                    role: role,
                    scope: society.name
                }]);

                // Also update the user status in the users list
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Active', role: role } : u));
            }
        } else {
            console.error("Error making society admin:", error);
            throw error;
        }
    };

    const revokeSocietyAdmin = async (userId: string, societyId: string) => {
        // We can either delete the membership or demote to Member
        const { error } = await supabase
            .from('user_societies')
            .update({ role: 'Member' })
            .eq('user_id', userId)
            .eq('society_id', societyId);

        if (!error) {
            const society = societies.find(s => s.id === societyId);
            if (society) {
                setAdmins(prev => prev.filter(a => !(a.id === userId && a.scope === society.name)));
            }
        }
    };


    const addUser = (user: AppUser) => setUsers([...users, user]);
    const removeUser = (id: string) => setUsers(users.filter(u => u.id !== id));

    const approvePendingUser = async (id: string, role: string, team: string) => {
        const pending = pendingUsers.find(p => p.id === id);
        if (!pending) return;

        console.log("Attempting Approval for:", id, "in Society:", pending.societyId);

        const res = await supabase
            .from('user_societies')
            .update({ status: 'Active', role: role })
            .eq('user_id', id)
            .eq('society_id', pending.societyId)
            .select();

        console.log("Update database response:", res);

        if (res.error) {
            console.error("Database Error:", res.error.message);
            alert("Database Error: " + res.error.message);
            return;
        }

        if (!res.data || res.data.length === 0) {
            console.error("Zero rows updated. You likely don't have permission (RLS).");
            alert("Approval Failed: Database rejected the update. Please ensure you have run the latest SQL policies and that your own account is marked as an 'Active' admin.");
            return;
        }

        setPendingUsers(prev => prev.filter(p => p.id !== id));

        const newUser: AppUser = {
            id: id,
            name: pending.name,
            email: pending.email,
            societyIds: [pending.societyId],
            joined: pending.time,
            status: 'Active',
            role: role,
            team: team
        };
        setUsers(prev => [...prev, newUser]);

        if (team !== "Unassigned") {
            await supabase.from('profiles').update({ primary_team: team }).eq('id', id);
        }
    };


    const rejectPendingUser = async (id: string) => {
        const pending = pendingUsers.find(p => p.id === id);
        if (!pending) return;

        const { error } = await supabase
            .from('user_societies')
            .delete()
            .eq('user_id', id)
            .eq('society_id', pending.societyId);

        if (error) {
            console.error("Error rejecting user:", error.message);
            alert("Failed to reject user: " + error.message);
            return;
        }

        setPendingUsers(pendingUsers.filter(u => u.id !== id));
    };



    const addTeam = async (team: Team & { society_id: string }) => {
        const { error } = await supabase.from('teams').insert([{
            id: team.id,
            name: team.name,
            color: team.color,
            type: team.type,
            members: team.members,
            leads: team.leads,
            society_id: team.society_id
        }]);
        if (!error) setTeams([...teams, team]);
    };

    const addOfficeBearerRole = async (ob: OfficeBearerRole) => {
        // Requires looking up profile ID by email/name usually
        setOfficeBearers([...officeBearers, ob]);
    };

    const updateOfficeBearerRole = (id: string, updates: Partial<OfficeBearerRole>) =>
        setOfficeBearers(officeBearers.map(ob => ob.id === id ? { ...ob, ...updates } : ob));

    const removeOfficeBearerRole = (id: string) => setOfficeBearers(officeBearers.filter(ob => ob.id !== id));

    const addTeamMember = (teamId: string, member: TeamMember) =>
        setTeamMembers(prev => ({ ...prev, [teamId]: [...(prev[teamId] || []), member] }));

    const removeTeamMember = (teamId: string, memberId: string) =>
        setTeamMembers(prev => ({ ...prev, [teamId]: (prev[teamId] || []).filter(m => m.id !== memberId) }));

    const updateTeamMemberRole = (teamId: string, memberId: string, role: TeamRole) =>
        setTeamMembers(prev => ({
            ...prev,
            [teamId]: (prev[teamId] || []).map(m => m.id === memberId ? { ...m, teamRole: role } : m)
        }));

    const addBoardList = async (teamId: string, title: string) => {
        const { data, error } = await supabase.from('board_lists').insert([{
            team_id: teamId,
            title,
            position: boardLists.filter(l => l.team_id === teamId).length
        }]).select().single();
        if (!error && data) setBoardLists([...boardLists, data]);
    };

    const addBoardCard = async (listId: string, title: string) => {
        const { data, error } = await supabase.from('board_cards').insert([{
            list_id: listId,
            title,
            position: boardCards.filter(c => c.list_id === listId).length
        }]).select().single();
        if (!error && data) setBoardCards([...boardCards, data]);
    };

    const updateCardStatus = async (cardId: string, isCompleted: boolean) => {
        const { error } = await supabase.from('board_cards').update({ is_completed: isCompleted }).eq('id', cardId);
        if (!error) setBoardCards(boardCards.map(c => c.id === cardId ? { ...c, is_completed: isCompleted } : c));
    };

    const moveCard = async (cardId: string, newListId: string) => {
        const { error } = await supabase.from('board_cards').update({ list_id: newListId }).eq('id', cardId);
        if (!error) setBoardCards(boardCards.map(c => c.id === cardId ? { ...c, list_id: newListId } : c));
    };

    return (
        <MockDataContext.Provider value={{
            societies, admins, users, pendingUsers, teams, officeBearers, teamMembers, boardLists, boardCards, isLoading,
            addSociety, updateSociety,
            addAdmin: addGlobalAdmin,
            removeAdmin: removeGlobalAdmin,
            makeSocietyAdmin, revokeSocietyAdmin,
            addUser, removeUser,
            approvePendingUser, rejectPendingUser, addTeam,
            addOfficeBearerRole, updateOfficeBearerRole, removeOfficeBearerRole,
            addTeamMember, removeTeamMember, updateTeamMemberRole,
            addBoardList, addBoardCard, updateCardStatus, moveCard,
        }}>
            {children}
        </MockDataContext.Provider>
    );

}

export function useMockData() {
    const context = useContext(MockDataContext);
    if (context === undefined) throw new Error("useMockData must be used within a MockDataProvider");
    return context;
}
