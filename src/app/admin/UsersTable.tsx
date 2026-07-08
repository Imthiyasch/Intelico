"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MoreVertical, ShieldBan, ShieldCheck, Trash2, FileText, X, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export type AdminUser = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  banned_until?: string;
  resumeCount: number;
};

type Resume = {
  id: string;
  title: string;
  template_id: string;
  content_json: Record<string, any>;
  created_at: string;
  updated_at: string;
};

function ResumeDataModal({
  user,
  onClose,
}: {
  user: AdminUser;
  onClose: () => void;
}) {
  const [resumes, setResumes] = useState<Resume[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch on mount
  useState(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(`/api/admin/resumes?userId=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");
        setResumes(data.resumes);
        if (data.resumes.length > 0) setExpandedId(data.resumes[0].id);
      } catch (err: any) {
        setError(err.message);
        toast({ title: "Error", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  });

  const templateBadgeColors: Record<string, string> = {
    modern: "bg-blue-100 text-blue-700",
    classic: "bg-amber-100 text-amber-700",
    minimal: "bg-slate-100 text-slate-700",
    bold: "bg-purple-100 text-purple-700",
    executive: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Resume Data
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 transition-colors text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {loading && (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading resume data…</span>
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-16 text-red-500 text-sm">{error}</div>
          )}

          {!loading && !error && resumes && resumes.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-sm">
              This user has no resumes yet.
            </div>
          )}

          {!loading &&
            !error &&
            resumes?.map((resume) => {
              const isOpen = expandedId === resume.id;
              return (
                <div
                  key={resume.id}
                  className="border border-slate-200 rounded-xl overflow-hidden"
                >
                  {/* Resume header row */}
                  <button
                    onClick={() => setExpandedId(isOpen ? null : resume.id)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-800 text-sm truncate">
                        {resume.title || "Untitled Resume"}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 ${
                          templateBadgeColors[resume.template_id] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {resume.template_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="text-xs text-slate-400 hidden sm:block">
                        Updated {new Date(resume.updated_at).toLocaleDateString()}
                      </span>
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* JSON content */}
                  {isOpen && (
                    <div className="bg-slate-900 text-slate-100 text-xs leading-relaxed overflow-x-auto">
                      <pre className="p-4 whitespace-pre-wrap break-words font-mono">
                        {JSON.stringify(resume.content_json, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 shrink-0 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {resumes ? `${resumes.length} resume${resumes.length !== 1 ? "s" : ""}` : ""}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UsersTable({ users }: { users: AdminUser[] }) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [viewingResumesUser, setViewingResumesUser] = useState<AdminUser | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleAction = async (action: "ban" | "unban" | "delete", userId: string) => {
    if (action === "delete" && !confirm("Are you sure you want to delete this user? This cannot be undone.")) {
      return;
    }

    setLoadingAction(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, targetUserId: userId }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Action failed");

      toast({
        title: "Success",
        description: data.message,
      });

      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      {/* Resume Data Modal */}
      {viewingResumesUser && (
        <ResumeDataModal
          user={viewingResumesUser}
          onClose={() => setViewingResumesUser(null)}
        />
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">User Email</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Resumes</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Signup Date</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Last Login</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {users.length > 0 ? (
                users.map((u) => {
                  const isBanned = !!u.banned_until;
                  const isLoading = loadingAction === u.id;

                  return (
                    <tr key={u.id} className={`hover:bg-slate-50/50 ${isLoading ? "opacity-50" : ""}`}>
                      <td className="py-4 px-6 font-medium text-slate-700">
                        {u.email}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${isBanned ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                          {isBanned ? "Banned" : "Active"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setViewingResumesUser(u)}
                          className="flex items-center gap-1.5 font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          title="View resume data"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          {u.resumeCount}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                        {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "Never"}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger disabled={isLoading} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <MoreVertical className="w-4 h-4 text-slate-500" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setViewingResumesUser(u)}
                              className="cursor-pointer text-blue-600 focus:text-blue-700"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View Resumes Data
                            </DropdownMenuItem>
                            {isBanned ? (
                              <DropdownMenuItem onClick={() => handleAction("unban", u.id)} className="cursor-pointer text-green-600 focus:text-green-700">
                                <ShieldCheck className="w-4 h-4 mr-2" />
                                Unban User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleAction("ban", u.id)} className="cursor-pointer text-orange-600 focus:text-orange-700">
                                <ShieldBan className="w-4 h-4 mr-2" />
                                Ban User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleAction("delete", u.id)} className="cursor-pointer text-red-600 focus:text-red-700">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
