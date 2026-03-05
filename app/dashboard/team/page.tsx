"use client";

import { Users2, Star, Mail, LayoutGrid, Sparkles, ChevronRight, Shield, Crown, Briefcase, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useMockData, TeamRole, TEAM_ROLE_PERMISSIONS } from "@/app/context/MockDataContext";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const ROLE_CONFIG: Record<TeamRole, { label: string; color: string; textColor: string; borderColor: string; bgColor: string; icon: string; rank: number }> = {
    "Director": { label: "Director", color: "bg-amber-500", textColor: "text-amber-700 dark:text-amber-400", borderColor: "border-amber-200 dark:border-amber-500/30", bgColor: "bg-amber-50 dark:bg-amber-500/10", icon: "🎯", rank: 1 },
    "Deputy Director": { label: "Deputy Director", color: "bg-blue-500", textColor: "text-blue-700 dark:text-blue-400", borderColor: "border-blue-200 dark:border-blue-500/30", bgColor: "bg-blue-50 dark:bg-blue-500/10", icon: "📐", rank: 2 },
    "HR": { label: "HR", color: "bg-violet-500", textColor: "text-violet-700 dark:text-violet-400", borderColor: "border-violet-200 dark:border-violet-500/30", bgColor: "bg-violet-50 dark:bg-violet-500/10", icon: "🤝", rank: 3 },
    "Executive": { label: "Executive", color: "bg-zinc-400", textColor: "text-zinc-600 dark:text-zinc-400", borderColor: "border-zinc-200 dark:border-zinc-700", bgColor: "bg-zinc-50 dark:bg-zinc-800/50", icon: "⭐", rank: 4 },
};

const RECENT_ACTIVITY = [
    { text: "System sync completed successfully.", time: "Just now" },
    { text: "Board tasks updated from recent changes.", time: "2h ago" },
];

