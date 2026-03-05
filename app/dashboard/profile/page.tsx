"use client";

import { Loader2, UserCircle, Mail, MapPin, Building2, Briefcase, Calendar, LinkIcon, LogOut, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        async function fetchProfile() {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("full_name, email, phone, department, primary_team, created_at, avatar_url")
                    .eq("id", authUser.id)
                    .single();

                if (profile) {
                    const joinDate = new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" });
                    const nameParts = profile.full_name?.split(" ") || [];
                    const initials = nameParts.length > 1
                        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
                        : profile.full_name?.charAt(0).toUpperCase() || "U";

                    setUser({
                        name: profile.full_name,
                        email: profile.email,
                        phone: profile.phone || "Not provided",
                        role: profile.primary_team || "Member",
                        department: profile.department || "No Department",
                        joinDate: joinDate,
                        location: "N/A", // Default for now
                        bio: "Passionate about building great things and contributing to the society.",
                        initials: initials,
                        avatar_url: profile.avatar_url
                    });
                }
            }
            setLoading(false);
        }
        fetchProfile();
    }, [supabase]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center bg-background dark:bg-zinc-950">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            <header className="mb-8 md:mb-10">
                <h1 className="text-3xl font-medium tracking-tight text-zinc-900 dark:text-white mb-2">My Profile</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                    Manage your personal information and view your activity.
                </p>
            </header>

            <div className="w-full grid md:grid-cols-3 gap-6 md:gap-8">

                {/* Left Column - Profile Card */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 shadow-xl overflow-hidden rounded-2xl">
                        <div className="h-24 md:h-28 bg-gradient-to-br from-amber-500/20 to-zinc-900 w-full relative" />
                        <CardContent className="pt-0 relative px-6 pb-6 text-center flex flex-col items-center">
                            <Avatar className="h-24 w-24 border-4 border-zinc-950 -mt-12 mb-4 bg-white dark:bg-zinc-900">
                                <AvatarImage src={user.avatar_url || ""} />
                                <AvatarFallback className="text-2xl font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-500">{user.initials}</AvatarFallback>
                            </Avatar>

                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-1">{user.name}</h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{user.role}</p>

                            <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-700 text-zinc-800 dark:text-zinc-300 font-normal mb-6">
                                {user.department} Team
                            </Badge>

                            <div className="w-full space-y-3 mt-2 border-t border-zinc-200 dark:border-zinc-800/60 pt-6">
                                <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                                    <Mail className="h-4 w-4 mr-3 shrink-0" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                                    <Phone className="h-4 w-4 mr-3 shrink-0" />
                                    <span className="truncate">{user.phone}</span>
                                </div>
                                <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                                    <MapPin className="h-4 w-4 mr-3 shrink-0" />
                                    <span className="truncate">{user.location}</span>
                                </div>
                                <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                                    <Calendar className="h-4 w-4 mr-3 shrink-0" />
                                    <span className="truncate">Joined {user.joinDate}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Details */}
                <div className="md:col-span-2 space-y-6">

                    {/* About Section */}
                    <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-medium text-zinc-900 dark:text-white flex justify-between items-center">
                                About Me
                                <Button variant="ghost" size="sm" className="h-8 text-xs text-amber-600 dark:text-amber-500 hover:text-amber-400 hover:bg-amber-500/10">
                                    Edit
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                                {user.bio}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Performance / System Stats */}
                    <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-medium text-zinc-900 dark:text-white">Performance Metrics</CardTitle>
                            <CardDescription className="text-zinc-500">Your task completion and attendance records.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-zinc-800 dark:text-zinc-300">Task Completion Rate</span>
                                    <span className="text-sm font-medium text-amber-600 dark:text-amber-500">92%</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500" style={{ width: '92%' }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-zinc-800 dark:text-zinc-300">Overall Attendance</span>
                                    <span className="text-sm font-medium text-emerald-500">85%</span>
                                </div>
                                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: '85%' }} />
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* Active Teams */}
                    <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-medium text-zinc-900 dark:text-white">Societies & Teams</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
                                            <Briefcase className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-zinc-800 dark:text-zinc-200">Event Management Team</p>
                                            <p className="text-xs text-zinc-500">Media Director</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10">Active</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-950/50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
                                            <Building2 className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-zinc-800 dark:text-zinc-200">Tech Society</p>
                                            <p className="text-xs text-zinc-500">Operations Member</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10">Active</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Log Out Button */}
                    <div className="pt-4 flex justify-end">
                        <Button variant="outline" className="text-rose-500 border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400 transition">
                            <LogOut className="h-4 w-4 mr-2" />
                            Log Out
                        </Button>
                    </div>

                </div>
            </div>

        </div>
    );
}
