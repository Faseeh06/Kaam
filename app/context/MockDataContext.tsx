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

export type PendingUser = { id: string; name: string; email: string; society: string; time: string; status: string };

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
    isLoading: boolean;

    addSociety: (soc: Society) => void;
    updateSociety: (id: string, updates: Partial<Society>) => void;
    addAdmin: (admin: GlobalAdmin) => void;
    removeAdmin: (id: string) => void;
    addUser: (user: AppUser) => void;
    removeUser: (id: string) => void;
    approvePendingUser: (id: string, role: string, team: string) => void;
    rejectPendingUser: (id: string) => void;
    addTeam: (team: Team) => void;
    addOfficeBearerRole: (ob: OfficeBearerRole) => void;
    updateOfficeBearerRole: (id: string, updates: Partial<OfficeBearerRole>) => void;
    removeOfficeBearerRole: (id: string) => void;
    addTeamMember: (teamId: string, member: TeamMember) => void;
    removeTeamMember: (teamId: string, memberId: string) => void;
    updateTeamMemberRole: (teamId: string, memberId: string, role: TeamRole) => void;
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

    // ─── Fetch Data ───────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch Societies
                const { data: socData } = await supabase.from('societies').select('*');
                if (socData) setSocieties(socData);

                // Fetch Teams
                const { data: teamData } = await supabase.from('teams').select('*');
                if (teamData) setTeams(teamData);

                // Fetch Admins (Global Admins From Profiles)
                const { data: adminProfiles } = await supabase.from('profiles').select('*').eq('is_global_admin', true);
                if (adminProfiles) {
                    setAdmins(adminProfiles.map(p => ({
                        id: p.id,
                        name: p.full_name,
                        email: p.email,
                        role: "Super Admin",
                        scope: "Global"
                    })));
                }

                // Fetch Users (Join Profiles + User_Societies)
                const { data: profileData } = await supabase.from('profiles').select('*, user_societies(*)');
                if (profileData) {
                    setUsers(profileData.map(p => ({
                        id: p.id,
                        name: p.full_name,
                        email: p.email,
                        societyIds: p.user_societies?.map((us: any) => us.society_id) || [],
                        joined: new Date(p.created_at).toLocaleDateString(),
                        role: "Member",
                        team: p.primary_team || "Unassigned",
                        status: "Active"
                    })));
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

            } catch (err) {
                console.error("Error fetching context data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─── Actions (Now wired to Supabase) ───────────────────────────

    const addSociety = async (soc: Society) => {
        const { error } = await supabase.from('societies').insert([soc]);
        if (!error) setSocieties([...societies, soc]);
    };

    const updateSociety = async (id: string, updates: Partial<Society>) => {
        const { error } = await supabase.from('societies').update(updates).eq('id', id);
        if (!error) setSocieties(societies.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const addAdmin = async (admin: GlobalAdmin) => {
        const { error } = await supabase.from('profiles').update({ is_global_admin: true }).eq('id', admin.id);
        if (!error) setAdmins([...admins, admin]);
    };

    const removeAdmin = async (id: string) => {
        const { error } = await supabase.from('profiles').update({ is_global_admin: false }).eq('id', id);
        if (!error) setAdmins(admins.filter(a => a.id !== id));
    };

    const addUser = (user: AppUser) => setUsers([...users, user]);
    const removeUser = (id: string) => setUsers(users.filter(u => u.id !== id));

    const approvePendingUser = async (id: string, role: string, team: string) => {
        // Logic will shift to updating 'user_societies' role and 'profiles' team
        setPendingUsers(pendingUsers.filter(p => p.id !== id));
    };

    const rejectPendingUser = (id: string) => setPendingUsers(pendingUsers.filter(u => u.id !== id));

    const addTeam = async (team: Team) => {
        const { error } = await supabase.from('teams').insert([{
            id: team.id,
            name: team.name,
            color: team.color,
            type: team.type,
            members: team.members,
            leads: team.leads
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

    return (
        <MockDataContext.Provider value={{
            societies, admins, users, pendingUsers, teams, officeBearers, teamMembers, isLoading,
            addSociety, updateSociety, addAdmin, removeAdmin, addUser, removeUser,
            approvePendingUser, rejectPendingUser, addTeam,
            addOfficeBearerRole, updateOfficeBearerRole, removeOfficeBearerRole,
            addTeamMember, removeTeamMember, updateTeamMemberRole,
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