export default function DashboardTeamPage() {
    const { teams, teamMembers, officeBearers, isLoading: isContextLoading } = useMockData();
    const [userData, setUserData] = useState<{ id: string; email: string; primary_team: string } | null>(null);
    const [isLocalLoading, setIsLocalLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id, email, primary_team')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setUserData({
                        id: profile.id,
                        email: profile.email || "",
                        primary_team: profile.primary_team || ""
                    });
                }
            }
            setIsLocalLoading(false);
        };
        fetchUserData();
    }, []);

    // Find user's team reactively from teamMembers (Source of Truth)
    const myTeam = userData ? teams.find(t =>
        // 1. Check direct associations (Real-time)
        (teamMembers[t.id] || []).some(m => m.userId === userData.id) ||
        // 2. Fallback to profile field
        t.name === userData.primary_team
    ) : null;


    const members = myTeam ? (teamMembers[myTeam.id] || []) : [];

    // Find my explicit role in THIS team. Default to Executive if not found.
    const myTeamMemberRecord = userData ? members.find(m => m.userId === userData.id) : null;
    const rawRole = myTeamMemberRecord?.teamRole || "Executive";
    const myRole = ROLE_CONFIG[rawRole] ? rawRole : "Executive";

    const myPerms = TEAM_ROLE_PERMISSIONS[myRole as TeamRole];

    // Separate Office Bearers from regular team members
    const obsList = members.filter(m => officeBearers.some(ob => ob.userId === m.userId)).map(m => {
        const obInfo = officeBearers.find(ob => ob.userId === m.userId);
        return {
            ...m,
            displayRole: obInfo?.position || "Office Bearer",
            isOb: true
        };
    });

    const nonObs = members.filter(m => !officeBearers.some(ob => ob.userId === m.userId));
    const directors = nonObs.filter(m => m.teamRole === "Director");
    const dds = nonObs.filter(m => m.teamRole === "Deputy Director");
    const hrs = nonObs.filter(m => m.teamRole === "HR");
    const execs = nonObs.filter(m => m.teamRole === "Executive");

    // Fix myRole for header if I am an OB
    const myOBInfo = officeBearers.find(ob => ob.userId === userData?.id);
    const displayHeaderRole = myOBInfo ? myOBInfo.position : myRole;
    const headerConfig = myOBInfo ? {
        label: myOBInfo.position,
        color: "bg-rose-500",
        textColor: "text-rose-700 dark:text-rose-400",
        borderColor: "border-rose-200 dark:border-rose-500/30",
        bgColor: "bg-rose-50 dark:bg-rose-500/10",
        icon: "👑"
    } : ROLE_CONFIG[myRole];

    const accentText = myTeam?.color?.replace("bg-", "text-") || "text-amber-500";

    if (isLocalLoading || isContextLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
        );
    }

    if (!myTeam) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-amber-50 dark:bg-amber-500/10 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-amber-100 dark:border-amber-500/20">
                    <Users2 className="h-10 w-10 text-amber-500" />
                </div>
                <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-2">No Team Found</h2>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-8 leading-relaxed">
                    You haven't been assigned to a team yet. Please contact your administrator for team assignment.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            {/* Breadcrumb + header */}
            <header className="mb-8">
                <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-600 mb-3">
                    <span>Dashboard</span><ChevronRight className="h-3.5 w-3.5" /><span className="text-zinc-600 dark:text-zinc-400 font-medium">My Team</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-medium tracking-tight text-zinc-900 dark:text-white mb-1">My Team</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Your team details, members, and your role permissions.</p>
                    </div>
                    {userData && (
                        <div className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border shadow-sm text-sm ${headerConfig.bgColor} ${headerConfig.textColor} ${headerConfig.borderColor}`}>
                            <span className="text-base">{headerConfig.icon}</span>
                            <div>
                                <p className="font-bold leading-none">{displayHeaderRole}</p>
                                <p className="text-[11px] opacity-70 mt-0.5">{myTeam?.name}</p>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left column */}
                <div className="lg:col-span-1 space-y-5">

                    {/* Team Identity */}
                    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl overflow-hidden shadow-sm">
                        <div className={`h-2 w-full ${myTeam?.color || "bg-amber-500"} opacity-80`} />
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-5">
                                <div className={`h-14 w-14 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/50`}>
                                    <LayoutGrid className={`h-7 w-7 ${accentText}`} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{myTeam?.name}</h2>
                                    <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-normal px-2 mt-1">
                                        {myTeam?.type} Team
                                    </Badge>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-background dark:bg-zinc-950/50 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">{members.length}</p>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Members</p>
                                </div>
                                <div className="bg-background dark:bg-zinc-950/50 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">{directors.length + dds.length}</p>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Directors</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Your Permissions */}
                    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl p-5 shadow-sm">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4 text-sm flex items-center gap-2">
                            <Shield className="h-4 w-4 text-zinc-400" /> Your Permissions
                        </h3>
                        <div className="space-y-2.5">
                            {[
                                { label: "Add tasks to board", allowed: myPerms.canAddToBoard },
                                { label: "Assign tasks to members", allowed: myPerms.canAssign },
                                { label: "Comment on tasks", allowed: myPerms.canComment },
                                { label: "Manage team members", allowed: myPerms.canManageMembers },
                            ].map(p => (
                                <div key={p.label} className="flex items-center justify-between text-sm">
                                    <span className="text-zinc-600 dark:text-zinc-400">{p.label}</span>
                                    <span className={`font-semibold text-xs px-2 py-0.5 rounded-full border ${p.allowed ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-600 border-zinc-200 dark:border-zinc-700'}`}>
                                        {p.allowed ? "✓ Yes" : "✗ No"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent activity */}
                    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl p-5 shadow-sm overflow-hidden">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4 text-sm">Team Activity</h3>
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

                {/* Right column — Members by role */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Role hierarchy legend */}
                    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-xl px-5 py-4 shadow-sm flex flex-wrap gap-3">
                        {obsList.length > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30">
                                <span>👑</span>
                                <span className="font-semibold">Office Bearer</span>
                                <span className="opacity-60 text-[10px]">Society-level</span>
                            </div>
                        )}
                        {(Object.keys(ROLE_CONFIG) as TeamRole[]).map(role => {
                            const cfg = ROLE_CONFIG[role];
                            const perms = TEAM_ROLE_PERMISSIONS[role];
                            return (
                                <div key={role} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${cfg.bgColor} ${cfg.textColor} ${cfg.borderColor}`}>
                                    <span>{cfg.icon}</span>
                                    <span className="font-semibold">{role}</span>
                                    <span className="opacity-60 text-[10px]">
                                        {[perms.canAddToBoard && "Board", perms.canAssign && "Assign", perms.canManageMembers && "Members", "Comment"].filter(Boolean).join(" · ")}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Group by role */}
                    {([
                        { role: "Office Bearer" as string, list: obsList },
                        { role: "Director" as string, list: directors },
                        { role: "Deputy Director" as string, list: dds },
                        { role: "HR" as string, list: hrs },
                        { role: "Executive" as string, list: execs },
                    ]).filter(g => g.list.length > 0).map(({ role, list }) => {
                        const cfg = role === "Office Bearer" ? {
                            icon: "👑", textColor: "text-rose-700 dark:text-rose-400", bgColor: "bg-rose-50 dark:bg-rose-500/10", borderColor: "border-rose-200 dark:border-rose-500/30"
                        } : ROLE_CONFIG[role as TeamRole];
                        return (
                            <div key={role} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden">
                                <div className="px-6 py-3.5 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center gap-2">
                                    <span>{cfg.icon}</span>
                                    <h3 className={`font-semibold text-sm ${cfg.textColor}`}>{role}s</h3>
                                    <span className="ml-auto text-xs text-zinc-400">{list.length}</span>
                                </div>
                                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                    {list.map((member: any) => {
                                        const isMe = member.email === userData?.email;
                                        return (
                                            <div key={member.id} className={`flex items-center gap-4 px-6 py-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors ${isMe ? "bg-amber-50/30 dark:bg-amber-500/5" : ""}`}>
                                                <Avatar className={`h-10 w-10 border shadow-sm ${isMe ? "border-amber-300 dark:border-amber-500/40" : `${cfg.borderColor}`}`}>
                                                    <AvatarFallback className={`font-bold text-sm ${cfg.bgColor} ${cfg.textColor}`}>
                                                        {member.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-zinc-900 dark:text-zinc-200 text-sm">{member.name}</p>
                                                        {isMe && (
                                                            <span className="px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] uppercase tracking-wider font-bold border border-blue-200 dark:border-blue-500/20">You</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-zinc-500 font-mono mt-0.5">{member.email}</p>
                                                </div>
                                                <span className={`text-[11px] font-medium shrink-0 ${member.isOb ? 'text-rose-500' : 'text-zinc-400'}`}>
                                                    {member.displayRole || member.teamRole}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
