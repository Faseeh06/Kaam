"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Society = {
    id: string; name: string; acronym: string; members: number; status: string;
    description?: string; email?: string; website?: string; whatsapp?: string;
    logo?: string; // base64 data URL or remote URL
};

export type GlobalAdmin = { id: string; name: string; email: string; role: string; scope: string };

export type AppUser = {
    id: string; name: string; email: string;
    societyIds: string[];   // user can belong to 1+ societies (by society id)
    joined: string; role: string; team: string; status: string;
};

export type PendingUser = { id: string; name: string; email: string; society: string; time: string; status: string };

export type Team = { id: string; name: string; members: number; leads: string[]; color: string; type: string };

// ─── Society Office Bearers ────────────────────────────────────────────────────
// Standard OB positions. President gets all teams; others get assigned team IDs only.
export type OBPosition = "President" | "General Secretary" | "Press Secretary" | "Treasurer" | string;

export type OfficeBearerRole = {
    id: string;
    name: string;
    email: string;
    position: OBPosition;
    assignedTeamIds: string[]; // empty = all (President), or specific team IDs
};

// ─── Team-level roles ──────────────────────────────────────────────────────────
// Permissions:
//   Director : add to board ✅ | assign tasks ✅ | comment ✅ | manage members ❌
//   Dep. Director: add to board ✅ | assign tasks ✅ | comment ✅ | manage members ❌
//   HR       : add to board ✅ | assign tasks ✅ | comment ✅ | manage members ✅
//   Executive: add to board ❌ | assign tasks ❌ | comment ✅ | manage members ❌
export type TeamRole = "Director" | "Deputy Director" | "HR" | "Executive";

export type TeamMember = {
    id: string;
    name: string;
    email: string;
    teamRole: TeamRole;
    joinedAt: string;
};

// Permissions helper
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
    teamMembers: Record<string, TeamMember[]>; // teamId → members

    // Actions
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

// ─── Initial Data ─────────────────────────────────────────────────────────────

const initialSocieties: Society[] = [
    { id: "1", name: "Computer Science Society", acronym: "CSS", members: 1200, status: "Active", description: "Empowering tech enthusiasts across campus.", email: "contact@css.edu", website: "https://css.example.com", whatsapp: "https://wa.me/923001234567" },
    { id: "2", name: "Entrepreneurs Network", acronym: "EN", members: 450, status: "Active", description: "Building the next generation of founders.", email: "en@uni.edu", whatsapp: "https://wa.me/923007654321" },
    { id: "3", name: "Robotics Club", acronym: "RC", members: 320, status: "Active", description: "Engineering the future, one robot at a time.", email: "rc@uni.edu" },
    { id: "4", name: "Literature & Debating", acronym: "LDS", members: 210, status: "Inactive", description: "Where words meet wisdom.", email: "lds@uni.edu" }
];

const initialAdmins: GlobalAdmin[] = [
    { id: "1", name: "Faseeh Ahmad", email: "faseeh@kaam.app", role: "Super Admin", scope: "Global" },
    { id: "2", name: "Sarah Jenkins", email: "president@css.edu", role: "Society President", scope: "Computer Science Society" },
    { id: "3", name: "Mike Logistics", email: "head@rc.edu", role: "Society President", scope: "Robotics Club" }
];

const initialUsers: AppUser[] = [
    { id: "1", name: "Alice Smith", email: "alice@student.edu", societyIds: ["1"], joined: "Oct 12, 2025", role: "Executive", team: "Creative & Design", status: "Active" },
    { id: "2", name: "Bob Johnson", email: "bob@student.edu", societyIds: ["1", "3"], joined: "Nov 03, 2025", role: "Director", team: "Operations & Logistics", status: "Active" },
    { id: "3", name: "Charlie Davis", email: "charlie@student.edu", societyIds: ["1"], joined: "Jan 15, 2026", role: "HR", team: "Marketing & Outreach", status: "Active" },
    { id: "4", name: "Emma Wilson", email: "emma@student.edu", societyIds: ["2"], joined: "Dec 01, 2025", role: "Executive", team: "Operations", status: "Active" },
    { id: "5", name: "David Kim", email: "david@student.edu", societyIds: ["2", "3"], joined: "Dec 10, 2025", role: "Director", team: "Tech", status: "Active" },
    { id: "6", name: "Priya Khan", email: "priya@student.edu", societyIds: ["3"], joined: "Jan 20, 2026", role: "Executive", team: "Design", status: "Active" },
];

const initialPendingUsers: PendingUser[] = [
    { id: "p1", name: "Emma Wilson", email: "emma.w@student.edu", society: "Event Management", time: "2 hours ago", status: "Pending" },
    { id: "p2", name: "David Kim", email: "dkim42@student.edu", society: "Event Management", time: "5 hours ago", status: "Pending" },
    { id: "p3", name: "Sophia Chen", email: "schen@univeristy.edu", society: "Event Management", time: "1 day ago", status: "Pending" }
];

const initialTeams: Team[] = [
    { id: "1", name: "Creative & Design", members: 12, leads: ["Sarah J.", "Mike L."], color: "bg-fuchsia-500", type: "Core" },
    { id: "2", name: "Operations & Logistics", members: 34, leads: ["Alex P."], color: "bg-blue-500", type: "Core" },
    { id: "3", name: "Marketing & Outreach", members: 21, leads: ["Emma W.", "David K."], color: "bg-emerald-500", type: "Core" },
    { id: "4", name: "Tech & IT", members: 8, leads: ["John Doe"], color: "bg-amber-500", type: "Support" },
    { id: "5", name: "Sponsorship", members: 5, leads: ["Rachel G."], color: "bg-violet-500", type: "Support" }
];

