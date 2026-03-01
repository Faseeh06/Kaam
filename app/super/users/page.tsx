"use client";

import { Users, Search, Download, Filter, MoreHorizontal, Trash2, UserCog, Building2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useMockData } from "@/app/context/MockDataContext";

export default function SuperUsersPage() {
    const { users, societies, removeUser } = useMockData();
    const [search, setSearch] = useState("");
    const [filterSocietyId, setFilterSocietyId] = useState<string>("all");

    // Filter: search + optional society
    const filtered = users.filter(u => {
        const matchesSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchesSociety =
            filterSocietyId === "all" || u.societyIds.includes(filterSocietyId);
        return matchesSearch && matchesSociety;
    });

    // Helper: resolve society names from IDs
    const getSocietyNames = (ids: string[]) =>
        ids.map(id => societies.find(s => s.id === id)).filter(Boolean);

    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight text-[#172b4d] dark:text-white mb-2">Global Master Database</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                        Every registered user across all societies. Filter by society to scope the view.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button className="bg-zinc-800 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-sm shrink-0">
                        <Download className="h-4 w-4 mr-2" /> Export CSV
                    </Button>
                </div>
            </header>

            <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">

                {/* Toolbar */}
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500"
                        />
                    </div>

                    {/* Society filter chips */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-zinc-400 font-medium shrink-0 flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" /> Filter:
                        </span>
                        <button
                            onClick={() => setFilterSocietyId("all")}
                            className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${filterSocietyId === "all" ? "bg-violet-600 text-white border-violet-600" : "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-violet-400"}`}>
                            All ({users.length})
                        </button>
                        {societies.map(soc => {
                            const count = users.filter(u => u.societyIds.includes(soc.id)).length;
                            return (
                                <button key={soc.id}
                                    onClick={() => setFilterSocietyId(filterSocietyId === soc.id ? "all" : soc.id)}
                                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${filterSocietyId === soc.id ? "bg-violet-600 text-white border-violet-600" : "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-violet-400"}`}>
                                    {soc.acronym} ({count})
                                </button>
                            );
                        })}
                        {filterSocietyId !== "all" && (
                            <button onClick={() => setFilterSocietyId("all")}
                                className="ml-1 h-5 w-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition">
                                <X className="h-3 w-3" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 dark:text-zinc-400 uppercase bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-800/50">
                            <tr>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Email</th>
                                <th className="px-6 py-4 font-medium">Societies</th>
                                <th className="px-6 py-4 font-medium">Role / Team</th>
                                <th className="px-6 py-4 font-medium">Joined</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                            {filtered.map((user) => {
                                const userSocieties = getSocietyNames(user.societyIds);
                                return (
                                    <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-700 shrink-0">
                                                    <AvatarFallback className="bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400 text-xs font-bold">
                                                        {user.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <p className="font-medium text-[#172b4d] dark:text-zinc-200 whitespace-nowrap">{user.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500 font-mono text-xs whitespace-nowrap">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {userSocieties.map(soc => soc && (
                                                    <span key={soc.id}
                                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20 whitespace-nowrap">
                                                        {soc.acronym}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-xs font-semibold text-[#172b4d] dark:text-zinc-300">{user.role}</span>
                                                <span className="text-[11px] text-zinc-400">{user.team}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500 whitespace-nowrap text-xs">{user.joined}</td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-[#172b4d] dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
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
                                                        className="flex items-center gap-2 text-rose-600 dark:text-rose-400 cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-sm">
                                                        <Trash2 className="h-3.5 w-3.5" /> Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-zinc-400 dark:text-zinc-600">
                            <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
                            <p className="text-sm font-medium">No users found</p>
                            {filterSocietyId !== "all" && (
                                <p className="text-xs mt-1 text-zinc-400">
                                    Try clearing the society filter
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
