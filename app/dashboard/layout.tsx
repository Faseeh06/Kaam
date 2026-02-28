"use client";

import Link from "next/link";
import { useState } from "react";
import { Shield, LayoutDashboard, KanbanSquare, Settings, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-zinc-950 text-white overflow-hidden selection:bg-amber-500/30">

            {/* Sidebar */}
            <aside
                className={`${isCollapsed ? 'w-20' : 'w-56'} transition-all duration-300 ease-in-out border-r border-zinc-800/50 bg-transparent flex flex-col hidden md:flex shrink-0 z-50 relative`}
            >
                {/* Collapse Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3.5 top-20 bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white rounded-full p-1 z-50 transition-colors"
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>

                <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} border-b border-transparent shrink-0 transition-all`}>
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Shield className="h-6 w-6 text-amber-500 shrink-0" />
                        {!isCollapsed && <span className="font-medium text-xl tracking-tight">Kaam</span>}
                    </Link>
                </div>

                <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {!isCollapsed ? (
                        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-3">Menu</div>
                    ) : (
                        <div className="h-4 mb-4" />
                    )}

                    <Link href="/dashboard" className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors group relative`} title="Overview">
                        <LayoutDashboard className="h-5 w-5 shrink-0 group-hover:!text-amber-500 transition-colors" />
                        {!isCollapsed && <span className="text-sm font-medium">Overview</span>}
                    </Link>

                    <Link href="/dashboard/board" className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg text-amber-500 bg-zinc-900/40 hover:bg-zinc-900/80 transition-colors group relative`} title="Board">
                        <KanbanSquare className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="text-sm font-medium">Board</span>}
                    </Link>

                    <Link href="#" className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors group relative`} title="Profile">
                        <User className="h-5 w-5 shrink-0 group-hover:text-amber-500 transition-colors" />
                        {!isCollapsed && <span className="text-sm font-medium">Profile</span>}
                    </Link>

                    <Link href="#" className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors group relative`} title="Settings">
                        <Settings className="h-5 w-5 shrink-0 group-hover:text-amber-500 transition-colors" />
                        {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
                    </Link>
                </div>

                <div className={`p-4 border-t border-zinc-800/50 ${isCollapsed ? 'flex justify-center' : ''}`}>
                    <div className={`flex items-center ${isCollapsed ? 'justify-center p-0' : 'gap-3 px-2 py-2'} rounded-lg hover:bg-zinc-900/50 transition-colors cursor-pointer`}>
                        <Avatar className="h-9 w-9 border border-zinc-800 shrink-0">
                            <AvatarImage src="/images/avatar.png" />
                            <AvatarFallback className="bg-zinc-800 text-amber-500 font-medium text-xs">JD</AvatarFallback>
                        </Avatar>
                        {!isCollapsed && (
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium leading-none mb-1.5 text-zinc-200 truncate truncate">John Doe</span>
                                <span className="text-[11px] text-zinc-500 leading-none truncate">user@test.com</span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative h-screen bg-zinc-950">
                {children}
            </div>
        </div>
    );
}
