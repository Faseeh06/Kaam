"use client";

import { Shield, Plus, ShieldAlert, Building2, MoreHorizontal, Trash2, Pencil, Search, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMockData } from "@/app/context/MockDataContext";

type AdminRole = "Society President" | "Vice President" | "Secretary" | "Treasurer" | "General Admin";

const ROLE_OPTIONS: { label: AdminRole; icon: string; color: string }[] = [
    { label: "Society President", icon: "👑", color: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
    { label: "Vice President", icon: "🎖️", color: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
    { label: "Secretary", icon: "📋", color: "text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20" },
    { label: "Treasurer", icon: "💰", color: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
    { label: "General Admin", icon: "🔧", color: "text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700" },
];

const getRoleStyle = (role: string) =>
    ROLE_OPTIONS.find(r => r.label === role) ?? { icon: "🔖", color: "text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700" };

export default function SuperAdminsPage() {
    const { admins, users, societies, addAdmin, removeAdmin } = useMockData();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedSociety, setSelectedSociety] = useState("");
    const [selectedRole, setSelectedRole] = useState<AdminRole>("Society President");

    const filtered = admins.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        a.scope.toLowerCase().includes(search.toLowerCase())
    );

    const handleMakeAdmin = () => {
        const user = users.find(u => u.id === selectedUserId);
        const society = societies.find(s => s.id === selectedSociety);
        if (!user || !society) return;
        addAdmin({ id: `admin-${Date.now()}`, name: user.name, email: user.email, role: selectedRole, scope: society.name });
        setSelectedUserId(""); setSelectedSociety(""); setSelectedRole("Society President");
        setOpen(false);
    };

    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            {/* Header */}
            <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight text-[#172b4d] dark:text-white mb-2">Admin Access</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                        Delegate and revoke elevated access across all societies.
                    </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-violet-600 text-white hover:bg-violet-700 shadow-sm shrink-0">
                            <Plus className="h-4 w-4 mr-2" /> Make Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                        <DialogHeader>
                            <DialogTitle className="text-[#172b4d] dark:text-white flex items-center gap-2">
                                <Shield className="h-5 w-5 text-violet-500" /> Grant Admin Privileges
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                                Select a registered user, assign a role, and link them to a society.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 mt-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Select User <span className="text-rose-500">*</span></label>
                                <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}
                                    className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500">
                                    <option value="">Choose a registered user...</option>
                                    {users.map(u => <option key={u.id} value={u.id}>{u.name} — {u.email}</option>)}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Assign Role <span className="text-rose-500">*</span></label>
                                <div className="grid grid-cols-2 gap-2">
                                    {ROLE_OPTIONS.map(r => (
                                        <button key={r.label} onClick={() => setSelectedRole(r.label)}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium border transition text-left flex items-center gap-2 ${selectedRole === r.label
                                                ? "bg-violet-50 dark:bg-violet-500/10 border-violet-400 dark:border-violet-500/50 text-violet-700 dark:text-violet-300"
                                                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"}`}>
                                            <span>{r.icon}</span> {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Link to Society <span className="text-rose-500">*</span></label>
                                <select value={selectedSociety} onChange={e => setSelectedSociety(e.target.value)}
                                    className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500">
                                    <option value="">Choose a society...</option>
                                    {societies.map(s => <option key={s.id} value={s.id}>{s.name} ({s.acronym})</option>)}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 border-zinc-200 dark:border-zinc-800">Cancel</Button>
                                <Button disabled={!selectedUserId || !selectedSociety} onClick={handleMakeAdmin}
                                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50">
                                    Confirm & Grant Access
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </header>

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
                {[
                    { label: "Total Admins", value: admins.length, icon: <Shield className="h-4 w-4 text-violet-500" /> },
                    { label: "Super Admins", value: admins.filter(a => a.scope === "Global").length, icon: <ShieldAlert className="h-4 w-4 text-amber-500" /> },
                    { label: "Society Admins", value: admins.filter(a => a.scope !== "Global").length, icon: <Building2 className="h-4 w-4 text-blue-500" /> },
                    { label: "Societies", value: societies.length, icon: <Crown className="h-4 w-4 text-emerald-500" /> },
                ].map(s => (
                    <div key={s.label} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-xl p-4 shadow-sm flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0">{s.icon}</div>
                        <div>
                            <p className="text-xl font-bold text-[#172b4d] dark:text-white">{s.value}</p>
                            <p className="text-[11px] text-zinc-500 leading-none mt-0.5">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-950/20">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search admins..."
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500" />
                    </div>
                    <span className="text-xs text-zinc-400 ml-auto">{filtered.length} admin{filtered.length !== 1 ? "s" : ""}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 dark:text-zinc-400 uppercase bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-800/50">
                            <tr>
                                <th className="px-6 py-3.5 font-medium">Admin</th>
                                <th className="px-6 py-3.5 font-medium">Role</th>
                                <th className="px-6 py-3.5 font-medium">Society / Scope</th>
                                <th className="px-6 py-3.5 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                            {filtered.map(admin => {
                                const rs = getRoleStyle(admin.role);
                                const isGlobal = admin.scope === "Global";
                                return (
                                    <tr key={admin.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
                                        {/* Admin */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className={`h-9 w-9 border-2 shadow-sm ${isGlobal ? "border-violet-200 dark:border-violet-500/30" : "border-zinc-200 dark:border-zinc-700"}`}>
                                                    <AvatarFallback className={`font-bold text-sm ${isGlobal ? "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}>
                                                        {admin.name.split(" ").map(n => n[0]).join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-[#172b4d] dark:text-zinc-200">{admin.name}</p>
                                                    <p className="text-xs text-zinc-500 font-mono">{admin.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${rs.color}`}>
                                                {rs.icon} {admin.role}
                                            </span>
                                        </td>

                                        {/* Scope */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                {isGlobal
                                                    ? <ShieldAlert className="h-4 w-4 text-violet-500 shrink-0" />
                                                    : <Building2 className="h-4 w-4 text-zinc-400 shrink-0" />}
                                                <span className={`text-sm font-medium ${isGlobal ? "text-violet-600 dark:text-violet-400" : "text-zinc-700 dark:text-zinc-300"}`}>
                                                    {admin.scope}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"
                                                        className="h-8 w-8 text-zinc-400 hover:text-[#172b4d] dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl">
                                                    <DropdownMenuItem className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 cursor-pointer rounded-lg text-sm">
                                                        <Pencil className="h-3.5 w-3.5" /> Edit Scope
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-1" />
                                                    <DropdownMenuItem
                                                        onClick={() => removeAdmin(admin.id)}
                                                        disabled={isGlobal}
                                                        className={`flex items-center gap-2 cursor-pointer rounded-lg text-sm ${isGlobal ? "text-zinc-300 dark:text-zinc-600 cursor-not-allowed" : "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"}`}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        {isGlobal ? "Can't delete Super" : "Revoke Access"}
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
                        <div className="text-center py-14 text-zinc-400 dark:text-zinc-600">
                            <ShieldAlert className="h-10 w-10 mx-auto mb-3 opacity-30" />
                            <p className="text-sm font-medium">No admins found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
