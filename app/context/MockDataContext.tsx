"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Society = {
    id: string; name: string; acronym: string; members: number; status: string;
    description?: string; email?: string; website?: string; whatsapp?: string;
    logo?: string;
    cover_url?: string;
    join_code?: string;
};

export type GlobalAdmin = { id: string; name: string; email: string; role: string; scope: string };

export type AppUser = {
    id: string; name: string; email: string;
    societyIds: string[];
    joined: string; role: string; team: string; status: string;
};

export type PendingUser = { id: string; name: string; email: string; society: string; societyId: string; time: string; status: string };


export type Team = { id: string; name: string; members: number; leads: string[]; color: string; type: string; society_id: string };

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
    userId: string;
    name: string;
    email: string;
    teamRole: TeamRole;
    joinedAt: string;
};


export const TEAM_ROLE_PERMISSIONS: Record<TeamRole, { canAddToBoard: boolean; canAssign: boolean; canComment: boolean; canManageMembers: boolean; canDelete: boolean }> = {
    "Director": { canAddToBoard: true, canAssign: true, canComment: true, canManageMembers: false, canDelete: true },
    "Deputy Director": { canAddToBoard: true, canAssign: true, canComment: true, canManageMembers: false, canDelete: true },
    "HR": { canAddToBoard: true, canAssign: true, canComment: true, canManageMembers: true, canDelete: true },
    "Executive": { canAddToBoard: false, canAssign: false, canComment: true, canManageMembers: false, canDelete: false },
};

// ─── Context type ─────────────────────────────────────────────────────────────

