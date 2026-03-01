"use client";

import { Users2, Star, Mail, LayoutGrid, Sparkles, ChevronRight, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useMockData } from "@/app/context/MockDataContext";

// Simulating the logged-in user belonging to team "1" (Creative & Design)
const MY_TEAM_ID = "1";
const MY_USER_ID = "1"; // Alice Smith

// Mock team member list — in production, this would come from Supabase by team_id
const MOCK_MEMBERS: Record<string, { id: string; name: string; email: string; role: string; isLead: boolean; joinedAt: string }[]> = {
    "1": [
        { id: "u1", name: "Sarah J.", email: "sarah@kaam.app", role: "Product Design Lead", isLead: true, joinedAt: "Sep 2024" },
        { id: "u2", name: "Mike L.", email: "mike@kaam.app", role: "Creative Director", isLead: true, joinedAt: "Oct 2024" },
        { id: "u1m", name: "Alice Smith", email: "alice@student.edu", role: "UI Designer", isLead: false, joinedAt: "Oct 2025" },
        { id: "u3", name: "Chris R.", email: "chris@student.edu", role: "Motion Designer", isLead: false, joinedAt: "Nov 2025" },
        { id: "u4", name: "Priya K.", email: "priya@student.edu", role: "Brand Associate", isLead: false, joinedAt: "Jan 2026" },
        { id: "u5", name: "Liam O.", email: "liam@student.edu", role: "Content Creator", isLead: false, joinedAt: "Jan 2026" },
    ],
    "2": [
        { id: "v1", name: "Omar S.", email: "omar@kaam.app", role: "Tech Lead", isLead: true, joinedAt: "Aug 2024" },
        { id: "v2", name: "Bob Johnson", email: "bob@student.edu", role: "Developer", isLead: false, joinedAt: "Nov 2025" },
    ],
};

const RECENT_ACTIVITY = [
    { text: "Sarah J. updated the Brand Kit task", time: "2h ago" },
    { text: "New task assigned: Social Media Banners", time: "5h ago" },
    { text: "Mike L. moved 'Logo Redesign' to Done", time: "1d ago" },
    { text: "2 members joined the team", time: "2d ago" },
];

export default function DashboardTeamPage() {
    const { teams } = useMockData();
    const myTeam = teams.find(t => t.id === MY_TEAM_ID) || teams[0];
    const members = MOCK_MEMBERS[myTeam?.id] || MOCK_MEMBERS["1"];
    const leads = members.filter(m => m.isLead);
    const regularMembers = members.filter(m => !m.isLead);
    const myProfile = members.find(m => m.email === "alice@student.edu");

    // Color helpers
    const accentText = myTeam?.color?.replace("bg-", "text-") || "text-fuchsia-500";
    const accentBg = myTeam?.color?.replace("bg-", "bg-") + "/10" || "bg-fuchsia-500/10";

    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-600 mb-3">
                    <span>Dashboard</span><ChevronRight className="h-3.5 w-3.5" /><span className="text-zinc-600 dark:text-zinc-400 font-medium">My Team</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-medium tracking-tight text-[#172b4d] dark:text-white mb-1">My Team</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Your current team assignment, members, and leads.</p>
                    </div>
                    {myProfile && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 shadow-sm text-sm">
                            <Sparkles className="h-4 w-4 text-amber-500" />
                            <span className="text-zinc-500">You are:</span>
                            <span className="font-semibold text-[#172b4d] dark:text-zinc-200">{myProfile.role}</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left column — Team info card */}
                <div className="lg:col-span-1 space-y-5">

                    {/* Team Identity Card */}
                    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl overflow-hidden shadow-sm">
                        <div className={`h-2 w-full ${myTeam?.color || "bg-fuchsia-500"} opacity-80`} />
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-5">
                                <div className={`h-14 w-14 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-center ${myTeam?.color}/10`}>
                                    <LayoutGrid className={`h-7 w-7 ${accentText}`} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#172b4d] dark:text-white">{myTeam?.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-normal px-2">
                                            {myTeam?.type} Team
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#f4f5f7] dark:bg-zinc-950/50 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-bold text-[#172b4d] dark:text-white">{members.length}</p>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Members</p>
                                </div>
                                <div className="bg-[#f4f5f7] dark:bg-zinc-950/50 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-bold text-[#172b4d] dark:text-white">{leads.length}</p>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Leads</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent activity */}
                    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-semibold text-[#172b4d] dark:text-zinc-100 mb-4 text-sm">Recent Activity</h3>
                        <div className="space-y-3">
                            {RECENT_ACTIVITY.map((a, i) => (
                                <div key={i} className="flex gap-3 text-sm">
                                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                                    <div>
                                        <p className="text-zinc-700 dark:text-zinc-300 leading-snug">{a.text}</p>
                                        <p className="text-xs text-zinc-400 mt-0.5">{a.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right column — Members */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Team Leads Section */}
                    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-500" />
                            <h3 className="font-semibold text-[#172b4d] dark:text-zinc-100 text-sm">Team Leads</h3>
                            <span className="ml-auto text-xs text-zinc-400">{leads.length} leads</span>
                        </div>
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                            {leads.map(lead => (
                                <div key={lead.id} className="flex items-center gap-4 px-6 py-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                    <Avatar className="h-11 w-11 border-2 border-amber-200 dark:border-amber-500/30 shadow-sm">
                                        <AvatarFallback className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold text-sm">
                                            {lead.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-[#172b4d] dark:text-zinc-200 text-sm">{lead.name}</p>
                                            <span className="px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[9px] uppercase tracking-wider font-bold border border-amber-200 dark:border-amber-500/20">Lead</span>
                                        </div>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{lead.role}</p>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400">
                                        <Mail className="h-3.5 w-3.5" />
                                        <span className="font-mono">{lead.email}</span>
                                    </div>
                                    <span className="text-[11px] text-zinc-400 ml-4 shrink-0">Since {lead.joinedAt}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Members Section */}
                    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center gap-2">
                            <Users2 className="h-4 w-4 text-zinc-500" />
                            <h3 className="font-semibold text-[#172b4d] dark:text-zinc-100 text-sm">Members</h3>
                            <span className="ml-auto text-xs text-zinc-400">{regularMembers.length} members</span>
                        </div>
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                            {regularMembers.map(member => {
                                const isMe = member.email === "alice@student.edu";
                                return (
                                    <div key={member.id} className={`flex items-center gap-4 px-6 py-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors ${isMe ? "bg-amber-50/30 dark:bg-amber-500/5" : ""}`}>
                                        <Avatar className={`h-11 w-11 border shadow-sm ${isMe ? "border-amber-300 dark:border-amber-500/40" : "border-zinc-200 dark:border-zinc-700"}`}>
                                            <AvatarFallback className={`font-bold text-sm ${isMe ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}>
                                                {member.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-[#172b4d] dark:text-zinc-200 text-sm">{member.name}</p>
                                                {isMe && (
                                                    <span className="px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] uppercase tracking-wider font-bold border border-blue-200 dark:border-blue-500/20">You</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{member.role}</p>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400">
                                            <Mail className="h-3.5 w-3.5" />
                                            <span className="font-mono">{member.email}</span>
                                        </div>
                                        <span className="text-[11px] text-zinc-400 ml-4 shrink-0">Since {member.joinedAt}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
