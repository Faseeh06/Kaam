"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Shield, LayoutDashboard, KanbanSquare, Settings, Users, Building2, UsersRound, ChevronLeft, ChevronRight, Sun, Moon, ShieldAlert, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex h-screen bg-[#f4f5f7] dark:bg-zinc-950 text-[#172b4d] dark:text-white overflow-hidden selection:bg-rose-500/30 transition-colors">

            {/* Admin Sidebar */}
            <aside
                className={`${isCollapsed ? 'w-20' : 'w-56'} transition-all duration-300 ease-in-out border-r border-zinc-200 dark:border-zinc-800/50 bg-[#f4f5f7] dark:bg-transparent flex flex-col hidden md:flex shrink-0 z-50 relative`}
            >
                {/* Collapse Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3.5 top-20 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-[#172b4d] dark:hover:text-white rounded-full p-1 z-50 transition-colors shadow-sm"
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>

                <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} border-b border-transparent shrink-0 transition-all`}>
                    <Link href="/admin" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <ShieldAlert className="h-6 w-6 text-rose-500 shrink-0" />
                        {!isCollapsed && <span className="font-medium text-xl tracking-tight">Kaam Admin</span>}
                    </Link>
                </div>

                <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {!isCollapsed ? (
                        <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 px-3">Management</div>
                    ) : (
                        <div className="h-4 mb-4" />
                    )}

                    <Link
                        href="/admin"
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group relative ${pathname === '/admin' ? 'text-rose-600 dark:text-rose-500 bg-rose-50/80 dark:bg-rose-500/10 hover:bg-rose-100/50 dark:hover:bg-rose-500/20' : 'text-zinc-500 dark:text-zinc-400 hover:text-[#172b4d] dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50'}`}
                        title="Dashboard"
                    >
                        <LayoutDashboard className={`h-5 w-5 shrink-0 transition-colors ${pathname === '/admin' ? 'text-rose-600 dark:text-rose-500' : 'group-hover:!text-rose-600 dark:group-hover:!text-rose-500'}`} />
                        {!isCollapsed && <span className="text-sm font-medium">Dashboard</span>}
                    </Link>

                    <Link
                        href="/admin/users"
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group relative ${pathname === '/admin/users' ? 'text-rose-600 dark:text-rose-500 bg-rose-50/80 dark:bg-rose-500/10 hover:bg-rose-100/50 dark:hover:bg-rose-500/20' : 'text-zinc-500 dark:text-zinc-400 hover:text-[#172b4d] dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50'}`}
                        title="Users & Approvals"
                    >
                        <Users className={`h-5 w-5 shrink-0 transition-colors ${pathname === '/admin/users' ? 'text-rose-600 dark:text-rose-500' : 'group-hover:!text-rose-600 dark:group-hover:!text-rose-500'}`} />
                        {!isCollapsed && <span className="text-sm font-medium">Users</span>}
                    </Link>

                    <Link
                        href="/admin/society"
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group relative ${pathname === '/admin/society' ? 'text-rose-600 dark:text-rose-500 bg-rose-50/80 dark:bg-rose-500/10 hover:bg-rose-100/50 dark:hover:bg-rose-500/20' : 'text-zinc-500 dark:text-zinc-400 hover:text-[#172b4d] dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50'}`}
                        title="Society Details"
                    >
                        <Building2 className={`h-5 w-5 shrink-0 transition-colors ${pathname === '/admin/society' ? 'text-rose-600 dark:text-rose-500' : 'group-hover:!text-rose-600 dark:group-hover:!text-rose-500'}`} />
                        {!isCollapsed && <span className="text-sm font-medium">Society Details</span>}
                    </Link>

                    <Link
                        href="/admin/teams"
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group relative ${pathname === '/admin/teams' ? 'text-rose-600 dark:text-rose-500 bg-rose-50/80 dark:bg-rose-500/10 hover:bg-rose-100/50 dark:hover:bg-rose-500/20' : 'text-zinc-500 dark:text-zinc-400 hover:text-[#172b4d] dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50'}`}
                        title="Teams"
                    >
                        <UsersRound className={`h-5 w-5 shrink-0 transition-colors ${pathname === '/admin/teams' ? 'text-rose-600 dark:text-rose-500' : 'group-hover:!text-rose-600 dark:group-hover:!text-rose-500'}`} />
                        {!isCollapsed && <span className="text-sm font-medium">Teams Management</span>}
                    </Link>

                    <Link
                        href="/admin/board"
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group relative ${pathname === '/admin/board' ? 'text-rose-600 dark:text-rose-500 bg-rose-50/80 dark:bg-rose-500/10 hover:bg-rose-100/50 dark:hover:bg-rose-500/20' : 'text-zinc-500 dark:text-zinc-400 hover:text-[#172b4d] dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50'}`}
                        title="Global Board"
                    >
                        <KanbanSquare className={`h-5 w-5 shrink-0 transition-colors ${pathname === '/admin/board' ? 'text-rose-600 dark:text-rose-500' : 'group-hover:!text-rose-600 dark:group-hover:!text-rose-500'}`} />
                        {!isCollapsed && <span className="text-sm font-medium">Global Board</span>}
                    </Link>

                    <Link
                        href="/admin/chat"
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group relative ${pathname === '/admin/chat' ? 'text-rose-600 dark:text-rose-500 bg-rose-50/80 dark:bg-rose-500/10 hover:bg-rose-100/50 dark:hover:bg-rose-500/20' : 'text-zinc-500 dark:text-zinc-400 hover:text-[#172b4d] dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50'}`}
                        title="Chat"
                    >
                        <MessageCircle className={`h-5 w-5 shrink-0 transition-colors ${pathname === '/admin/chat' ? 'text-rose-600 dark:text-rose-500' : 'group-hover:!text-rose-600 dark:group-hover:!text-rose-500'}`} />
                        {!isCollapsed && <span className="text-sm font-medium">Chat</span>}
                    </Link>

                    <Link
                        href="/admin/settings"
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group relative ${pathname === '/admin/settings' ? 'text-rose-600 dark:text-rose-500 bg-rose-50/80 dark:bg-rose-500/10 hover:bg-rose-100/50 dark:hover:bg-rose-500/20' : 'text-zinc-500 dark:text-zinc-400 hover:text-[#172b4d] dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50'}`}
                        title="Admin Settings"
                    >
                        <Settings className={`h-5 w-5 shrink-0 transition-colors ${pathname === '/admin/settings' ? 'text-rose-600 dark:text-rose-500' : 'group-hover:!text-rose-600 dark:group-hover:!text-rose-500'}`} />
                        {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
                    </Link>
                </div>

                <div className={`p-4 border-t border-zinc-200 dark:border-zinc-800/50 ${isCollapsed ? 'flex justify-center flex-col items-center gap-4' : 'flex items-center justify-between'} transition-all`}>
                    <div className={`flex items-center ${isCollapsed ? 'justify-center p-0' : 'gap-3 px-2 py-2'} rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer`}>
                        <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800 shrink-0">
                            <AvatarFallback className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-500 font-bold text-xs ring-1 ring-rose-500/20">A</AvatarFallback>
                        </Avatar>
                        {!isCollapsed && (
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium leading-none mb-1.5 text-[#172b4d] dark:text-zinc-200 truncate truncate">Super Admin</span>
                                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-none truncate">admin@test.com</span>
                            </div>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className={`text-zinc-500 hover:text-[#172b4d] dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800 shrink-0 ${isCollapsed ? '' : 'mr-1'}`}
                        title="Toggle theme"
                    >
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative h-screen bg-[#f4f5f7] dark:bg-zinc-950 transition-colors">
                {children}
            </div>
        </div>
    );
}
