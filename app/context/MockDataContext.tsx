"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export type Society = { id: string; name: string; acronym: string; members: number; status: string; description?: string; email?: string; website?: string; whatsapp?: string; };
export type GlobalAdmin = { id: string; name: string; email: string; role: string; scope: string };
export type AppUser = { id: string; name: string; email: string; society: string; joined: string; role: string; team: string; status: string };
export type PendingUser = { id: string; name: string; email: string; society: string; time: string; status: string };
export type Team = { id: string; name: string; members: number; leads: string[]; color: string; type: string };

type MockDataContextType = {
    societies: Society[];
    admins: GlobalAdmin[];
    users: AppUser[];
    pendingUsers: PendingUser[];
    teams: Team[];

    // Actions
    addSociety: (soc: Society) => void;
    updateSociety: (id: string, updates: Partial<Society>) => void;
    addAdmin: (admin: GlobalAdmin) => void;
    addUser: (user: AppUser) => void;
    removeUser: (id: string) => void;
    approvePendingUser: (id: string, role: string, team: string) => void;
    rejectPendingUser: (id: string) => void;
    addTeam: (team: Team) => void;
};

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
    { id: "1", name: "Alice Smith", email: "alice@student.edu", society: "Computer Science", joined: "Oct 12, 2025", role: "Team Lead", team: "Tech", status: "Active" },
    { id: "2", name: "Bob Johnson", email: "bob@student.edu", society: "Robotics Club", joined: "Nov 03, 2025", role: "Member", team: "Hardware", status: "Active" },
    { id: "3", name: "Charlie Davis", email: "charlie@student.edu", society: "Entrepreneurs", joined: "Jan 15, 2026", role: "Member", team: "Marketing", status: "Active" }
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

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export function MockDataProvider({ children }: { children: ReactNode }) {
    const [societies, setSocieties] = useState<Society[]>(initialSocieties);
    const [admins, setAdmins] = useState<GlobalAdmin[]>(initialAdmins);
    const [users, setUsers] = useState<AppUser[]>(initialUsers);
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>(initialPendingUsers);
    const [teams, setTeams] = useState<Team[]>(initialTeams);

    const addSociety = (soc: Society) => setSocieties([...societies, soc]);
    const updateSociety = (id: string, updates: Partial<Society>) =>
        setSocieties(societies.map(s => s.id === id ? { ...s, ...updates } : s));
    const addAdmin = (admin: GlobalAdmin) => setAdmins([...admins, admin]);
    const addUser = (user: AppUser) => setUsers([...users, user]);
    const removeUser = (id: string) => setUsers(users.filter(u => u.id !== id));
    const addTeam = (team: Team) => setTeams([...teams, team]);

    const approvePendingUser = (id: string, role: string, team: string) => {
        const userToApprove = pendingUsers.find(u => u.id === id);
        if (userToApprove) {
            setPendingUsers(pendingUsers.filter(u => u.id !== id));
            setUsers([...users, {
                id: `u-${Date.now()}`,
                name: userToApprove.name,
                email: userToApprove.email,
                society: userToApprove.society,
                joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                role,
                team,
                status: "Active"
            }]);
        }
    };

    const rejectPendingUser = (id: string) => {
        setPendingUsers(pendingUsers.filter(u => u.id !== id));
    };

    return (
        <MockDataContext.Provider value={{
            societies, admins, users, pendingUsers, teams,
            addSociety, updateSociety, addAdmin, addUser, removeUser, approvePendingUser, rejectPendingUser, addTeam
        }}>
            {children}
        </MockDataContext.Provider>
    );
}

export function useMockData() {
    const context = useContext(MockDataContext);
    if (context === undefined) {
        throw new Error("useMockData must be used within a MockDataProvider");
    }
    return context;
}
