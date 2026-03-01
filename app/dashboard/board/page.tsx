"use client";

import {
    MoreHorizontal, Plus, AlignLeft, MessageSquare, Paperclip,
    CheckCircle2, Calendar, KanbanSquare, Search, X, Tag,
    Clock, CheckSquare, Users, Circle, Activity, CreditCard,
    Flag, UserCircle2, ChevronDown
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useMockData, TeamRole, TEAM_ROLE_PERMISSIONS } from "@/app/context/MockDataContext";

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

// ─── Initial data ─────────────────────────────────────────────────────────────

const initialLists: ListProps[] = [
    {
        id: "list-1", title: "To Do",
        cards: [
            {
                id: "c-1", title: "Design new onboarding flow",
                description: "Create a step-by-step onboarding for new members joining the society.",
                hasDescription: true, severity: "High", deadline: "2026-03-05",
                assignedTo: "Alice Smith",
                activity: [{ user: "Sarah J.", action: "created this task", time: "Mar 1, 2026", avatar: "SJ" }]
            },
            {
                id: "c-2", title: "Write event proposal document",
                severity: "Medium", deadline: "2026-03-10", assignedTo: "Chris R.",
                activity: []
            }
        ]
    },
    {
        id: "list-2", title: "In Progress",
        cards: [
            {
                id: "c-3", title: "Social media banners for annual gala",
                hasDescription: true, severity: "High", deadline: "2026-03-03",
                assignedTo: "Liam O.", attachments: 2,
                activity: [{ user: "Mike L.", action: "moved to In Progress", time: "Mar 1, 2026", avatar: "ML" }]
            }
        ]
    },
    {
        id: "list-3", title: "Review",
        cards: [
            {
                id: "c-4", title: "Sponsorship deck — first draft",
                hasDescription: true, severity: "Medium", deadline: "2026-03-07",
                assignedTo: "Alice Smith", comments: 3,
                activity: [{ user: "Emma W.", action: "submitted for review", time: "Feb 28, 2026", avatar: "EW" }]
            }
        ]
    },
    {
        id: "list-4", title: "Done",
        cards: [
            { id: "c-5", title: "Confirm venue booking", isCompleted: true, severity: "Low", assignedTo: "Bob Johnson", activity: [] },
            { id: "c-6", title: "Send thank-you emails to sponsors", isCompleted: true, severity: "Low", activity: [] }
        ]
    }
];

// ─── Simulate current user & role ─────────────────────────────────────────────
const MY_TEAM_ID = "1";
const MY_ROLE: TeamRole = "Director"; // change to "Executive" to see restricted view

// ─── Board Page ───────────────────────────────────────────────────────────────