type MockDataContextType = {
    societies: Society[];
    admins: GlobalAdmin[];
    users: AppUser[];
    allRegisteredUsers: { id: string; name: string; email: string }[];
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
    removeUser: (userId: string, societyId: string) => Promise<void>;
    updateUserRole: (userId: string, societyId: string, role: string) => Promise<void>;
    approvePendingUser: (id: string, role: string, team: string) => void;
    rejectPendingUser: (id: string) => void;

    addTeam: (team: Omit<Team, "id"> & { society_id: string }) => Promise<void>;
    removeTeam: (id: string) => Promise<void>;
    addOfficeBearerRole: (ob: OfficeBearerRole) => void;
    updateOfficeBearerRole: (id: string, updates: Partial<OfficeBearerRole>) => void;
    removeOfficeBearerRole: (id: string) => void;
    addTeamMember: (teamId: string, userId: string, role?: TeamRole) => Promise<void>;
    removeTeamMember: (memberId: string) => Promise<void>;

    updateTeamMemberRole: (teamId: string, memberId: string, role: TeamRole) => void;

    // Board Actions
    addBoardList: (teamId: string, title: string) => Promise<void>;
    updateBoardList: (listId: string, title: string) => Promise<void>;
    addBoardCard: (listId: string, title: string) => Promise<void>;
    updateBoardCard: (cardId: string, updates: any) => Promise<void>;
    removeBoardCard: (cardId: string) => Promise<void>;
    updateCardStatus: (cardId: string, isCompleted: boolean) => Promise<void>;
    moveCard: (cardId: string, newListId: string) => Promise<void>;
    removeBoardList: (listId: string) => Promise<void>;
};

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export function MockDataProvider({ children }: { children: ReactNode }) {
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(true);
    const [societies, setSocieties] = useState<Society[]>([]);
    const [admins, setAdmins] = useState<GlobalAdmin[]>([]);
    const [users, setUsers] = useState<AppUser[]>([]);
    const [allRegisteredUsers, setAllRegisteredUsers] = useState<{ id: string; name: string; email: string }[]>([]);
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

            // Fetch All Registered Profiles
            const { data: allProfilesData } = await supabase.from('profiles').select('id, full_name, email');
            if (allProfilesData) {
                setAllRegisteredUsers(allProfilesData.map(p => ({ id: p.id, name: p.full_name || "Unknown", email: p.email || "No Email" })));
            }

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

            // Fetch Team Members
            const { data: memberData } = await supabase
                .from('team_members')
                .select('*, profiles(full_name, email)');

            const grouped: Record<string, TeamMember[]> = {};
            if (memberData) {
                memberData.forEach((m: any) => {
                    const tId = m.team_id;
                    if (!grouped[tId]) grouped[tId] = [];
                    grouped[tId].push({
                        id: m.id,
                        userId: m.user_id,
                        name: m.profiles?.full_name || "Unknown",
                        email: m.profiles?.email || "N/A",
                        teamRole: m.role as TeamRole,
                        joinedAt: m.joined_at
                    });
                });
                setTeamMembers(grouped);
            }


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

                    // Find if user is in any team
                    let teamName = profile.primary_team;
                    if (!teamName || teamName === "Unassigned") {
                        const userAssignment = memberData?.find((assignment: any) => assignment.user_id === m.user_id);
                        if (userAssignment) {
                            const team = teamData?.find(t => t.id === userAssignment.team_id);
                            if (team) teamName = team.name;
                        }
                    }
                    if (!teamName) teamName = "Unassigned";

                    if (m.status === 'Active') {
                        activeMembers.push({
                            id: m.user_id,
                            name: profile.full_name || "Unknown User",
                            email: profile.email || "No Email",
                            societyIds: [m.society_id],
                            joined: profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A',
                            role: m.role || "Executive",
                            team: teamName,
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

            const { data: cardData } = await supabase
                .from('board_cards')
                .select('*, profiles(full_name)')
                .order('position');

            if (cardData) {
                setBoardCards(cardData.map((c: any) => ({
                    ...c,
                    assigned_to_name: c.profiles?.full_name || null
                })));
            }




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
            .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => fetchData())
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
        // Handle join_code migration if it's changing
        if (updates.join_code) {
            const oldSociety = societies.find(s => s.id === id);
            if (oldSociety?.join_code && oldSociety.join_code !== updates.join_code) {
                console.log(`Migrating join code from ${oldSociety.join_code} to ${updates.join_code}`);
                await supabase.rpc('migrate_society_join_code', {
                    old_code: oldSociety.join_code,
                    new_code: updates.join_code
                });
            }
        }

        const { error } = await supabase.from('societies').update(updates).eq('id', id);
        if (error) throw error;
        setSocieties(societies.map(s => s.id === id ? { ...s, ...updates } : s));
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
            .update({ role: 'Executive' })
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

    const removeUser = async (userId: string, societyId: string) => {
        const { error } = await supabase
            .from('user_societies')
            .delete()
            .eq('user_id', userId)
            .eq('society_id', societyId);

        if (error) {
            console.error("Failed to remove user:", error.message);
            alert("Failed to remove user: " + error.message);
            return;
        }

        setUsers(prev => prev.filter(u => !(u.id === userId && u.societyIds.includes(societyId))));
    };

    const updateUserRole = async (userId: string, societyId: string, role: string) => {
        const { error } = await supabase
            .from('user_societies')
            .update({ role })
            .eq('user_id', userId)
            .eq('society_id', societyId);

        if (error) {
            console.error("Failed to update user role:", error.message);
            alert("Failed to update user role: " + error.message);
            return;
        }

        const { error: teamErr } = await supabase
            .from('team_members')
            .update({ role })
            .eq('user_id', userId);

        if (teamErr) {
            console.warn("Failed to propagate role to team_members:", teamErr.message);
        }

        setTeamMembers(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(tId => {
                next[tId] = next[tId].map(member =>
                    member.userId === userId ? { ...member, teamRole: role as TeamRole } : member
                );
            });
            return next;
        });

        setUsers(prev => prev.map(u =>
            (u.id === userId && u.societyIds.includes(societyId))
                ? { ...u, role }
                : u
        ));
    };

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

            // Also insert them explicitly into the requested team_members group
            const matchTeam = teams.find(t => t.name === team);
            if (matchTeam) {
                await supabase.from('team_members').insert([{ team_id: matchTeam.id, user_id: id, role: role }]);
                setTeamMembers(prev => {
                    const existing = prev[matchTeam.id] || [];
                    return {
                        ...prev,
                        [matchTeam.id]: [...existing, {
                            id: crypto.randomUUID(),
                            userId: id,
                            name: pending.name,
                            email: pending.email,
                            teamRole: role as TeamRole,
                            joinedAt: new Date().toISOString()
                        }]
                    };
                });
            }
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



    const addTeam = async (teamData: Omit<Team, "id"> & { society_id: string }) => {
        const { data, error } = await supabase
            .from('teams')
            .insert([{
                name: teamData.name,
                color: teamData.color,
                type: teamData.type,
                members: teamData.members,
                leads: teamData.leads,
                society_id: teamData.society_id
            }])
            .select()
            .single();

        if (error) {
            console.error("Error creating team:", error.message);
            alert("Failed to create team: " + error.message);
            return;
        }

        if (data) {
            setTeams(prev => [...prev, data as Team]);
        }
    };

    const removeTeam = async (id: string) => {
        const { error } = await supabase.from('teams').delete().eq('id', id);
        if (error) {
            console.error("Error deleting team:", error.message);
            alert("Failed to delete team: " + error.message);
            return;
        }
        setTeams(prev => prev.filter(t => t.id !== id));
    };

    const addOfficeBearerRole = async (ob: OfficeBearerRole) => {
        // Requires looking up profile ID by email/name usually
        setOfficeBearers([...officeBearers, ob]);
    };

    const updateOfficeBearerRole = (id: string, updates: Partial<OfficeBearerRole>) =>
        setOfficeBearers(officeBearers.map(ob => ob.id === id ? { ...ob, ...updates } : ob));

    const removeOfficeBearerRole = (id: string) => setOfficeBearers(officeBearers.filter(ob => ob.id !== id));

    const addTeamMember = async (teamId: string, userId: string, role: TeamRole = "Executive") => {
        // 1. Get Team Name for primary_team sync
        const { data: teamInfo } = await supabase.from('teams').select('name').eq('id', teamId).single();

        // 2. Insert into team_members
        const { error: memberError } = await supabase
            .from('team_members')
            .insert([{ team_id: teamId, user_id: userId, role }]);

        if (memberError && memberError.code !== '23505') {
            console.error("Error adding team member:", memberError.message);
            alert("Failed to add member: " + memberError.message);
            return;
        }

        // 3. Sync to profiles.primary_team (Always sync even if assignment already existed)
        if (teamInfo) {
            console.log(`Syncing user ${userId} to team ${teamInfo.name}`);
            await supabase.from('profiles').update({ primary_team: teamInfo.name }).eq('id', userId);
        }


        // 4. Increment team count (optional but good for consistency if we use team.members)
        await supabase.rpc('increment_team_members', { t_id: teamId });
    };



    const removeTeamMember = async (memberId: string) => {
        // 1. Get member info before delete
        const { data: memberInfo } = await supabase.from('team_members').select('user_id, team_id').eq('id', memberId).single();

        // 2. Delete record
        const { error: delError } = await supabase
            .from('team_members')
            .delete()
            .eq('id', memberId);

        if (delError) {
            console.error("Error removing team member:", delError.message);
            alert("Failed to remove member: " + delError.message);
            return;
        }

        // 3. Clear profile primary_team and decrement count
        if (memberInfo) {
            await supabase.from('profiles').update({ primary_team: "" }).eq('id', memberInfo.user_id);
            await supabase.rpc('decrement_team_members', { t_id: memberInfo.team_id });
        }
    };



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

    const updateBoardList = async (listId: string, title: string) => {
        const { error } = await supabase.from('board_lists').update({ title }).eq('id', listId);
        if (!error) setBoardLists(boardLists.map(l => l.id === listId ? { ...l, title } : l));
    };

    const addBoardCard = async (listId: string, title: string) => {
        const { data, error } = await supabase.from('board_cards').insert([{
            list_id: listId,
            title,
            position: boardCards.filter(c => c.list_id === listId).length
        }]).select().single();
        if (!error && data) setBoardCards([...boardCards, data]);
    };

    const updateBoardCard = async (cardId: string, updates: any) => {
        const { error } = await supabase.from('board_cards').update(updates).eq('id', cardId);
        if (!error) {
            let finalUpdates = { ...updates };
            if (updates.hasOwnProperty('assigned_to')) {
                const newId = updates.assigned_to;
                if (!newId) {
                    finalUpdates.assigned_to_name = null;
                } else {
                    // Try to find name in teamMembers or allRegisteredUsers
                    let foundName = null;
                    Object.values(teamMembers).some(list => {
                        const m = list.find(mem => mem.userId === newId);
                        if (m) { foundName = m.name; return true; }
                        return false;
                    });
                    if (!foundName) {
                        const u = allRegisteredUsers.find(au => au.id === newId);
                        if (u) foundName = u.name;
                    }
                    if (foundName) finalUpdates.assigned_to_name = foundName;

                    // Insert Notification
                    const cardData = boardCards.find(c => c.id === cardId);
                    const taskTitle = updates.title || cardData?.title || 'a task';

                    await supabase.from('notifications').insert([{
                        user_id: newId,
                        type: 'assignment',
                        message: `You've been assigned to the task: "${taskTitle}"`,
                        related_entity_id: cardId
                    }]);
                }
            }
            setBoardCards(boardCards.map(c => c.id === cardId ? { ...c, ...finalUpdates } : c));
        }
    };

    const updateCardStatus = async (cardId: string, isCompleted: boolean) => {
        const { error } = await supabase.from('board_cards').update({ is_completed: isCompleted }).eq('id', cardId);
        if (!error) setBoardCards(boardCards.map(c => c.id === cardId ? { ...c, is_completed: isCompleted } : c));
    };

    const moveCard = async (cardId: string, newListId: string) => {
        const { error } = await supabase.from('board_cards').update({ list_id: newListId }).eq('id', cardId);
        if (!error) setBoardCards(boardCards.map(c => c.id === cardId ? { ...c, list_id: newListId } : c));
    };

    const removeBoardCard = async (cardId: string) => {
        const { error } = await supabase.from('board_cards').delete().eq('id', cardId);
        if (!error) setBoardCards(prev => prev.filter(c => c.id !== cardId));
    };

    const removeBoardList = async (listId: string) => {
        const { error } = await supabase.from('board_lists').delete().eq('id', listId);
        if (!error) {
            setBoardLists(prev => prev.filter(l => l.id !== listId));
            setBoardCards(prev => prev.filter(c => c.list_id !== listId));
        }
    };

    return (
        <MockDataContext.Provider value={{
            societies, admins, users, allRegisteredUsers, pendingUsers, teams, officeBearers, teamMembers, boardLists, boardCards, isLoading,
            addSociety, updateSociety,
            addAdmin: addGlobalAdmin,
            removeAdmin: removeGlobalAdmin,
            makeSocietyAdmin, revokeSocietyAdmin,
            addUser, removeUser, updateUserRole,
            approvePendingUser, rejectPendingUser, addTeam, removeTeam,
            addOfficeBearerRole, updateOfficeBearerRole, removeOfficeBearerRole,
            addTeamMember, removeTeamMember, updateTeamMemberRole,
            addBoardList, updateBoardList, removeBoardList, addBoardCard, updateBoardCard, removeBoardCard, updateCardStatus, moveCard,
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
