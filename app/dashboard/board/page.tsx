"use client";

import {
    MoreHorizontal, Plus, AlignLeft, MessageSquare, Paperclip,
    CheckCircle2, Calendar, KanbanSquare, Search, X, Tag,
    Clock, CheckSquare, Users, Circle, Activity, CreditCard,
    Flag, UserCircle2, ChevronDown, Loader2, LayoutGrid
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useMockData, TEAM_ROLE_PERMISSIONS, TeamRole, Team } from "@/app/context/MockDataContext";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type Severity = "High" | "Medium" | "Low";

type CardProps = {
    id: string;
    title: string;
    description?: string;
    hasDescription?: boolean;
    attachments?: number;
    imageCover?: string;
    isCompleted?: boolean;
    comments?: number;
    assignedTo?: string;   // member name
    deadline?: string;     // ISO date string YYYY-MM-DD
    severity?: Severity;
    activity?: { user: string; action: string; time: string; avatar: string }[];
};

type ListProps = { id: string; title: string; cards: CardProps[] };

// ─── Severity helpers ─────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<Severity, { stripe: string; badge: string; icon: string }> = {
    High: { stripe: "bg-red-500", badge: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20", icon: "🔴" },
    Medium: { stripe: "bg-orange-400", badge: "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20", icon: "🟠" },
    Low: { stripe: "bg-emerald-500", badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20", icon: "🟢" },
};

const formatDeadline = (d?: string) => {
    if (!d) return null;
    const date = new Date(d);
    const now = new Date();
    const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (diff < 0) return { label, color: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20" };
    if (diff <= 2) return { label, color: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20" };
    return { label, color: "text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700" };
};

// ─── Board Page ───────────────────────────────────────────────────────────────

export default function BoardPage() {
    const {
        teams, boardLists, boardCards, teamMembers,
        addBoardList, updateBoardList, addBoardCard, updateBoardCard, updateCardStatus, moveCard
    } = useMockData();

    // ── Current User Logic ────────────────────────────────────────────────────
    const [userData, setUserData] = useState<{ id: string; primary_team: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchUserData = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase.from('profiles').select('id, primary_team').eq('id', user.id).single();
                setUserData({ id: user.id, primary_team: profile?.primary_team || "" });
            }
            setIsLoading(false);
        };
        fetchUserData();
    }, []);

    // Find user's team reactively from teamMembers (Source of Truth)
    const myTeam = userData ? teams.find(t =>
        // 1. Check direct associations (Real-time)
        (teamMembers[t.id] || []).some(m => m.userId === userData.id) ||
        // 2. Fallback to profile field
        t.name === userData.primary_team
    ) : null;

    const members = myTeam ? (teamMembers[myTeam.id] || []) : [];

    // Find my explicit role in THIS team. Default to Executive if not found.
    const myTeamMemberRecord = userData ? members.find(m => m.userId === userData.id) : null;
    const rawRole = myTeamMemberRecord?.teamRole || "Executive";
    const myRole = TEAM_ROLE_PERMISSIONS[rawRole as TeamRole] ? rawRole : "Executive";
    const myPerms = TEAM_ROLE_PERMISSIONS[myRole as TeamRole] || TEAM_ROLE_PERMISSIONS["Executive"];

    // ── Board Data Formatting ──────────────────────────────────────────────────

    const displayLists: ListProps[] = boardLists
        .filter(l => l.team_id === myTeam?.id)
        .map(l => ({
            id: l.id,
            title: l.title,
            cards: boardCards
                .filter(c => c.list_id === l.id)
                .map(c => ({
                    id: c.id,
                    title: c.title,
                    description: c.description,
                    isCompleted: c.is_completed,
                    severity: c.severity as Severity,
                    deadline: c.deadline,
                    assignedTo: c.assigned_to_name, // You might need to add this to your schema/mock
                    hasDescription: !!c.description,
                }))
        }));

    // UI state
    const [isAddingList, setIsAddingList] = useState(false);
    const [newListTitle, setNewListTitle] = useState("");
    const [addingCardToList, setAddingCardToList] = useState<string | null>(null);
    const [editingListId, setEditingListId] = useState<string | null>(null);
    const [editListTitle, setEditListTitle] = useState("");
    const [selectedCard, setSelectedCard] = useState<{ card: CardProps; listId: string; listTitle: string } | null>(null);

    // Add-card form
    const [newCardTitle, setNewCardTitle] = useState("");
    // (Other add card fields omitted for brevity, can be re-added if needed)

    // Edit Card logic
    const [editCardField, setEditCardField] = useState<"title" | "description" | null>(null);
    const [editCardText, setEditCardText] = useState("");

    const handleSaveCardField = async () => {
        if (!selectedCard || !editCardField) return;
        const updates = { [editCardField]: editCardText };

        setSelectedCard({
            ...selectedCard,
            card: {
                ...selectedCard.card,
                [editCardField]: editCardText
            }
        });

        await updateBoardCard(selectedCard.card.id, updates);
        setEditCardField(null);
    };

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleAddList = async () => {
        if (!newListTitle.trim() || !myTeam) { setIsAddingList(false); return; }
        await addBoardList(myTeam.id, newListTitle);
        setNewListTitle(""); setIsAddingList(false);
    };

    const handleAddCard = async (listId: string) => {
        if (!newCardTitle.trim()) { setAddingCardToList(null); return; }
        await addBoardCard(listId, newCardTitle);
        setNewCardTitle("");
        setAddingCardToList(null);
    };

    const handleRenameList = async (listId: string) => {
        if (!editListTitle.trim()) { setEditingListId(null); return; }
        await updateBoardList(listId, editListTitle);
        setEditingListId(null);
    };

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (source.droppableId !== destination.droppableId) {
            await moveCard(draggableId, destination.droppableId);
        }
    };

    if (isLoading || !mounted) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
        );
    }

    if (!myTeam) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-amber-50 dark:bg-amber-500/10 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-amber-100 dark:border-amber-500/20">
                    <LayoutGrid className="h-10 w-10 text-amber-500" />
                </div>
                <h2 className="text-2xl font-semibold text-[#172b4d] dark:text-white mb-2">No Team Assigned</h2>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-8 leading-relaxed">
                    You haven't been assigned to a team yet. Please wait for your administrator to assign you to a team board.
                </p>
                <Link href="/dashboard">
                    <Button className="bg-amber-500 text-zinc-950 hover:bg-amber-600 px-8 h-11 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        Return to Dashboard
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col overflow-hidden relative selection:bg-amber-500/30">

            {/* Nav */}
            <nav className="flex items-center justify-between px-6 py-4 shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="font-medium text-lg text-[#172b4d] dark:text-white">{myTeam.name} Board</h1>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-500/20`}>
                        {myRole}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2 mr-2">
                        {(["High", "Medium", "Low"] as Severity[]).map(s => (
                            <span key={s} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${SEVERITY_CONFIG[s].badge}`}>
                                {SEVERITY_CONFIG[s].icon} {s}
                            </span>
                        ))}
                    </div>
                    <Button variant="ghost" size="icon" className="text-zinc-500 dark:text-zinc-400 hover:text-[#172b4d] dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800">
                        <Search className="h-5 w-5" />
                    </Button>
                </div>
            </nav>

            {/* Board */}
            <main className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex h-full items-start gap-4 p-6 w-max">
                        {displayLists.map(list => (
                            <div key={list.id} className="w-[300px] sm:w-[320px] shrink-0 flex flex-col max-h-full bg-[#ebecf0] dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 rounded-xl">

                                {/* List header */}
                                <div className="px-4 py-3 pb-2 flex justify-between items-center text-[#172b4d] dark:text-zinc-100 shrink-0">
                                    {editingListId === list.id ? (
                                        <input autoFocus value={editListTitle} onChange={e => setEditListTitle(e.target.value)}
                                            onBlur={() => handleRenameList(list.id)}
                                            onKeyDown={e => { if (e.key === 'Enter') handleRenameList(list.id); if (e.key === 'Escape') setEditingListId(null); }}
                                            className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 text-sm w-full outline-none focus:border-amber-500/50" />
                                    ) : (
                                        <h2 className="font-medium cursor-pointer py-1 px-1 -ml-1 border border-transparent rounded hover:border-zinc-300 dark:border-zinc-700 flex-1 transition"
                                            onClick={() => { setEditingListId(list.id); setEditListTitle(list.title); }}>
                                            {list.title}
                                            <span className="ml-2 text-xs text-zinc-400 font-normal">({list.cards.length})</span>
                                        </h2>
                                    )}
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 ml-2">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Cards */}
                                <Droppable droppableId={list.id} type="card">
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}
                                            className={`px-3 pb-3 flex-1 overflow-y-auto custom-scrollbar space-y-2.5 transition-colors ${snapshot.isDraggingOver ? 'bg-zinc-100 dark:bg-zinc-800/20' : ''}`}>

                                            {list.cards.map((card, index) => {
                                                const sev = card.severity ? SEVERITY_CONFIG[card.severity] : null;
                                                const dl = formatDeadline(card.deadline);
                                                return (
                                                    <Draggable key={card.id} draggableId={card.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                                style={provided.draggableProps.style}
                                                                onClick={() => setSelectedCard({ card, listId: list.id, listTitle: list.title })}
                                                                className={`group flex flex-col gap-2 bg-white dark:bg-zinc-950 rounded-lg border shadow-sm relative overflow-hidden cursor-pointer transition
                                                                    ${snapshot.isDragging ? 'border-amber-500/50 shadow-2xl scale-[1.02] z-50' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-500'}`}>

                                                                {/* Severity stripe */}
                                                                {sev && <div className={`h-1 w-full ${sev.stripe} shrink-0`} />}

                                                                <div className="px-3.5 pb-3.5 pt-2.5 flex flex-col gap-2">
                                                                    <div className="flex gap-2 items-start">
                                                                        {card.isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />}
                                                                        <p className={`text-sm leading-relaxed ${card.isCompleted ? 'text-zinc-500 dark:text-zinc-400 line-through' : 'text-zinc-800 dark:text-zinc-200'}`}>
                                                                            {card.title}
                                                                        </p>
                                                                    </div>

                                                                    {/* Meta row */}
                                                                    <div className="flex items-center flex-wrap gap-1.5 text-zinc-500">
                                                                        {sev && (
                                                                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${sev.badge}`}>
                                                                                {card.severity}
                                                                            </span>
                                                                        )}
                                                                        {dl && (
                                                                            <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border font-medium ${dl.color}`}>
                                                                                <Calendar className="h-3 w-3" /> {dl.label}
                                                                            </span>
                                                                        )}
                                                                        {card.assignedTo && (
                                                                            <Avatar className="h-5 w-5 ml-auto border border-zinc-200 dark:border-zinc-700">
                                                                                <AvatarFallback className="text-[9px] bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold">
                                                                                    {card.assignedTo.split(' ').map(n => n[0]).join('')}
                                                                                </AvatarFallback>
                                                                            </Avatar>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            })}
                                            {provided.placeholder}

                                            {/* Add Card */}
                                            {myPerms.canAddToBoard && addingCardToList === list.id ? (
                                                <div className="mt-2 space-y-2 bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
                                                    <textarea autoFocus placeholder="Task title..." value={newCardTitle}
                                                        onChange={e => setNewCardTitle(e.target.value)}
                                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddCard(list.id); } if (e.key === 'Escape') setAddingCardToList(null); }}
                                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded p-2 text-sm outline-none resize-none" rows={2} />

                                                    <div className="flex gap-2">
                                                        <Button size="sm" onClick={() => handleAddCard(list.id)} className="bg-amber-500 text-zinc-950 hover:bg-amber-600 text-xs h-7">Add task</Button>
                                                        <Button size="icon" variant="ghost" onClick={() => setAddingCardToList(null)} className="h-7 w-7 text-zinc-500"><X className="h-4 w-4" /></Button>
                                                    </div>
                                                </div>
                                            ) : myPerms.canAddToBoard ? (
                                                <Button variant="ghost" onClick={() => { setAddingCardToList(list.id); setNewCardTitle(""); }}
                                                    className="w-full justify-start text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 mt-2 shrink-0">
                                                    <Plus className="h-4 w-4 mr-2" /> Add a task
                                                </Button>
                                            ) : (
                                                <p className="text-[10px] text-zinc-400 text-center italic pt-2">View only board</p>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}

                        {/* Add list */}
                        {myPerms.canAddToBoard && (
                            <div className="w-[300px] sm:w-[320px] shrink-0">
                                {isAddingList ? (
                                    <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 space-y-3">
                                        <input autoFocus placeholder="Enter list title..." value={newListTitle} onChange={e => setNewListTitle(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') handleAddList(); if (e.key === 'Escape') setIsAddingList(false); }}
                                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-2 text-sm outline-none focus:border-amber-500/50" />
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={handleAddList} className="bg-amber-500 text-zinc-950 hover:bg-amber-600">Add list</Button>
                                            <Button size="icon" variant="ghost" onClick={() => setIsAddingList(false)} className="h-8 w-8 text-zinc-500"><X className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Button variant="outline" onClick={() => { setIsAddingList(true); setNewListTitle(""); }}
                                        className="w-full justify-start border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 bg-[#ebecf0]/50 dark:bg-zinc-900/30 hover:bg-[#ebecf0] hover:text-zinc-800 h-12">
                                        <Plus className="h-4 w-4 mr-2" /> Add another list
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </DragDropContext>
            </main>

            {/* ── Card Detail Modal ── */}
            {selectedCard && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-200"
                    onClick={() => setSelectedCard(null)}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                    <div className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-full max-w-5xl md:h-[82vh] h-[90vh] rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)]"
                        onClick={e => e.stopPropagation()}>

                        <Button variant="ghost" size="icon" className="absolute top-3 right-3 md:hidden z-10 h-8 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-full" onClick={() => setSelectedCard(null)}>
                            <X className="h-4 w-4" />
                        </Button>

                        <div className="flex-1 overflow-y-auto p-5 md:p-8 flex flex-col gap-6 custom-scrollbar">
                            {selectedCard.card.severity && (
                                <div className={`h-1.5 w-full rounded-full ${SEVERITY_CONFIG[selectedCard.card.severity].stripe} -mt-2 md:-mt-2`} />
                            )}

                            <div className="flex items-start gap-4">
                                <Circle className="h-6 w-6 text-zinc-400 mt-1 shrink-0" />
                                <div className="flex-1 min-w-0 pr-8 md:pr-0">
                                    {editCardField === "title" ? (
                                        <div className="mb-2 flex flex-col gap-2">
                                            <input
                                                autoFocus
                                                value={editCardText}
                                                onChange={e => setEditCardText(e.target.value)}
                                                className="text-xl md:text-2xl font-semibold bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700/80 rounded px-2 py-1 text-[#172b4d] dark:text-white w-full outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500"
                                            />
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" onClick={handleSaveCardField} className="bg-amber-500 text-zinc-950 hover:bg-amber-600 h-8 px-3">Save</Button>
                                                <Button size="icon" variant="ghost" onClick={() => setEditCardField(null)} className="h-8 w-8 text-zinc-500 hover:text-zinc-800"><X className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <h2
                                            onClick={() => { if (myPerms.canAddToBoard) { setEditCardField("title"); setEditCardText(selectedCard.card.title); } }}
                                            className={`text-xl md:text-2xl font-semibold text-[#172b4d] dark:text-zinc-100 leading-tight mb-2 ${myPerms.canAddToBoard ? 'cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 px-1 -ml-1 rounded transition-colors' : ''}`}
                                        >
                                            {selectedCard.card.title}
                                        </h2>
                                    )}
                                    <p className="text-sm text-zinc-500">in list <span className="underline underline-offset-4 cursor-pointer">{selectedCard.listTitle}</span></p>

                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {selectedCard.card.severity && (
                                            <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${SEVERITY_CONFIG[selectedCard.card.severity].badge}`}>
                                                <Flag className="h-3.5 w-3.5" /> {selectedCard.card.severity} Priority
                                            </span>
                                        )}
                                        {selectedCard.card.deadline && (() => {
                                            const d = formatDeadline(selectedCard.card.deadline); return d ? (
                                                <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${d.color}`}>
                                                    <Calendar className="h-3.5 w-3.5" /> Due {d.label}
                                                </span>
                                            ) : null;
                                        })()}
                                    </div>
                                </div>
                            </div>

                            <div className="ml-0 md:ml-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <AlignLeft className="h-5 w-5 text-zinc-400 shrink-0" />
                                    <h3 className="text-sm font-semibold text-[#172b4d] dark:text-zinc-100">Description</h3>
                                    {myPerms.canAddToBoard && (
                                        <Button
                                            onClick={() => { setEditCardField("description"); setEditCardText(selectedCard.card.description || ""); }}
                                            variant="secondary"
                                            size="sm"
                                            className="h-7 px-3 text-xs bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-300 hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 ml-auto"
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </div>
                                <div className="ml-0 md:ml-8">
                                    {editCardField === "description" ? (
                                        <div className="space-y-3">
                                            <textarea
                                                autoFocus
                                                value={editCardText}
                                                onChange={e => setEditCardText(e.target.value)}
                                                className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700/80 rounded-lg p-3 text-sm text-[#172b4d] dark:text-zinc-100 placeholder:text-zinc-600 outline-none resize-y min-h-[100px] focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500 shadow-sm custom-scrollbar"
                                                placeholder="Add a more detailed description..."
                                            />
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" onClick={handleSaveCardField} className="bg-amber-500 text-zinc-950 hover:bg-amber-600 px-4">Save</Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditCardField(null)} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">Cancel</Button>
                                            </div>
                                        </div>
                                    ) : selectedCard.card.description ? (
                                        <div
                                            onClick={() => { if (myPerms.canAddToBoard) { setEditCardField("description"); setEditCardText(selectedCard.card.description || ""); } }}
                                            className={`text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 border border-zinc-100 dark:border-zinc-800 min-h-[60px] whitespace-pre-line leading-relaxed ${myPerms.canAddToBoard ? 'cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors' : ''}`}
                                        >
                                            {selectedCard.card.description}
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => { if (myPerms.canAddToBoard) { setEditCardField("description"); setEditCardText(""); } }}
                                            className={`bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-4 text-zinc-500 min-h-[60px] text-sm flex items-center ${myPerms.canAddToBoard ? 'cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors' : ''}`}
                                        >
                                            <span className="italic">No description yet.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-[340px] bg-[#ebecf0] dark:bg-zinc-900/50 md:border-l border-zinc-200 dark:border-zinc-800 flex flex-col md:h-full overflow-hidden shrink-0">
                            <div className="hidden md:flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800/50">
                                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-2 py-1 rounded text-xs font-medium text-zinc-500">
                                    <CreditCard className="h-3.5 w-3.5" /> Task Detail
                                </div>
                            </div>
                            <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Activity className="h-4 w-4 text-zinc-400" />
                                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Activity</h4>
                                </div>
                                <p className="text-xs text-zinc-400 italic">Historical activity tracking coming soon.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