export default function BoardPage() {
    const { teamMembers } = useMockData();
    const myPerms = TEAM_ROLE_PERMISSIONS[MY_ROLE];
    const teamMemberList = teamMembers[MY_TEAM_ID] || [];

    const [lists, setLists] = useState<ListProps[]>(initialLists);
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    // UI state
    const [isAddingList, setIsAddingList] = useState(false);
    const [newListTitle, setNewListTitle] = useState("");
    const [addingCardToList, setAddingCardToList] = useState<string | null>(null);
    const [editingListId, setEditingListId] = useState<string | null>(null);
    const [editListTitle, setEditListTitle] = useState("");
    const [selectedCard, setSelectedCard] = useState<{ card: CardProps; listId: string; listTitle: string } | null>(null);

    // Add-card form
    const [newCardTitle, setNewCardTitle] = useState("");
    const [newCardSeverity, setNewCardSeverity] = useState<Severity>("Medium");
    const [newCardDeadline, setNewCardDeadline] = useState("");
    const [newCardAssignee, setNewCardAssignee] = useState("");

    // Card detail assign panel
    const [assignDropOpen, setAssignDropOpen] = useState(false);
    const [commentText, setCommentText] = useState("");

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleAddList = () => {
        if (!newListTitle.trim()) { setIsAddingList(false); return; }
        setLists([...lists, { id: `list-${Date.now()}`, title: newListTitle, cards: [] }]);
        setNewListTitle(""); setIsAddingList(false);
    };

    const handleAddCard = (listId: string) => {
        if (!newCardTitle.trim()) { setAddingCardToList(null); return; }
        const list = lists.find(l => l.id === listId);
        setLists(lists.map(l => l.id !== listId ? l : {
            ...l,
            cards: [...l.cards, {
                id: `c-${Date.now()}`, title: newCardTitle,
                severity: newCardSeverity,
                deadline: newCardDeadline || undefined,
                assignedTo: newCardAssignee || undefined,
                activity: [{ user: MY_ROLE, action: `added this task to ${list?.title}`, time: "Just now", avatar: MY_ROLE.substring(0, 2).toUpperCase() }]
            }]
        }));
        setNewCardTitle(""); setNewCardSeverity("Medium"); setNewCardDeadline(""); setNewCardAssignee("");
        setAddingCardToList(null);
    };

    const handleRenameList = (listId: string) => {
        if (!editListTitle.trim()) { setEditingListId(null); return; }
        setLists(lists.map(l => l.id === listId ? { ...l, title: editListTitle } : l));
        setEditingListId(null);
    };

    const handleAssign = (memberName: string) => {
        if (!selectedCard) return;
        setLists(lists.map(l => l.id !== selectedCard.listId ? l : {
            ...l,
            cards: l.cards.map(c => c.id !== selectedCard.card.id ? c : { ...c, assignedTo: memberName })
        }));
        setSelectedCard(prev => prev ? { ...prev, card: { ...prev.card, assignedTo: memberName } } : null);
        setAssignDropOpen(false);
    };

    const handleAddComment = () => {
        if (!commentText.trim() || !selectedCard) return;
        const newActivity = { user: MY_ROLE, action: `commented: "${commentText}"`, time: "Just now", avatar: MY_ROLE.substring(0, 2).toUpperCase() };
        setLists(lists.map(l => l.id !== selectedCard.listId ? l : {
            ...l,
            cards: l.cards.map(c => c.id !== selectedCard.card.id ? c : { ...c, activity: [...(c.activity || []), newActivity] })
        }));
        setSelectedCard(prev => prev ? { ...prev, card: { ...prev.card, activity: [...(prev.card.activity || []), newActivity] } } : null);
        setCommentText("");
    };

    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;
        const srcIdx = lists.findIndex(l => l.id === source.droppableId);
        const dstIdx = lists.findIndex(l => l.id === destination.droppableId);
        if (srcIdx === -1 || dstIdx === -1) return;
        const srcCards = Array.from(lists[srcIdx].cards);
        const dstCards = source.droppableId === destination.droppableId ? srcCards : Array.from(lists[dstIdx].cards);
        const [moved] = srcCards.splice(source.index, 1);
        dstCards.splice(destination.index, 0, moved);
        const newLists = [...lists];
        newLists[srcIdx] = { ...lists[srcIdx], cards: srcCards };
        if (source.droppableId !== destination.droppableId)
            newLists[dstIdx] = { ...lists[dstIdx], cards: dstCards };
        setLists(newLists);
    };

    if (!mounted) return null;

    return (
        <div className="h-full flex flex-col overflow-hidden relative selection:bg-amber-500/30">

            {/* Nav */}
            <nav className="flex items-center justify-between px-6 py-4 shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="font-medium text-lg text-[#172b4d] dark:text-white">Creative & Design Board</h1>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${myPerms.canAddToBoard ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20" : "bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700"}`}>
                        {MY_ROLE}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {/* Severity legend */}
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
                        {lists.map(list => (
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
                                                                        {card.comments && (
                                                                            <span className="flex items-center gap-1 text-xs font-medium">
                                                                                <MessageSquare className="h-3.5 w-3.5" /> {card.comments}
                                                                            </span>
                                                                        )}
                                                                        {card.attachments && (
                                                                            <span className="flex items-center gap-1 text-xs font-medium">
                                                                                <Paperclip className="h-3.5 w-3.5" /> {card.attachments}
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

                                                    {/* Severity picker */}
                                                    <div className="flex gap-1.5">
                                                        {(["High", "Medium", "Low"] as Severity[]).map(s => (
                                                            <button key={s} onClick={() => setNewCardSeverity(s)}
                                                                className={`text-[10px] font-semibold px-2 py-1 rounded-full border flex items-center gap-1 transition ${newCardSeverity === s ? SEVERITY_CONFIG[s].badge + " ring-1 ring-offset-1 ring-current" : "bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700"}`}>
                                                                {SEVERITY_CONFIG[s].icon} {s}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {/* Deadline */}
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                                                        <input type="date" value={newCardDeadline} onChange={e => setNewCardDeadline(e.target.value)}
                                                            className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 text-xs outline-none text-zinc-700 dark:text-zinc-300" />
                                                    </div>

                                                    {/* Assignee */}
                                                    {myPerms.canAssign && (
                                                        <div className="flex items-center gap-2">
                                                            <UserCircle2 className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                                                            <select value={newCardAssignee} onChange={e => setNewCardAssignee(e.target.value)}
                                                                className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 text-xs outline-none text-zinc-700 dark:text-zinc-300">
                                                                <option value="">Assign to...</option>
                                                                {teamMemberList.map(m => <option key={m.id} value={m.name}>{m.name} ({m.teamRole})</option>)}
                                                            </select>
                                                        </div>
                                                    )}

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
                                                <p className="text-[10px] text-zinc-400 text-center italic pt-2">View only — {MY_ROLE}s can comment</p>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}

                        {/* Add list */}
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

                        {/* Mobile close */}
                        <Button variant="ghost" size="icon" className="absolute top-3 right-3 md:hidden z-10 h-8 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-full" onClick={() => setSelectedCard(null)}>
                            <X className="h-4 w-4" />
                        </Button>

                        {/* Left content */}
                        <div className="flex-1 overflow-y-auto p-5 md:p-8 flex flex-col gap-6 custom-scrollbar">

                            {/* Severity banner */}
                            {selectedCard.card.severity && (
                                <div className={`h-1.5 w-full rounded-full ${SEVERITY_CONFIG[selectedCard.card.severity].stripe} -mt-2 md:-mt-2`} />
                            )}

                            <div className="flex items-start gap-4">
                                <Circle className="h-6 w-6 text-zinc-400 mt-1 shrink-0" />
                                <div className="flex-1 min-w-0 pr-8 md:pr-0">
                                    <h2 className="text-xl md:text-2xl font-semibold text-[#172b4d] dark:text-zinc-100 leading-tight mb-2">{selectedCard.card.title}</h2>
                                    <p className="text-sm text-zinc-500">in list <span className="underline underline-offset-4 cursor-pointer">{selectedCard.listTitle}</span></p>

                                    {/* Chips */}
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
                                        {selectedCard.card.assignedTo && (
                                            <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/20">
                                                <UserCircle2 className="h-3.5 w-3.5" /> {selectedCard.card.assignedTo}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="ml-0 md:ml-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <AlignLeft className="h-5 w-5 text-zinc-400 shrink-0" />
                                    <h3 className="text-sm font-semibold text-[#172b4d] dark:text-zinc-100">Description</h3>
                                </div>
                                <div className="ml-0 md:ml-8 text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4 border border-zinc-100 dark:border-zinc-800 min-h-[60px]">
                                    {selectedCard.card.description || <span className="italic text-zinc-400">No description yet.</span>}
                                </div>
                            </div>
                        </div>

                        {/* Right sidebar */}
                        <div className="w-full md:w-[340px] bg-[#ebecf0] dark:bg-zinc-900/50 md:border-l border-zinc-200 dark:border-zinc-800 flex flex-col md:h-full overflow-hidden shrink-0">

                            {/* Sidebar header */}
                            <div className="hidden md:flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800/50">
                                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-2 py-1 rounded text-xs font-medium text-zinc-500">
                                    <CreditCard className="h-3.5 w-3.5" /> Task Detail
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-800 dark:hover:text-white" onClick={() => setSelectedCard(null)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-5">

                                {/* Assign section — only for canAssign roles */}
                                {myPerms.canAssign && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Assignee</h4>
                                        <div className="relative">
                                            <button onClick={() => setAssignDropOpen(!assignDropOpen)}
                                                className="w-full flex items-center justify-between gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 transition">
                                                <span className="flex items-center gap-2">
                                                    <UserCircle2 className="h-4 w-4 text-zinc-400" />
                                                    {selectedCard.card.assignedTo || "Unassigned"}
                                                </span>
                                                <ChevronDown className="h-4 w-4 text-zinc-400" />
                                            </button>
                                            {assignDropOpen && (
                                                <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-10 overflow-hidden">
                                                    <div className="p-1">
                                                        {teamMemberList.map(m => (
                                                            <button key={m.id} onClick={() => handleAssign(m.name)}
                                                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition text-left ${selectedCard.card.assignedTo === m.name ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "text-zinc-700 dark:text-zinc-300"}`}>
                                                                <Avatar className="h-6 w-6">
                                                                    <AvatarFallback className="text-[10px] bg-zinc-200 dark:bg-zinc-700">{m.name.charAt(0)}</AvatarFallback>
                                                                </Avatar>
                                                                <span>{m.name}</span>
                                                                <span className="ml-auto text-[10px] text-zinc-400">{m.teamRole}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Activity + comments */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Activity className="h-4 w-4 text-zinc-400" />
                                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Activity</h4>
                                    </div>

                                    {/* Comment box — all roles can comment */}
                                    <div className="flex items-start gap-2 mb-4">
                                        <Avatar className="h-7 w-7 shrink-0"><AvatarFallback className="text-[10px] bg-amber-100 dark:bg-amber-500/20 text-amber-700">{MY_ROLE.substring(0, 2)}</AvatarFallback></Avatar>
                                        <div className="flex-1 flex flex-col gap-1.5">
                                            <textarea value={commentText} onChange={e => setCommentText(e.target.value)}
                                                placeholder="Write a comment..."
                                                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 text-sm resize-none outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500"
                                                rows={2}
                                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
                                            />
                                            {commentText.trim() && (
                                                <Button size="sm" onClick={handleAddComment} className="self-end bg-amber-500 text-zinc-950 hover:bg-amber-600 h-7 text-xs px-3">Post</Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Activity list */}
                                    <div className="space-y-4">
                                        {(selectedCard.card.activity || []).map((act, i) => (
                                            <div key={i} className="flex gap-2.5">
                                                <Avatar className="h-7 w-7 shrink-0">
                                                    <AvatarFallback className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold">{act.avatar}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 mt-0.5">
                                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">
                                                        <span className="font-semibold text-[#172b4d] dark:text-zinc-100 mr-1">{act.user}</span>
                                                        {act.action}
                                                    </p>
                                                    <p className="text-[11px] text-zinc-400 mt-0.5">{act.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {(!selectedCard.card.activity || selectedCard.card.activity.length === 0) && (
                                            <p className="text-xs text-zinc-400 italic">No activity yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
