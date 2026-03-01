"use client";

import { Building2, Plus, Search, Users, LayoutGrid, TrendingUp, MoreVertical, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMockData } from "@/app/context/MockDataContext";

const COLORS = [
    { label: "Violet", value: "bg-violet-500", text: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-500/10" },
    { label: "Rose", value: "bg-rose-500", text: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
    { label: "Blue", value: "bg-blue-500", text: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
    { label: "Emerald", value: "bg-emerald-500", text: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
    { label: "Amber", value: "bg-amber-500", text: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
    { label: "Fuchsia", value: "bg-fuchsia-500", text: "text-fuchsia-500", bg: "bg-fuchsia-50 dark:bg-fuchsia-500/10" },
];

// Simulate some extra per-society detail for display
const SOCIETY_META: Record<string, { boards: number; tasks: number; activity: string }> = {
    "1": { boards: 4, tasks: 87, activity: "High" },
    "2": { boards: 2, tasks: 34, activity: "Medium" },
    "3": { boards: 3, tasks: 52, activity: "High" },
    "4": { boards: 1, tasks: 12, activity: "Low" },
};

export default function SuperSocietiesPage() {
    const { societies, addSociety } = useMockData();
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    // Form state
    const [name, setName] = useState("");
    const [acronym, setAcronym] = useState("");
    const [president, setPresident] = useState("");
    const [email, setEmail] = useState("");
    const [color, setColor] = useState("bg-violet-500");
    const [type, setType] = useState("Academic");

    const filtered = societies.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.acronym.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = () => {
        if (!name.trim() || !acronym.trim()) return;
        addSociety({
            id: `soc-${Date.now()}`,
            name: name.trim(),
            acronym: acronym.trim().toUpperCase(),
            members: 1,
            status: "Active",
        });
        setName(""); setAcronym(""); setPresident(""); setEmail(""); setColor("bg-violet-500"); setType("Academic");
        setOpen(false);
    };

    const getActivityColor = (level: string) => {
        if (level === "High") return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20";
        if (level === "Medium") return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20";
        return "text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700";
    };

    const getColorMeta = (colorVal: string) => COLORS.find(c => c.value === colorVal) || COLORS[0];

    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight text-[#172b4d] dark:text-white mb-2">Societies Registry</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                        Manage all registered organizations operating on the Kaam platform.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search societies..."
                            className="pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500 w-48"
                        />
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-violet-600 text-white hover:bg-violet-700 shadow-sm shrink-0">
                                <Plus className="h-4 w-4 mr-2" /> Register Organization
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                            <DialogHeader>
                                <DialogTitle className="text-[#172b4d] dark:text-white flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-violet-500" /> Register New Organization
                                </DialogTitle>
                                <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                                    Fill in the details below. A society admin will be assigned after creation.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 mt-2">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5 col-span-2">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Full Name <span className="text-rose-500">*</span></label>
                                        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Computer Science Society"
                                            className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Acronym <span className="text-rose-500">*</span></label>
                                        <input value={acronym} onChange={e => setAcronym(e.target.value)} placeholder="CSS" maxLength={6}
                                            className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm font-mono uppercase text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Society Type</label>
                                        <select value={type} onChange={e => setType(e.target.value)}
                                            className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500">
                                            <option>Academic</option><option>Cultural</option><option>Sports</option>
                                            <option>Professional</option><option>Community Service</option><option>Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">President / Founding Lead Name</label>
                                        <input value={president} onChange={e => setPresident(e.target.value)} placeholder="Full name of the society president"
                                            className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500" />
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">President Contact Email</label>
                                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="president@university.edu"
                                            className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500" />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Society Accent Color</label>
                                        <div className="flex gap-2.5">
                                            {COLORS.map(c => (
                                                <div key={c.value} title={c.label} onClick={() => setColor(c.value)}
                                                    className={`h-7 w-7 rounded-full cursor-pointer border-2 transition-transform hover:scale-110 ${c.value} ${color === c.value ? 'border-[#172b4d] dark:border-white ring-2 ring-zinc-200 dark:ring-zinc-700 ring-offset-1 scale-110' : 'border-transparent opacity-70 hover:opacity-100'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 border-zinc-200 dark:border-zinc-800">Cancel</Button>
                                    <Button disabled={!name.trim() || !acronym.trim()} onClick={handleSubmit}
                                        className="flex-1 bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50">Register Society</Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            {/* Rich Society Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((soc) => {
                    const meta = SOCIETY_META[soc.id] || { boards: 1, tasks: 0, activity: "Low" };
                    const cm = getColorMeta(soc.id === "1" ? "bg-violet-500" : soc.id === "2" ? "bg-blue-500" : soc.id === "3" ? "bg-emerald-500" : "bg-amber-500");
                    return (
                        <div key={soc.id} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden group relative flex flex-col">
                            {/* Top accent banner */}
                            <div className={`h-2 w-full ${cm.value} opacity-80`} />

                            <div className="p-6 flex flex-col flex-1">
                                {/* Header row */}
                                <div className="flex items-start justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <Avatar className={`h-12 w-12 border-2 border-white dark:border-zinc-950 shadow-sm ${cm.bg}`}>
                                            <AvatarFallback className={`${cm.text} font-bold text-sm ${cm.bg}`}>{soc.acronym}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold text-base text-[#172b4d] dark:text-zinc-100 leading-tight">{soc.name}</h3>
                                            <p className="text-xs text-zinc-500 font-mono uppercase">{soc.acronym}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${soc.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'}`}>
                                            {soc.status}
                                        </span>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-[#172b4d] dark:hover:text-white -mr-1">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Stats row */}
                                <div className="grid grid-cols-3 gap-3 mb-5">
                                    <div className="bg-[#f4f5f7] dark:bg-zinc-950/50 rounded-xl p-3 text-center">
                                        <p className="text-xl font-bold text-[#172b4d] dark:text-white">{soc.members.toLocaleString()}</p>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Members</p>
                                    </div>
                                    <div className="bg-[#f4f5f7] dark:bg-zinc-950/50 rounded-xl p-3 text-center">
                                        <p className="text-xl font-bold text-[#172b4d] dark:text-white">{meta.boards}</p>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Boards</p>
                                    </div>
                                    <div className="bg-[#f4f5f7] dark:bg-zinc-950/50 rounded-xl p-3 text-center">
                                        <p className="text-xl font-bold text-[#172b4d] dark:text-white">{meta.tasks}</p>
                                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">Tasks</p>
                                    </div>
                                </div>

                                {/* Activity & tags */}
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                                    <div className="flex items-center gap-1.5">
                                        <TrendingUp className="h-3.5 w-3.5 text-zinc-400" />
                                        <span className="text-xs text-zinc-500">Activity:</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getActivityColor(meta.activity)}`}>
                                            {meta.activity}
                                        </span>
                                    </div>
                                    <Button variant="outline" size="sm" className="h-7 text-xs border-zinc-200 dark:border-zinc-700 hover:border-violet-400 dark:hover:border-violet-500/50 hover:text-violet-600 dark:hover:text-violet-400 transition">
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Register new card */}
                <button onClick={() => setOpen(true)} className="bg-[#f4f5f7]/50 dark:bg-zinc-900/20 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-6 hover:border-violet-400 dark:hover:border-violet-500/50 transition flex flex-col items-center justify-center gap-3 text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 min-h-[220px] group">
                    <div className="h-12 w-12 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center group-hover:bg-violet-50 dark:group-hover:bg-violet-500/10 transition">
                        <Plus className="h-6 w-6" />
                    </div>
                    <span className="font-medium text-sm">Register New Society</span>
                </button>
            </div>

        </div>
    );
}
