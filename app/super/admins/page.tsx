"use client";

import { UserCog, Plus, ShieldAlert, Key, Building2, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMockData } from "@/app/context/MockDataContext";

type AdminRole = "Society President" | "Vice President" | "Secretary" | "Treasurer" | "General Admin";

const ROLE_OPTIONS: AdminRole[] = [
    "Society President",
    "Vice President",
    "Secretary",
    "Treasurer",
    "General Admin",
];

export default function SuperAdminsPage() {
    const { admins, users, societies, addAdmin } = useMockData();
    const [open, setOpen] = useState(false);

    // Form state
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedSociety, setSelectedSociety] = useState("");
    const [selectedRole, setSelectedRole] = useState<AdminRole>("Society President");

    const handleMakeAdmin = () => {
        const user = users.find(u => u.id === selectedUserId);
        const society = societies.find(s => s.id === selectedSociety);
        if (!user || !society) return;

        addAdmin({
            id: `admin-${Date.now()}`,
            name: user.name,
            email: user.email,
            role: selectedRole,
            scope: society.name,
        });
        setSelectedUserId(""); setSelectedSociety(""); setSelectedRole("Society President");
        setOpen(false);
    };

    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight text-[#172b4d] dark:text-white mb-2">Local Admins Access</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                        Delegate and monitor elevated access to Society Office Bearers.
                    </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-violet-600 text-white hover:bg-violet-700 shadow-sm shrink-0">
                            <Shield className="h-4 w-4 mr-2" /> Make Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                        <DialogHeader>
                            <DialogTitle className="text-[#172b4d] dark:text-white flex items-center gap-2">
                                <Shield className="h-5 w-5 text-violet-500" /> Grant Admin Privileges
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                                Select an existing registered user, assign them a role, and link them to a society.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 mt-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                                    Select User <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={selectedUserId}
                                    onChange={e => setSelectedUserId(e.target.value)}
                                    className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500"
                                >
                                    <option value="">Choose a registered user...</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
                                    ))}
                                </select>
                                {selectedUserId && (
                                    <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">
                                        ✓ User found: {users.find(u => u.id === selectedUserId)?.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                                    Assign Role <span className="text-rose-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {ROLE_OPTIONS.map(role => (
                                        <button
                                            key={role}
                                            onClick={() => setSelectedRole(role)}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium border transition text-left ${selectedRole === role
                                                    ? "bg-violet-50 dark:bg-violet-500/10 border-violet-400 dark:border-violet-500/50 text-violet-700 dark:text-violet-300"
                                                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                                                }`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                                    Link to Society <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={selectedSociety}
                                    onChange={e => setSelectedSociety(e.target.value)}
                                    className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500"
                                >
                                    <option value="">Choose a society...</option>
                                    {societies.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.acronym})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 border-zinc-200 dark:border-zinc-800">
                                    Cancel
                                </Button>
                                <Button
                                    disabled={!selectedUserId || !selectedSociety}
                                    onClick={handleMakeAdmin}
                                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
                                >
                                    Confirm & Grant Access
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {admins.map((admin) => (
                    <div key={admin.id} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition relative overflow-hidden group">

                        <div className={`absolute top-0 left-0 w-1.5 h-full ${admin.scope === 'Global' ? 'bg-violet-500' : 'bg-rose-500'}`} />

                        <div className="flex justify-between items-start mb-4">
                            <Avatar className="h-12 w-12 border-2 border-white dark:border-zinc-950 shadow-sm">
                                <AvatarFallback className={`${admin.scope === 'Global' ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'} font-bold`}>
                                    {admin.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded border ${admin.scope === 'Global' ? 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'}`}>
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
                            <Button variant="outline" className="w-full text-xs h-8 border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/10">Revoke</Button>
                            <Button variant="outline" className="w-full text-xs h-8 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800">Edit Scope</Button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
