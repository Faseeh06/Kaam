"use client";

import { Users, Building2, Target, TrendingUp, UserCheck, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminDashboardPage() {
    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            <header className="mb-8 md:mb-10">
                <h1 className="text-3xl font-medium tracking-tight text-[#172b4d] dark:text-white mb-2">Admin Dashboard</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                    Overview of the entire society platform, users, and tasks.
                </p>
            </header>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
                        <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#172b4d] dark:text-white">1,248</div>
                        <p className="text-xs text-emerald-500 mt-1 flex items-center font-medium">
                            <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
                        <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Teams</CardTitle>
                        <Building2 className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#172b4d] dark:text-white">24</div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center">
                            Across 4 active societies
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
                        <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Pending Approvals</CardTitle>
                        <UserCheck className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#172b4d] dark:text-white">14</div>
                        <p className="text-xs text-amber-500 dark:text-amber-400 mt-1 flex items-center font-medium">
                            Requires immediate attention
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm hover:shadow-md transition">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
                        <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Active Tasks</CardTitle>
                        <Target className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#172b4d] dark:text-white">342</div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center">
                            120 completed this week
                        </p>
                    </CardContent>
                </Card>

            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card className="md:col-span-2 bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm">
                    <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
                        <CardTitle className="text-lg font-medium text-[#172b4d] dark:text-white">System Activity</CardTitle>
                        <CardDescription className="text-zinc-500 dark:text-zinc-400">Latest actions across all societies.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
                                <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-500" />
                            </div>
                            <div>
                                <p className="text-sm text-[#172b4d] dark:text-zinc-200"><span className="font-semibold">Super Admin</span> created a new team: <span className="font-medium">Marketing</span> in Tech Society.</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">2 minutes ago</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Avatar className="h-8 w-8 shrink-0 border border-zinc-200 dark:border-zinc-700/50">
                                <AvatarFallback className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">AS</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm text-[#172b4d] dark:text-zinc-200"><span className="font-semibold">Alex Smith</span> submitted a report for <span className="font-medium text-rose-500 underline decoration-rose-500/30">Q3 Planning</span> task.</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">1 hour ago</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
                                <UserCheck className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                            </div>
                            <div>
                                <p className="text-sm text-[#172b4d] dark:text-zinc-200"><span className="font-semibold">New registration</span>: 3 users requested to join Design Society.</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">3 hours ago</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="md:col-span-1 bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm">
                    <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
                        <CardTitle className="text-lg font-medium text-[#172b4d] dark:text-white">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-3">
                        <button className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-rose-300 dark:hover:border-rose-500/50 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition group text-left">
                            <div>
                                <p className="text-sm font-medium text-[#172b4d] dark:text-zinc-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition">Review Pending Users</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">14 users awaiting approval</p>
                            </div>
                            <div className="h-6 w-6 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-500 flex items-center justify-center text-xs font-bold shrink-0">
                                14
                            </div>
                        </button>
                        <button className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition group text-left">
                            <div>
                                <p className="text-sm font-medium text-[#172b4d] dark:text-zinc-200 transition">Create New Team</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Add a new operational department</p>
                            </div>
                        </button>
                        <button className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition group text-left">
                            <div>
                                <p className="text-sm font-medium text-[#172b4d] dark:text-zinc-200 transition">Society Settings</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Manage global organization rules</p>
                            </div>
                        </button>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
