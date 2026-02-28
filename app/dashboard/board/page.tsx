"use client";

import {
    MoreHorizontal,
    Plus,
    AlignLeft,
    MessageSquare,
    Paperclip,
    CheckCircle2,
    Inbox,
    Calendar,
    KanbanSquare,
    Layers,
    Search,
    X,
    Tag,
    Clock,
    CheckSquare,
    Users,
    Circle,
    Activity,
    CreditCard
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

type CardProps = {
    id: string;
    title: string;
    description?: string;
    hasDescription?: boolean;
    attachments?: number;
    imageCover?: string;
    isCompleted?: boolean;
    comments?: number;
    hasAvatar?: boolean;
    activity?: { user: string; action: string; time: string; avatar: string }[];
};

type ListProps = {
    id: string;
    title: string;
    cards: CardProps[];
};

const initialLists: ListProps[] = [
    {
        id: "list-1",
        title: "To Do",
        cards: [
            {
                id: "c-1",
                title: "V2 (milestone 2) - feedback from client 2/22/2026",
                description: "1. Exhibitor needs to see and download data scanned from QR badges\n2. Please add addresses to the web and rego forms.\n\nAustralia – May / June\n• Tuesday 19 May — Hordern Pavilion, Gate C/3 Driver Ave, Moore Park NSW\n• Thursday 21 May — Brisbane Showgrounds Exhibition Building\n• Tuesday 26 May — Melbourne Showgrounds Victoria Pavilion",
                hasDescription: true,
                activity: [
                    { user: "HawkgeekDev", action: "added this card to To Do", time: "Feb 22, 2026, 10:57 PM", avatar: "HD" }
                ]
            }
        ]
    },
    {
        id: "list-2",
        title: "In Progress - Dev",
        cards: []
    },
    {
        id: "list-3",
        title: "Review",
        cards: [
            {
                id: "c-2",
                title: "client feedback for signup",
                hasDescription: false,
            },
            {
                id: "c-3",
                title: "Add QR code on registration detail modal",
                hasDescription: true,
                attachments: 1,
                imageCover: "/images/solution-detect.png"
            }
        ]
    },
    {
        id: "list-4",
        title: "Done",
        cards: [
            {
                id: "c-5",
                title: "Login: Replace Welcome Back with: Meetings Website",
                isCompleted: true,
            },
            {
                id: "c-6",
                title: "Admin Panel Modifications for Exhibitors",
                isCompleted: true,
            }
        ]
    }
];

export default function BoardPage() {
    const [lists, setLists] = useState<ListProps[]>(initialLists);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // List addition state
    const [isAddingList, setIsAddingList] = useState(false);
    const [newListTitle, setNewListTitle] = useState("");

    // Card addition state
    const [addingCardToList, setAddingCardToList] = useState<string | null>(null);
    const [newCardTitle, setNewCardTitle] = useState("");

    // List renaming state
    const [editingListId, setEditingListId] = useState<string | null>(null);
    const [editListTitle, setEditListTitle] = useState("");

    // Detailed Modal state
    const [selectedCard, setSelectedCard] = useState<{ card: CardProps; listTitle: string } | null>(null);

    // Handlers
    const handleAddList = () => {
        if (!newListTitle.trim()) {
            setIsAddingList(false);
            return;
        }
        setLists([...lists, { id: `list-${Date.now()}`, title: newListTitle, cards: [] }]);
        setNewListTitle("");
        setIsAddingList(false);
    };

    const handleAddCard = (listId: string) => {
        if (!newCardTitle.trim()) {
            setAddingCardToList(null);
            return;
        }
        setLists(lists.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    cards: [...list.cards, {
                        id: `c-${Date.now()}`,
                        title: newCardTitle,
                        activity: [{ user: "John Doe", action: `added this card to ${list.title}`, time: "Just now", avatar: "JD" }]
                    }]
                };
            }
            return list;
        }));
        setNewCardTitle("");
        setAddingCardToList(null);
    };

    const handleRenameList = (listId: string) => {
        if (!editListTitle.trim()) {
            setEditingListId(null);
            return;
        }
        setLists(lists.map(list => {
            if (list.id === listId) return { ...list, title: editListTitle };
            return list;
        }));
        setEditingListId(null);
    };

    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const sourceListIdx = lists.findIndex(l => l.id === source.droppableId);
        const destListIdx = lists.findIndex(l => l.id === destination.droppableId);

        if (sourceListIdx === -1 || destListIdx === -1) return;

        const sourceList = lists[sourceListIdx];
        const destList = lists[destListIdx];

        const sourceCards = Array.from(sourceList.cards);
        const destCards = source.droppableId === destination.droppableId ? sourceCards : Array.from(destList.cards);

        // Remove from source
        const [movedCard] = sourceCards.splice(source.index, 1);

        // Insert into destination
        destCards.splice(destination.index, 0, movedCard);

        const newLists = [...lists];
        newLists[sourceListIdx] = { ...sourceList, cards: sourceCards };
        if (source.droppableId !== destination.droppableId) {
            newLists[destListIdx] = { ...destList, cards: destCards };
        }

        setLists(newLists);
    };

    if (!mounted) return null; // Avoid Hydration Mismatch for DnD

    return (
        <div className="h-full flex flex-col overflow-hidden relative selection:bg-amber-500/30">

            {/* Top Navigation - Board Specific */}
            <nav className="flex items-center justify-between px-6 py-4 shrink-0 bg-transparent">
                <h1 className="font-medium text-lg text-white">Event Management Team</h1>
                <div className="flex items-center gap-2 sm:gap-4">
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                        <Search className="h-5 w-5" />
                    </Button>
                </div>
            </nav>

            {/* Board Content */}
            <main className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex h-full items-start gap-4 p-6 w-max">

                        {lists.map((list) => (
                            <div key={list.id} className="w-[300px] sm:w-[320px] shrink-0 flex flex-col max-h-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl">
                                {/* List Header */}
                                <div className="px-4 py-3 pb-2 flex justify-between items-center text-zinc-100 shrink-0 group">
                                    {editingListId === list.id ? (
                                        <input
                                            type="text"
                                            autoFocus
                                            value={editListTitle}
                                            onChange={(e) => setEditListTitle(e.target.value)}
                                            onBlur={() => handleRenameList(list.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleRenameList(list.id);
                                                if (e.key === 'Escape') setEditingListId(null);
                                            }}
                                            className="bg-zinc-950 border border-zinc-700/80 rounded px-2 py-1 text-sm text-white w-full outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500"
                                        />
                                    ) : (
                                        <h2
                                            className="font-medium cursor-pointer py-1 px-1 -ml-1 border border-transparent rounded hover:border-zinc-700 flex-1 transition"
                                            onClick={() => {
                                                setEditingListId(list.id);
                                                setEditListTitle(list.title);
                                            }}
                                        >
                                            {list.title}
                                        </h2>
                                    )}
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 ml-2">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Cards Container / Droppable */}
                                <Droppable droppableId={list.id} type="card">
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`px-3 pb-3 flex-1 overflow-y-auto custom-scrollbar space-y-2.5 transition-colors ${snapshot.isDraggingOver ? 'bg-zinc-800/20' : ''}`}
                                        >
                                            {list.cards.map((card, index) => (
                                                <Draggable key={card.id} draggableId={card.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => setSelectedCard({ card, listTitle: list.title })}
                                                            className={`group flex flex-col gap-2 bg-zinc-950 p-3.5 rounded-lg border hover:border-zinc-600 transition shadow-sm relative overflow-hidden ${snapshot.isDragging ? 'border-amber-500/50 shadow-2xl scale-[1.02] z-50' : 'border-zinc-800 hover:border-zinc-600 cursor-pointer'}`}
                                                            style={provided.draggableProps.style}
                                                        >
                                                            {card.imageCover && (
                                                                <div className="w-full h-24 bg-zinc-900 overflow-hidden mb-1 -mx-3.5 -mt-3.5 w-[calc(100%+28px)] border-b border-zinc-800">
                                                                    <img src={card.imageCover} alt="Cover" className="w-full h-full object-cover transition-transform group-hover:scale-105 pointer-events-none" />
                                                                </div>
                                                            )}

                                                            <div className="flex gap-2 items-start mt-1">
                                                                {card.isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />}
                                                                <p className={`text-sm leading-relaxed ${card.isCompleted ? 'text-zinc-400 line-through decoration-zinc-600' : 'text-zinc-200'}`}>
                                                                    {card.title}
                                                                </p>
                                                            </div>

                                                            {(card.hasDescription || card.comments || card.attachments || card.hasAvatar) && (
                                                                <div className="flex items-center gap-3 text-zinc-500 mt-2">
                                                                    {card.hasDescription && <AlignLeft className="h-3.5 w-3.5" />}
                                                                    {card.comments && (
                                                                        <div className="flex items-center gap-1.5 text-xs font-medium">
                                                                            <MessageSquare className="h-3.5 w-3.5" />
                                                                            <span>{card.comments}</span>
                                                                        </div>
                                                                    )}
                                                                    {card.attachments && (
                                                                        <div className="flex items-center gap-1.5 text-xs font-medium">
                                                                            <Paperclip className="h-3.5 w-3.5" />
                                                                            <span>{card.attachments}</span>
                                                                        </div>
                                                                    )}
                                                                    {card.hasAvatar && (
                                                                        <Avatar className="h-6 w-6 ml-auto border border-zinc-800">
                                                                            <AvatarFallback className="bg-zinc-800 text-[10px] text-zinc-300">AN</AvatarFallback>
                                                                        </Avatar>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}

                                            {/* Add Card Input */}
                                            {addingCardToList === list.id ? (
                                                <div className="mt-2 space-y-2">
                                                    <textarea
                                                        autoFocus
                                                        placeholder="Enter a title for this card..."
                                                        value={newCardTitle}
                                                        onChange={(e) => setNewCardTitle(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                                e.preventDefault();
                                                                handleAddCard(list.id);
                                                            }
                                                            if (e.key === 'Escape') setAddingCardToList(null);
                                                        }}
                                                        className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg p-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none resize-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500 shadow-sm"
                                                        rows={2}
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        <Button size="sm" onClick={() => handleAddCard(list.id)} className="bg-amber-500 text-zinc-950 hover:bg-amber-600">
                                                            Add card
                                                        </Button>
                                                        <Button size="icon" variant="ghost" onClick={() => setAddingCardToList(null)} className="h-8 w-8 text-zinc-400 hover:text-white">
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setAddingCardToList(list.id);
                                                        setNewCardTitle("");
                                                    }}
                                                    className="w-full justify-start text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 mt-2 shrink-0"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" /> Add a card
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}

                        {/* Add Another List */}
                        <div className="w-[300px] sm:w-[320px] shrink-0">
                            {isAddingList ? (
                                <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 space-y-3">
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Enter list title..."
                                        value={newListTitle}
                                        onChange={(e) => setNewListTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleAddList();
                                            if (e.key === 'Escape') setIsAddingList(false);
                                        }}
                                        className="w-full bg-zinc-950 border border-zinc-700/80 rounded px-3 py-2 text-sm text-white outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" onClick={handleAddList} className="bg-amber-500 text-zinc-950 hover:bg-amber-600">
                                            Add list
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => setIsAddingList(false)} className="h-8 w-8 text-zinc-400 hover:text-white">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsAddingList(true);
                                        setNewListTitle("");
                                    }}
                                    className="w-full justify-start border-dashed border-zinc-700/80 text-zinc-400 bg-zinc-900/30 hover:bg-zinc-900/80 hover:text-zinc-200 hover:border-zinc-600 h-12"
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add another list
                                </Button>
                            )}
                        </div>

                    </div>
                </DragDropContext>
            </main>

            {/* Floating Bottom Navigation */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center p-1.5 rounded-full bg-zinc-900 border border-zinc-800 shadow-2xl backdrop-blur-xl shrink-0 z-[40] overflow-x-auto max-w-[90vw]">
                <button className="flex items-center gap-2 px-4 py-2 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition text-sm font-medium whitespace-nowrap">
                    <Inbox className="h-4 w-4" />
                    <span className="hidden sm:inline">Inbox</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition text-sm font-medium whitespace-nowrap">
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">Planner</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 transition text-sm font-medium whitespace-nowrap">
                    <KanbanSquare className="h-4 w-4" />
                    <span>Board</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition text-sm font-medium whitespace-nowrap">
                    <Layers className="h-4 w-4" />
                    <span className="hidden sm:inline">Switch boards</span>
                </button>
            </div>

            {/* Detailed Card Modal */}
            {selectedCard && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-200"
                    onClick={() => setSelectedCard(null)}
                >
                    {/* Modal Backdrop overlay */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                    {/* Modal Container */}
                    <div
                        className="relative bg-zinc-950 border border-zinc-800 w-full max-w-5xl md:h-[80vh] h-[90vh] rounded-xl shadow-2xl flex flex-col md:flex-row shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button (Mobile absolute, Desktop inline) */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-3 right-3 md:hidden z-10 h-8 w-8 text-zinc-300 bg-zinc-800/80 rounded-full"
                            onClick={() => setSelectedCard(null)}
                        >
                            <X className="h-4 w-4" />
                        </Button>

                        {/* Left Main Content */}
                        <div className="flex-1 overflow-y-auto p-5 md:p-8 flex flex-col gap-8 custom-scrollbar relative">
                            {/* Header Section */}
                            <div className="flex items-start gap-4">
                                <Circle className="h-6 w-6 text-zinc-400 mt-1 shrink-0" />
                                <div className="flex-1 min-w-0 pr-8 md:pr-0">
                                    <h2 className="text-xl md:text-2xl font-semibold text-zinc-100 leading-tight mb-1.5">{selectedCard.card.title}</h2>
                                    <p className="text-sm text-zinc-400">
                                        in list <span className="underline decoration-zinc-500 underline-offset-4 cursor-pointer hover:text-zinc-300">{selectedCard.listTitle}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons Row */}
                            <div className="ml-0 md:ml-10 flex flex-wrap gap-2">
                                <Button variant="outline" size="sm" className="bg-zinc-800/40 border-zinc-700/80 hover:border-zinc-500 text-zinc-300 hover:bg-zinc-700/60 transition h-8 px-3 text-xs w-auto">
                                    <Plus className="h-3 w-3 mr-1.5" /> Add
                                </Button>
                                <Button variant="outline" size="sm" className="bg-zinc-800/40 border-zinc-700/80 hover:border-zinc-500 text-zinc-300 hover:bg-zinc-700/60 transition h-8 px-3 text-xs w-auto">
                                    <Tag className="h-3 w-3 mr-1.5" /> Labels
                                </Button>
                                <Button variant="outline" size="sm" className="bg-zinc-800/40 border-zinc-700/80 hover:border-zinc-500 text-zinc-300 hover:bg-zinc-700/60 transition h-8 px-3 text-xs w-auto">
                                    <Clock className="h-3 w-3 mr-1.5" /> Dates
                                </Button>
                                <Button variant="outline" size="sm" className="bg-zinc-800/40 border-zinc-700/80 hover:border-zinc-500 text-zinc-300 hover:bg-zinc-700/60 transition h-8 px-3 text-xs w-auto">
                                    <CheckSquare className="h-3 w-3 mr-1.5" /> Checklist
                                </Button>
                                <Button variant="outline" size="sm" className="bg-zinc-800/40 border-zinc-700/80 hover:border-zinc-500 text-zinc-300 hover:bg-zinc-700/60 transition h-8 px-3 text-xs w-auto">
                                    <Users className="h-3 w-3 mr-1.5" /> Members
                                </Button>
                            </div>

                            {/* Description Section */}
                            <div className="ml-0 md:ml-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <AlignLeft className="h-5 w-5 text-zinc-400 shrink-0" />
                                        <h3 className="text-base font-semibold text-zinc-100">Description</h3>
                                    </div>
                                    <Button variant="secondary" size="sm" className="h-7 px-3 text-xs bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 border border-zinc-700">
                                        Edit
                                    </Button>
                                </div>
                                <div className="ml-0 md:ml-8">
                                    {selectedCard.card.description ? (
                                        <div className="text-sm text-zinc-300 whitespace-pre-line leading-relaxed">
                                            {selectedCard.card.description}
                                        </div>
                                    ) : (
                                        <div className="bg-zinc-800/30 border border-zinc-800/60 rounded-lg p-5 text-zinc-500 cursor-pointer hover:bg-zinc-800/50 transition text-sm">
                                            Add a more detailed description...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Divider for Mobile */}
                        <div className="w-full h-px bg-zinc-800 block md:hidden" />

                        {/* Right Sidebar */}
                        <div className="w-full md:w-[360px] bg-zinc-900/50 md:border-l border-zinc-800 flex flex-col md:h-full relative overflow-hidden shrink-0">

                            {/* Desktop Close/Info Bar */}
                            <div className="hidden md:flex justify-between items-center p-4 border-b border-zinc-800/50">
                                <div className="flex items-center gap-2 bg-zinc-800/60 border border-zinc-700/50 px-2 py-1 rounded text-xs font-medium text-zinc-400">
                                    <CreditCard className="h-3.5 w-3.5" /> Board
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800" onClick={() => setSelectedCard(null)}>
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="p-5 md:p-6 flex-1 overflow-y-auto custom-scrollbar">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <Activity className="h-4 w-4 text-zinc-400" />
                                        <h3 className="text-sm font-semibold text-zinc-200">Activity</h3>
                                    </div>
                                    <Button variant="secondary" size="sm" className="h-7 text-xs bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700">
                                        Show details
                                    </Button>
                                </div>

                                {/* Comment Imput Area */}
                                <div className="flex items-start gap-3 mb-6">
                                    <Avatar className="h-8 w-8 shrink-0 border border-zinc-700/50">
                                        <AvatarImage src="/images/avatar.png" />
                                        <AvatarFallback className="bg-amber-500/20 text-amber-500 text-xs font-semibold">JD</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 bg-zinc-950 border border-zinc-700 shadow-inner rounded-lg p-3 text-sm text-zinc-500 cursor-text hover:bg-zinc-900 transition min-h-[40px]">
                                        Write a comment...
                                    </div>
                                </div>

                                {/* Activity Feed List */}
                                <div className="space-y-5">
                                    {selectedCard.card.activity?.map((act, i) => (
                                        <div key={i} className="flex gap-3">
                                            <Avatar className="h-8 w-8 shrink-0 border border-zinc-800">
                                                <AvatarFallback className="bg-indigo-600/30 text-indigo-400 text-[10px] font-bold">{act.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 mt-0.5">
                                                <p className="text-sm text-zinc-300 leading-snug">
                                                    <span className="font-semibold text-zinc-100 mr-1.5">{act.user}</span>
                                                    {act.action}
                                                </p>
                                                <p className="text-[11px] text-zinc-500 mt-1 cursor-pointer hover:underline inline-block">{act.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!selectedCard.card.activity || selectedCard.card.activity.length === 0) && (
                                        <p className="text-sm text-zinc-600 italic">No activity yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
