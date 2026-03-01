"use client";

import { Users, Plus, Star, MoreVertical, LayoutGrid } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useMockData } from "@/app/context/MockDataContext";

export default function AdminTeamsPage() {
    const { teams, addTeam } = useMockData();
    const [selectedTeam, setSelectedTeam] = useState<any>(null);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);

    const openManageModal = (team: any) => {
        setSelectedTeam(team);
        setIsManageModalOpen(true);
    };

    const handleCreateTeam = () => {
        addTeam({
            id: `team-${Date.now()}`,
            name: "New Custom Team",
            members: 1,
            leads: ["You"],
            color: "bg-rose-500",
            type: "Core"
        });
    };

    return (
        <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">

            <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight text-[#172b4d] dark:text-white mb-2">Teams Management</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
                        Organize your society into functional groups.
                    </p>
                </div>
                <Button onClick={handleCreateTeam} className="bg-rose-500 text-white hover:bg-rose-600 shadow-sm shrink-0">
                    <Plus className="h-4 w-4 mr-2" /> Create New Team
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {teams.map((team) => (
                    <div key={team.id} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition group overflow-hidden relative">
                        {/* Decorative Top Banner */}
                        <div className={`absolute top-0 left-0 right-0 h-1.5 ${team.color} opacity-80`} />

                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-xl ${team.color}/10 flex items-center justify-center shrink-0 border border-white dark:border-zinc-800`}>
                                    <LayoutGrid className={`h-5 w-5 ${team.color.replace('bg-', 'text-')}`} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#172b4d] dark:text-zinc-100">{team.name}</h3>
                                    <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-normal px-2 mt-1">
                                        {team.type} Team
                                    </Badge>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-[#172b4d] dark:hover:text-white shrink-0 -mr-2">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-600 dark:text-zinc-400 flex items-center">
                                    <Users className="h-4 w-4 mr-2 opacity-70" /> Members
                                </span>
                                <span className="font-medium text-[#172b4d] dark:text-zinc-200">{team.members}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm border-t border-zinc-100 dark:border-zinc-800/50 pt-4">
                                <span className="text-zinc-600 dark:text-zinc-400 flex items-center">
                                    <Star className="h-4 w-4 mr-2 opacity-70 text-amber-500" /> Team Leads
                                </span>
                                <div className="flex -space-x-2">
                                    {team.leads.map((lead, i) => (
                                        <div key={i} className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-800 border-2 border-white dark:border-zinc-950 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-300" title={lead}>
                                            {lead.charAt(0)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Button onClick={() => openManageModal(team)} variant="outline" className="w-full bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[#172b4d] dark:text-zinc-200 hover:text-rose-600 dark:hover:text-rose-400 transition">
                                Manage Team
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Create Team Card */}
                <button onClick={handleCreateTeam} className="bg-[#f4f5f7]/50 dark:bg-zinc-900/20 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:border-rose-400 dark:hover:border-rose-500/50 transition flex flex-col items-center justify-center gap-3 text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-500 min-h-[250px] group">
                    <div className="h-12 w-12 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center group-hover:bg-rose-50 dark:group-hover:bg-rose-500/10 transition">
                        <Plus className="h-6 w-6" />
                    </div>
                    <span className="font-medium">Create New Team</span>
                </button>
            </div>

            {/* Manage Team Modal */}
            <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
                <DialogContent className="sm:max-w-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader>
                        <DialogTitle className="text-[#172b4d] dark:text-white">Manage Team: {selectedTeam?.name}</DialogTitle>
                        <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                            View and manage members assigned to this functional group.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                placeholder="Search & add member by name..."
                                className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-rose-500"
                            />
                            <Button size="sm" className="bg-rose-500 text-white hover:bg-rose-600">Add</Button>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 min-h-[150px] max-h-[300px] overflow-y-auto custom-scrollbar">
                            {selectedTeam?.leads?.map((lead: string, i: number) => (
                                <div key={`lead-${i}`} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-700">
                                            <AvatarFallback className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-500 text-xs font-bold">{lead.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium text-[#172b4d] dark:text-zinc-200">{lead}</p>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Team Lead</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10">Remove</Button>
                                </div>
                            ))}
                            {/* Dummy members to show off the UI scroll */}
                            {Array.from({ length: selectedTeam?.members > 0 ? selectedTeam.members - selectedTeam.leads.length : 0 }).slice(0, 4).map((_, i) => (
                                <div key={`member-${i}`} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-700">
                                            <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 text-xs font-bold">U{i + 1}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium text-[#172b4d] dark:text-zinc-200">Dummy User {i + 1}</p>
                                            <p className="text-xs text-zinc-500">Member</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10">Remove</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
