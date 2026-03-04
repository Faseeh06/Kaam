"use client";

import { useMockData, Society, AppUser, Team } from "@/app/context/MockDataContext";
import { useParams, useRouter } from "next/navigation";
import {
    ChevronLeft, Building2, Users, Layout, CheckCircle2,
    Calendar, Mail, Globe, MessageSquare, Shield,
    MoreVertical, Settings, UserPlus, Trash2, ExternalLink,
    Activity, ArrowUpRight, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMemo } from "react";

export default function SocietyDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { societies, users, teams, boardLists, boardCards, admins } = useMockData();

    const society = useMemo(() => societies.find(s => s.id === id), [societies, id]);

    // Derived Data
    const societyUsers = useMemo(() => users.filter(u => u.societyIds.includes(id as string)), [users, id]);
    const societyTeams = useMemo(() => teams.filter(t => t.society_id === id), [teams, id]);
    const societyAdmins = useMemo(() => admins.filter(a => a.scope === society?.name), [admins, society]);

    const teamIds = societyTeams.map(t => t.id);
    const societyLists = boardLists.filter(l => teamIds.includes(l.team_id));
    const listIds = societyLists.map(l => l.id);
    const societyCards = boardCards.filter(c => listIds.includes(c.list_id));
    const completedTasks = societyCards.filter(c => c.isCompleted).length;

    if (!society) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8">
                <Building2 className="h-16 w-16 text-zinc-300 mb-4" />
                <h2 className="text-xl font-bold text-white dark:text-white">Society not found</h2>
                <Button variant="link" onClick={() => router.push('/super/societies')} className="text-violet-600">
                    Return to Registry
                </Button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            {/* Header / Breadcrumbs */}
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push('/super/societies')}
                    className="h-9 w-9 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">Society Details</h1>
                    <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-violet-500" />
                        <span className="text-lg font-bold text-white dark:text-white">{society.name}</span>
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline" className="h-9 border-zinc-200 dark:border-zinc-800">
                        <Settings className="h-4 w-4 mr-2" /> Manage
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="h-9 w-9 border-zinc-200 dark:border-zinc-800">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="text-rose-600 dark:text-rose-400">
                                <Trash2 className="h-4 w-4 mr-2" /> Archive Society
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Profile Hero Section */}
            <Card className="mb-8 border-none bg-white dark:bg-zinc-900/60 overflow-hidden shadow-sm relative">
                {/* Banner */}
                <div className="h-48 md:h-64 w-full relative bg-zinc-100 dark:bg-zinc-800">
                    {society.cover_url ? (
                        <img src={society.cover_url} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Info Bar overlapping banner */}
                <div className="px-6 md:px-10 pb-8 relative">
                    <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12 md:-mt-16">
                        <div className="h-24 w-24 md:h-32 md:w-32 rounded-3xl border-4 border-white dark:border-zinc-900 bg-white dark:bg-zinc-800 shadow-xl overflow-hidden flex items-center justify-center">
                            {society.logo ? (
                                <img src={society.logo} alt={society.name} className="h-full w-full object-contain p-2" />
                            ) : (
                                <Building2 className="h-12 w-12 text-zinc-300" />
                            )}
                        </div>

                        <div className="flex-1 pb-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl md:text-3xl font-bold text-white dark:text-white">{society.name}</h2>
                                <Badge className={cn(
                                    society.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20',
                                    "font-bold uppercase tracking-widest text-[10px]"
                                )}>
                                    {society.status}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                                <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-violet-500" /> {society.acronym} Registry</span>
                                {society.email && <span className="flex items-center gap-1.5 hover:text-white transition-colors"><Mail className="h-4 w-4" /> {society.email}</span>}
                                {society.website && (
                                    <Link href={society.website} target="_blank" className="flex items-center gap-1.5 hover:text-violet-600 transition-colors">
                                        <Globe className="h-4 w-4" /> {new URL(society.website).hostname}
                                        <ExternalLink className="h-3 w-3" />
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pb-1">
                            {society.whatsapp && (
                                <Button className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold h-11 px-6 shadow-md shadow-[#25D366]/20">
                                    <MessageSquare className="h-4 w-4 mr-2" /> Join WhatsApp
                                </Button>
                            )}
                        </div>
                    </div>

                    {society.description && (
                        <div className="mt-8 max-w-3xl">
                            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{society.description}</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard label="Total Members" value={societyUsers.length} icon={Users} color="blue" />
                <StatCard label="Active Teams" value={societyTeams.length} icon={Layout} color="violet" />
                <StatCard label="Tasks Created" value={societyCards.length} icon={Activity} color="emerald" />
                <StatCard label="Completion Rate" value={`${societyCards.length ? Math.round((completedTasks / societyCards.length) * 100) : 0}%`} icon={CheckCircle2} color="rose" />
            </div>

            {/* Tabs for detailed lists */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1">
                    <TabsTrigger value="overview" className="px-6 data-[state=active]:bg-violet-50 dark:data-[state=active]:bg-violet-500/10 data-[state=active]:text-violet-600 dark:data-[state=active]:text-violet-400">Overview</TabsTrigger>
                    <TabsTrigger value="teams" className="px-6">Teams ({societyTeams.length})</TabsTrigger>
                    <TabsTrigger value="members" className="px-6">Members ({societyUsers.length})</TabsTrigger>
                    <TabsTrigger value="admins" className="px-6">Presidents & Admins ({societyAdmins.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Summary Column */}
                        <div className="md:col-span-2 space-y-8">
                            <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                                    <CardDescription>Latest task movements and board updates.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {societyCards.slice(0, 5).map(card => (
                                        <div key={card.id} className="flex items-center justify-between p-3 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", card.isCompleted ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100 text-zinc-500")}>
                                                    {card.isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white dark:text-zinc-100 leading-tight">{card.title}</p>
                                                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight mt-0.5">Updated recently</p>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="text-[9px] font-bold">{card.label}</Badge>
                                        </div>
                                    ))}
                                    {societyCards.length === 0 && (
                                        <div className="text-center py-8">
                                            <Activity className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                                            <p className="text-sm text-zinc-500">No recent task activity</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-8">
                            <Card className="bg-white dark:bg-zinc-900 border-violet-500/20 shadow-lg shadow-violet-500/5">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base font-bold flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-violet-500" /> Administrative Health
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
                                            <span>Leadership Status</span>
                                            <span className="text-emerald-500">{societyAdmins.length > 0 ? 'Assigned' : 'Missing'}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <div className={cn("h-full transition-all duration-1000", societyAdmins.length > 0 ? "bg-emerald-500 w-full" : "bg-rose-500 w-0")} />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
                                            <span>Teams Structure</span>
                                            <span className="text-violet-500">{societyTeams.length}/5 Target</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-violet-500 transition-all duration-1000" style={{ width: `${(societyTeams.length / 5) * 100}%` }} />
                                        </div>
                                    </div>
                                    <Button className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white font-bold h-11" variant="outline">
                                        <ArrowUpRight className="h-4 w-4 mr-2" /> View Public Profile
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="teams">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {societyTeams.map(team => (
                            <Card key={team.id} className="bg-white dark:bg-zinc-900 hover:border-violet-500/50 transition-colors shadow-sm cursor-pointer group">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg", team.color)}>
                                            <Layout className="h-5 w-5" />
                                        </div>
                                        <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest">{team.type}</Badge>
                                    </div>
                                    <h4 className="font-bold text-white dark:text-white group-hover:text-violet-600 transition-colors">{team.name}</h4>
                                    <p className="text-xs text-zinc-500 mb-4">{team.members} Active Members</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Leads: {team.leads.length}</span>
                                        <ArrowUpRight className="h-4 w-4 text-zinc-300 group-hover:text-violet-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="members">
                    <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">User</th>
                                        <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Role</th>
                                        <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Team</th>
                                        <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">Joined</th>
                                        <th className="px-6 py-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                    {societyUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 shadow-sm">
                                                        <AvatarFallback className="bg-violet-50 text-violet-600 font-bold text-xs">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-bold text-white dark:text-zinc-100">{user.name}</p>
                                                        <p className="text-xs text-zinc-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-zinc-200 dark:border-zinc-800">
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">{user.team}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs text-zinc-400">{user.joined}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                        <DropdownMenuItem>Message User</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-rose-600">Remove from Society</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {societyUsers.length === 0 && (
                                <div className="p-12 text-center text-zinc-400">
                                    <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">No members yet in this registry.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="admins">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {societyAdmins.map(admin => (
                            <Card key={admin.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-1">
                                    <Shield className="h-12 w-12 text-violet-500/5 rotate-12" />
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <Avatar className="h-14 w-14 border-2 border-violet-100 dark:border-zinc-800 shadow-md shadow-violet-500/5">
                                            <AvatarFallback className="bg-violet-600 text-white font-bold text-lg">{admin.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-bold text-lg text-white dark:text-white leading-tight">{admin.name}</h4>
                                            <Badge variant="outline" className="bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20 text-violet-600 dark:text-violet-400 font-bold uppercase text-[9px] mt-1">
                                                {admin.role}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                                            <Mail className="h-4 w-4" />
                                            <span>{admin.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                                            <Shield className="h-4 w-4" />
                                            <span>Local Registry Auth: Full</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/50 flex gap-2">
                                        <Button size="sm" variant="outline" className="flex-1 text-xs h-8 border-zinc-200 dark:border-zinc-800">History</Button>
                                        <Button size="sm" variant="outline" className="flex-1 text-xs h-8 text-rose-600 border-rose-100 dark:border-rose-900/30">Revoke</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        <Button variant="outline" className="border-dashed border-2 h-auto min-h-[160px] flex flex-col items-center justify-center gap-3 text-zinc-400 hover:text-violet-500 hover:border-violet-400/50 hover:bg-violet-50/20 transition-all rounded-2xl group">
                            <div className="h-10 w-10 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                <UserPlus className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-sm tracking-tight text-center">Appoint New Officer</span>
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>

        </div>
    );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: 'blue' | 'violet' | 'emerald' | 'rose' }) {
    const colorMap = {
        blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
        violet: "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
        rose: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
    };

    return (
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800/60 shadow-sm overflow-hidden group hover:shadow-lg transition-all border-b-2 hover:border-b-violet-500">
            <CardContent className="p-5 flex items-center gap-4">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border", colorMap[color])}>
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{label}</p>
                    <p className="text-xl font-bold text-white dark:text-white">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function getActivityColor(level: string) {
    if (level === "High") return "text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
    if (level === "Medium") return "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
    return "text-zinc-500 border-zinc-200 bg-zinc-50 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700";
}
