"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, FileText, Trash2, Eye, Edit, Download, Loader2, Zap, LayoutDashboard } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";
import { Resume, TEMPLATES } from "@/lib/types";
import { truncate } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string; id?: string } | null>(null);
  const [profile, setProfile] = useState<{ name?: string; plan?: string } | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push("/auth");
        return;
      }
      setUser({ email: data.user.email, id: data.user.id });
      
      const { data: profileData } = await supabase
        .from("users")
        .select("name, plan")
        .eq("id", data.user.id)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }
      
      fetchResumes(data.user.id);
    });
  }, [router]);

  const fetchResumes = async (userId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setResumes(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resume? This cannot be undone.")) return;
    setDeleting(id);
    await supabase.from("resumes").delete().eq("id", id);
    setResumes((prev) => prev.filter((r) => r.id !== id));
    setDeleting(null);
  };

  const handleEdit = (resume: Resume) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("intellico_resume", JSON.stringify(resume.content_json));
      localStorage.setItem("intellico_template", resume.template_id);
      localStorage.setItem("intellico_resume_id", resume.id || "");
      localStorage.setItem("intellico_resume_title", resume.title);
    }
    router.push("/builder");
  };

  const handlePreview = (resume: Resume) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("intellico_resume", JSON.stringify(resume.content_json));
      localStorage.setItem("intellico_template", resume.template_id);
    }
    router.push("/builder/preview");
  };

  const getTemplateName = (id: string) => TEMPLATES.find((t) => t.id === id)?.name || id;

  if (!user && loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <LayoutDashboard className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-slate-500 font-medium">Dashboard</span>
              </div>
              <h1 className="font-display text-3xl font-bold">My Resumes</h1>
              <div className="text-slate-500 text-sm mt-1 flex items-center flex-wrap gap-2">
                <span>{profile?.name ? `${profile.name} (${user?.email})` : user?.email}</span>
                <span>·</span>
                <span className="badge-brand text-xs capitalize">
                  {profile?.plan || "free"} Plan
                </span>
                <Link href="/pricing" className="text-blue-600 hover:text-blue-700 font-semibold text-xs hover:underline flex items-center gap-0.5 ml-2">
                  Upgrade Plan & Billing →
                </Link>
              </div>
            </div>
            <Link
              href="/builder"
              className="btn-primary"
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.removeItem("intellico_resume");
                  localStorage.removeItem("intellico_template");
                  localStorage.removeItem("intellico_resume_id");
                  localStorage.removeItem("intellico_resume_title");
                }
              }}
            >
              <Plus className="w-4 h-4" />
              New Resume
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Total Resumes", value: resumes.length, icon: FileText },
              { label: "Plan", value: profile?.plan ? profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1) : "Free", icon: Zap },
              { label: "Downloads", value: "—", icon: Download },
              { label: "ATS Score", value: "—", icon: Eye },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4 flex items-center gap-3 border border-slate-200">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                  <stat.icon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumes Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass rounded-2xl h-48 shimmer-bg" />
              ))}
            </div>
          ) : resumes.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 border border-blue-100">
                <FileText className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-3">No resumes yet</h2>
              <p className="text-slate-500 text-sm max-w-sm mb-8">
                Create your first ATS-optimized resume. It takes less than 5 minutes with AI assistance.
              </p>
              <Link href="/builder" className="btn-primary">
                <Plus className="w-4 h-4" />
                Create Your First Resume
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <div key={resume.id} className="glass rounded-2xl p-6 group border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all">
                  {/* Preview mockup */}
                  <div className="h-32 rounded-xl bg-slate-50 border border-slate-200 mb-4 flex flex-col gap-2 p-4 overflow-hidden">
                    <div className="h-3 bg-slate-300 rounded w-2/3" />
                    <div className="h-2 bg-slate-200 rounded w-full" />
                    <div className="h-2 bg-slate-200 rounded w-4/5" />
                    <div className="h-px bg-slate-200" />
                    <div className="h-2 bg-slate-200 rounded w-1/3" />
                    <div className="h-2 bg-slate-200 rounded w-full" />
                  </div>

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-base leading-snug">
                        {truncate(resume.title, 35)}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="badge-brand text-xs">{getTemplateName(resume.template_id)}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(resume.created_at || "").toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(resume)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-200 hover:border-slate-300"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handlePreview(resume)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-200 hover:border-slate-300"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>
                    <button
                      onClick={() => resume.id && handleDelete(resume.id)}
                      disabled={deleting === resume.id}
                      className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-slate-200 hover:border-red-200"
                      aria-label="Delete resume"
                    >
                      {deleting === resume.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {/* Add new card */}
              <Link
                href="/builder"
                className="glass rounded-2xl p-6 border-dashed border-slate-300 flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50/50 transition-all group min-h-[200px]"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("intellico_resume");
                    localStorage.removeItem("intellico_template");
                    localStorage.removeItem("intellico_resume_id");
                    localStorage.removeItem("intellico_resume_title");
                  }
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors border border-blue-100">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-500 group-hover:text-blue-700">New Resume</span>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
