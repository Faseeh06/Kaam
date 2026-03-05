"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Shield,
  LayoutDashboard,
  KanbanSquare,
  Settings,
  Users,
  Building2,
  UsersRound,
  Crown,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  ShieldAlert,
  MessageCircle,
  LogOut,
  Loader2,
  ShieldOff,
  Menu,
  X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    managedSocietyId?: string;
    role?: string;
  } | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // null = loading
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Fetch profile and managed society
      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "full_name, email, is_global_admin, user_societies(society_id, role)",
        )
        .eq("id", user.id)
        .single();

      if (profile) {
        const managementRoles = ["Admin", "Office Bearer"];
        const managedSociety = (profile.user_societies as any[])?.find((us) =>
          managementRoles.includes(us.role),
        );

        // Only allow: global admins OR users with a management role
        if (!profile.is_global_admin && !managedSociety) {
          setIsAuthorized(false);
          return;
        }

        setIsAuthorized(true);
        setUserData({
          name: profile.full_name || "Admin",
          email: user.email || "",
          managedSocietyId: managedSociety?.society_id,
          role: managedSociety?.role,
        });
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  // Still loading auth check
  if (isAuthorized === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  // Unauthorized — user is not an admin or management role
  if (isAuthorized === false) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 bg-background dark:bg-zinc-950 text-center px-6">
        <div className="h-20 w-20 rounded-3xl bg-rose-500/10 flex items-center justify-center">
          <ShieldOff className="h-10 w-10 text-rose-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white dark:text-white mb-2">
            Access Restricted
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
            You don't have permission to access the admin panel. This area is
            reserved for Admins and Office Bearers.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            Go to Dashboard
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-zinc-500 hover:text-rose-500"
          >
            Log Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background dark:bg-zinc-950 text-white dark:text-white overflow-hidden selection:bg-rose-500/30 transition-colors">

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 flex flex-col shrink-0 transition-all duration-300 ease-in-out border-r border-zinc-200 dark:border-zinc-800/50 bg-background dark:bg-zinc-950 md:bg-transparent ${isCollapsed ? "w-20" : "w-64"} ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
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
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        <div
          className={`h-16 flex items-center ${isCollapsed ? "justify-center px-0" : "px-6"} border-b border-transparent shrink-0 transition-all`}
        >
          <Link
            href="/admin"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <ShieldAlert className="h-6 w-6 text-rose-500 shrink-0" />
            {!isCollapsed && (
              <span className="font-medium text-xl tracking-tight">
                Kaam Admin
              </span>
            )}
          </Link>
        </div>

        <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {!isCollapsed ? (
            <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4 px-3">
              Management
            </div>
          ) : (
            <div className="h-4 mb-4" />
          )}

          <Link
            href="/admin"
            className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg transition-colors group relative ${pathname === "/admin" ? "text-rose-600 dark:text-rose-500 bg-rose-50/80 dark:bg-rose-500/10 hover:bg-rose-100/50 dark:hover:bg-rose-500/20" : "text-zinc-500 dark:text-zinc-400 hover:text-white dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50"}`}
            title="Dashboard"
          >
            <LayoutDashboard
              className={`h-5 w-5 shrink-0 transition-colors ${pathname === "/admin" ? "text-rose-600 dark:text-rose-500" : "group-hover:!text-rose-600 dark:group-hover:!text-rose-500"}`}
            />
            {!isCollapsed && (
              <span className="text-sm font-medium">Dashboard</span>
            )}
          </Link>

          <Link
            href="/admin/users"
            className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg transition-colors group relative ${pathname === "/admin/users" ? "text-rose-600 dark:text-rose-500 bg-rose-50/80 dark:bg-rose-500/10 hover:bg-rose-100/50 dark:hover:bg-rose-500/20" : "text-zinc-500 dark:text-zinc-400 hover:text-white dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50"}`}
            title="Users & Approvals"
          >
            <Users
              className={`h-5 w-5 shrink-0 transition-colors ${pathname === "/admin/users" ? "text-rose-600 dark:text-rose-500" : "group-hover:!text-rose-600 dark:group-hover:!text-rose-500"}`}
            />
            {!isCollapsed && <span className="text-sm font-medium">Users</span>}
          </Link>

          {userData?.role === "Admin" && (
            <Link
              href="/admin/society"
              className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg transition-colors group relative ${pathname === "/admin/society" ? "text-rose-600 dark:text-rose-500 bg-rose-50/80 dark:bg-rose-500/10 hover:bg-rose-100/50 dark:hover:bg-rose-500/20" : "text-zinc-500 dark:text-zinc-400 hover:text-white dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50"}`}
              title="Society Details"
            >
              <Building2
                className={`h-5 w-5 shrink-0 transition-colors ${pathname === "/admin/society" ? "text-rose-600 dark:text-rose-500" : "group-hover:!text-rose-600 dark:group-hover:!text-rose-500"}`}
              />
              {!isCollapsed && (
                <span className="text-sm font-medium">Society Details</span>
              )}
            </Link>
          )}

          <Link
            href="/admin/teams"
            className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg transition-colors group relative ${pathname === "/admin/teams" ? "text-rose-600 dark:text-rose-500 bg-rose-50/80 dark:bg-rose-500/10 hover:bg-rose-100/50 dark:hover:bg-rose-500/20" : "text-zinc-500 dark:text-zinc-400 hover:text-white dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50"}`}
            title="Teams"
          >
            <UsersRound
              className={`h-5 w-5 shrink-0 transition-colors ${pathname === "/admin/teams" ? "text-rose-600 dark:text-rose-500" : "group-hover:!text-rose-600 dark:group-hover:!text-rose-500"}`}
            />
            {!isCollapsed && (
              <span className="text-sm font-medium">Teams Management</span>
            )}
          </Link>

          {userData?.role === "Admin" && (
            <Link
              href="/admin/office-bearers"
              className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg transition-colors group relative ${pathname === "/admin/office-bearers" ? "text-rose-600 dark:text-rose-500 bg-rose-50/80 dark:bg-rose-500/10 hover:bg-rose-100/50 dark:hover:bg-rose-500/20" : "text-zinc-500 dark:text-zinc-400 hover:text-white dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50"}`}
              title="Office Bearers"
            >
              <Crown
                className={`h-5 w-5 shrink-0 transition-colors ${pathname === "/admin/office-bearers" ? "text-rose-600 dark:text-rose-500" : "group-hover:!text-rose-600 dark:group-hover:!text-rose-500"}`}
              />
              {!isCollapsed && (
                <span className="text-sm font-medium">Office Bearers</span>
              )}
            </Link>
          )}

          <Link
            href="/admin/board"
            className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg transition-colors group relative ${pathname === "/admin/board" ? "text-rose-600 dark:text-rose-500 bg-rose-50/80 dark:bg-rose-500/10 hover:bg-rose-100/50 dark:hover:bg-rose-500/20" : "text-zinc-500 dark:text-zinc-400 hover:text-white dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50"}`}
            title="Global Board"
          >
            <KanbanSquare
              className={`h-5 w-5 shrink-0 transition-colors ${pathname === "/admin/board" ? "text-rose-600 dark:text-rose-500" : "group-hover:!text-rose-600 dark:group-hover:!text-rose-500"}`}
            />
            {!isCollapsed && (
              <span className="text-sm font-medium">Global Board</span>
            )}
          </Link>

          <Link
            href="/admin/chat"
            className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg transition-colors group relative ${pathname === "/admin/chat" ? "text-rose-600 dark:text-rose-500 bg-rose-50/80 dark:bg-rose-500/10 hover:bg-rose-100/50 dark:hover:bg-rose-500/20" : "text-zinc-500 dark:text-zinc-400 hover:text-white dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50"}`}
            title="Chat"
          >
            <MessageCircle
              className={`h-5 w-5 shrink-0 transition-colors ${pathname === "/admin/chat" ? "text-rose-600 dark:text-rose-500" : "group-hover:!text-rose-600 dark:group-hover:!text-rose-500"}`}
            />
            {!isCollapsed && <span className="text-sm font-medium">Chat</span>}
          </Link>

          {userData?.role === "Admin" && (
            <Link
              href="/admin/settings"
              className={`flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg transition-colors group relative ${pathname === "/admin/settings" ? "text-rose-600 dark:text-rose-500 bg-rose-50/80 dark:bg-rose-500/10 hover:bg-rose-100/50 dark:hover:bg-rose-500/20" : "text-zinc-500 dark:text-zinc-400 hover:text-white dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50"}`}
              title="Admin Settings"
            >
              <Settings
                className={`h-5 w-5 shrink-0 transition-colors ${pathname === "/admin/settings" ? "text-rose-600 dark:text-rose-500" : "group-hover:!text-rose-600 dark:group-hover:!text-rose-500"}`}
              />
              {!isCollapsed && (
                <span className="text-sm font-medium">Settings</span>
              )}
            </Link>
          )}
        </div>

        <div
          className={`p-4 border-t border-zinc-200 dark:border-zinc-800/50 transition-all flex flex-col gap-2`}
        >
          <div className="flex items-center justify-between w-full">
            <div
              className={`flex items-center ${isCollapsed ? "justify-center p-0" : "gap-3 px-2 py-2"} rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer min-w-0 flex-1`}
            >
              <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800 shrink-0">
                <AvatarFallback className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-500 font-bold text-xs ring-1 ring-rose-500/20">
                  {userData?.name?.substring(0, 2).toUpperCase() || "??"}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium leading-none text-white dark:text-zinc-200 truncate">
                    {userData?.name || "Loading..."}
                  </span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`text-zinc-500 hover:text-white dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800 shrink-0 ${isCollapsed ? "mt-2" : ""}`}
              title="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>

          <button
            onClick={handleLogout}
            className={`flex items-center w-full ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"} py-2.5 rounded-lg transition-colors group relative text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 mt-2`}
            title="Log Out"
          >
            <LogOut className="h-5 w-5 shrink-0 transition-colors" />
            {!isCollapsed && (
              <span className="text-sm font-medium uppercase tracking-wider text-[11px]">
                Log out
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-screen bg-background dark:bg-zinc-950 transition-colors">
        {/* Mobile Header Topbar */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800/50 bg-background dark:bg-zinc-950 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-rose-500 shrink-0" />
            <span className="font-medium text-xl tracking-tight">Kaam Admin</span>
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
