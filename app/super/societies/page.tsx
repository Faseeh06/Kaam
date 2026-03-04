"use client";

import { Building2, Plus, Search, TrendingUp, MoreVertical, Settings, MessageSquare, Mail, Globe, Upload, X, ImageIcon, Activity, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMockData, Society } from "@/app/context/MockDataContext";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLORS = [
    { label: "Violet", value: "bg-violet-500", bg: "bg-violet-100 dark:bg-violet-500/20", textDark: "text-violet-700 dark:text-violet-300" },
    { label: "Rose", value: "bg-rose-500", bg: "bg-rose-100 dark:bg-rose-500/20", textDark: "text-rose-700 dark:text-rose-300" },
    { label: "Blue", value: "bg-blue-500", bg: "bg-blue-100 dark:bg-blue-500/20", textDark: "text-blue-700 dark:text-blue-300" },
    { label: "Emerald", value: "bg-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-500/20", textDark: "text-emerald-700 dark:text-emerald-300" },
    { label: "Amber", value: "bg-amber-500", bg: "bg-amber-100 dark:bg-amber-500/20", textDark: "text-amber-700 dark:text-amber-300" },
    { label: "Fuchsia", value: "bg-fuchsia-500", bg: "bg-fuchsia-100 dark:bg-fuchsia-500/20", textDark: "text-fuchsia-700 dark:text-fuchsia-300" },
];

const SOCIETY_META: Record<string, { boards: number; tasks: number; activity: string; colorIdx: number }> = {
    "1": { boards: 4, tasks: 87, activity: "High", colorIdx: 0 },
    "2": { boards: 2, tasks: 34, activity: "Medium", colorIdx: 2 },
    "3": { boards: 3, tasks: 52, activity: "High", colorIdx: 3 },
    "4": { boards: 1, tasks: 12, activity: "Low", colorIdx: 4 },
};

const getActivityColor = (level: string) => {
    if (level === "High") return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20";
    if (level === "Medium") return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20";
    return "text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700";
};

