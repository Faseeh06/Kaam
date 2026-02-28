"use client";

import {
    Bell,
    CheckCircle2,
    Clock,
    LayoutDashboard,
    LogOut,
    Settings,
    Shield,
    User,
    Activity,
    CalendarDays,
    Users
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock Data
const user = {
    name: "John Doe",
    email: "user@test.com",
    role: "Media Director",
    society: "Debate Club",
    attendance: 85,
};

const tasks = [
    {
        id: 1,
        title: "Design Promo Banners for Annual Meet",
        society: "Debate Club",
        team: "Media",
        status: "In Progress",
        deadline: "Tomorrow",
        priority: "High",
    },
    {
        id: 2,
        title: "Draft Speech Guidelines Document",
        society: "Debate Club",
        team: "Content",
        status: "Review",
        deadline: "Oct 24",
        priority: "Medium",
    },
    {
        id: 3,
        title: "Organize Logistics for Workshop",
        society: "Tech Society",
        team: "Operations",
        status: "To Do",
        deadline: "Oct 28",
        priority: "High",
    },
];

const activityLog = [
    { id: 1, action: "Submitted Task 'Design Promo Banners'", time: "2 hours ago" },
    { id: 2, action: "Marked present at 'Weekly Sync'", time: "Yesterday" },
    { id: 3, action: "Joined 'Tech Society' as Operations Member", time: "3 days ago" },
];

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-amber-500/30">
            {/* Navigation */}
            <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <Shield className="h-6 w-6 text-amber-500" />
                            <span className="font-medium text-xl tracking-tight">Kaam</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
                            <Link href="#" className="text-amber-500 font-medium transition-colors">
                                Overview
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                My Tasks
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                Societies
                            </Link>
                            <Link href="#" className="hover:text-white transition-colors">
                                Calendar
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <div className="h-8 w-px bg-zinc-800 hidden md:block" />
                        <div className="flex items-center gap-3 relative group cursor-pointer">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                <p className="text-xs text-zinc-500 mt-1">{user.role}</p>
                            </div>
                            <Avatar className="h-9 w-9 border border-zinc-800">
                                <AvatarImage src="/images/avatar.png" />
                                <AvatarFallback className="bg-zinc-800 text-zinc-400">JD</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-medium tracking-tight">Welcome back, {user.name.split(' ')[0]}</h1>
                        <p className="text-zinc-400 mt-1">Here is a summary of your performance and tasks across all your societies.</p>
                    </div>
                    <Button className="bg-amber-500 text-zinc-950 hover:bg-amber-400">
                        View Notifications
                    </Button>
                </div>

                {/* Metrics Grid */}
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">
                                Active Tasks
                            </CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-medium text-white">12</div>
                            <p className="text-xs text-emerald-500 mt-1">
                                +3 completed this week
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">
                                Upcoming Deadlines
                            </CardTitle>
                            <Clock className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-medium text-white">4</div>
                            <p className="text-xs text-rose-500 mt-1">
                                2 due tomorrow
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">
                                Overall Attendance
                            </CardTitle>
                            <Activity className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-medium text-white">{user.attendance}%</div>
                            <Progress value={user.attendance} className="mt-3 h-1 bg-zinc-800 [&>div]:bg-amber-500" />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Left Column */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg font-medium text-white">Assigned Tasks</CardTitle>
                                    <Button variant="outline" size="sm" className="border-zinc-700 text-white bg-transparent hover:bg-zinc-800">View All</Button>
                                </div>
                                <CardDescription className="text-zinc-400">
                                    Your tasks pending review or completion.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="all" className="w-full">
                                    <TabsList className="bg-zinc-950 border border-zinc-800 w-full justify-start rounded-md h-12 p-1 mb-6">
                                        <TabsTrigger value="all" className="data-[state=active]:bg-zinc-800 text-zinc-400 data-[state=active]:text-white">All Tasks</TabsTrigger>
                                        <TabsTrigger value="todo" className="data-[state=active]:bg-zinc-800 text-zinc-400 data-[state=active]:text-white">To Do</TabsTrigger>
                                        <TabsTrigger value="progress" className="data-[state=active]:bg-zinc-800 text-zinc-400 data-[state=active]:text-white">In Progress</TabsTrigger>
                                        <TabsTrigger value="review" className="data-[state=active]:bg-zinc-800 text-zinc-400 data-[state=active]:text-white">Under Review</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="all" className="space-y-4 outline-none">
                                        {tasks.map((task) => (
                                            <div key={task.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-zinc-950/50 border border-zinc-800/50 transition-colors hover:bg-zinc-800/50">
                                                <div className="space-y-1 w-full flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium text-white">{task.title}</h4>
                                                        <Badge variant={task.priority === 'High' ? 'destructive' : 'secondary'} className="bg-rose-500/10 text-rose-500 border-rose-500/20">
                                                            {task.priority}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                                                        <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {task.society} ({task.team})</span>
                                                        <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Due: {task.deadline}</span>
                                                    </div>
                                                </div>
                                                <div className="mt-4 sm:mt-0 flex items-center gap-3">
                                                    <Badge variant="outline" className="border-zinc-700 text-zinc-300 bg-zinc-900">
                                                        {task.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-lg font-medium text-white">Teams & Roles</CardTitle>
                                <CardDescription className="text-zinc-400">
                                    Organizations you are part of.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <p className="font-medium text-white">Debate Club</p>
                                        <p className="text-sm text-amber-500">Media Director</p>
                                    </div>
                                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700">Media Team</Badge>
                                </div>
                                <div className="h-px bg-zinc-800" />
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <p className="font-medium text-white">Tech Society</p>
                                        <p className="text-sm text-zinc-400">Executive Member</p>
                                    </div>
                                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700">Operations</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900 border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-lg font-medium text-white">Activity Log</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {activityLog.map((log, i) => (
                                        <div key={log.id} className="flex gap-4 relative">
                                            {i !== activityLog.length - 1 && (
                                                <div className="absolute left-1.5 top-6 bottom-[-16px] w-px bg-zinc-800" />
                                            )}
                                            <div className="mt-1 flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-amber-500/20 ring-1 ring-amber-500/50">
                                                <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                            </div>
                                            <div className="space-y-1 pb-1">
                                                <p className="text-sm font-medium text-white leading-none">{log.action}</p>
                                                <p className="text-xs text-zinc-500">{log.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="link" className="w-full mt-4 text-zinc-400 text-sm h-auto p-0">
                                    View full history
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
