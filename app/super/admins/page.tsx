"use client";

import { UserCog, Plus, Search, ShieldAlert, Key, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useMockData } from "@/app/context/MockDataContext";

export default function SuperAdminsPage() {
    const { admins, addAdmin } = useMockData();

    const handleGrantAdmin = () => {
        addAdmin({
            id: `admin-${Date.now()}`,
            name: "New Admin",
            email: "new.admin@edu.com",
            role: "Society President",
            scope: "New Society"
        });
    };

    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight text-[#172b4d] dark:text-white mb-2">Local Admins Access</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                        Delegate and monitor root access to Society Presidents.
                    </p>
                </div>
                <Button onClick={handleGrantAdmin} className="bg-violet-600 text-white hover:bg-violet-700 shadow-sm shrink-0">
                    <Key className="h-4 w-4 mr-2" /> Grant Admin Rights
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {admins.map((admin) => (
                    <div key={admin.id} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition relative overflow-hidden group">

                        <div className={`absolute top-0 left-0 w-1.5 h-full ${admin.scope === 'Global' ? 'bg-violet-500' : 'bg-rose-500'}`} />

                        <div className="flex justify-between items-start mb-4">
                            <Avatar className="h-12 w-12 border-2 border-white dark:border-zinc-950 shadow-sm">
                                <AvatarFallback className={`${admin.scope === 'Global' ? 'bg-violet-100 text-violet-700' : 'bg-rose-100 text-rose-700'} font-bold`}>
                                    {admin.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded border ${admin.scope === 'Global' ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'}`}>
                                {admin.role}
                            </span>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg text-[#172b4d] dark:text-zinc-100">{admin.name}</h3>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">{admin.email}</p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                            <p className="text-xs text-zinc-500 mb-1">Scope of Authority</p>
                            <p className="font-medium text-sm text-[#172b4d] dark:text-zinc-300 flex items-center gap-1.5">
                                {admin.scope === 'Global' ? <ShieldAlert className="h-4 w-4 text-violet-500" /> : <Building2 className="h-4 w-4 text-rose-400" />}
                                {admin.scope}
                            </p>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <Button variant="outline" className="w-full text-xs h-8 border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-500/20 dark:hover:bg-rose-500/10">Revoke</Button>
                            <Button variant="outline" className="w-full text-xs h-8">Edit Scope</Button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