// ─── Reusable Logo Upload Zone ─────────────────────────────────────────────────
function LogoUpload({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const processFile = (file: File) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = e => onChange(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault(); setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    }, []);

    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5" /> Society Logo
            </label>

            {value ? (
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50 dark:bg-zinc-900 shrink-0">
                        <img src={value} alt="Logo" className="h-full w-full object-contain p-1" />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <p className="text-xs text-zinc-500">Logo uploaded ✓</p>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}
                                className="text-xs h-7 border-zinc-200 dark:border-zinc-800">
                                <Upload className="h-3 w-3 mr-1" /> Replace
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => onChange("")}
                                className="text-xs h-7 border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10">
                                <X className="h-3 w-3 mr-1" /> Remove
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-5 cursor-pointer transition
                        ${dragging
                            ? "border-violet-400 bg-violet-50 dark:bg-violet-500/10"
                            : "border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-violet-400 dark:hover:border-violet-500/50 hover:bg-violet-50/40 dark:hover:bg-violet-500/5"}`}>
                    <div className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-sm">
                        <Upload className="h-5 w-5 text-zinc-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Drop logo here or <span className="text-violet-600 dark:text-violet-400 underline">browse</span></p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">PNG, JPG, SVG — max 2 MB</p>
                    </div>
                </div>
            )}
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SuperSocietiesPage() {
    const { societies, addSociety, updateSociety, teams, boardLists, boardCards, users } = useMockData();
    const router = useRouter();
    const [registerOpen, setRegisterOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Society | null>(null);
    const [search, setSearch] = useState("");

    // Helper to calculate society metrics
    const getSocietyMetrics = (societyId: string) => {
        const societyTeams = teams.filter(t => t.society_id === societyId);
        const teamIds = societyTeams.map(t => t.id);

        const societyLists = boardLists.filter(l => teamIds.includes(l.team_id));
        const listIds = societyLists.map(l => l.id);

        const societyCards = boardCards.filter(c => listIds.includes(c.list_id));

        // Real-time member count for this society
        const memberCount = users.filter(u => u.societyIds.includes(societyId)).length;

        return {
            members: memberCount,
            boards: societyTeams.length,
            tasks: societyCards.length,
            activity: societyCards.length > 20 ? "High" : (societyCards.length > 5 ? "Medium" : "Low")
        };
    };

    // Register form
    const [name, setName] = useState("");
    const [acronym, setAcronym] = useState("");
    const [president, setPresident] = useState("");
    const [email, setEmail] = useState("");
    const [color, setColor] = useState("bg-violet-500");
    const [type, setType] = useState("Academic");
    const [logo, setLogo] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    // Edit form
    const [editName, setEditName] = useState("");
    const [editDesc, setEditDesc] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editWebsite, setEditWebsite] = useState("");
    const [editWhatsapp, setEditWhatsapp] = useState("");
    const [editStatus, setEditStatus] = useState("Active");
    const [editLogo, setEditLogo] = useState("");
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    const filtered = societies.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.acronym.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = async () => {
        if (!name.trim() || !acronym.trim() || isRegistering) return;
        setIsRegistering(true);
        try {
            await addSociety({
                id: `soc-${Date.now()}`, name: name.trim(),
                acronym: acronym.trim().toUpperCase(), members: 1,
                status: "Active", email, description: "", logo: logo || undefined,
            });
            setName(""); setAcronym(""); setPresident(""); setEmail("");
            setColor("bg-violet-500"); setType("Academic"); setLogo("");
            setRegisterOpen(false);
        } finally {
            setIsRegistering(false);
        }
    };

    const openEdit = (soc: Society) => {
        setEditTarget(soc);
        setEditName(soc.name);
        setEditDesc(soc.description || "");
        setEditEmail(soc.email || "");
        setEditWebsite(soc.website || "");
        setEditWhatsapp(soc.whatsapp || "");
        setEditStatus(soc.status);
        setEditLogo(soc.logo || "");
    };

    const handleSaveEdit = async () => {
        if (!editTarget || isSavingEdit) return;
        setIsSavingEdit(true);
        try {
            await updateSociety(editTarget.id, {
                name: editName, description: editDesc, email: editEmail,
                website: editWebsite, whatsapp: editWhatsapp,
                status: editStatus, logo: editLogo || undefined,
            });
            setEditTarget(null);
        } finally {
            setIsSavingEdit(false);
        }
    };

    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight text-[#172b4d] dark:text-white mb-2">Societies Registry</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">Manage all registered organizations on the Kaam platform.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search societies..."
                            className="pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500 w-48" />
                    </div>

                    {/* ── Register Dialog ── */}
                    <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-violet-600 text-white hover:bg-violet-700 shadow-sm shrink-0">
                                <Plus className="h-4 w-4 mr-2" /> Register Organization
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-[#172b4d] dark:text-white flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-violet-500" /> Register New Organization
                                </DialogTitle>
                                <DialogDescription className="text-zinc-500 dark:text-zinc-400">Fill in the details to register a new society.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-2">
                                {/* Logo uploader */}
                                <LogoUpload value={logo} onChange={setLogo} />

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
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Type</label>
                                        <select value={type} onChange={e => setType(e.target.value)}
                                            className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500">
                                            <option>Academic</option><option>Cultural</option><option>Sports</option>
                                            <option>Professional</option><option>Community Service</option><option>Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">President Name</label>
                                        <input value={president} onChange={e => setPresident(e.target.value)} placeholder="Full name of the society president"
                                            className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500" />
                                    </div>
                                    <div className="space-y-1.5 col-span-2">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Contact Email</label>
                                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="president@university.edu"
                                            className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500" />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Accent Color</label>
                                        <div className="flex gap-2.5">
                                            {COLORS.map(c => (
                                                <div key={c.value} title={c.label} onClick={() => setColor(c.value)}
                                                    className={`h-7 w-7 rounded-full cursor-pointer border-2 transition-transform hover:scale-110 ${c.value} ${color === c.value ? 'border-[#172b4d] dark:border-white ring-2 ring-zinc-200 dark:ring-zinc-700 ring-offset-1 scale-110' : 'border-transparent opacity-70 hover:opacity-100'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <Button variant="outline" onClick={() => setRegisterOpen(false)} disabled={isRegistering} className="flex-1 border-zinc-200 dark:border-zinc-800">Cancel</Button>
                                    <Button disabled={!name.trim() || !acronym.trim() || isRegistering} onClick={handleSubmit}
                                        className="flex-1 bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50">
                                        {isRegistering ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : ""} Register Society
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            {/* ── Edit Dialog ── */}
            <Dialog open={!!editTarget} onOpenChange={open => !open && setEditTarget(null)}>
                <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-[#172b4d] dark:text-white flex items-center gap-2">
                            <Settings className="h-5 w-5 text-violet-500" /> Edit Society Profile
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                            Update the details for <strong className="text-[#172b4d] dark:text-white">{editTarget?.name}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        {/* Logo uploader */}
                        <LogoUpload value={editLogo} onChange={setEditLogo} />

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Society Name</label>
                            <input value={editName} onChange={e => setEditName(e.target.value)}
                                className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Description</label>
                            <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={3}
                                className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500 resize-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1"><Mail className="h-3 w-3" /> Email</label>
                                <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="contact@society.edu"
                                    className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1"><Globe className="h-3 w-3" /> Website</label>
                                <input type="url" value={editWebsite} onChange={e => setEditWebsite(e.target.value)} placeholder="https://..."
                                    className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500" />
                            </div>
                            <div className="space-y-1.5 col-span-2">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3 text-[#25D366]" /> WhatsApp Group Link
                                </label>
                                <input value={editWhatsapp} onChange={e => setEditWhatsapp(e.target.value)} placeholder="https://chat.whatsapp.com/..."
                                    className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-violet-500" />
                                <p className="text-[11px] text-zinc-400">Used on the Chat page for members to join via WhatsApp.</p>
                            </div>
                            <div className="space-y-1.5 col-span-2">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</label>
                                <div className="flex gap-3">
                                    {["Active", "Inactive"].map(s => (
                                        <button key={s} onClick={() => setEditStatus(s)}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${editStatus === s ? (s === "Active" ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-400 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-300" : "bg-rose-50 dark:bg-rose-500/10 border-rose-400 dark:border-rose-500/50 text-rose-700 dark:text-rose-300") : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500"}`}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={() => setEditTarget(null)} disabled={isSavingEdit} className="flex-1 border-zinc-200 dark:border-zinc-800">Cancel</Button>
                            <Button onClick={handleSaveEdit} disabled={isSavingEdit} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50">
                                {isSavingEdit ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : ""} Save Changes
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ── Cards Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((soc, idx) => {
                    const metrics = getSocietyMetrics(soc.id);
                    const cm = COLORS[idx % COLORS.length];
                    return (
                        <Card
                            key={soc.id}
                            className="group bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col relative"
                            onClick={() => router.push(`/super/societies/${soc.id}`)}
                        >
                            {/* Card Decorative Top or Cover Image */}
                            <div className="h-24 w-full relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                {soc.cover_url ? (
                                    <img src={soc.cover_url} alt="Cover" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <div className={cn("w-full h-full opacity-20", cm.value)} />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                    <p className="text-[10px] text-white/80 font-medium">Click to view details</p>
                                </div>
                                <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border-white/20 text-white transition-colors">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl">
                                            <DropdownMenuItem onClick={() => openEdit(soc)} className="flex items-center gap-2 cursor-pointer text-sm font-medium p-2.5">
                                                <Settings className="h-4 w-4 text-violet-500" /> Edit Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-1" />
                                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2.5 font-medium">
                                                Archive Society
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <div className="px-6 pb-6 pt-0 flex flex-col flex-1 relative">
                                {/* Logo overlapping the cover */}
                                <div className="h-16 w-16 rounded-2xl border-4 border-white dark:border-zinc-900 bg-white dark:bg-zinc-800 shadow-md -mt-8 mb-4 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
                                    {soc.logo ? (
                                        <img src={soc.logo} alt={soc.name} className="h-full w-full object-contain p-1" />
                                    ) : (
                                        <Building2 className={cn("h-7 w-7", cm.textDark.split(' ')[0])} />
                                    )}
                                </div>

                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <h3 className="font-bold text-lg text-[#172b4d] dark:text-zinc-100 leading-tight truncate flex-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{soc.name}</h3>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                        soc.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                                    )}>
                                        {soc.status}
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-500 font-medium font-mono uppercase tracking-tight mb-4">{soc.acronym}</p>

                                {soc.description && (
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed line-clamp-2 min-h-[32px]">{soc.description}</p>
                                )}

                                <div className="grid grid-cols-3 gap-2 mb-6">
                                    {[{ label: "Members", val: metrics.members }, { label: "Boards", val: metrics.boards }, { label: "Tasks", val: metrics.tasks }].map(s => (
                                        <div key={s.label} className="flex flex-col items-center p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800/50 group-hover:bg-violet-50/30 dark:group-hover:bg-violet-500/5 transition-colors">
                                            <p className="text-base font-bold text-[#172b4d] dark:text-white">{s.val}</p>
                                            <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                                    <div className="flex items-center gap-1.5">
                                        <Activity className="h-3.5 w-3.5 text-zinc-400" />
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                                            getActivityColor(metrics.activity)
                                        )}>
                                            {metrics.activity} ACTIVITY
                                        </span>
                                    </div>
                                    <TrendingUp className="h-4 w-4 text-zinc-300 group-hover:text-violet-500 transition-colors" />
                                </div>
                            </div>
                        </Card>
                    );
                })}


                {/* Add new tile */}
                <button onClick={() => setRegisterOpen(true)} className="bg-[#f4f5f7]/50 dark:bg-zinc-900/20 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-6 hover:border-violet-400 dark:hover:border-violet-500/50 transition flex flex-col items-center justify-center gap-3 text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 min-h-[220px] group">
                    <div className="h-12 w-12 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center group-hover:bg-violet-50 dark:group-hover:bg-violet-500/10 transition">
                        <Plus className="h-6 w-6" />
                    </div>
                    <span className="font-medium text-sm">Register New Society</span>
                </button>
            </div>

        </div>
    );
}
