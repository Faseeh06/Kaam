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
  Check,
  CreditCard,
  LayoutGrid,
  Trash2,
  Flag,
  ChevronDown,
  UserCircle2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMockData } from "@/app/context/MockDataContext";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { NotificationBell } from "@/components/NotificationBell";

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
  severity?: string;
  assigned_to?: string;
  assigned_to_name?: string;
  deadline?: string;
  activity?: { user: string; action: string; time: string; avatar: string }[];
};

type Severity = "High" | "Medium" | "Low";

const SEVERITY_CONFIG: Record<
  Severity,
  { stripe: string; badge: string; icon: string }
> = {
  High: {
    stripe: "bg-rose-500",
    badge:
      "bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-500/20",
    icon: "text-rose-500",
  },
  Medium: {
    stripe: "bg-amber-500",
    badge:
      "bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/20",
    icon: "text-amber-500",
  },
  Low: {
    stripe: "bg-emerald-500",
    badge:
      "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/20",
    icon: "text-emerald-500",
  },
};

const formatDeadline = (d?: string) => {
  if (!d) return null;
  const date = new Date(d);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const isOverdue = diff < 0;
  const daysDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));

  // Formatting label
  const dateLabel = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const timeLabel = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const label = `${dateLabel} ${timeLabel}`;

  if (isOverdue)
    return {
      label: `Overdue (${label})`,
      color:
        "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 font-bold",
    };
  if (daysDiff <= 2)
    return {
      label: `Soon (${label})`,
      color:
        "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20",
    };
  return {
    label,
    color:
      "text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700",
  };
};

type ListProps = {
  id: string;
  title: string;
  cards: CardProps[];
};

