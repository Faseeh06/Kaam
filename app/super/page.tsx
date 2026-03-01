"use client";

import { Users, Building2, UserCog, Database, ShieldCheck, Activity, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMockData, GlobalAdmin } from "@/app/context/MockDataContext";

export default function SuperDashboardPage() {
    const { societies, admins, users, pendingUsers } = useMockData();

    // Growth calculations
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const newUsersThisWeek = [...users, ...pendingUsers].filter(u => {
        const dateStr = 'joined' in u ? u.joined : ('time' in u ? u.time : null);
        if (!dateStr || dateStr === 'N/A' || dateStr === 'Just now') return false;
        const joinDate = new Date(dateStr);
        return !isNaN(joinDate.getTime()) && joinDate >= oneWeekAgo;
    }).length;

    const newSocietiesThisMonth = societies.filter(s => {
        // Societies don't have a joined date in the type yet, but we can assume some are new
        // For now let's just use the length or a mock growth if date isn't available
        return true;
    }).length;

    // Total users is both active and pending
    const totalUsersCount = users.length + pendingUsers.length;

    // Global Admins (Super Admins)
    const superAdminsCount = admins.filter((a: GlobalAdmin) => a.scope === "Global").length;

    // Total Admins (including society admins)
    const totalAdminsCount = admins.length;

    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            <header className="mb-8 md:mb-10">
                <h1 className="text-3xl font-medium tracking-tight text-[#172b4d] dark:text-white mb-2">Platform Overview</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                    Master control panel for the multi-society platform.
                </p>
            </header>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
                        <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Societies</CardTitle>
                        <Building2 className="h-4 w-4 text-violet-600 dark:text-violet-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#172b4d] dark:text-white">{societies.length}</div>
                        <p className="text-xs text-emerald-500 mt-1 flex items-center font-medium">
                            +{newSocietiesThisMonth} onboarded this month
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
                        <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Global Admins</CardTitle>
                        <UserCog className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#172b4d] dark:text-white">{superAdminsCount}</div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center font-medium">
                            Presidents & Core ExCom
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
                        <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total System Users</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#172b4d] dark:text-white">{totalUsersCount.toLocaleString()}</div>
                        <p className="text-xs text-emerald-500 mt-1 flex items-center font-medium">
                            +{newUsersThisWeek} registrations this week
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
                        <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">System Health</CardTitle>
                        <Activity className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#172b4d] dark:text-white">99.9%</div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center">
                            All services optimal
                        </p>
                    </CardContent>
                </Card>

            </div>


            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm">
                    <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
                        <CardTitle className="text-lg font-medium text-[#172b4d] dark:text-white flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-violet-500" /> Administrative Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-3">
                        <button className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-500/50 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition group text-left">
                            <div>
                                <p className="text-sm font-medium text-[#172b4d] dark:text-zinc-200 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition">Register New Society</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Onboard a completely new organization</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center shrink-0">
                                <Plus className="h-4 w-4 text-violet-700 dark:text-violet-400" />
                            </div>
                        </button>
                        <button className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-500/50 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition group text-left">
                            <div>
                                <p className="text-sm font-medium text-[#172b4d] dark:text-zinc-200 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition">Assign Society President</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Grant root local access to an existing user</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center shrink-0">
                                <UserCog className="h-4 w-4 text-violet-700 dark:text-violet-400" />
                            </div>
                        </button>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm">
                    <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
                        <CardTitle className="text-lg font-medium text-[#172b4d] dark:text-white flex items-center gap-2">
                            <Database className="h-5 w-5 text-zinc-500" /> System Metrics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-zinc-600 dark:text-zinc-400">Database Capacity</span>
                                    <span className="font-medium text-[#172b4d] dark:text-zinc-200">42% Used</span>
                                </div>
                                <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-violet-500 w-[42%] rounded-full" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-zinc-600 dark:text-zinc-400">Storage API Limit</span>
                                    <span className="font-medium text-[#172b4d] dark:text-zinc-200">800GB / 2TB</span>
                                </div>
                                <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[40%] rounded-full" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
