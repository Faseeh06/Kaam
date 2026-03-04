"use client";

import {
  Users,
  Building2,
  Target,
  TrendingUp,
  UserCheck,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useMockData } from "@/app/context/MockDataContext";

export default function AdminDashboardPage() {
  const {
    users,
    teams,
    boardCards,
    boardLists,
    pendingUsers,
    societies,
    teamMembers,
    officeBearers,
  } = useMockData();
  const [managedSocietyId, setManagedSocietyId] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const adminSociety = societies.find((s) => s.id === managedSocietyId);

  // OB access filtering
  const myOBRecord = userData
    ? officeBearers.find((ob) => ob.userId === userData.id)
    : null;
  const isPresident = myOBRecord?.position === "President";
  const isScopedOB = !!myOBRecord && !isPresident;

  // Filter data for the managed society and OB scoping
  const societyTeams = teams.filter((t) => {
    if (!managedSocietyId || (t as any).society_id !== managedSocietyId)
      return false;
    if (isScopedOB) return myOBRecord.assignedTeamIds.includes(t.id);
    return true;
  });

  const societyUsers = users.filter((u) => {
    if (!managedSocietyId || !u.societyIds.includes(managedSocietyId))
      return false;
    if (isScopedOB) {
      // Only see members of assigned teams
      const allowedTeamIds = societyTeams.map((t) => t.id);
      return allowedTeamIds.some((tid) =>
        (teamMembers[tid] || []).some((tm) => tm.userId === u.id),
      );
    }
    return true;
  });

  // For tasks, we need to filter cards belonging to this society's teams
  const teamIds = societyTeams.map((t) => t.id);
  const societyLists = boardLists.filter((l) => teamIds.includes(l.team_id));
  const societyListIds = societyLists.map((l) => l.id);
  const societyTasks = boardCards.filter((c) =>
    societyListIds.includes(c.list_id),
  );
  const totalTasksCount = societyTasks.length;

  // Pending approvals for this society
  const filteredPending = pendingUsers.filter(
    (u) => managedSocietyId && u.society === adminSociety?.name,
  );

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col pt-4 px-4 md:px-8 pb-8 overflow-y-auto custom-scrollbar">
      <header className="mb-8 md:mb-10">
        <h1 className="text-3xl font-medium tracking-tight text-white dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
          Overview of the entire society platform, users, and tasks.
        </p>
      </header>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white dark:text-white">
              {societyUsers.length}
            </div>
            <p className="text-xs text-zinc-500 mt-1 flex items-center font-medium">
              Registered members
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Total Teams
            </CardTitle>
            <Building2 className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white dark:text-white">
              {societyTeams.length}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center">
              Active departments
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Pending Approvals
            </CardTitle>
            <UserCheck className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white dark:text-white">
              {filteredPending.length}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center font-medium">
              {filteredPending.length > 0
                ? "Awaiting your review"
                : "All up to date"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm hover:shadow-md transition">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
            <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Active Tasks
            </CardTitle>
            <Target className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white dark:text-white">
              {societyTasks.length}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center">
              Total across all departments
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Teams Overview */}
        <Card className="md:col-span-2 bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm">
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
            <CardTitle className="text-lg font-medium text-white dark:text-white">
              Society Teams
            </CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400">
              All teams registered under {adminSociety?.name || "your society"}.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {societyTeams.length === 0 ? (
              <div className="py-10 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                No teams found. Create a team to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {societyTeams.map((team) => {
                  // Count members across all teamMembers records for this team
                  const teamTaskLists = boardLists.filter(
                    (l) => l.team_id === team.id,
                  );
                  const teamListIds = teamTaskLists.map((l) => l.id);
                  const teamTaskCount = boardCards.filter(
                    (c) => teamListIds.includes(c.list_id) && !c.is_completed,
                  ).length;
                  const memberCount = (teamMembers[team.id] || []).length;

                  return (
                    <div
                      key={team.id}
                      className="flex items-center gap-4 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-white dark:hover:bg-zinc-900/60 transition"
                    >
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm ${(team as any).color || "bg-rose-500"}`}
                      >
                        {team.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white dark:text-white truncate">
                          {team.name}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {team.type || "General"}
                        </p>
                      </div>
                      <div className="flex gap-4 text-right shrink-0">
                        <div>
                          <p className="text-sm font-bold text-white dark:text-white">
                            {memberCount}
                          </p>
                          <p className="text-[10px] text-zinc-400 uppercase tracking-wide">
                            Members
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white dark:text-white">
                            {teamTaskCount}
                          </p>
                          <p className="text-[10px] text-zinc-400 uppercase tracking-wide">
                            Tasks
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-1 bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm">
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50 pb-4">
            <CardTitle className="text-lg font-medium text-white dark:text-white">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-rose-300 dark:hover:border-rose-500/50 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition group text-left">
              <div>
                <p className="text-sm font-medium text-white dark:text-zinc-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition">
                  Review Pending Users
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {filteredPending.length} users awaiting approval
                </p>
              </div>
              <div className="h-6 w-6 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-500 flex items-center justify-center text-xs font-bold shrink-0">
                {filteredPending.length}
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition group text-left">
              <div>
                <p className="text-sm font-medium text-white dark:text-zinc-200 transition">
                  Create New Team
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Add a new operational department
                </p>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition group text-left">
              <div>
                <p className="text-sm font-medium text-white dark:text-zinc-200 transition">
                  Society Settings
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Manage global organization rules
                </p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
