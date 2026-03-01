"use client";

import { Crown, Plus, Trash2, Users2, Shield, ChevronDown, X, Pencil } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMockData, OfficeBearerRole, OBPosition } from "@/app/context/MockDataContext";

// Default + custom positions
const DEFAULT_POSITIONS: OBPosition[] = ["President", "General Secretary", "Press Secretary", "Treasurer"];

const POSITION_STYLES: Record<string, { bg: string; text: string; border: string; icon: string }> = {
    "President": { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-500/20", icon: "👑" },
    "General Secretary": { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-500/20", icon: "📋" },
    "Press Secretary": { bg: "bg-violet-50 dark:bg-violet-500/10", text: "text-violet-700 dark:text-violet-400", border: "border-violet-200 dark:border-violet-500/20", icon: "📣" },
    "Treasurer": { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-500/20", icon: "💰" },
};
const getStyle = (pos: string) => POSITION_STYLES[pos] || { bg: "bg-zinc-50 dark:bg-zinc-800/50", text: "text-zinc-600 dark:text-zinc-400", border: "border-zinc-200 dark:border-zinc-700", icon: "🔖" };

export default function AdminOfficeBearersPage() {
    const { teams, officeBearers, users, addOfficeBearerRole, updateOfficeBearerRole, removeOfficeBearerRole } = useMockData();

    const [addOpen, setAddOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<OfficeBearerRole | null>(null);
    const [customPositions, setCustomPositions] = useState<string[]>([]);
    const [newCustomPos, setNewCustomPos] = useState("");

    // Add form
    const [selUserId, setSelUserId] = useState("");
    const [selPosition, setSelPosition] = useState<OBPosition>("President");
    const [selTeamIds, setSelTeamIds] = useState<string[]>([]);
    const [customPosInput, setCustomPosInput] = useState("");

    // Edit form
    const [editTeamIds, setEditTeamIds] = useState<string[]>([]);
    const [editPosition, setEditPosition] = useState<OBPosition>("President");

    const allPositions = [...DEFAULT_POSITIONS, ...customPositions];
    const isPresident = selPosition === "President";
    const editIsPresident = editPosition === "President";

    const toggleTeam = (id: string, arr: string[], setter: (v: string[]) => void) => {
        setter(arr.includes(id) ? arr.filter(t => t !== id) : [...arr, id]);
    };

    const handleAdd = () => {
        const user = users.find(u => u.id === selUserId);
        if (!user || !selPosition) return;
        addOfficeBearerRole({
            id: `ob-${Date.now()}`,
            name: user.name,
            email: user.email,
            position: selPosition,
            assignedTeamIds: isPresident ? [] : selTeamIds,
        });
        setSelUserId(""); setSelPosition("President"); setSelTeamIds([]); setAddOpen(false);
    };

    const openEdit = (ob: OfficeBearerRole) => {
        setEditTarget(ob);
        setEditTeamIds(ob.assignedTeamIds);
        setEditPosition(ob.position);
    };

    const handleSaveEdit = () => {
        if (!editTarget) return;
        updateOfficeBearerRole(editTarget.id, {
            position: editPosition,
            assignedTeamIds: editIsPresident ? [] : editTeamIds,
        });
        setEditTarget(null);
    };

    const addCustomPosition = () => {
        if (newCustomPos.trim() && !allPositions.includes(newCustomPos.trim())) {
            setCustomPositions([...customPositions, newCustomPos.trim()]);
            setNewCustomPos("");
        }
    };

    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight text-[#172b4d] dark:text-white mb-2">Office Bearers</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                        Manage society-level roles. Presidents access all teams; other OBs access only their assigned teams.
                    </p>
                </div>
                <div className="flex gap-3">
                    {/* Add custom position */}
                    <div className="flex gap-2">
                        <input
                            value={newCustomPos}
                            onChange={e => setNewCustomPos(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addCustomPosition()}
                            placeholder="Add custom position..."
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-rose-500 w-52"
                        />
                        <Button onClick={addCustomPosition} variant="outline" size="sm" className="border-zinc-200 dark:border-zinc-800 shrink-0">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <Dialog open={addOpen} onOpenChange={setAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-rose-500 text-white hover:bg-rose-600 shadow-sm shrink-0">
                                <Plus className="h-4 w-4 mr-2" /> Add Office Bearer
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                            <DialogHeader>
                                <DialogTitle className="text-[#172b4d] dark:text-white">Add Office Bearer</DialogTitle>
                                <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                                    Assign a registered user to a society-level position.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 mt-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Select User <span className="text-rose-500">*</span></label>
                                    <select value={selUserId} onChange={e => setSelUserId(e.target.value)}
                                        className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-rose-500">
                                        <option value="">Choose a registered user...</option>
                                        {users.map(u => <option key={u.id} value={u.id}>{u.name} — {u.email}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Position <span className="text-rose-500">*</span></label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {allPositions.map(pos => (
                                            <button key={pos} onClick={() => setSelPosition(pos)}
                                                className={`px-3 py-2 rounded-lg text-left text-xs font-medium border transition ${selPosition === pos ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-400 dark:border-rose-500/50 text-rose-700 dark:text-rose-300' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                                                {getStyle(pos).icon} {pos}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {!isPresident && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Assign Teams</label>
                                        <p className="text-[11px] text-zinc-400">This OB will only access the selected teams.</p>
                                        <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                                            {teams.map(t => (
                                                <button key={t.id} onClick={() => toggleTeam(t.id, selTeamIds, setSelTeamIds)}
                                                    className={`px-3 py-2 rounded-lg text-left text-xs font-medium border transition flex items-center gap-2 ${selTeamIds.includes(t.id) ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-400 dark:border-blue-500/50 text-blue-700 dark:text-blue-300' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                                                    <span className={`h-2 w-2 rounded-full ${t.color} shrink-0`} />
                                                    {t.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {isPresident && (
                                    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg p-3 text-xs text-amber-700 dark:text-amber-400">
                                        👑 President role grants access to <strong>all teams</strong> automatically.
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <Button variant="outline" onClick={() => setAddOpen(false)} className="flex-1 border-zinc-200 dark:border-zinc-800">Cancel</Button>
                                    <Button disabled={!selUserId} onClick={handleAdd} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-50">Add OB</Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            {/* Edit OB dialog */}
            <Dialog open={!!editTarget} onOpenChange={open => !open && setEditTarget(null)}>
                <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-[#172b4d] dark:text-white">Edit Office Bearer</DialogTitle>
                        <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                            Update <strong className="text-[#172b4d] dark:text-white">{editTarget?.name}</strong>'s position and team access.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Position</label>
                            <div className="grid grid-cols-2 gap-2">
                                {allPositions.map(pos => (
                                    <button key={pos} onClick={() => setEditPosition(pos)}
                                        className={`px-3 py-2 rounded-lg text-left text-xs font-medium border transition ${editPosition === pos ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-400 dark:border-rose-500/50 text-rose-700 dark:text-rose-300' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                                        {getStyle(pos).icon} {pos}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {!editIsPresident && (
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Team Access</label>
                                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                                    {teams.map(t => (
                                        <button key={t.id} onClick={() => toggleTeam(t.id, editTeamIds, setEditTeamIds)}
                                            className={`px-3 py-2 rounded-lg text-left text-xs font-medium border transition flex items-center gap-2 ${editTeamIds.includes(t.id) ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-400 dark:border-blue-500/50 text-blue-700 dark:text-blue-300' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                                            <span className={`h-2 w-2 rounded-full ${t.color} shrink-0`} />
                                            {t.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {editIsPresident && (
                            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg p-3 text-xs text-amber-700 dark:text-amber-400">
                                👑 President automatically accesses all teams.
                            </div>
                        )}
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={() => setEditTarget(null)} className="flex-1 border-zinc-200 dark:border-zinc-800">Cancel</Button>
                            <Button onClick={handleSaveEdit} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white">Save Changes</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Permission Legend */}
            <div className="mb-6 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-xl p-4 shadow-sm">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Society Role → Team Access</h3>
                <div className="flex flex-wrap gap-3">
                    {[
                        { pos: "President", note: "All teams", color: "amber" },
                        { pos: "General Secretary", note: "Assigned teams", color: "blue" },
                        { pos: "Press Secretary", note: "Assigned teams", color: "violet" },
                        { pos: "Treasurer", note: "Assigned teams", color: "emerald" },
                        { pos: "Custom", note: "Assigned teams", color: "zinc" },
                    ].map(r => {
                        const s = getStyle(r.pos);
                        return (
                            <div key={r.pos} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${s.bg} ${s.text} ${s.border}`}>
                                <span>{s.icon}</span>
                                <span className="font-semibold">{r.pos}</span>
                                <span className="opacity-70">— {r.note}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* OB Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {officeBearers.map(ob => {
                    const s = getStyle(ob.position);
                    const isPresident = ob.position === "President";
                    const assignedTeams = isPresident ? teams : teams.filter(t => ob.assignedTeamIds.includes(t.id));
                    return (
                        <div key={ob.id} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">
                            <div className={`h-1.5 w-full ${isPresident ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700'}`} />
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className={`h-12 w-12 border-2 ${isPresident ? 'border-amber-200 dark:border-amber-500/30' : 'border-zinc-200 dark:border-zinc-700'} shadow-sm`}>
                                            <AvatarFallback className={`${s.bg} ${s.text} font-bold`}>
                                                {ob.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-[#172b4d] dark:text-zinc-100">{ob.name}</p>
                                            <p className="text-xs text-zinc-500 mt-0.5">{ob.email}</p>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-[#172b4d] dark:hover:text-white -mr-1 -mt-1">
                                                <ChevronDown className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl">
                                            <DropdownMenuItem onClick={() => openEdit(ob)} className="flex items-center gap-2 text-sm cursor-pointer rounded-lg">
                                                <Pencil className="h-3.5 w-3.5" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-1" />
                                            <DropdownMenuItem onClick={() => removeOfficeBearerRole(ob.id)}
                                                className="flex items-center gap-2 text-rose-600 dark:text-rose-400 cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-sm">
                                                <Trash2 className="h-3.5 w-3.5" /> Remove
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Position badge */}
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${s.bg} ${s.text} ${s.border}`}>
                                    {s.icon} {ob.position}
                                </div>

                                {/* Team access */}
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-2 font-semibold">
                                        {isPresident ? "Full Access" : `Team Access (${assignedTeams.length})`}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {isPresident ? (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 font-medium">All Teams</span>
                                        ) : assignedTeams.length > 0 ? (
                                            assignedTeams.map(t => (
                                                <span key={t.id} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                                                    <span className={`h-1.5 w-1.5 rounded-full ${t.color}`} />
                                                    {t.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-zinc-400 italic">No teams assigned</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
