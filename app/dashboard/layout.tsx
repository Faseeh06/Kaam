import Link from "next/link";
import { Shield, LayoutDashboard, KanbanSquare, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-zinc-950 text-white overflow-hidden selection:bg-amber-500/30">

            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-800/50 bg-[#0a0a0a] flex flex-col hidden md:flex shrink-0 z-50">
                <div className="h-16 flex items-center px-6 border-b border-transparent">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Shield className="h-6 w-6 text-amber-500" />
                        <span className="font-medium text-xl tracking-tight">Kaam</span>
                    </Link>
                </div>

                <div className="flex-1 py-8 px-4 space-y-1">
                    <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-3">Menu</div>
                    <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors">
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="text-sm font-medium">Overview</span>
                    </Link>
                    <Link href="/dashboard/board" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors">
                        <KanbanSquare className="h-4 w-4" />
                        <span className="text-sm font-medium">Board</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium">Profile</span>
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors">
                        <Settings className="h-4 w-4" />
                        <span className="text-sm font-medium">Settings</span>
                    </Link>
                </div>

                <div className="p-4 border-t border-zinc-800/50">
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-900/50 transition-colors cursor-pointer">
                        <Avatar className="h-9 w-9 border border-zinc-800">
                            <AvatarImage src="/images/avatar.png" />
                            <AvatarFallback className="bg-zinc-800 text-amber-500 font-medium text-xs">JD</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium leading-none mb-1.5 text-zinc-200">John Doe</span>
                            <span className="text-[11px] text-zinc-500 leading-none">user@test.com</span>
                        </div>
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
