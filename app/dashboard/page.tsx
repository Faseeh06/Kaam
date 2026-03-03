"use client";

import { Bell, CheckCircle2, Clock, Activity, ArrowUpRight, Plus, Calendar, Shield, Users2, Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useMockData } from "@/app/context/MockDataContext";
import Link from "next/link";
import { NotificationBell } from "@/components/NotificationBell";

export default function DashboardPage() {
    const { boardCards, boardLists, teams } = useMockData();
    const [userData, setUserData] = useState<{ id: string; name: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id, full_name')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setUserData({ id: profile.id, name: profile.full_name });
                }
            }
            setIsLoading(false);
        };
        fetchUser();
    }, []);

    // Filter tasks assigned to this user
    const myTasks = boardCards.filter(c => c.assigned_to === userData?.id);

    // KPIs calculations
    const inProgressCount = myTasks.filter(t => !t.is_completed).length;

    // Filter upcoming tasks (with deadlines, not completed)
    const upcomingTasks = myTasks
        .filter(t => t.deadline && !t.is_completed)
        .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col pt-0 md:pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            {/* Transparent Navbar */}
            <header className="h-16 flex items-center justify-between shrink-0 mb-8 md:mb-12">
                <div className="flex items-center gap-4 md:hidden">
                    <Shield className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                    <span className="font-medium text-xl tracking-tight text-[#172b4d] dark:text-white">Kaam</span>
                </div>
                <div className="hidden md:block"></div>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/board">
                        <Button variant="outline" className="hidden sm:flex items-center gap-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-[#172b4d] dark:text-white bg-transparent hover:bg-[#ebecf0] dark:bg-zinc-900/50">
                            <Plus className="h-4 w-4" /> View Board
                        </Button>
                    </Link>
                    <NotificationBell />
                </div>
            </header>

            <div className="max-w-4xl mx-auto w-full space-y-12">
                <header>
                    <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[#172b4d] dark:text-white mb-2">Welcome back, {userData?.name?.split(' ')[0] || "User"}.</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg">
                        You have <span className="text-amber-600 dark:text-amber-500 font-medium">{inProgressCount} tasks assigned</span> to you {upcomingTasks.length > 0 && <>and <span className="text-amber-600 dark:text-amber-500 font-medium">{upcomingTasks.length} upcoming deadlines</span></>}.
                    </p>
                </header>

                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 flex flex-col justify-between h-40 hover:bg-white dark:hover:bg-zinc-900/60 transition cursor-pointer group">
                        <div className="flex justify-between items-start">
                            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-zinc-400 group-hover:text-zinc-500 transition" />
                        </div>
                        <div>
                            <div className="text-3xl font-light text-[#172b4d] dark:text-white mb-1">{inProgressCount}</div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-400">Tasks in Progress</div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 flex flex-col justify-between h-40 hover:bg-white dark:hover:bg-zinc-900/60 transition cursor-pointer group">
                        <div className="flex justify-between items-start">
                            <div className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-rose-500" />
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-zinc-400 group-hover:text-zinc-500 transition" />
                        </div>
                        <div>
                            <div className="text-3xl font-light text-[#172b4d] dark:text-white mb-1">{upcomingTasks.length}</div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-400">Total Deadlines</div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 flex flex-col justify-between h-40 hover:bg-white dark:hover:bg-zinc-900/60 transition cursor-pointer group">
                        <div className="flex justify-between items-start">
                            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Activity className="h-5 w-5 text-emerald-500" />
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-zinc-400 group-hover:text-zinc-500 transition" />
                        </div>
                        <div>
                            <div className="text-3xl font-light text-[#172b4d] dark:text-white mb-1">92%</div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-400">Platform Activity</div>
                        </div>
                    </div>
                </div>

                {/* Assigned to Me Section */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-medium text-[#172b4d] dark:text-white">Assigned to Me</h2>
                        <Link href="/dashboard/board" className="text-xs text-amber-600 dark:text-amber-500 hover:underline flex items-center gap-1 font-medium">
                            Open full board <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {myTasks.length > 0 ? (
                        <div className="space-y-3">
                            {myTasks.slice(0, 5).map(task => {
                                const listName = boardLists.find(l => l.id === task.list_id)?.title || "Unknown List";
                                const dl = formatDl(task.deadline);
                                const sev = task.severity as Severity;

                                return (
                                    <Link key={task.id} href="/dashboard/board"
                                        className="flex gap-0 rounded-xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/20 hover:border-zinc-300 dark:hover:border-zinc-700 transition overflow-hidden group cursor-pointer shadow-sm">
                                        {sev && <div className={`w-1.5 shrink-0 ${SEV_STRIPE[sev] || 'bg-zinc-300'}`} />}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 flex-1 min-w-0">
                                            <div className="flex flex-col gap-1.5 min-w-0">
                                                <h3 className={`text-[#172b4d] dark:text-white font-medium text-sm leading-snug ${task.is_completed ? 'line-through text-zinc-400' : ''}`}>{task.title}</h3>
                                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                                    <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[10px] font-medium text-zinc-500">{listName}</span>
                                                    {dl && <span className={`flex items-center gap-1 font-medium ${dl.color}`}><Calendar className="h-3 w-3" /> {dl.label}</span>}
                                                </div>
                                            </div>
                                            {sev && (
                                                <span className={`shrink-0 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${SEV_BADGE[sev]}`}>
                                                    {sev}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-10 text-center rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800/60">
                            <p className="text-zinc-500 dark:text-zinc-400">No tasks assigned to you yet.</p>
                        </div>
                    )}
                </div>

                {/* Today's Focus / My Team section */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-medium text-[#172b4d] dark:text-white">Upcoming Deadlines</h2>
                        </div>
                        {upcomingTasks.length > 0 ? (
                            <div className="space-y-3">
                                {upcomingTasks.slice(0, 5).map(task => (
                                    <div key={task.id} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 flex items-center gap-4 transition hover:bg-white dark:hover:bg-zinc-900/60">
                                        <div className="h-8 w-8 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 text-rose-500">
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-[#172b4d] dark:text-white truncate">{task.title}</p>
                                            {(() => {
                                                const dl = formatDl(task.deadline!);
                                                return dl ? <p className={`text-xs font-semibold ${dl.color}`}>{dl.label}</p> : null;
                                            })()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                <p className="text-sm text-zinc-500 italic">No upcoming deadlines.</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-medium text-[#172b4d] dark:text-white">My Team</h2>
                        </div>
                        <UserTeamCard userId={userData?.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}


function UserTeamCard({ userId }: { userId?: string }) {
    const { teams, teamMembers } = useMockData();

    if (!userId) {
        return (
            <div className="p-6 h-32 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
            </div>
        );
    }

    // Find the team by checking teamMembers associations (Source of Truth)
    const myTeam = teams.find(t => (teamMembers[t.id] || []).some(m => m.userId === userId));


    if (!myTeam) {
        return (
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3 text-zinc-400">
                    <Users2 className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-[#172b4d] dark:text-white uppercase tracking-wider">Not Assigned</p>
                <p className="text-xs text-zinc-500 mt-1">You haven't been assigned to a team yet.</p>
            </div>
        );
    }

    return (
        <Link href="/dashboard/team" className="block p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-amber-500/50 transition shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl ${myTeam.color || 'bg-amber-500'} flex items-center justify-center text-white`}>
                        <Users2 className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-[#172b4d] dark:text-white">{myTeam.name}</h3>
                        <p className="text-xs text-zinc-500">{myTeam.type} Team</p>
                    </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-6 w-6 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800" />
                    ))}
                    <div className="h-6 w-6 rounded-full border-2 border-white dark:border-zinc-900 bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-[8px] font-bold text-amber-600">
                        +{Math.max(0, (myTeam as any).members - 3)}
                    </div>
                </div>
                <span className="text-xs font-medium text-zinc-500">{(myTeam as any).members} members</span>
            </div>
        </Link>
    );
}

// ─── Severity helpers ──────────────────────────────────────────────────────────
type Severity = "High" | "Medium" | "Low";

const SEV_BADGE: Record<Severity, string> = {
    High: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20",
    Medium: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20",
    Low: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
};
const SEV_STRIPE: Record<Severity, string> = { High: "bg-red-500", Medium: "bg-orange-400", Low: "bg-emerald-500" };

function formatDl(d?: string) {
    if (!d) return null;
    const date = new Date(d);
    const diff = Math.ceil((date.getTime() - Date.now()) / 86400000);
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (diff < 0) return { label: `Overdue (${label})`, color: "text-red-600 dark:text-red-400" };
    if (diff <= 2) return { label: `Due ${label}`, color: "text-orange-500 dark:text-orange-400" };
    return { label: `Due ${label}`, color: "text-zinc-500 dark:text-zinc-400" };
}
