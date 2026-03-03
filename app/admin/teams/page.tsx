"use client";

import {
  Users,
  Plus,
  Star,
  MoreVertical,
  LayoutGrid,
  Settings,
  ShieldAlert,
  Search,
  Check,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMockData } from "@/app/context/MockDataContext";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

const COLORS = [
  { label: "Rose", value: "bg-rose-500" },
  { label: "Blue", value: "bg-blue-500" },
  { label: "Emerald", value: "bg-emerald-500" },
  { label: "Amber", value: "bg-amber-500" },
  { label: "Violet", value: "bg-violet-500" },
  { label: "Fuchsia", value: "bg-fuchsia-500" },
];

export default function AdminTeamsPage() {
  const {
    teams,
    addTeam,
    removeTeam,
    users,
    teamMembers,
    addTeamMember,
    removeTeamMember,
    officeBearers,
  } = useMockData();
  const [managedSocietyId, setManagedSocietyId] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Member search for management
  const [memberSearch, setMemberSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);

  useEffect(() => {
    const getManagedSociety = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserData({ id: user.id });
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_societies(society_id, role)")
          .eq("id", user.id)
          .single();

        if (profile) {
          const managementRoles = ["Admin", "Office Bearer"];
          const managed = (profile.user_societies as any[])?.find((us) =>
            managementRoles.includes(us.role),
          );
          setManagedSocietyId(managed?.society_id);
        }
      }
      setIsLoading(false);
    };
    getManagedSociety();
  }, []);

  const myOBRecord = userData
    ? officeBearers.find((ob) => ob.userId === userData.id)
    : null;
  const isPresident = myOBRecord?.position === "President";
  const isScopedOB = !!myOBRecord && !isPresident;

  const societyTeams = teams.filter((t) => {
    if (!managedSocietyId || (t as any).society_id !== managedSocietyId)
      return false;
    if (isScopedOB) return myOBRecord.assignedTeamIds.includes(t.id);
    return true;
  });

  // Create team form state
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Core");
  const [newColor, setNewColor] = useState("bg-rose-500");
  const [newLeadInput, setNewLeadInput] = useState("");
  const [newLeads, setNewLeads] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const openManageModal = (team: any) => {
    setSelectedTeam(team);
    setIsManageModalOpen(true);
  };

  const addLead = () => {
    if (newLeadInput.trim() && !newLeads.includes(newLeadInput.trim())) {
      setNewLeads([...newLeads, newLeadInput.trim()]);
      setNewLeadInput("");
    }
  };

  const removeLead = (lead: string) =>
    setNewLeads(newLeads.filter((l) => l !== lead));

  // For member management modal
  const manageableUsers = users.filter(
    (u) =>
      u.societyIds.includes(managedSocietyId || "") &&
      !teamMembers[selectedTeam?.id]?.some((m) => m.userId === u.id),
  );

  const searchResults = manageableUsers
    .filter(
      (u) =>
        u.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(memberSearch.toLowerCase()),
    )
    .slice(0, 5);

  const handleAddMember = async (userId: string) => {
    if (!selectedTeam || isAddingMember) return;
    setIsAddingMember(true);
    try {
      await addTeamMember(selectedTeam.id, userId);
      setMemberSearch("");
      setShowResults(false);
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleRemoveMember = async (recordId: string) => {
    await removeTeamMember(recordId);
  };

  const handleCreateTeam = async () => {
    if (!newName.trim() || !managedSocietyId || isCreating) return;
    setIsCreating(true);
    try {
      await addTeam({
        name: newName.trim(),
        members: newLeads.length || 0,
        leads: newLeads.length > 0 ? newLeads : ["Unassigned"],
        color: newColor,
        type: newType,
        society_id: managedSocietyId,
      });
      // reset
      setNewName("");
      setNewType("Core");
      setNewColor("bg-rose-500");
      setNewLeads([]);
      setNewLeadInput("");
      setIsCreateOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this team? This action cannot be undone.",
      )
    )
      return;
    try {
      await removeTeam(teamId);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!managedSocietyId) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-500">
        Managed society not found.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">
      <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-[#172b4d] dark:text-white mb-2">
            Teams Management
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
            Organize your society into functional groups.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-rose-500 text-white hover:bg-rose-600 shadow-sm shrink-0">
              <Plus className="h-4 w-4 mr-2" /> Create New Team
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-[#172b4d] dark:text-white">
                Create New Team
              </DialogTitle>
              <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                Set up a new functional group for your society.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Team Name <span className="text-rose-500">*</span>
                </label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Marketing & Outreach"
                  className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Team Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option>Core</option>
                  <option>Support</option>
                  <option>Advisory</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Team Accent Color
                </label>
                <div className="flex gap-2.5">
                  {COLORS.map((c) => (
                    <div
                      key={c.value}
                      title={c.label}
                      onClick={() => setNewColor(c.value)}
                      className={`h-7 w-7 rounded-full cursor-pointer border-2 transition-transform hover:scale-110 ${c.value} ${newColor === c.value ? "border-[#172b4d] dark:border-white ring-2 ring-zinc-200 dark:ring-zinc-700 ring-offset-1 scale-110" : "border-transparent opacity-70 hover:opacity-100"}`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Add Team Leads
                </label>
                <div className="flex gap-2">
                  <input
                    value={newLeadInput}
                    onChange={(e) => setNewLeadInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addLead()}
                    placeholder="Type a name and press Add or Enter"
                    className="flex-1 bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <Button
                    size="sm"
                    onClick={addLead}
                    className="bg-rose-500 hover:bg-rose-600 text-white"
                  >
                    Add
                  </Button>
                </div>
                {newLeads.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {newLeads.map((lead) => (
                      <span
                        key={lead}
                        className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 rounded-full px-3 py-1 text-xs font-medium"
                      >
                        <span className="h-4 w-4 rounded-full bg-amber-200 dark:bg-amber-500/30 flex items-center justify-center font-bold text-[10px]">
                          {lead.charAt(0)}
                        </span>
                        {lead}
                        <button
                          onClick={() => removeLead(lead)}
                          className="ml-1 text-amber-500 hover:text-rose-500 transition"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 border-zinc-200 dark:border-zinc-800"
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  disabled={!newName.trim() || isCreating}
                  onClick={handleCreateTeam}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-50"
                >
                  {isCreating && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Team
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {societyTeams.map((team) => (
          <div
            key={team.id}
            className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition group overflow-hidden relative"
          >
            {/* Decorative Top Banner */}
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 ${team.color} opacity-80`}
            />

            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-xl ${team.color}/10 flex items-center justify-center shrink-0 border border-white dark:border-zinc-800`}
                >
                  <LayoutGrid
                    className={`h-5 w-5 ${team.color.replace("bg-", "text-")}`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-[#172b4d] dark:text-zinc-100">
                    {team.name}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-normal px-2 mt-1"
                  >
                    {team.type} Team
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-[#172b4d] dark:hover:text-white shrink-0 -mr-2"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-40 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl"
                >
                  <DropdownMenuItem
                    onClick={() => handleDeleteTeam(team.id)}
                    className="flex items-center gap-2 text-rose-600 dark:text-rose-400 focus:text-rose-600 dark:focus:text-rose-400 cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-sm"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete Team
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-600 dark:text-zinc-400 flex items-center">
                  <Users className="h-4 w-4 mr-2 opacity-70" /> Members
                </span>
                <span className="font-medium text-[#172b4d] dark:text-zinc-200">
                  {teamMembers[team.id]?.length || team.members || 0}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm border-t border-zinc-100 dark:border-zinc-800/50 pt-4">
                <span className="text-zinc-600 dark:text-zinc-400 flex items-center">
                  <Star className="h-4 w-4 mr-2 opacity-70 text-amber-500" />{" "}
                  Team Leads
                </span>
                <div className="flex -space-x-2">
                  {(
                    teamMembers[team.id]?.filter(
                      (m) =>
                        m.teamRole === "Director" ||
                        m.teamRole === "Deputy Director",
                    ) || team.leads.map((l) => ({ name: l }))
                  ).map((lead: any, i: number) => (
                    <div
                      key={i}
                      className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-800 border-2 border-white dark:border-zinc-950 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-300"
                      title={lead.name}
                    >
                      {lead.name.charAt(0)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={() => openManageModal(team)}
                variant="outline"
                className="w-full bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-[#172b4d] dark:text-zinc-200 hover:text-rose-600 dark:hover:text-rose-400 transition"
              >
                Manage Team
              </Button>
            </div>
          </div>
        ))}

        {/* Create Team Card - Hide for Scoped OBs */}
        {!isScopedOB && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-[#f4f5f7]/50 dark:bg-zinc-900/20 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:border-rose-400 dark:hover:border-rose-500/50 transition flex flex-col items-center justify-center gap-3 text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-500 min-h-[250px] group"
          >
            <div className="h-12 w-12 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center group-hover:bg-rose-50 dark:group-hover:bg-rose-500/10 transition">
              <Plus className="h-6 w-6" />
            </div>
            <span className="font-medium">Create New Team</span>
          </button>
        )}
      </div>

      {/* Manage Team Modal */}
      <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
        <DialogContent className="sm:max-w-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="text-[#172b4d] dark:text-white">
              Manage Team: {selectedTeam?.name}
            </DialogTitle>
            <DialogDescription className="text-zinc-500 dark:text-zinc-400">
              View and manage members assigned to this functional group.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="members" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg h-10 p-1 mb-4">
              <TabsTrigger
                value="members"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 rounded-md text-sm font-medium transition-all data-[state=active]:text-[#172b4d] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Members & Roles
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 rounded-md text-sm font-medium transition-all data-[state=active]:text-[#172b4d] dark:data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Team Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="space-y-4">
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      value={memberSearch}
                      onChange={(e) => {
                        setMemberSearch(e.target.value);
                        setShowResults(true);
                      }}
                      onFocus={() => setShowResults(true)}
                      placeholder="Search & add society member..."
                      className="w-full bg-[#f4f5f7] dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-zinc-400 hover:text-zinc-600"
                    onClick={() => {
                      setMemberSearch("");
                      setShowResults(false);
                    }}
                  >
                    Clear
                  </Button>
                </div>

                {showResults && memberSearch.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((u) => (
                        <button
                          key={u.id}
                          disabled={isAddingMember}
                          onClick={() => handleAddMember(u.id)}
                          className={`w-full flex items-center gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition text-left border-b border-zinc-100 dark:border-zinc-800 last:border-0 group ${isAddingMember ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
                              {u.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#172b4d] dark:text-zinc-100 truncate">
                              {u.name}
                            </p>
                            <p className="text-[10px] text-zinc-500 truncate">
                              {u.email}
                            </p>
                          </div>
                          {isAddingMember ? (
                            <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
                          ) : (
                            <Plus className="h-4 w-4 text-zinc-400 group-hover:text-rose-500 transition" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-zinc-500">
                        No matching members found in society.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 min-h-[150px] max-h-[300px] overflow-y-auto custom-scrollbar">
                {teamMembers[selectedTeam?.id]?.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 hover:bg-white dark:hover:bg-zinc-800 p-2 rounded-md transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-700">
                        <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-[#172b4d] dark:text-zinc-300 text-xs font-bold">
                          {m.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-[#172b4d] dark:text-zinc-200">
                          {m.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                          {m.teamRole}
                        </p>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(m.id)}
                        className="h-7 px-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                {(!teamMembers[selectedTeam?.id] ||
                  teamMembers[selectedTeam?.id].length === 0) && (
                  <div className="h-32 flex flex-col items-center justify-center text-zinc-500 text-xs italic gap-2">
                    <Users className="h-5 w-5 opacity-30" />
                    No members in this team yet.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 pt-2">
              <div className="space-y-4 border border-zinc-200 dark:border-zinc-800 bg-[#f4f5f7]/50 dark:bg-zinc-900/30 p-5 rounded-xl">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                    Team Name
                  </label>
                  <input
                    defaultValue={selectedTeam?.name}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm font-medium text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                    Team Accent Color
                  </label>
                  <div className="flex gap-2">
                    {[
                      "bg-rose-500",
                      "bg-blue-500",
                      "bg-emerald-500",
                      "bg-amber-500",
                      "bg-violet-500",
                      "bg-fuchsia-500",
                    ].map((color) => (
                      <div
                        key={color}
                        className={`h-6 w-6 rounded-full cursor-pointer border-2 transition-transform hover:scale-110 ${color} ${selectedTeam?.color === color ? "border-[#172b4d] dark:border-white shadow-sm ring-2 ring-zinc-200 dark:ring-zinc-800 ring-offset-1" : "border-transparent opacity-70 hover:opacity-100"}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                    Assign HR / Point of Contact
                  </label>
                  <select className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg p-2.5 text-sm text-[#172b4d] dark:text-zinc-100 outline-none focus:ring-1 focus:ring-rose-500">
                    <option value="">Select an active member...</option>
                    <option value="hr1">HR Representative 1</option>
                    <option value="hr2">Society Admin</option>
                    {selectedTeam?.leads?.map((lead: string) => (
                      <option key={lead} value={lead}>
                        {lead} (Lead)
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    This person will handle internal disputes, performance
                    reviews, and onboarding.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 h-10"
                >
                  <ShieldAlert className="h-4 w-4 mr-2" />
                  Archive this Team
                </Button>
                <p className="text-[11px] mt-2 mb-1 text-center text-zinc-400">
                  Archiving will preserve tasks but block new members.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
