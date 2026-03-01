"use client";

import { Check, X, Search, Filter, MoreHorizontal, UserCog, UserPlus, Copy, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useMockData } from "@/app/context/MockDataContext";

export default function AdminUsersPage() {
    const { users, pendingUsers, approvePendingUser, rejectPendingUser, removeUser, societies } = useMockData();

    // In production this comes from the authenticated session.
    // Society id "1" = Computer Science Society (the mock admin's society).
    const ADMIN_SOCIETY_ID = "1";
    const adminSociety = societies.find(s => s.id === ADMIN_SOCIETY_ID);

    const activeUsers = users
        .filter(u => u.status === 'Active' && u.societyIds.includes(ADMIN_SOCIETY_ID));
    const [inviteCopied, setInviteCopied] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);

    const handleCopyInvite = () => {
        navigator.clipboard.writeText("https://kaam.app/invite/ref=emt2026");
        setInviteCopied(true);
        setTimeout(() => setInviteCopied(false), 2000);
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText("emt2026");
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
    };

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
                    <Button variant="outline" size="icon" className="border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-[#172b4d] dark:hover:text-white shrink-0">
                        <Filter className="h-4 w-4" />
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-rose-500 text-white hover:bg-rose-600 shadow-sm shrink-0">
                                <UserPlus className="h-4 w-4 mr-2 hidden sm:flex" /> Invite
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                            <DialogHeader>
                                <DialogTitle className="text-[#172b4d] dark:text-white">Invite New Member</DialogTitle>
                                <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                                    Share this unique sign-up link. Once they register, they will appear in your pending approvals.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col space-y-4 mt-4">
                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Invite Link</label>
                                    <div className="flex items-center space-x-2">
                                        <div className="grid flex-1 gap-2">
                                            <input
                                                readOnly
                                                value="https://kaam.app/invite/ref=emt2026"
                                                className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-500 dark:text-zinc-400 outline-none"
                                            />
                                        </div>
                                        <Button size="sm" onClick={handleCopyInvite} className="px-3 bg-[#172b4d] dark:bg-white text-white dark:text-black">
                                            {inviteCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Referral Code Only</label>
                                    <div className="flex items-center space-x-2">
                                        <div className="grid flex-1 gap-2">
                                            <input
                                                readOnly
                                                value="emt2026"
                                                className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm font-mono text-zinc-800 dark:text-zinc-300 outline-none"
                                            />
                                        </div>
                                        <Button size="sm" variant="outline" onClick={handleCopyCode} className="px-3 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300">
                                            {codeCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            <div className="space-y-8 w-full">

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
                                                <span className="text-sm text-zinc-500 dark:text-zinc-500">{user.time}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button onClick={() => approvePendingUser(user.id, "Member", "General")} size="sm" variant="outline" className="border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-300 dark:hover:border-emerald-500/50 h-8 px-2.5">
                                                        <Check className="h-4 w-4 mr-1.5" /> Accept
                                                    </Button>
                                                    <Button onClick={() => rejectPendingUser(user.id)} size="sm" variant="outline" className="border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-300 dark:hover:border-rose-500/50 h-8 px-2.5">
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
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 dark:text-zinc-500 hover:text-[#172b4d] dark:hover:text-white">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl">
                                                        <DropdownMenuItem className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg text-sm">
                                                            <UserCog className="h-3.5 w-3.5" /> Edit Role
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-1" />
                                                        <DropdownMenuItem
                                                            onClick={() => removeUser(user.id)}
                                                            className="flex items-center gap-2 text-rose-600 dark:text-rose-400 cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-sm"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" /> Delete User
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
