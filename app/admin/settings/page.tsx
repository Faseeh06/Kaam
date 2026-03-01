"use client";

import { ShieldAlert, Globe, Bell, Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminSettingsPage() {
    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            <header className="mb-8 md:mb-10">
                <h1 className="text-3xl font-medium tracking-tight text-[#172b4d] dark:text-white mb-2">Global Settings</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                    Configure high-level security, access, and permissions for the society.
                </p>
            </header>

            <div className="w-full grid md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">

                {/* Left Column - Navigation */}
                <div className="md:col-span-1 space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-rose-600 dark:text-rose-500 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:text-rose-700 dark:hover:text-rose-400 font-medium">
                        <ShieldAlert className="h-4 w-4 mr-3" /> Security
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-zinc-500 dark:text-zinc-400 hover:text-[#172b4d] dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <Globe className="h-4 w-4 mr-3" /> External Access
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-zinc-500 dark:text-zinc-400 hover:text-[#172b4d] dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        <Bell className="h-4 w-4 mr-3" /> Webhooks
                    </Button>
                </div>

                {/* Right Column - Content */}
                <div className="md:col-span-3 lg:col-span-4 space-y-6">

                    {/* Security & Approvals Component */}
                    <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 shadow-sm overflow-hidden rounded-2xl">
                        <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800/50">
                            <CardTitle className="text-lg font-medium text-[#172b4d] dark:text-white flex items-center gap-2">
                                <Lock className="h-5 w-5 text-rose-500" />
                                Onboarding & Privacy
                            </CardTitle>
                            <CardDescription className="text-zinc-500 dark:text-zinc-400">Configure how new users can join the platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">

                            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/60 bg-[#f4f5f7] dark:bg-zinc-950/40">
                                <div className="pr-4">
                                    <p className="font-medium text-[#172b4d] dark:text-zinc-200 text-sm mb-1">Require Manual Approval</p>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-500">All new signups must be explicitly approved by an admin before they can view boards or society details.</p>
                                </div>
                                <div className="h-6 w-11 bg-rose-500 rounded-full relative cursor-pointer opacity-90 hover:opacity-100 transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] shrink-0">
                                    <div className="absolute top-1 right-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/60 bg-[#f4f5f7] dark:bg-zinc-950/40">
                                <div className="pr-4">
                                    <p className="font-medium text-[#172b4d] dark:text-zinc-200 text-sm mb-1">Domain Restriction</p>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-500">Only allow registrations from emails ending in <span className="font-mono bg-zinc-200 dark:bg-zinc-800 px-1 rounded text-zinc-800 dark:text-zinc-300">@university.edu</span></p>
                                </div>
                                <div className="h-6 w-11 bg-zinc-300 dark:bg-zinc-700/50 rounded-full relative cursor-pointer hover:bg-zinc-400 dark:hover:bg-zinc-700 transition shrink-0">
                                    <div className="absolute top-1 left-1 h-4 w-4 bg-white dark:bg-zinc-400 rounded-full shadow-sm" />
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* Highly Dangerous Features */}
                    <Card className="bg-rose-50 dark:bg-rose-500/5 border-rose-200 dark:border-rose-500/20 shadow-sm overflow-hidden rounded-2xl">
                        <CardHeader className="pb-2 border-b border-rose-100 dark:border-rose-500/10">
                            <CardTitle className="text-lg font-medium text-rose-600 dark:text-rose-500 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Super Admin Zone
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-rose-200 dark:border-rose-500/20 rounded-xl bg-white/50 dark:bg-rose-500/5">
                                <div>
                                    <p className="text-sm font-semibold text-[#172b4d] dark:text-zinc-200">Archive Society DB</p>
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Locks all boards across all teams to read-only mode.</p>
                                </div>
                                <Button variant="outline" className="border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 shrink-0">
                                    Initiate Archive
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>

        </div>
    );
}
