"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ShieldAlert, LayoutDashboard, Users, Building2, UserCog, ChevronLeft, ChevronRight, Sun, Moon, Database, Settings, LogOut, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SuperLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const getUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name, email')
                    .eq('id', user.id)
                    .single();

                setUserData({
                    name: profile?.full_name || "Super Admin",
                    email: user.email || ""
                });
            }
        };
        getUser();

        // Save last workspace to cookie for smart routing on login/revisit
        document.cookie = "last_workspace=/super; path=/; max-age=2592000";
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <div className="flex h-screen bg-background dark:bg-zinc-950 text-white dark:text-white overflow-hidden selection:bg-violet-500/30 transition-colors">

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Super Admin Sidebar */}
            <aside
                className={`fixed md:relative inset-y-0 left-0 z-50 flex flex-col shrink-0 transition-all duration-300 ease-in-out border-r border-zinc-200 dark:border-zinc-800/50 bg-background dark:bg-zinc-950 md:bg-transparent ${isCollapsed ? 'w-20' : 'w-64'} ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                {/* Mobile Close Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="md:hidden absolute right-4 top-5 text-zinc-500 hover:text-white"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Collapse Toggle Button (Desktop Only) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex absolute -right-3.5 top-20 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-white dark:hover:text-white rounded-full p-1 z-50 transition-colors shadow-sm"
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>

                <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} border-b border-transparent shrink-0 transition-all`}>
                    <Link href="/super" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Database className="h-6 w-6 text-violet-600 dark:text-violet-500 shrink-0" />
                        {!isCollapsed && <span className="font-medium text-xl tracking-tight">System Core</span>}
                    </Link>
                </div>

                <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {!isCollapsed ? (
                        <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 px-3">Global Infrastructure</div>
                    ) : (
                        <div className="h-4 mb-4" />
                    )}

                    <Link
                        href="/super"
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group relative ${pathname === '/super' ? 'text-violet-700 dark:text-violet-400 bg-violet-100/80 dark:bg-violet-500/10 hover:bg-violet-200/50 dark:hover:bg-violet-500/20' : 'text-zinc-500 dark:text-zinc-400 hover:text-white dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50'}`}
                        title="Overview"
                    >
                        <LayoutDashboard className={`h-5 w-5 shrink-0 transition-colors ${pathname === '/super' ? 'text-violet-700 dark:text-violet-400' : 'group-hover:!text-violet-700 dark:group-hover:!text-violet-400'}`} />
                        {!isCollapsed && <span className="text-sm font-medium">Overview</span>}
                    </Link>

                    <Link
                        href="/super/societies"
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group relative ${pathname.startsWith('/super/societies') ? 'text-violet-700 dark:text-violet-400 bg-violet-100/80 dark:bg-violet-500/10 hover:bg-violet-200/50 dark:hover:bg-violet-500/20' : 'text-zinc-500 dark:text-zinc-400 hover:text-white dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50'}`}
                        title="Societies"
                    >
                        <Building2 className={`h-5 w-5 shrink-0 transition-colors ${pathname.startsWith('/super/societies') ? 'text-violet-700 dark:text-violet-400' : 'group-hover:!text-violet-700 dark:group-hover:!text-violet-400'}`} />
                        {!isCollapsed && <span className="text-sm font-medium">Societies</span>}
                    </Link>

                    <Link
                        href="/super/admins"
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group relative ${pathname.startsWith('/super/admins') ? 'text-violet-700 dark:text-violet-400 bg-violet-100/80 dark:bg-violet-500/10 hover:bg-violet-200/50 dark:hover:bg-violet-500/20' : 'text-zinc-500 dark:text-zinc-400 hover:text-white dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50'}`}
                        title="Local Admins"
                    >
                        <UserCog className={`h-5 w-5 shrink-0 transition-colors ${pathname.startsWith('/super/admins') ? 'text-violet-700 dark:text-violet-400' : 'group-hover:!text-violet-700 dark:group-hover:!text-violet-400'}`} />
                        {!isCollapsed && <span className="text-sm font-medium">Local Admins</span>}
                    </Link>

                    <Link
                        href="/super/users"
                        className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group relative ${pathname.startsWith('/super/users') ? 'text-violet-700 dark:text-violet-400 bg-violet-100/80 dark:bg-violet-500/10 hover:bg-violet-200/50 dark:hover:bg-violet-500/20' : 'text-zinc-500 dark:text-zinc-400 hover:text-white dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50'}`}
                        title="All Users"
                    >
                        <Users className={`h-5 w-5 shrink-0 transition-colors ${pathname.startsWith('/super/users') ? 'text-violet-700 dark:text-violet-400' : 'group-hover:!text-violet-700 dark:group-hover:!text-violet-400'}`} />
                        {!isCollapsed && <span className="text-sm font-medium">All Users DB</span>}
                    </Link>

                </div>

                <div className={`p-4 border-t border-zinc-200 dark:border-zinc-800/50 transition-all flex flex-col gap-2`}>
                    <div className="flex items-center justify-between w-full">
                        <div className={`flex items-center ${isCollapsed ? 'justify-center p-0' : 'gap-3 px-2 py-2'} rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer min-w-0 flex-1`}>
                            <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800 shrink-0">
                                <AvatarFallback className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 font-bold text-xs ring-1 ring-violet-500/20">
                                    {userData?.name?.substring(0, 2).toUpperCase() || "??"}
                                </AvatarFallback>
                            </Avatar>
                            {!isCollapsed && (
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium leading-none text-white dark:text-zinc-200 truncate">{userData?.name || "Loading..."}</span>
                                </div>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className={`text-zinc-500 hover:text-white dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800 shrink-0 ${isCollapsed ? 'mt-2' : ''}`}
                            title="Toggle theme"
                        >
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </Button>
                    </div>

                    <button
                        onClick={handleLogout}
                        className={`flex items-center w-full ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg transition-colors group relative text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 mt-2`}
                        title="Log Out"
                    >
                        <LogOut className="h-5 w-5 shrink-0 transition-colors" />
                        {!isCollapsed && <span className="text-sm font-medium uppercase tracking-wider text-[11px]">Log out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative h-screen bg-background dark:bg-zinc-950 transition-colors">
                {/* Mobile Header Topbar */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800/50 bg-background dark:bg-zinc-950 shrink-0">
                    <div className="flex items-center gap-2">
                        <Database className="h-6 w-6 text-violet-600 dark:text-violet-500 shrink-0" />
                        <span className="font-medium text-xl tracking-tight">System Core</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2 text-zinc-500 hover:text-white">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}
