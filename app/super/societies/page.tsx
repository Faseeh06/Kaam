"use client";

import { Building2, Plus, Search, MoreVertical, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useMockData } from "@/app/context/MockDataContext";

export default function SuperSocietiesPage() {
    const { societies, addSociety } = useMockData();

    const handleRegisterSociety = () => {
        addSociety({
            id: `soc-${Date.now()}`,
            name: "New Example Society",
            acronym: "NES",
            members: 1,
            status: "Active"
        });
    };

    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight text-[#172b4d] dark:text-white mb-2">Societies Registry</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                        Manage all registered organizations operating on the Kaam platform.
                    </p>
                </div>
                <Button onClick={handleRegisterSociety} className="bg-violet-600 text-white hover:bg-violet-700 shadow-sm shrink-0">
                    <Plus className="h-4 w-4 mr-2" /> Register Organization
                </Button>
            </header>

            <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-950/20">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                            placeholder="Search societies..."
                            className="pl-9 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 dark:text-zinc-400 uppercase bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-800/50">
                            <tr>
                                <th className="px-6 py-4 font-medium">Organization</th>
                                <th className="px-6 py-4 font-medium">Total Members</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                            {societies.map((soc) => (
                                <tr key={soc.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-700">
                                                <AvatarFallback className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 font-bold text-xs">{soc.acronym}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-[#172b4d] dark:text-zinc-200">{soc.name}</p>
                                                <p className="text-xs text-zinc-500">{soc.acronym}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400 font-medium">
                                        {soc.members.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${soc.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'}`}>
                                            {soc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-[#172b4d] dark:hover:text-white">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
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
