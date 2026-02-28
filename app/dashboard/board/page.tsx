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
    Bell,
    Shield
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data based on the screenshot provided
const lists = [
    {
        id: "list-1",
        title: "To Do",
        cards: [
            {
                id: "c-1",
                title: "V2 (milestone 2) - feedback from client 2/22/2026",
                hasDescription: true,
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
                title: "Add QR code (image and manual code) on registration detail modal",
                hasDescription: true,
                attachments: 1,
                imageCover: "/images/solution-detect.png" // using existing image as placeholder
            },
            {
                id: "c-4",
                title: "Edit Registration mock",
                hasDescription: false,
                imageCover: "/images/solution-learn.png" // using existing image as placeholder
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
            },
            {
                id: "c-7",
                title: "Issues related urgent tasks",
                isCompleted: true,
                attachments: 4,
                imageCover: "/images/solution-neutralize.png" // placeholder
            },
            {
                id: "c-8",
                title: "Admin: Manage room identifier on Update City and Add/Update Room",
                isCompleted: true,
            }
        ]
    },
    {
        id: "list-5",
        title: "Future",
        cards: [
            {
                id: "c-9",
                title: "Loading doesn't look good - check comments",
                hasDescription: true,
                comments: 1,
            },
            {
                id: "c-10",
                title: "@anniee16 $0.00 USD",
                hasAvatar: true,
            },
            {
                id: "c-11",
                title: "profile section at the right of the header",
                hasDescription: true,
                attachments: 3,
            },
            {
                id: "c-12",
                title: "Profile Page needed",
                hasDescription: false,
            },
            {
                id: "c-13",
                title: "In Edit City, don't show number of meeting rooms and room Ids",
                hasDescription: false,
            },
            {
                id: "c-14",
                title: "Settings page needed",
                hasDescription: true,
            },
            {
                id: "c-15",
                title: "Cronjob: Expired hours feature on Rooms",
                hasDescription: false,
            }
        ]
    }
];

export default function BoardPage() {
    return (
        <div className="h-full flex flex-col overflow-hidden">

            {/* Top Navigation - Board Specific */}
            <nav className="flex items-center justify-between px-6 py-4 shrink-0 bg-transparent">
                <h1 className="font-medium text-lg text-white">
                    Event Management Team
                </h1>
                <div className="flex items-center gap-2 sm:gap-4">
                    <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                        <Search className="h-5 w-5" />
                    </Button>
                </div>
            </nav>

            {/* Board Content */}
            <main className="flex-1 overflow-x-auto overflow-y-hidden">
                <div className="flex h-full items-start gap-4 p-6 w-max">

                    {lists.map((list) => (
                        <div key={list.id} className="w-[300px] sm:w-[320px] shrink-0 flex flex-col max-h-full bg-zinc-900/50 border border-zinc-800 rounded-xl">
                            {/* List Header */}
                            <div className="px-4 py-3 pb-2 flex justify-between items-center text-zinc-100 shrink-0">
                                <h2 className="font-medium">{list.title}</h2>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Cards Container */}
                            <div className="px-3 pb-3 flex-1 overflow-y-auto custom-scrollbar space-y-3">
                                {list.cards.map((card) => (
                                    <div
                                        key={card.id}
                                        className="group flex flex-col gap-2 bg-zinc-950 p-3.5 rounded-lg border border-zinc-800 hover:border-zinc-600 transition cursor-pointer shadow-sm relative overflow-hidden"
                                    >
                                        {/* Optional Image Cover */}
                                        {card.imageCover && (
                                            <div className="w-full h-24 bg-zinc-900 overflow-hidden mb-1 -mx-3.5 -mt-3.5 w-[calc(100%+28px)] border-b border-zinc-800">
                                                <img src={card.imageCover} alt="Cover" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                            </div>
                                        )}

                                        <div className="flex gap-2 items-start mt-1">
                                            {/* Completed Checkmark */}
                                            {card.isCompleted && (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                            )}

                                            <p className={`text-sm leading-relaxed ${card.isCompleted ? 'text-zinc-400 line-through decoration-zinc-600' : 'text-zinc-200'}`}>
                                                {card.title}
                                            </p>
                                        </div>

                                        {/* Card Badges / Icons */}
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
                                    </div>
                                ))}

                                {/* Add Card Button */}
                                <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 mt-2">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add a task
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Add Another List Button */}
                    <div className="w-[300px] sm:w-[320px] shrink-0">
                        <Button variant="outline" className="w-full justify-start border-dashed border-zinc-700 text-zinc-400 bg-zinc-900/30 hover:bg-zinc-900/80 hover:text-zinc-200 hover:border-zinc-600 h-12">
                            <Plus className="h-4 w-4 mr-2" />
                            Add another list
                        </Button>
                    </div>

                </div>
            </main>

            {/* Floating Bottom Navigation */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center p-1.5 rounded-full bg-zinc-900 border border-zinc-800 shadow-xl backdrop-blur-xl shrink-0 z-50 overflow-x-auto max-w-[90vw]">
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

        </div>
    );
}
