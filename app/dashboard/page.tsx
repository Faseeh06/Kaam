"use client";

import { Bell, CheckCircle2, Clock, Activity, ArrowUpRight, Plus, Calendar, Shield, Menu, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
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
                    <Button variant="outline" className="hidden sm:flex items-center gap-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-[#172b4d] dark:text-white bg-transparent hover:bg-[#ebecf0] dark:bg-zinc-900/50">
                        <Plus className="h-4 w-4" /> Create Task
                    </Button>
                    <Button variant="ghost" size="icon" className="text-zinc-500 dark:text-zinc-400 hover:text-[#172b4d] dark:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800 dark:bg-zinc-800 rounded-full">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="md:hidden text-zinc-500 dark:text-zinc-400 hover:text-[#172b4d] dark:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800 dark:bg-zinc-800 rounded-full">
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto w-full space-y-12">
                <header>
                    <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[#172b4d] dark:text-white mb-2">Good morning, Alice.</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg">
                        You have <span className="text-amber-600 dark:text-amber-500 font-medium">2 tasks assigned</span> to you and 2 approaching deadlines.
                    </p>
                </header>

                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {[
                        { icon: <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-500" />, bg: "bg-amber-500/10", val: "12", label: "Tasks in Progress" },
                        { icon: <Clock className="h-5 w-5 text-rose-500" />, bg: "bg-rose-500/10", val: "2", label: "Urgent Deadlines" },
                        { icon: <Activity className="h-5 w-5 text-emerald-500" />, bg: "bg-emerald-500/10", val: "85%", label: "Average Attendance" },
                    ].map(k => (
                        <div key={k.label} className="p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 flex flex-col justify-between h-40 hover:bg-white dark:bg-zinc-900/60 transition cursor-pointer group sm:last:col-span-2 md:last:col-span-1">
                            <div className="flex justify-between items-start">
                                <div className={`h-10 w-10 rounded-full ${k.bg} flex items-center justify-center`}>{k.icon}</div>
                                <ArrowUpRight className="h-5 w-5 text-zinc-400 group-hover:text-zinc-500 transition" />
                            </div>
                            <div>
                                <div className="text-3xl font-light text-[#172b4d] dark:text-white mb-1">{k.val}</div>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400">{k.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Assigned to Me */}
                <AssignedToMe />

                {/* Today's Focus */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-medium text-[#172b4d] dark:text-white">Today's Focus</h2>
                    </div>
                    <div className="space-y-3">
                        {[
                            { title: "Design Promo Banners for Annual Meet", date: "Tomorrow", team: "Debate Club", sev: "High" as const, done: false },
                            { title: "Organize Logistics for Workshop", date: "Oct 28", team: "Tech Society", sev: "Medium" as const, done: false },
                            { title: "Draft Speech Guidelines Document", date: "Done", team: "Debate Club", sev: null, done: true },
                        ].map(t => (
                            <div key={t.title} className="p-4 sm:p-5 rounded-xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-zinc-300 dark:border-zinc-700 transition cursor-pointer">
                                <div className="flex items-start gap-4">
                                    <div className="mt-0.5 min-w-[20px]">
                                        <div className={`h-5 w-5 rounded-full border transition flex items-center justify-center ${t.done ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10" : "border-zinc-400 dark:border-zinc-600 hover:border-amber-500"}`}>
                                            {t.done && <div className="w-3 h-3 bg-emerald-500 rounded-full" />}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className={`font-medium mb-1 ${t.done ? "text-zinc-500 line-through decoration-zinc-600" : "text-[#172b4d] dark:text-white"}`}>{t.title}</h3>
                                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                                            <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {t.date}</span>
                                            <div className="w-1 h-1 rounded-full bg-zinc-400" />
                                            <span>{t.team}</span>
                                        </div>
                                    </div>
                                </div>
                                {t.sev && (
                                    <div className="pl-9 sm:pl-0">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${SEV_BADGE[t.sev]}`}>{t.sev} Priority</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Severity helpers ──────────────────────────────────────────────────────────
type Severity = "High" | "Medium" | "Low";
type BoardTask = { id: string; title: string; severity?: Severity; deadline?: string; list: string; assignedTo?: string };

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

// Simulated tasks assigned to current user (in production: fetched from context/API by user ID)
const MY_NAME = "Alice Smith";
const ASSIGNED_TASKS: BoardTask[] = [
    { id: "c-1", title: "Design new onboarding flow", severity: "High", deadline: "2026-03-05", list: "To Do", assignedTo: "Alice Smith" },
    { id: "c-4", title: "Sponsorship deck — first draft", severity: "Medium", deadline: "2026-03-07", list: "Review", assignedTo: "Alice Smith" },
];

function AssignedToMe() {
    const myTasks = ASSIGNED_TASKS.filter(t => t.assignedTo === MY_NAME);
    if (myTasks.length === 0) return null;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-[#172b4d] dark:text-white">Assigned to Me</h2>
                <a href="/dashboard/board" className="text-xs text-amber-600 dark:text-amber-500 hover:underline flex items-center gap-1">
                    Open board <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
            </div>
            <div className="space-y-3">
                {myTasks.map(task => {
                    const dl = formatDl(task.deadline);
                    const sev = task.severity;
                    return (
                        <a key={task.id} href="/dashboard/board"
                            className="flex gap-0 rounded-xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/20 hover:border-zinc-300 dark:hover:border-zinc-700 transition overflow-hidden group cursor-pointer">
                            {sev && <div className={`w-1.5 shrink-0 ${SEV_STRIPE[sev]}`} />}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 flex-1 min-w-0">
                                <div className="flex flex-col gap-1.5 min-w-0">
                                    <h3 className="text-[#172b4d] dark:text-white font-medium text-sm leading-snug">{task.title}</h3>
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                        <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[10px] font-medium text-zinc-500">{task.list}</span>
                                        {dl && <span className={`flex items-center gap-1 font-medium ${dl.color}`}><Calendar className="h-3 w-3" /> {dl.label}</span>}
                                    </div>
                                </div>
                                {sev && (
                                    <span className={`shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${SEV_BADGE[sev]}`}>
                                        <Flag className="h-3 w-3" /> {sev}
                                    </span>
                                )}
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