// Office Bearers — President gets all teams (assignedTeamIds: [])
const initialOfficeBearers: OfficeBearerRole[] = [
    { id: "ob1", name: "Sarah Jenkins", email: "president@css.edu", position: "President", assignedTeamIds: [] },
    { id: "ob2", name: "Omar Siddiqui", email: "gs@css.edu", position: "General Secretary", assignedTeamIds: ["1", "2", "3"] },
    { id: "ob3", name: "Layla Noor", email: "ps@css.edu", position: "Press Secretary", assignedTeamIds: ["3", "5"] },
    { id: "ob4", name: "Hamza Raza", email: "treasurer@css.edu", position: "Treasurer", assignedTeamIds: ["4", "5"] },
];

// Team members with role-based positions
const initialTeamMembers: Record<string, TeamMember[]> = {
    "1": [
        { id: "tm1", name: "Sarah J.", email: "sarah@kaam.app", teamRole: "Director", joinedAt: "Sep 2024" },
        { id: "tm2", name: "Mike L.", email: "mike@kaam.app", teamRole: "Deputy Director", joinedAt: "Oct 2024" },
        { id: "tm3", name: "Priya K.", email: "priya@student.edu", teamRole: "HR", joinedAt: "Nov 2024" },
        { id: "tm4", name: "Alice Smith", email: "alice@student.edu", teamRole: "Executive", joinedAt: "Oct 2025" },
        { id: "tm5", name: "Chris R.", email: "chris@student.edu", teamRole: "Executive", joinedAt: "Nov 2025" },
        { id: "tm6", name: "Liam O.", email: "liam@student.edu", teamRole: "Executive", joinedAt: "Jan 2026" },
    ],
    "2": [
        { id: "tm7", name: "Alex P.", email: "alex@kaam.app", teamRole: "Director", joinedAt: "Aug 2024" },
        { id: "tm8", name: "Bob Johnson", email: "bob@student.edu", teamRole: "Deputy Director", joinedAt: "Nov 2025" },
        { id: "tm9", name: "Natasha V.", email: "natasha@student.edu", teamRole: "HR", joinedAt: "Jan 2026" },
    ],
    "3": [
        { id: "tm10", name: "Emma W.", email: "emma@kaam.app", teamRole: "Director", joinedAt: "Sep 2024" },
        { id: "tm11", name: "David K.", email: "david@kaam.app", teamRole: "Deputy Director", joinedAt: "Oct 2024" },
        { id: "tm12", name: "Charlie Davis", email: "charlie@student.edu", teamRole: "HR", joinedAt: "Jan 2026" },
        { id: "tm13", name: "Sophia C.", email: "sophiac@student.edu", teamRole: "Executive", joinedAt: "Feb 2026" },
    ],
};

// ─── Context & Provider ───────────────────────────────────────────────────────

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export function MockDataProvider({ children }: { children: ReactNode }) {
    const [societies, setSocieties] = useState<Society[]>(initialSocieties);
    const [admins, setAdmins] = useState<GlobalAdmin[]>(initialAdmins);
    const [users, setUsers] = useState<AppUser[]>(initialUsers);
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>(initialPendingUsers);
    const [teams, setTeams] = useState<Team[]>(initialTeams);
    const [officeBearers, setOfficeBearers] = useState<OfficeBearerRole[]>(initialOfficeBearers);
    const [teamMembers, setTeamMembers] = useState<Record<string, TeamMember[]>>(initialTeamMembers);

    // Society
    const addSociety = (soc: Society) => setSocieties([...societies, soc]);
    const updateSociety = (id: string, updates: Partial<Society>) =>
        setSocieties(societies.map(s => s.id === id ? { ...s, ...updates } : s));

    // Admins
    const addAdmin = (admin: GlobalAdmin) => setAdmins([...admins, admin]);
    const removeAdmin = (id: string) => setAdmins(admins.filter(a => a.id !== id));

    // Users
    const addUser = (user: AppUser) => setUsers([...users, user]);
    const removeUser = (id: string) => setUsers(users.filter(u => u.id !== id));

    const approvePendingUser = (id: string, role: string, team: string) => {
        const u = pendingUsers.find(u => u.id === id);
        if (!u) return;
        // Find the society id that matches the pending user's society name
        const matchedSociety = societies.find(s =>
            s.name.toLowerCase().includes(u.society.toLowerCase()) ||
            u.society.toLowerCase().includes(s.acronym.toLowerCase())
        );
        setPendingUsers(pendingUsers.filter(p => p.id !== id));
        setUsers([...users, {
            id: `u-${Date.now()}`, name: u.name, email: u.email,
            societyIds: matchedSociety ? [matchedSociety.id] : ["1"],
            joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            role, team, status: "Active"
        }]);
    };
    const rejectPendingUser = (id: string) => setPendingUsers(pendingUsers.filter(u => u.id !== id));

    // Teams
    const addTeam = (team: Team) => setTeams([...teams, team]);

    // Office Bearers
    const addOfficeBearerRole = (ob: OfficeBearerRole) => setOfficeBearers([...officeBearers, ob]);
    const updateOfficeBearerRole = (id: string, updates: Partial<OfficeBearerRole>) =>
        setOfficeBearers(officeBearers.map(ob => ob.id === id ? { ...ob, ...updates } : ob));
    const removeOfficeBearerRole = (id: string) => setOfficeBearers(officeBearers.filter(ob => ob.id !== id));

    // Team Members (with roles)
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
            societies, admins, users, pendingUsers, teams, officeBearers, teamMembers,
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
