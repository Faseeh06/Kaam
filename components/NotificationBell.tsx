"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface Notification {
    id: string;
    user_id: string;
    type: string;
    message: string;
    is_read: boolean;
    related_entity_id: string | null;
    created_at: string;
}

export function NotificationBell() {
    const supabase = createClient();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserAndNotifications = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                const { data } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(20);

                if (data) {
                    setNotifications(data as Notification[]);
                }

                // Subscribe to real-time notifications
                const channel = supabase.channel('realtime:notifications')
                    .on(
                        'postgres_changes',
                        {
                            event: 'INSERT',
                            schema: 'public',
                            table: 'notifications',
                            filter: `user_id=eq.${user.id}`,
                        },
                        (payload) => {
                            const newNotif = payload.new as Notification;
                            setNotifications((prev) => [newNotif, ...prev]);

                            // Show Browser Notification on Windows/Mac
                            if ("Notification" in window && Notification.permission === "granted") {
                                try {
                                    const notification = new Notification("Kaam Alert", {
                                        body: newNotif.message,
                                        icon: "/favicon.ico", // An icon is often required by Windows to display correctly
                                    });
                                    notification.onclick = () => {
                                        window.focus();
                                        notification.close();
                                    };
                                } catch (err) {
                                    console.error("Failed to show desktop notification:", err);
                                }
                            }
                        }
                    )
                    .subscribe();

                setIsLoading(false);

                return () => {
                    supabase.removeChannel(channel);
                };
            }
            setIsLoading(false);
        };

        const cleanup = fetchUserAndNotifications();

        // Ask for permission for desktop notifications if not already granted/denied
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }

        return () => {
            cleanup.then(fn => { if (typeof fn === 'function') fn(); });
        };
    }, [supabase]);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const markAsRead = async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    };

    const markAllAsRead = async () => {
        if (!userId) return;
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
    };

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-zinc-500 dark:text-zinc-400 hover:text-[#172b4d] dark:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800 dark:bg-zinc-800 rounded-full">
                    <Bell className="h-5 w-5" />
                    {!isLoading && unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-900" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-xl p-0">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                    <h3 className="font-semibold text-sm text-[#172b4d] dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                            className="text-xs text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 font-medium"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>

                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="p-8 flex justify-center">
                            <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                            <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                                <Bell className="h-5 w-5 text-zinc-400" />
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">You're all caught up!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => { if (!notif.is_read) markAsRead(notif.id); }}
                                    className={`px-4 py-3 flex gap-3 cursor-pointer transition ${notif.is_read ? 'bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/50' : 'bg-amber-50/50 dark:bg-amber-500/5 hover:bg-amber-50 dark:hover:bg-amber-500/10'}`}
                                >
                                    <div className="mt-1 shrink-0">
                                        <div className={`h-2 w-2 rounded-full ${notif.is_read ? 'bg-transparent' : 'bg-amber-500'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm ${notif.is_read ? 'text-zinc-600 dark:text-zinc-400' : 'text-[#172b4d] dark:text-zinc-200 font-medium'} leading-snug`}>
                                            {notif.message}
                                        </p>
                                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-wider font-semibold">
                                            {timeAgo(notif.created_at)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
