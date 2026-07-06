"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, FileText, Activity, ShieldAlert, CreditCard, TrendingUp, Search, RefreshCw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";
import UsersTable, { AdminUser } from "./UsersTable";
import { Button } from "@/components/ui/Button";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  
  // Dashboard metrics
  const [usersCount, setUsersCount] = useState(0);
  const [resumesCount, setResumesCount] = useState(0);
  const [activePlanCount, setActivePlanCount] = useState(0);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [planCounts, setPlanCounts] = useState<Record<string, number>>({
    free: 0,
    starter: 0,
    popular: 0,
    "best-value": 0
  });

  const [searchQuery, setSearchQuery] = useState("");

  const checkAdminAccess = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !session.user) {
        router.push("/auth");
        return;
      }

      const userEmail = session.user.email?.toLowerCase() || "";
      const allowedAdmins = ["imthiranu@gmail.com"];
      
      if (allowedAdmins.includes(userEmail)) {
        setAuthorized(true);
        setAdminEmail(userEmail);
        await fetchData();
      } else {
        setAuthorized(false);
      }
    } catch (err) {
      console.error("Admin check failed", err);
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    // 1. Fetch resumes count
    const { count: resCount } = await supabase.from("resumes").select("*", { count: "exact", head: true });
    setResumesCount(resCount || 0);

    // 2. Fetch users and their resume counts
    const { data: profiles } = await supabase.from("users").select("id, email, name, plan, created_at");
    
    if (profiles) {
      setUsersCount(profiles.length);

      // Plan counts
      const counts: Record<string, number> = { free: 0, starter: 0, popular: 0, "best-value": 0 };
      profiles.forEach((p) => {
        const planName = p.plan || "free";
        counts[planName] = (counts[planName] || 0) + 1;
      });
      setPlanCounts(counts);
      setActivePlanCount(profiles.filter(p => p.plan && p.plan !== "free").length);

      // Get resume count for each user
      const { data: resumes } = await supabase.from("resumes").select("user_id");
      const resumeMap: Record<string, number> = {};
      (resumes || []).forEach(r => {
        resumeMap[r.user_id] = (resumeMap[r.user_id] || 0) + 1;
      });

      const formatted: AdminUser[] = profiles.map(p => ({
        id: p.id,
        email: p.email || "No Email",
        created_at: p.created_at,
        resumeCount: resumeMap[p.id] || 0
      })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setUsers(formatted);
    }

    // 3. Fetch recent activities
    const { data: activities } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    setRecentActivities(activities || []);
  };

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center max-w-md">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-500 mb-6">You do not have permission to view the admin panel.</p>
          <Button variant="secondary" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">Logged in as {adminEmail}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={fetchData} className="flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4" /> Refresh Data
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Users</p>
              <p className="text-2xl font-bold">{usersCount}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Resumes</p>
              <p className="text-2xl font-bold">{resumesCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Subscribers</p>
              <p className="text-2xl font-bold">{activePlanCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Recent Activities</p>
              <p className="text-2xl font-bold">{recentActivities.length}</p>
            </div>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-12">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold">Subscription Plan Distribution</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["free", "starter", "popular", "best-value"].map((p) => (
              <div key={p} className="rounded-xl border border-slate-100 p-4 text-center">
                <p className="text-xs font-medium text-slate-500 capitalize mb-1">{p === "best-value" ? "Best Value" : p}</p>
                <p className="text-3xl font-black text-slate-800">{planCounts[p] || 0}</p>
              </div>
            ))}
          </div>
        </div>

        {/* User Management Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-xl font-bold">User Management</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search user email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <UsersTable users={filteredUsers} />
        </div>

        {/* Activity Logs */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Activity Logs</h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Action</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Details</th>
                  <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentActivities.length > 0 ? (
                  recentActivities.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-50/50">
                      <td className="py-4 px-6 font-medium text-slate-700">{act.action}</td>
                      <td className="py-4 px-6 text-slate-500">
                        {act.details ? JSON.stringify(act.details) : "-"}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {new Date(act.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-500">No activity logs found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
