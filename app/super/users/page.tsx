"use client";

import { Users, Search, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useMockData } from "@/app/context/MockDataContext";

export default function SuperUsersPage() {
    const { users } = useMockData();

    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight text-[#172b4d] dark:text-white mb-2">Global Master Database</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                        View every single registered user across the entire platform.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <Filter className="h-4 w-4 mr-2" /> Filter
                    </Button>
                    <Button className="bg-zinc-800 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-sm shrink-0">
                        <Download className="h-4 w-4 mr-2" /> Export CSV
                    </Button>
                </div>
            </header>

            <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-950/20">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                            placeholder="Query massive database by email or name..."
                            className="pl-9 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus-visible:ring-violet-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 dark:text-zinc-400 uppercase bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-800/50">
                            <tr>
                                <th className="px-6 py-4 font-medium">User Profile</th>
                                <th className="px-6 py-4 font-medium">Email Identifier</th>
                                <th className="px-6 py-4 font-medium">Connected Society</th>
                                <th className="px-6 py-4 font-medium">Registration Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[#172b4d] dark:text-zinc-200">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 font-mono text-xs">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 text-violet-600 dark:text-violet-400 font-medium">
                                        {user.society}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500">
                                        {user.joined}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
