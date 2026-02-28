"use client";

import { Bell, CheckCircle2, Clock, Activity, ArrowUpRight, Plus, Calendar, Shield, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    return (
        <div className="h-full flex flex-col pt-0 md:pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            {/* Transparent Navbar */}
            <header className="h-16 flex items-center justify-between shrink-0 mb-8 md:mb-12">
                <div className="flex items-center gap-4 md:hidden">
                    <Shield className="h-6 w-6 text-amber-500" />
                    <span className="font-medium text-xl tracking-tight text-white">Kaam</span>
                </div>
                {/* Desktop placeholder for alignment */}
                <div className="hidden md:block"></div>

                <div className="flex items-center gap-4">
                    <Button variant="outline" className="hidden sm:flex items-center gap-2 border-dashed border-zinc-700 text-zinc-400 hover:text-white bg-transparent hover:bg-zinc-900/50">
                        <Plus className="h-4 w-4" />
                        Create Task
                    </Button>
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="md:hidden text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full">
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto w-full space-y-12">
                {/* Greeting */}
                <header>
                    <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-2">
                        Good morning, John.
                    </h1>
                    <p className="text-zinc-400 text-base sm:text-lg">
                        You have <span className="text-amber-500 font-medium">12 active tasks</span> and 2 deadlines coming up. Let's get to work.
                    </p>
                </header>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 flex flex-col justify-between h-40 hover:bg-zinc-900/60 transition cursor-pointer group">
                        <div className="flex justify-between items-start">
                            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-amber-500" />
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition" />
                        </div>
                        <div>
                            <div className="text-3xl font-light text-white mb-1">12</div>
                            <div className="text-sm text-zinc-400">Tasks in Progress</div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 flex flex-col justify-between h-40 hover:bg-zinc-900/60 transition cursor-pointer group">
                        <div className="flex justify-between items-start">
                            <div className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-rose-500" />
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition" />
                        </div>
                        <div>
                            <div className="text-3xl font-light text-white mb-1">2</div>
                            <div className="text-sm text-zinc-400">Urgent Deadlines</div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 flex flex-col justify-between h-40 hover:bg-zinc-900/60 transition cursor-pointer group sm:col-span-2 md:col-span-1">
                        <div className="flex justify-between items-start">
                            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Activity className="h-5 w-5 text-emerald-500" />
                            </div>
                            <ArrowUpRight className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition" />
                        </div>
                        <div>
                            <div className="text-3xl font-light text-white mb-1">85%</div>
                            <div className="text-sm text-zinc-400">Average Attendance</div>
                        </div>
                    </div>
                </div>

                {/* Today's Focus */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-medium text-white">Today's Focus</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="p-4 sm:p-5 rounded-xl border border-zinc-800/60 bg-zinc-900/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-zinc-700 transition cursor-pointer">
                            <div className="flex items-start gap-4">
                                <div className="mt-0.5 min-w-[20px]">
                                    <div className="h-5 w-5 rounded-full border border-zinc-600 hover:border-amber-500 cursor-pointer transition" />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium mb-1 border-b border-transparent">Design Promo Banners for Annual Meet</h3>
                                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                                        <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Tomorrow</span>
                                        <div className="w-1 h-1 rounded-full bg-zinc-700" />
                                        <span>Debate Club</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pl-9 sm:pl-0">
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                    High Priority
                                </span>
                            </div>
                        </div>

                        <div className="p-4 sm:p-5 rounded-xl border border-zinc-800/60 bg-zinc-900/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-zinc-700 transition cursor-pointer">
                            <div className="flex items-start gap-4">
                                <div className="mt-0.5 min-w-[20px]">
                                    <div className="h-5 w-5 rounded-full border border-zinc-600 hover:border-amber-500 cursor-pointer transition" />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium mb-1 border-b border-transparent">Organize Logistics for Workshop</h3>
                                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                                        <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Oct 28</span>
                                        <div className="w-1 h-1 rounded-full bg-zinc-700" />
                                        <span>Tech Society</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pl-9 sm:pl-0">
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                    Medium Priority
                                </span>
                            </div>
                        </div>

                        <div className="p-4 sm:p-5 rounded-xl border border-zinc-800/60 bg-zinc-900/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-zinc-700 transition cursor-pointer">
                            <div className="flex items-start gap-4">
                                <div className="mt-0.5 min-w-[20px]">
                                    <div className="h-5 w-5 rounded-full border border-zinc-600 hover:border-amber-500 cursor-pointer transition flex items-center justify-center">
                                        <div className="w-3 h-3 bg-zinc-600 rounded-full hover:bg-amber-500 transition-colors" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-zinc-500 font-medium mb-1 line-through decoration-zinc-700">Draft Speech Guidelines Document</h3>
                                    <div className="flex items-center gap-3 text-xs text-zinc-600">
                                        <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Done</span>
                                        <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                        <span>Debate Club</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pl-9 sm:pl-0">
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800/50 text-zinc-500 border border-zinc-800">
                                    Completed
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}