export default function BoardPage() {
  const {
    teams,
    boardLists,
    boardCards,
    teamMembers,
    officeBearers,
    users,
    addBoardList,
    updateBoardList,
    removeBoardList,
    addBoardCard,
    updateBoardCard,
    removeBoardCard,
    updateCardStatus,
    moveCard,
  } = useMockData();

  const [managedSocietyId, setManagedSocietyId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const getManagedSociety = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_societies(society_id, role)")
          .eq("id", user.id)
          .single();

        if (profile) {
          const managementRoles = ["Admin", "Office Bearer"];
          const managed = (profile.user_societies as any[])?.find((us) =>
            managementRoles.includes(us.role),
          );
          setManagedSocietyId(managed?.society_id);
          setUserRole(managed?.role);
        }
        setUserData({ id: user.id });
      }
      setIsLoading(false);
    };
    getManagedSociety();
  }, []);

  const [userData, setUserData] = useState<{ id: string } | null>(null);

  const myOBRecord = userData
    ? officeBearers.find((ob) => ob.userId === userData.id)
    : null;
  const isPresident = myOBRecord?.position === "President";
  const isScopedOB = !!myOBRecord && !isPresident;

  const societyTeams = teams.filter((t) => {
    if (!managedSocietyId || (t as any).society_id !== managedSocietyId)
      return false;
    if (isScopedOB && myOBRecord)
      return myOBRecord.assignedTeamIds.includes(t.id);
    return true;
  });

  // Default to first team if none selected
  useEffect(() => {
    if (societyTeams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(societyTeams[0].id);
    }
  }, [societyTeams, selectedTeamId]);

  const activeTeam = societyTeams.find((t) => t.id === selectedTeamId);

  // Map DB lists/cards to the UI format
  const displayLists: ListProps[] = boardLists
    .filter((l) => l.team_id === selectedTeamId)
    .map((l) => ({
      id: l.id,
      title: l.title,
      cards: boardCards
        .filter((c) => c.list_id === l.id)
        .map((c) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          isCompleted: c.is_completed,
          severity: c.severity,
          deadline: c.deadline,
          assigned_to: c.assigned_to,
          assigned_to_name: (c as any).assigned_to_name,
        })),
    }));

  const canDelete = userRole && ["Admin", "Office Bearer"].includes(userRole);
  const selectedTeamMembers = selectedTeamId
    ? teamMembers[selectedTeamId] || []
    : [];

  // List addition state
  const [isAddingList, setIsAddingList] = useState(false);
  const [isSavingList, setIsSavingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  // Card addition state
  const [addingCardToList, setAddingCardToList] = useState<string | null>(null);
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  // List renaming state
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [isRenamingList, setIsRenamingList] = useState(false);
  const [editListTitle, setEditListTitle] = useState("");

  // Detailed Modal state
  const [selectedCard, setSelectedCard] = useState<{
    card: CardProps;
    listTitle: string;
  } | null>(null);
  const [editCardField, setEditCardField] = useState<
    "title" | "description" | null
  >(null);
  const [editCardText, setEditCardText] = useState("");
  const [isSavingCardField, setIsSavingCardField] = useState(false);
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [pendingDeadline, setPendingDeadline] = useState("");

  const handleSaveCardField = async () => {
    if (!selectedCard || !editCardField || isSavingCardField) return;
    setIsSavingCardField(true);
    try {
      const updates = { [editCardField]: editCardText };

      // Optimistic local update of selectedCard state so modal doesn't flash
      setSelectedCard({
        ...selectedCard,
        card: {
          ...selectedCard.card,
          [editCardField]: editCardText,
        },
      });

      await updateBoardCard(selectedCard.card.id, updates);
      setEditCardField(null);
    } finally {
      setIsSavingCardField(false);
    }
  };

  // Handlers
  const handleAddList = async () => {
    if (!newListTitle.trim() || !selectedTeamId || isSavingList) {
      if (!newListTitle.trim()) setIsAddingList(false);
      return;
    }
    setIsSavingList(true);
    try {
      await addBoardList(selectedTeamId, newListTitle);
      setNewListTitle("");
      setIsAddingList(false);
    } finally {
      setIsSavingList(false);
    }
  };

  const handleAddCard = async (listId: string) => {
    if (!newCardTitle.trim() || isSavingCard) {
      if (!newCardTitle.trim()) setAddingCardToList(null);
      return;
    }
    setIsSavingCard(true);
    try {
      await addBoardCard(listId, newCardTitle);
      setNewCardTitle("");
      setAddingCardToList(null);
    } finally {
      setIsSavingCard(false);
    }
  };

  const handleRenameList = async (listId: string) => {
    if (editListTitle.trim() && !isRenamingList) {
      setIsRenamingList(true);
      try {
        await updateBoardList(listId, editListTitle);
      } finally {
        setIsRenamingList(false);
      }
    }
    setEditingListId(null);
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // In a real DnD, we update the DB. Position handling is complex, but for now we'll just move it to the new list.
    if (source.droppableId !== destination.droppableId) {
      await moveCard(draggableId, destination.droppableId);
    }
  };

  if (isLoading || !mounted) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (societyTeams.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-rose-100 dark:border-rose-500/20">
          <LayoutGrid className="h-10 w-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-2">
          No Teams Found
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-8 leading-relaxed">
          You need to create at least one team for your society before you can
          access the Kanban board.
        </p>
        <Link href="/admin/teams">
          <Button className="bg-rose-500 text-white hover:bg-rose-600 px-8 h-11 rounded-xl shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Plus className="h-4 w-4 mr-2" /> Make a Team
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden relative selection:bg-rose-500/30">
      {/* Top Navigation - Board Specific */}
      <nav className="flex items-center justify-between px-6 py-4 shrink-0 bg-transparent">
        <h1 className="font-medium text-lg text-zinc-900 dark:text-white">
          {activeTeam ? `${activeTeam.name} Department Board` : "Select a Team"}
        </h1>
        <div className="flex items-center gap-2 sm:gap-4">
          <NotificationBell />
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      {/* Board Content */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full items-start gap-4 p-6 w-max">
            {displayLists.map((list) => (
              <div
                key={list.id}
                className="w-[300px] sm:w-[320px] shrink-0 flex flex-col max-h-full bg-[#ebecf0] dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 rounded-xl"
              >
                {/* List Header */}
                <div className="px-4 py-3 pb-2 flex justify-between items-center text-zinc-900 dark:text-zinc-100 shrink-0 group">
                  {editingListId === list.id ? (
                    <input
                      type="text"
                      autoFocus
                      value={editListTitle}
                      onChange={(e) => setEditListTitle(e.target.value)}
                      onBlur={() => handleRenameList(list.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameList(list.id);
                        if (e.key === "Escape") setEditingListId(null);
                      }}
                      className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700/80 rounded px-2 py-1 text-sm text-zinc-900 dark:text-white w-full outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500"
                    />
                  ) : (
                    <h2
                      className="font-medium cursor-pointer py-1 px-1 -ml-1 border border-transparent rounded hover:border-zinc-300 dark:border-zinc-700 flex-1 transition"
                      onClick={() => {
                        setEditingListId(list.id);
                        setEditListTitle(list.title);
                      }}
                    >
                      {list.title}
                    </h2>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-500 hover:text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 dark:bg-zinc-800 ml-2"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                    >
                      {canDelete && (
                        <DropdownMenuItem
                          className="text-rose-500 focus:text-rose-500 cursor-pointer"
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to delete this list?",
                              )
                            )
                              removeBoardList(list.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete List
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Cards Container / Droppable */}
                <Droppable droppableId={list.id} type="card">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`px-3 pb-3 flex-1 overflow-y-auto custom-scrollbar space-y-2.5 transition-colors ${snapshot.isDraggingOver ? "bg-zinc-100 dark:bg-zinc-800/20" : ""}`}
                    >
                      {list.cards.map((card, index) => (
                        <Draggable
                          key={card.id}
                          draggableId={card.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() =>
                                setSelectedCard({ card, listTitle: list.title })
                              }
                              className={`group flex flex-col gap-2 bg-white dark:bg-zinc-950 p-3.5 rounded-lg border hover:border-zinc-400 dark:hover:border-zinc-400 dark:border-zinc-600 transition shadow-sm relative overflow-hidden ${snapshot.isDragging ? "border-rose-500/50 shadow-2xl scale-[1.02] z-50" : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-400 dark:border-zinc-600 cursor-pointer"}`}
                              style={provided.draggableProps.style}
                            >
                              {/* Severity stripe & Menu toggle */}
                              <div className="flex items-center justify-between group/header h-1 mb-1">
                                {card.severity && (
                                  <div
                                    className={`h-full flex-1 ${SEVERITY_CONFIG[card.severity as Severity].stripe}`}
                                  />
                                )}
                                {canDelete && (
                                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 shadow-sm"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <MoreHorizontal className="h-3 w-3" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent
                                        align="end"
                                        className="w-48 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                                      >
                                        <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                          Set Priority
                                        </div>
                                        {(
                                          [
                                            "High",
                                            "Medium",
                                            "Low",
                                          ] as Severity[]
                                        ).map((s) => (
                                          <DropdownMenuItem
                                            key={s}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              updateBoardCard(card.id, {
                                                severity: s,
                                              });
                                            }}
                                            className="cursor-pointer"
                                          >
                                            <span
                                              className={`w-2 h-2 rounded-full mr-2 ${SEVERITY_CONFIG[s].stripe}`}
                                            />{" "}
                                            {s}
                                          </DropdownMenuItem>
                                        ))}
                                        <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />
                                        <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                          Assign Member
                                        </div>
                                        {selectedTeamMembers.map((m) => (
                                          <DropdownMenuItem
                                            key={m.id}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              updateBoardCard(card.id, {
                                                assigned_to: m.userId,
                                              });
                                            }}
                                            className="cursor-pointer"
                                          >
                                            <Avatar className="h-5 w-5 mr-2">
                                              <AvatarFallback className="text-[9px]">
                                                {m.name
                                                  .split(" ")
                                                  .map((n) => n[0])
                                                  .join("")}
                                              </AvatarFallback>
                                            </Avatar>
                                            <span className="truncate text-sm">
                                              {m.name}
                                            </span>
                                          </DropdownMenuItem>
                                        ))}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                )}
                              </div>
                              {card.imageCover && (
                                <div className="w-full h-24 bg-white dark:bg-zinc-900 overflow-hidden mb-1 -mx-3.5 -mt-3.5 w-[calc(100%+28px)] border-b border-zinc-200 dark:border-zinc-800">
                                  <img
                                    src={card.imageCover}
                                    alt="Cover"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105 pointer-events-none"
                                  />
                                </div>
                              )}

                              <div className="flex gap-2 items-start mt-1">
                                {card.isCompleted && (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                )}
                                <p
                                  className={`text-sm leading-relaxed ${card.isCompleted ? "text-zinc-500 dark:text-zinc-400 line-through decoration-zinc-600" : "text-zinc-800 dark:text-zinc-200"}`}
                                >
                                  {card.title}
                                </p>
                              </div>

                              {(card.hasDescription ||
                                card.comments ||
                                card.attachments ||
                                card.hasAvatar) && (
                                  <div className="flex items-center gap-3 text-zinc-500 mt-2">
                                    {card.hasDescription && (
                                      <AlignLeft className="h-3.5 w-3.5" />
                                    )}
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
                                    {card.assigned_to_name && (
                                      <div className="flex items-center gap-1.5 ml-auto bg-zinc-50 dark:bg-zinc-900/50 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 transition-all group-hover:border-zinc-300 dark:group-hover:border-zinc-700">
                                        <Avatar className="h-4 w-4 border-none shrink-0 shadow-none">
                                          <AvatarFallback className="text-[7px] bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 font-bold">
                                            {card.assigned_to_name
                                              .split(" ")
                                              .map((n: string) => n[0])
                                              .join("")}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300 truncate max-w-[100px] tracking-tight">
                                          {card.assigned_to_name}
                                        </span>
                                      </div>
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
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleAddCard(list.id);
                              }
                              if (e.key === "Escape") setAddingCardToList(null);
                            }}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700/80 rounded-lg p-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 outline-none resize-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500 shadow-sm"
                            rows={2}
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAddCard(list.id)}
                              disabled={isSavingCard}
                              className="bg-rose-500 text-zinc-950 hover:bg-rose-600 disabled:opacity-50"
                            >
                              {isSavingCard ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : ""} Add card
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              disabled={isSavingCard}
                              onClick={() => setAddingCardToList(null)}
                              className="h-8 w-8 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-50"
                            >
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
                          className="w-full justify-start text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 dark:bg-zinc-800/80 mt-2 shrink-0"
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
                <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 space-y-3">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Enter list title..."
                    value={newListTitle}
                    disabled={isSavingList}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddList();
                      if (e.key === "Escape") setIsAddingList(false);
                    }}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700/80 rounded px-3 py-2 text-sm text-zinc-900 dark:text-white outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500 disabled:opacity-50"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={handleAddList}
                      disabled={isSavingList}
                      className="bg-rose-500 text-zinc-950 hover:bg-rose-600 disabled:opacity-50"
                    >
                      {isSavingList ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : ""} Add list
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={isSavingList}
                      onClick={() => setIsAddingList(false)}
                      className="h-8 w-8 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-50"
                    >
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
                  className="w-full justify-start border-dashed border-zinc-300 dark:border-zinc-700/80 text-zinc-500 dark:text-zinc-400 bg-[#ebecf0]/50 dark:bg-zinc-900/30 hover:bg-[#ebecf0] dark:bg-zinc-900/80 hover:text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-400 dark:border-zinc-600 h-12"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add another list
                </Button>
              )}
            </div>
          </div>
        </DragDropContext>
      </main>

      {/* Floating Bottom Navigation - Real Teams */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center p-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl backdrop-blur-xl shrink-0 z-[40] overflow-x-auto max-w-[90vw] gap-1">
        {societyTeams.map((team) => (
          <button
            key={team.id}
            onClick={() => setSelectedTeamId(team.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition text-sm font-medium whitespace-nowrap ${selectedTeamId === team.id
              ? "bg-rose-500/10 text-rose-600 dark:text-rose-500 border border-rose-500/20"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 border border-transparent"
              }`}
          >
            <span
              className={`h-2 w-2 rounded-full shrink-0 ${team.color || "bg-rose-500"}`}
            ></span>
            <span>{team.name}</span>
          </button>
        ))}
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
            className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-full max-w-5xl md:h-[80vh] h-[90vh] rounded-xl shadow-2xl flex flex-col md:flex-row shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button (Mobile absolute, Desktop inline) */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 md:hidden z-10 h-8 w-8 text-zinc-800 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 rounded-full"
              onClick={() => setSelectedCard(null)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Left Main Content */}
            <div className="flex-1 overflow-y-auto p-5 md:p-8 flex flex-col gap-8 custom-scrollbar relative">
              {/* Header Section */}
              <div className="flex items-start gap-4">
                <Circle className="h-6 w-6 text-zinc-500 dark:text-zinc-400 mt-1 shrink-0" />
                <div className="flex-1 min-w-0 pr-8 md:pr-0">
                  {editCardField === "title" ? (
                    <div className="mb-1.5 flex flex-col gap-2">
                      <input
                        autoFocus
                        value={editCardText}
                        disabled={isSavingCardField}
                        onChange={(e) => setEditCardText(e.target.value)}
                        className="text-xl md:text-2xl font-semibold bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700/80 rounded px-2 py-1 text-zinc-900 dark:text-white w-full outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500 disabled:opacity-50"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          disabled={isSavingCardField}
                          onClick={handleSaveCardField}
                          className="bg-rose-500 text-white hover:bg-rose-600 h-8 px-3 disabled:opacity-50"
                        >
                          {isSavingCardField ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : ""} Save
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={isSavingCardField}
                          onClick={() => setEditCardField(null)}
                          className="h-8 w-8 text-zinc-500 hover:text-zinc-800 disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <h2
                      onClick={() => {
                        setEditCardField("title");
                        setEditCardText(selectedCard.card.title);
                      }}
                      className="text-xl md:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 leading-tight mb-1.5 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 px-1 -ml-1 rounded transition-colors"
                    >
                      {selectedCard.card.title}
                    </h2>
                  )}
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    in list{" "}
                    <span className="underline decoration-zinc-500 underline-offset-4 cursor-pointer hover:text-zinc-800 dark:text-zinc-300">
                      {selectedCard.listTitle}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {canDelete ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`h-8 rounded-full border transition hover:opacity-80 px-3 ${selectedCard.card.severity ? SEVERITY_CONFIG[selectedCard.card.severity as Severity].badge : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700"}`}
                          >
                            <Flag className="h-3.5 w-3.5 mr-1.5" />
                            {selectedCard.card.severity
                              ? `${selectedCard.card.severity} Priority`
                              : "Set Priority"}
                            <ChevronDown className="h-3 w-3 ml-1.5 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="w-40 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        >
                          {(["High", "Medium", "Low"] as Severity[]).map(
                            (s) => (
                              <DropdownMenuItem
                                key={s}
                                onClick={async () => {
                                  await updateBoardCard(selectedCard.card.id, {
                                    severity: s,
                                  });
                                  setSelectedCard({
                                    ...selectedCard,
                                    card: { ...selectedCard.card, severity: s },
                                  });
                                }}
                                className="cursor-pointer"
                              >
                                <span
                                  className={`w-2 h-2 rounded-full mr-2 ${SEVERITY_CONFIG[s].stripe}`}
                                />{" "}
                                {s}
                              </DropdownMenuItem>
                            ),
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      selectedCard.card.severity && (
                        <span
                          className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${SEVERITY_CONFIG[selectedCard.card.severity as Severity].badge}`}
                        >
                          <Flag className="h-3.5 w-3.5" />{" "}
                          {selectedCard.card.severity} Priority
                        </span>
                      )
                    )}

                    {canDelete && (
                      <div className="relative">
                        {isEditingDeadline ? (
                          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-xl shadow-sm z-[100] animate-in fade-in zoom-in-95 duration-200">
                            <input
                              type="datetime-local"
                              autoFocus
                              className="bg-transparent text-sm outline-none focus:ring-0 text-zinc-800 dark:text-zinc-100 px-1"
                              value={
                                pendingDeadline ||
                                (selectedCard.card.deadline
                                  ? new Date(selectedCard.card.deadline)
                                    .toISOString()
                                    .slice(0, 16)
                                  : "")
                              }
                              onChange={(e) =>
                                setPendingDeadline(e.target.value)
                              }
                            />
                            <Button
                              size="icon"
                              className="h-7 w-7 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shrink-0"
                              onClick={async () => {
                                if (pendingDeadline) {
                                  const isoDate = new Date(
                                    pendingDeadline,
                                  ).toISOString();
                                  await updateBoardCard(selectedCard.card.id, {
                                    deadline: isoDate,
                                  });
                                  setSelectedCard({
                                    ...selectedCard,
                                    card: {
                                      ...selectedCard.card,
                                      deadline: isoDate,
                                    },
                                  });
                                }
                                setIsEditingDeadline(false);
                                setPendingDeadline("");
                              }}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-zinc-400 hover:text-rose-500 shrink-0"
                              onClick={() => {
                                setIsEditingDeadline(false);
                                setPendingDeadline("");
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsEditingDeadline(true);
                              setPendingDeadline(
                                selectedCard.card.deadline
                                  ? new Date(selectedCard.card.deadline)
                                    .toISOString()
                                    .slice(0, 16)
                                  : "",
                              );
                            }}
                            className={`h-8 rounded-full border transition hover:opacity-80 px-3 
                                                            ${selectedCard.card.deadline ? formatDeadline(selectedCard.card.deadline)?.color : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700"}`}
                          >
                            <Calendar className="h-3.5 w-3.5 mr-1.5" />
                            {selectedCard.card.deadline
                              ? formatDeadline(selectedCard.card.deadline)
                                ?.label
                              : "Set Deadline"}
                          </Button>
                        )}
                      </div>
                    )}
                    {!canDelete &&
                      selectedCard.card.deadline &&
                      (() => {
                        const d = formatDeadline(selectedCard.card.deadline);
                        return d ? (
                          <span
                            className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${d.color}`}
                          >
                            <Calendar className="h-3.5 w-3.5" /> Due {d.label}
                          </span>
                        ) : null;
                      })()}

                    {canDelete ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2.5 text-[11px] font-medium border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all rounded-full"
                          >
                            <Users className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
                            {(selectedCard.card as any).assigned_to_name ||
                              "Assignee"}
                            <ChevronDown className="h-3 w-3 ml-1.5 text-zinc-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="w-56 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                        >
                          <DropdownMenuItem
                            onClick={async () => {
                              await updateBoardCard(selectedCard.card.id, {
                                assigned_to: null,
                              });
                              setSelectedCard({
                                ...selectedCard,
                                card: {
                                  ...selectedCard.card,
                                  assigned_to: undefined,
                                  assigned_to_name: undefined,
                                } as any,
                              });
                            }}
                            className="cursor-pointer text-zinc-500 font-medium text-xs"
                          >
                            <UserCircle2 className="h-4 w-4 mr-2" /> Unassign
                            Card
                          </DropdownMenuItem>
                          <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />
                          <div className="px-2 py-1.5 text-[10px] uppercase font-bold text-zinc-400 tracking-tight">
                            Team Members
                          </div>
                          {selectedTeamMembers.map((m) => (
                            <DropdownMenuItem
                              key={m.id}
                              onClick={async () => {
                                await updateBoardCard(selectedCard.card.id, {
                                  assigned_to: m.userId,
                                });
                                setSelectedCard({
                                  ...selectedCard,
                                  card: {
                                    ...selectedCard.card,
                                    assigned_to: m.userId,
                                    assigned_to_name: m.name,
                                  } as any,
                                });
                              }}
                              className="cursor-pointer"
                            >
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback className="text-[10px] bg-amber-100 text-amber-600 font-bold">
                                  {m.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col text-left">
                                <span className="text-sm font-medium leading-tight">
                                  {m.name}
                                </span>
                                <span className="text-[10px] text-zinc-500 lowercase leading-tight">
                                  {m.teamRole}
                                </span>
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      (selectedCard.card as any).assigned_to_name && (
                        <span className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                          <Users className="h-3.5 w-3.5" />{" "}
                          {(selectedCard.card as any).assigned_to_name}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="ml-0 md:ml-10 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-zinc-100 dark:bg-zinc-800/40 border-zinc-300 dark:border-zinc-700/80 hover:border-zinc-500 text-zinc-800 dark:text-zinc-300 hover:bg-zinc-700/60 transition h-8 px-3 text-xs w-auto"
                >
                  <Plus className="h-3 w-3 mr-1.5" /> Add
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-zinc-100 dark:bg-zinc-800/40 border-zinc-300 dark:border-zinc-700/80 hover:border-zinc-500 text-zinc-800 dark:text-zinc-300 hover:bg-zinc-700/60 transition h-8 px-3 text-xs w-auto"
                >
                  <Tag className="h-3 w-3 mr-1.5" /> Labels
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-zinc-100 dark:bg-zinc-800/40 border-zinc-300 dark:border-zinc-700/80 hover:border-zinc-500 text-zinc-800 dark:text-zinc-300 hover:bg-zinc-700/60 transition h-8 px-3 text-xs w-auto"
                >
                  <Clock className="h-3 w-3 mr-1.5" /> Dates
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-zinc-100 dark:bg-zinc-800/40 border-zinc-300 dark:border-zinc-700/80 hover:border-zinc-500 text-zinc-800 dark:text-zinc-300 hover:bg-zinc-700/60 transition h-8 px-3 text-xs w-auto"
                >
                  <CheckSquare className="h-3 w-3 mr-1.5" /> Checklist
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-zinc-100 dark:bg-zinc-800/40 border-zinc-300 dark:border-zinc-700/80 hover:border-zinc-500 text-zinc-800 dark:text-zinc-300 hover:bg-zinc-700/60 transition h-8 px-3 text-xs w-auto"
                >
                  <Users className="h-3 w-3 mr-1.5" /> Members
                </Button>
                {canDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm("Delete this card?")) {
                        removeBoardCard(selectedCard.card.id);
                        setSelectedCard(null);
                      }
                    }}
                    className="bg-rose-500/10 border-rose-500/20 text-rose-600 hover:bg-rose-500 hover:text-white transition h-8 px-3 text-xs w-auto ml-auto"
                  >
                    <Trash2 className="h-3 w-3 mr-1.5" /> Delete Card
                  </Button>
                )}
              </div>

              {/* Description Section */}
              <div className="ml-0 md:ml-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <AlignLeft className="h-5 w-5 text-zinc-500 dark:text-zinc-400 shrink-0" />
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      Description
                    </h3>
                  </div>
                  <Button
                    onClick={() => {
                      setEditCardField("description");
                      setEditCardText(selectedCard.card.description || "");
                    }}
                    variant="secondary"
                    size="sm"
                    className="h-7 px-3 text-xs bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-300 hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700"
                  >
                    Edit
                  </Button>
                </div>
                <div className="ml-0 md:ml-8">
                  {editCardField === "description" ? (
                    <div className="space-y-3">
                      <textarea
                        autoFocus
                        value={editCardText}
                        onChange={(e) => setEditCardText(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700/80 rounded-lg p-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 outline-none resize-y min-h-[100px] focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500 shadow-sm custom-scrollbar"
                        placeholder="Add a more detailed description..."
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveCardField}
                          className="bg-rose-500 text-white hover:bg-rose-600 px-4"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditCardField(null)}
                          className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : selectedCard.card.description ? (
                    <div
                      onClick={() => {
                        setEditCardField("description");
                        setEditCardText(selectedCard.card.description || "");
                      }}
                      className="text-sm text-zinc-800 dark:text-zinc-300 whitespace-pre-line leading-relaxed cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/50 p-2 -my-2 -mx-2 rounded transition-colors"
                    >
                      {selectedCard.card.description}
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setEditCardField("description");
                        setEditCardText("");
                      }}
                      className="bg-zinc-100 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800/60 rounded-lg p-5 text-zinc-500 cursor-pointer hover:bg-zinc-200/50 dark:hover:bg-zinc-800 dark:bg-zinc-800/50 transition text-sm"
                    >
                      Add a more detailed description...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Divider for Mobile */}
            <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 block md:hidden" />

            {/* Right Sidebar */}
            <div className="w-full md:w-[360px] bg-[#ebecf0] dark:bg-zinc-900/50 md:border-l border-zinc-200 dark:border-zinc-800 flex flex-col md:h-full relative overflow-hidden shrink-0">
              {/* Desktop Close/Info Bar */}
              <div className="hidden md:flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800/50">
                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700/50 px-2 py-1 rounded text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  <CreditCard className="h-3.5 w-3.5" /> Board
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 dark:bg-zinc-800"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 dark:bg-zinc-800"
                    onClick={() => setSelectedCard(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-5 md:p-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                    <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      Activity
                    </h3>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-7 text-xs bg-zinc-100 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-300 hover:bg-zinc-700"
                  >
                    Show details
                  </Button>
                </div>

                {/* Comment Imput Area */}
                <div className="flex items-start gap-3 mb-6">
                  <Avatar className="h-8 w-8 shrink-0 border border-zinc-300 dark:border-zinc-700/50">
                    <AvatarImage src="/images/avatar.png" />
                    <AvatarFallback className="bg-rose-500/20 text-rose-600 dark:text-rose-500 text-xs font-semibold">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 shadow-inner rounded-lg p-3 text-sm text-zinc-500 cursor-text hover:bg-white dark:bg-zinc-900 transition min-h-[40px]">
                    Write a comment...
                  </div>
                </div>

                {/* Activity Feed List */}
                <div className="space-y-5">
                  {selectedCard.card.activity?.map((act, i) => (
                    <div key={i} className="flex gap-3">
                      <Avatar className="h-8 w-8 shrink-0 border border-zinc-200 dark:border-zinc-800">
                        <AvatarFallback className="bg-indigo-600/30 text-indigo-400 text-[10px] font-bold">
                          {act.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 mt-0.5">
                        <p className="text-sm text-zinc-800 dark:text-zinc-300 leading-snug">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-100 mr-1.5">
                            {act.user}
                          </span>
                          {act.action}
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-1 cursor-pointer hover:underline inline-block">
                          {act.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!selectedCard.card.activity ||
                    selectedCard.card.activity.length === 0) && (
                      <p className="text-sm text-zinc-600 italic">
                        No activity yet.
                      </p>
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
