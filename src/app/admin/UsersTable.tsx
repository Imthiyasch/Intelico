"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  MoreVertical, ShieldBan, ShieldCheck, Trash2,
  FileText, X, Loader2, LayoutTemplate, Table2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ResumeData } from "@/lib/types";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { BoldTemplate } from "@/components/templates/BoldTemplate";
import { ExecutiveTemplate } from "@/components/templates/ExecutiveTemplate";

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
  content_json: ResumeData;
  created_at: string;
  updated_at: string;
};

const TEMPLATE_MAP: Record<string, React.ComponentType<{ data: ResumeData }>> = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  bold: BoldTemplate,
  executive: ExecutiveTemplate,
};

const TEMPLATE_BADGE: Record<string, string> = {
  modern: "bg-blue-100 text-blue-700",
  classic: "bg-amber-100 text-amber-700",
  minimal: "bg-slate-100 text-slate-700",
  bold: "bg-purple-100 text-purple-700",
  executive: "bg-emerald-100 text-emerald-700",
};

// ---------- Structured data table view ----------
function DataTableView({ resume }: { resume: Resume }) {
  const d = resume.content_json;
  const pi = d?.personalInfo || {};

  return (
    <div className="space-y-6 p-1">
      {/* Personal Info */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Personal Info</h3>
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              {[
                ["Name", pi.name],
                ["Email", pi.email],
                ["Phone", pi.phone],
                ["Location", pi.location],
                ["LinkedIn", pi.linkedin],
                ["Portfolio", pi.portfolio],
              ].filter(([, v]) => v).map(([k, v]) => (
                <tr key={k} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 font-medium text-slate-500 w-32 shrink-0">{k}</td>
                  <td className="px-4 py-2.5 text-slate-800 break-all">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Summary */}
      {d?.summary && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Summary</h3>
          <div className="border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed">{d.summary}</div>
        </section>
      )}

      {/* Experience */}
      {d?.experience?.length > 0 && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Experience</h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Role</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Company</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 hidden sm:table-cell">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {d.experience.map((exp, i) => (
                  <tr key={i} className="hover:bg-slate-50 align-top">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{exp.role}</td>
                    <td className="px-4 py-2.5 text-slate-600">{exp.company}</td>
                    <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap hidden sm:table-cell">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Education */}
      {d?.education?.length > 0 && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Education</h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Degree</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Institution</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 hidden sm:table-cell">Years</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {d.education.map((edu, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{edu.degree} {edu.field && `in ${edu.field}`}</td>
                    <td className="px-4 py-2.5 text-slate-600">{edu.institution}</td>
                    <td className="px-4 py-2.5 text-slate-500 hidden sm:table-cell">{edu.startYear} – {edu.endYear}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Skills */}
      {d?.skills?.length > 0 && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {d.skills.map((s, i) => (
              <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">{s}</span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {d?.projects && d.projects.length > 0 && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Projects</h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Name</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 hidden sm:table-cell">Tech Stack</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {d.projects.map((proj, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{proj.name}</td>
                    <td className="px-4 py-2.5 text-slate-500 hidden sm:table-cell">{proj.technologies?.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Certifications */}
      {d?.certifications && d.certifications.length > 0 && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Certifications</h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Name</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Issuer</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {d.certifications.map((cert, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{cert.name}</td>
                    <td className="px-4 py-2.5 text-slate-600">{cert.issuer}</td>
                    <td className="px-4 py-2.5 text-slate-500 hidden sm:table-cell">{cert.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Achievements */}
      {d?.achievements && d.achievements.length > 0 && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Achievements</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
            {d.achievements.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </section>
      )}

      {/* Languages & Tools */}
      {((d?.languages?.length ?? 0) > 0 || (d?.tools?.length ?? 0) > 0) && (
        <section>
          <div className="grid grid-cols-2 gap-4">
            {d?.languages && d.languages.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Languages</h3>
                <div className="flex flex-wrap gap-1.5">
                  {d.languages.map((l, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">{l}</span>
                  ))}
                </div>
              </div>
            )}
            {d?.tools && d.tools.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Tools</h3>
                <div className="flex flex-wrap gap-1.5">
                  {d.tools.map((t, i) => (
                    <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

// ---------- Modal ----------
function ResumeDataModal({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const [resumes, setResumes] = useState<Resume[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<"preview" | "data">("preview");
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
        if (data.resumes.length > 0) setSelectedId(data.resumes[0].id);
      } catch (err: any) {
        setError(err.message);
        toast({ title: "Error", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  });

  const selected = resumes?.find((r) => r.id === selectedId) ?? null;
  const TemplateComponent = selected ? (TEMPLATE_MAP[selected.template_id] ?? ModernTemplate) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-slate-900 text-sm truncate">{user.email}</p>
              <p className="text-xs text-slate-400">{resumes ? `${resumes.length} resume${resumes.length !== 1 ? "s" : ""}` : ""}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors text-slate-500 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading && (
          <div className="flex-1 flex items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading resumes…</span>
          </div>
        )}
        {error && !loading && (
          <div className="flex-1 flex items-center justify-center text-red-500 text-sm">{error}</div>
        )}
        {!loading && !error && resumes?.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">This user has no resumes yet.</div>
        )}

        {!loading && !error && resumes && resumes.length > 0 && (
          <div className="flex flex-1 min-h-0">
            {/* Left sidebar — resume list */}
            <div className="w-52 shrink-0 border-r border-slate-100 bg-slate-50 overflow-y-auto flex flex-col">
              <p className="px-3 pt-3 pb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Resumes</p>
              {resumes.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`text-left px-3 py-2.5 border-b border-slate-100 transition-colors ${selectedId === r.id ? "bg-blue-50 border-l-2 border-l-blue-500" : "hover:bg-white"}`}
                >
                  <p className={`text-xs font-semibold truncate ${selectedId === r.id ? "text-blue-700" : "text-slate-700"}`}>
                    {r.title || "Untitled"}
                  </p>
                  <p className={`text-[10px] capitalize mt-0.5 ${TEMPLATE_BADGE[r.template_id] ? "" : "text-slate-400"}`}>
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${TEMPLATE_BADGE[r.template_id] ?? "bg-slate-100 text-slate-500"}`}>
                      {r.template_id}
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{new Date(r.updated_at).toLocaleDateString()}</p>
                </button>
              ))}
            </div>

            {/* Right panel */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              {/* Tab bar */}
              <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-100 bg-white shrink-0">
                <button
                  onClick={() => setTab("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${tab === "preview" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}
                >
                  <LayoutTemplate className="w-3.5 h-3.5" />
                  Resume Preview
                </button>
                <button
                  onClick={() => setTab("data")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${tab === "data" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}
                >
                  <Table2 className="w-3.5 h-3.5" />
                  Data Table
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {selected && tab === "preview" && TemplateComponent && (
                  <div className="p-6 bg-slate-100 min-h-full">
                    <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-[800px] mx-auto scale-[0.85] origin-top">
                      <TemplateComponent data={selected.content_json} />
                    </div>
                  </div>
                )}
                {selected && tab === "data" && (
                  <div className="p-6">
                    <DataTableView resume={selected} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end">
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

// ---------- Main Table ----------
export default function UsersTable({ users }: { users: AdminUser[] }) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [viewingResumesUser, setViewingResumesUser] = useState<AdminUser | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleAction = async (action: "ban" | "unban" | "delete", userId: string) => {
    if (action === "delete" && !confirm("Are you sure you want to delete this user? This cannot be undone.")) return;

    setLoadingAction(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, targetUserId: userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");
      toast({ title: "Success", description: data.message });
      router.refresh();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      {viewingResumesUser && (
        <ResumeDataModal user={viewingResumesUser} onClose={() => setViewingResumesUser(null)} />
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
                      <td className="py-4 px-6 font-medium text-slate-700">{u.email}</td>
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
                      <td className="py-4 px-6 text-slate-500 whitespace-nowrap">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                        {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "Never"}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger disabled={isLoading} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <MoreVertical className="w-4 h-4 text-slate-500" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewingResumesUser(u)} className="cursor-pointer text-blue-600 focus:text-blue-700">
                              <FileText className="w-4 h-4 mr-2" />
                              View Resumes
                            </DropdownMenuItem>
                            {isBanned ? (
                              <DropdownMenuItem onClick={() => handleAction("unban", u.id)} className="cursor-pointer text-green-600 focus:text-green-700">
                                <ShieldCheck className="w-4 h-4 mr-2" /> Unban User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleAction("ban", u.id)} className="cursor-pointer text-orange-600 focus:text-orange-700">
                                <ShieldBan className="w-4 h-4 mr-2" /> Ban User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleAction("delete", u.id)} className="cursor-pointer text-red-600 focus:text-red-700">
                              <Trash2 className="w-4 h-4 mr-2" /> Delete User
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
