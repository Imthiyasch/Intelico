import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import { Users, FileText, Activity, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("sb-access-token")?.value;
  const supabase = createServerSupabase(); // Has service role key

  if (!token) {
    redirect("/auth");
  }

  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) {
    redirect("/auth");
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
  const userEmail = user.email?.toLowerCase();

  if (!userEmail || !adminEmails.includes(userEmail)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center max-w-md">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-500">You do not have permission to view the admin panel.</p>
        </div>
      </div>
    );
  }

  // Fetch metrics using service role to bypass RLS
  const [
    { count: usersCount },
    { count: resumesCount },
    { data: recentActivities },
    { data: usersList }
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("resumes").select("*", { count: "exact", head: true }),
    supabase.from("activities").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("users").select("*").order("created_at", { ascending: false }).limit(10)
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-500">Overview of users and platform activity.</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Users</p>
              <p className="text-2xl font-bold">{usersCount || 0}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Resumes</p>
              <p className="text-2xl font-bold">{resumesCount || 0}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Recent Activities</p>
              <p className="text-2xl font-bold">{recentActivities?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
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
                  {recentActivities && recentActivities.length > 0 ? (
                    recentActivities.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-50/50">
                        <td className="py-4 px-6 font-medium text-slate-700">{act.action}</td>
                        <td className="py-4 px-6 text-slate-500">
                          {act.details ? JSON.stringify(act.details).substring(0, 50) : "-"}
                        </td>
                        <td className="py-4 px-6 text-slate-500">
                          {new Date(act.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-500">No recent activities found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Newest Users */}
          <div>
            <h2 className="text-xl font-bold mb-4">Newest Users</h2>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <ul className="space-y-4">
                {usersList && usersList.length > 0 ? (
                  usersList.map((u) => (
                    <li key={u.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                        {u.email ? u.email[0].toUpperCase() : "?"}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-slate-700 truncate">{u.email || "Anonymous"}</p>
                        <p className="text-xs text-slate-400">{new Date(u.created_at).toLocaleDateString()}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-slate-500 py-4">No users found.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
