"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Shield, LayoutDashboard, KanbanSquare, Settings, User, Users2, ChevronLeft, ChevronRight, Sun, Moon, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex h-screen bg-[#f4f5f7] dark:bg-zinc-950 text-[#172b4d] dark:text-white overflow-hidden selection:bg-amber-500/30 transition-colors">

            {/* Sidebar */}
            <aside
                className={`${isCollapsed ? 'w-20' : 'w-56'} transition-all duration-300 ease-in-out border-r border-zinc-200 dark:border-zinc-800/50 bg-[#f4f5f7] dark:bg-transparent flex flex-col hidden md:flex shrink-0 z-50 relative`}
            >
                {/* Collapse Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3.5 top-20 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full p-1 z-50 transition-colors"
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
                        <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 px-3">Menu</div>
                    ) : (
                        <div className="h-4 mb-4" />
                    )}

                    <Link
                        href="/dashboard"
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group relative ${pathname === '/dashboard' ? 'text-amber-600 dark:text-amber-500 bg-amber-50/50 dark:bg-zinc-900/40 hover:bg-amber-100/50 dark:hover:bg-zinc-900/80' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/50'}`}
                        title="Overview"
                    >
                        <LayoutDashboard className={`h-5 w-5 shrink-0 transition-colors ${pathname === '/dashboard' ? 'text-amber-600 dark:text-amber-500' : 'group-hover:!text-amber-600 dark:group-hover:!text-amber-500'}`} />
                        {!isCollapsed && <span className="text-sm font-medium">Overview</span>}
                    </Link>

                    <Link
                        href="/dashboard/board"
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group relative ${pathname === '/dashboard/board' ? 'text-amber-600 dark:text-amber-500 bg-amber-50/50 dark:bg-zinc-900/40 hover:bg-amber-100/50 dark:hover:bg-zinc-900/80' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/50'}`}
                        title="Board"
                    >
                        <KanbanSquare className={`h-5 w-5 shrink-0 transition-colors ${pathname === '/dashboard/board' ? 'text-amber-600 dark:text-amber-500' : 'group-hover:!text-amber-600 dark:group-hover:!text-amber-500'}`} />
                        {!isCollapsed && <span className="text-sm font-medium">Board</span>}
                    </Link>

                    <Link
                        href="/dashboard/team"
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group relative ${pathname === '/dashboard/team' ? 'text-amber-600 dark:text-amber-500 bg-amber-50/50 dark:bg-zinc-900/40 hover:bg-amber-100/50 dark:hover:bg-zinc-900/80' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/50'}`}
                        title="My Team"
                    >
                        <Users2 className={`h-5 w-5 shrink-0 transition-colors ${pathname === '/dashboard/team' ? 'text-amber-600 dark:text-amber-500' : 'group-hover:!text-amber-600 dark:group-hover:!text-amber-500'}`} />
                        {!isCollapsed && <span className="text-sm font-medium">My Team</span>}
                    </Link>

                    <Link
                        href="/dashboard/profile"
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group relative ${pathname === '/dashboard/profile' ? 'text-amber-600 dark:text-amber-500 bg-amber-50/50 dark:bg-zinc-900/40 hover:bg-amber-100/50 dark:hover:bg-zinc-900/80' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/50'}`}
                        title="Profile"
                    >
                        <User className={`h-5 w-5 shrink-0 transition-colors ${pathname === '/dashboard/profile' ? 'text-amber-600 dark:text-amber-500' : 'group-hover:!text-amber-600 dark:group-hover:!text-amber-500'}`} />
                        {!isCollapsed && <span className="text-sm font-medium">Profile</span>}
                    </Link>

                    <Link
                        href="/dashboard/settings"
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group relative ${pathname === '/dashboard/settings' ? 'text-amber-600 dark:text-amber-500 bg-amber-50/50 dark:bg-zinc-900/40 hover:bg-amber-100/50 dark:hover:bg-zinc-900/80' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/50'}`}
                        title="Settings"
                    >
                        <Settings className={`h-5 w-5 shrink-0 transition-colors ${pathname === '/dashboard/settings' ? 'text-amber-600 dark:text-amber-500' : 'group-hover:!text-amber-600 dark:group-hover:!text-amber-500'}`} />
                        {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
                    </Link>

                    <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/50 mt-4">
                        <Link
                            href="/"
                            className={`flex items-center w-full ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group relative text-zinc-500 hover:text-rose-600 dark:hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10`}
                            title="Log Out"
                        >
                            <LogOut className="h-5 w-5 shrink-0 transition-colors group-hover:text-rose-600 dark:group-hover:text-rose-500" />
                            {!isCollapsed && <span className="text-sm font-medium">Log out</span>}
                        </Link>
                    </div>
                </div>

                <div className={`p-4 border-t border-zinc-200 dark:border-zinc-800/50 ${isCollapsed ? 'flex justify-center flex-col items-center gap-4' : 'flex items-center justify-between'} transition-all`}>
                    <div className={`flex items-center ${isCollapsed ? 'justify-center p-0' : 'gap-3 px-2 py-2'} rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer`}>
                        <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800 shrink-0">
                            <AvatarImage src="/images/avatar.png" />
                            <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-amber-600 dark:text-amber-500 font-medium text-xs">JD</AvatarFallback>
                        </Avatar>
                        {!isCollapsed && (
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium leading-none mb-1.5 text-zinc-900 dark:text-zinc-200 truncate truncate">John Doe</span>
                                <span className="text-[11px] text-zinc-500 leading-none truncate">user@test.com</span>
                            </div>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className={`text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0 ${isCollapsed ? '' : 'mr-1'}`}
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
