"use client";

import { Check, X, Search, Filter, MoreHorizontal, UserCog } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const pendingUsers = [
    { id: 1, name: "Alice Johnson", email: "alice.j@university.edu", society: "Tech Society", applied: "2 hours ago" },
    { id: 2, name: "Mark Peterson", email: "mark.p@gmail.com", society: "Event Management", applied: "5 hours ago" },
    { id: 3, name: "Sarah Lee", email: "sarah.lee99@test.com", society: "Debate Club", applied: "1 day ago" },
];

const activeUsers = [
    { id: 4, name: "John Doe", email: "user@test.com", role: "Member", team: "Creative", status: "Active" },
    { id: 5, name: "Emma Smith", email: "emma.smith@test.com", role: "Team Lead", team: "Operations", status: "Active" },
    { id: 6, name: "Michael Chen", email: "m.chen@test.com", role: "Member", team: "Marketing", status: "Inactive" },
];

export default function AdminUsersPage() {
    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight text-[#172b4d] dark:text-white mb-2">User Management</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                        Review pending approvals and manage active members.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-[#172b4d] dark:text-white outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500 transition w-full md:w-64"
                        />
                    </div>
                    <Button variant="outline" size="icon" className="border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-[#172b4d] dark:hover:text-white">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            <div className="space-y-8 max-w-6xl">

                {/* Pending Approvals */}
                <div>
                    <h2 className="text-lg font-semibold text-[#172b4d] dark:text-zinc-100 mb-4 flex items-center gap-2">
                        Pending Approvals
                        <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-500">{pendingUsers.length}</Badge>
                    </h2>

                    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50">
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Society</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Applied</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/30 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800">
                                                        <AvatarFallback className="bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-500 text-xs font-medium">{user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium text-[#172b4d] dark:text-zinc-200">{user.name}</p>
                                                        <p className="text-xs text-zinc-500 dark:text-zinc-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-zinc-600 dark:text-zinc-300">{user.society}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-zinc-500 dark:text-zinc-500">{user.applied}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button size="sm" variant="outline" className="border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-300 dark:hover:border-emerald-500/50 h-8 px-2.5">
                                                        <Check className="h-4 w-4 mr-1.5" /> Accept
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-300 dark:hover:border-rose-500/50 h-8 px-2.5">
                                                        <X className="h-4 w-4 mr-1.5" /> Reject
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Active Members */}
                <div>
                    <h2 className="text-lg font-semibold text-[#172b4d] dark:text-zinc-100 mb-4 flex items-center gap-2">
                        Active Members
                        <Badge variant="outline" className="border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">{activeUsers.length}</Badge>
                    </h2>

                    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50">
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Role & Team</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">Manage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/30 transition">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800">
                                                        <AvatarFallback className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-medium">{user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium text-[#172b4d] dark:text-zinc-200">{user.name}</p>
                                                        <p className="text-xs text-zinc-500 dark:text-zinc-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">{user.role}</span>
                                                    <span className="text-xs text-zinc-500 dark:text-zinc-500">{user.team} Team</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={user.status === 'Active' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10' : 'text-zinc-500 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50'}>
                                                    {user.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 dark:text-zinc-500 hover:text-[#172b4d] dark:hover:text-white">
                                                    <UserCog className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 dark:text-zinc-500 hover:text-[#172b4d] dark:hover:text-white">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
