"use client";

import { Users, Building2, UserCog, Database, ShieldCheck, Activity, Plus, Loader2, Search, Check, ChevronsUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMockData, GlobalAdmin, Society, AppUser } from "@/app/context/MockDataContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function SuperDashboardPage() {
    const { societies, admins, users, pendingUsers, makeSocietyAdmin, allRegisteredUsers } = useMockData();
    const [isAssigning, setIsAssigning] = useState(false);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedSoc, setSelectedSoc] = useState("");
    const [isAssignOpen, setIsAssignOpen] = useState(false);

    // Dynamic Metrics
    const dbMetrics = useMemo(() => {
        // Approximate usage based on record counts
        const baseUsage = 12.4; // MB
        const rowUsage = (societies.length * 0.5) + (users.length * 0.1) + (allRegisteredUsers.length * 0.1);
        const totalUsed = baseUsage + rowUsage;
        const capacity = 50.0; // MB for free tier or demo
        const percentage = Math.min(Math.round((totalUsed / capacity) * 100), 100);
        return { used: totalUsed.toFixed(1), percentage };
    }, [societies.length, users.length, allRegisteredUsers.length]);

    const storageMetrics = useMemo(() => {
        // Societies use storage for logo and cover
        const avgAssetSize = 2.4; // MB
        const totalUsedGB = (societies.length * avgAssetSize * 2) / 1024;
        const limitGB = 2000; // 2TB
        const percentage = Math.max(0.4, (totalUsedGB / limitGB) * 100);
        return { used: totalUsedGB.toFixed(2), percentage: percentage.toFixed(2) };
    }, [societies.length]);

    // Growth calculations
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const newUsersThisWeek = useMemo(() => {
        return [...users, ...pendingUsers].filter(u => {
            const dateStr = 'joined' in u ? u.joined : ('time' in u ? u.time : null);
            if (!dateStr || dateStr === 'N/A' || dateStr === 'Just now') return false;
            const joinDate = new Date(dateStr);
            return !isNaN(joinDate.getTime()) && joinDate >= oneWeekAgo;
        }).length;
    }, [users, pendingUsers, oneWeekAgo]);

    const newSocietiesThisMonth = societies.length; // Logic simplified for demo

    // Total users is both active and pending
    const totalUsersCount = users.length + pendingUsers.length;

    // Global Admins (Super Admins)
    const superAdminsCount = admins.filter((a: GlobalAdmin) => a.scope === "Global").length;

    const handleAssignPresident = async () => {
        if (!selectedUser || !selectedSoc) return;
        setIsAssigning(true);
        try {
            await makeSocietyAdmin(selectedUser, selectedSoc, "President");
            toast.success("Society President assigned successfully!");
            setIsAssignOpen(false);
            setSelectedUser("");
            setSelectedSoc("");
        } catch (error: any) {
            toast.error("Failed to assign president: " + error.message);
        }
        setIsAssigning(false);
    };

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
                        <Link href="/super/societies" className="block">
                            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-500/50 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition group text-left">
                                <div>
                                    <p className="text-sm font-semibold text-[#172b4d] dark:text-zinc-200 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition">Register New Society</p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Onboard a completely new organization</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center shrink-0">
                                    <Plus className="h-5 w-5 text-violet-700 dark:text-violet-400" />
                                </div>
                            </button>
                        </Link>

                        <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
                            <DialogTrigger asChild>
                                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-violet-500/50 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition group text-left">
                                    <div>
                                        <p className="text-sm font-semibold text-[#172b4d] dark:text-zinc-200 group-hover:text-violet-700 dark:group-hover:text-violet-400 transition">Assign Society President</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Grant root local access to an existing user</p>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center shrink-0">
                                        <UserCog className="h-5 w-5 text-violet-700 dark:text-violet-400" />
                                    </div>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl rounded-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-semibold text-[#172b4d] dark:text-white">Assign President</DialogTitle>
                                    <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                                        Elevate a user to lead a specific society.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-6 space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Target User</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between bg-[#f4f5f7] dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
                                                        !selectedUser && "text-muted-foreground"
                                                    )}
                                                >
                                                    {selectedUser
                                                        ? allRegisteredUsers.find((user) => user.id === selectedUser)?.name
                                                        : "Select user..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0" align="start">
                                                <Command className="border-none">
                                                    <CommandInput placeholder="Search users..." />
                                                    <CommandList>
                                                        <CommandEmpty>No user found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {allRegisteredUsers.map((user) => (
                                                                <CommandItem
                                                                    value={user.name}
                                                                    key={user.id}
                                                                    onSelect={() => {
                                                                        setSelectedUser(user.id);
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            user.id === selectedUser ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {user.name}
                                                                    <span className="ml-2 text-[10px] text-zinc-400">{user.email}</span>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Society</label>
                                        <select
                                            value={selectedSoc}
                                            onChange={(e) => setSelectedSoc(e.target.value)}
                                            className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500"
                                        >
                                            <option value="">Select society...</option>
                                            {societies.map((soc) => (
                                                <option key={soc.id} value={soc.id}>{soc.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="pt-2 flex gap-3">
                                        <Button variant="outline" className="flex-1" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
                                        <Button
                                            disabled={!selectedUser || !selectedSoc || isAssigning}
                                            onClick={handleAssignPresident}
                                            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                                        >
                                            {isAssigning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                                            Assign President
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
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
                                    <span className="font-medium text-[#172b4d] dark:text-zinc-200">{dbMetrics.percentage}% Used ({dbMetrics.used}MB)</span>
                                </div>
                                <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-violet-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                                        style={{ width: `${dbMetrics.percentage}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-zinc-600 dark:text-zinc-400">Storage API Limit</span>
                                    <span className="font-medium text-[#172b4d] dark:text-zinc-200">{storageMetrics.used}GB / 2TB</span>
                                </div>
                                <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                        style={{ width: `${storageMetrics.percentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
