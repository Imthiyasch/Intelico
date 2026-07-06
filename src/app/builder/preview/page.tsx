"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Loader2, Save, Check, Mail, Share2, Eye, EyeOff, Sliders } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { BoldTemplate } from "@/components/templates/BoldTemplate";
import { ExecutiveTemplate } from "@/components/templates/ExecutiveTemplate";
import { ResumeData, TemplateId, TEMPLATES, EMPTY_RESUME } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";

type SidebarTab = "templates" | "sections" | "edit";

export default function PreviewPage() {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(EMPTY_RESUME);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("modern");
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [resumeTitle, setResumeTitle] = useState("My Resume");
  
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>("templates");

  // Visibility States for sections
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    achievements: true,
    languages: true,
    certifications: true,
    tools: true,
    references: true,
  });

  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingDoc, setDownloadingDoc] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [emailing, setEmailing] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("intellico_resume");
    const storedTemplate = localStorage.getItem("intellico_template") as TemplateId | null;
    const storedId = localStorage.getItem("intellico_resume_id");
    const storedTitle = localStorage.getItem("intellico_resume_title");
    if (stored) { try { setResumeData(JSON.parse(stored)); } catch {} }
    if (storedTemplate) setSelectedTemplate(storedTemplate);
    if (storedId) setResumeId(storedId);
    if (storedTitle) setResumeTitle(storedTitle);

    const storedVisibility = localStorage.getItem("intellico_visibility");
    if (storedVisibility) {
      try { setVisibleSections(JSON.parse(storedVisibility)); } catch {}
    }
  }, []);

  const handleTemplateChange = (id: TemplateId) => {
    setSelectedTemplate(id);
    localStorage.setItem("intellico_template", id);
  };

  const handleVisibilityToggle = (section: string) => {
    const updated = { ...visibleSections, [section]: !visibleSections[section] };
    setVisibleSections(updated);
    localStorage.setItem("intellico_visibility", JSON.stringify(updated));
  };

  const handleFieldChange = (section: string, field: string, value: string) => {
    setResumeData(prev => {
      let updated = { ...prev };
      if (section === "personalInfo") {
        updated.personalInfo = { ...prev.personalInfo, [field]: value };
      } else if (section === "summary") {
        updated.summary = value;
      } else if (section === "references") {
        updated.references = value;
      }
      localStorage.setItem("intellico_resume", JSON.stringify(updated));
      return updated;
    });
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    setDownloadingPdf(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.8);
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgRatio = canvas.height / canvas.width;
      const imgH = pageWidth * imgRatio;
      
      if (imgH <= pageHeight) {
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, imgH);
      } else {
        let position = 0;
        let remainingHeight = imgH;
        while (remainingHeight > 0) {
          pdf.addImage(imgData, "JPEG", 0, position, pageWidth, imgH);
          remainingHeight -= pageHeight;
          position -= pageHeight;
          if (remainingHeight > 0) pdf.addPage();
        }
      }
      pdf.save(`${resumeTitle.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("PDF error:", err);
      alert("PDF download failed. Please try again.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    setDownloadingDoc(true);
    try {
      const res = await fetch("/api/export-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, templateId: selectedTemplate, title: resumeTitle }),
      });
      if (!res.ok) throw new Error("DOCX generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resumeTitle.replace(/\s+/g, "_")}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Word export failed. Please try again.");
    } finally {
      setDownloadingDoc(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth"); return; }

    const payload = {
      user_id: user.id,
      title: resumeTitle,
      content_json: resumeData,
      template_id: selectedTemplate,
    };

    if (resumeId) {
      await supabase.from("resumes").update(payload).eq("id", resumeId);
    } else {
      const { data } = await supabase.from("resumes").insert(payload).select().single();
      if (data) {
        setResumeId(data.id);
        localStorage.setItem("intellico_resume_id", data.id);
      }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleEmailCopy = async () => {
    setEmailing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) {
        alert("Please log in to email your resume.");
        return;
      }
      
      // Auto save to ensure we have a resume ID
      await handleSave();
      
      const shareUrl = `${window.location.origin}/share/${resumeId || "temp"}`;
      const res = await fetch("/api/email-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          resumeTitle,
          resumeUrl: shareUrl
        })
      });
      
      if (res.ok) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 3000);
      }
    } catch {
      alert("Failed to email resume.");
    } finally {
      setEmailing(false);
    }
  };

  const handleShareLink = async () => {
    setSharing(true);
    try {
      await handleSave();
      const shareUrl = `${window.location.origin}/share/${resumeId}`;
      await navigator.clipboard.writeText(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    } catch {
      alert("Failed to copy link.");
    } finally {
      setSharing(false);
    }
  };

  const TemplateComponent = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    bold: BoldTemplate,
    executive: ExecutiveTemplate,
  }[selectedTemplate];

  // Filtering out hidden sections
  const filteredData: ResumeData = {
    ...resumeData,
    summary: visibleSections.summary ? resumeData.summary : "",
    experience: visibleSections.experience ? resumeData.experience : [],
    education: visibleSections.education ? resumeData.education : [],
    skills: visibleSections.skills ? resumeData.skills : [],
    projects: visibleSections.projects ? resumeData.projects : [],
    achievements: visibleSections.achievements ? resumeData.achievements : [],
    languages: visibleSections.languages ? resumeData.languages : [],
    certifications: visibleSections.certifications ? resumeData.certifications : [],
    tools: visibleSections.tools ? resumeData.tools : [],
    references: visibleSections.references ? resumeData.references : "",
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="pt-20 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-3">
              <Link href="/builder" className="btn-ghost">
                <ArrowLeft className="w-4 h-4" />
                Back to Edit
              </Link>
              <div>
                <input
                  type="text"
                  value={resumeTitle}
                  onChange={(e) => {
                    setResumeTitle(e.target.value);
                    localStorage.setItem("intellico_resume_title", e.target.value);
                  }}
                  className="font-display text-2xl font-bold bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none"
                />
                <p className="text-slate-500 text-sm">Preview & Tailoring Panel</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" onClick={handleSave} loading={saving}>
                {saved ? <><Check className="w-4 h-4 text-green-400" /> Saved!</> : <><Save className="w-4 h-4" /> Save</>}
              </Button>
              <Button variant="secondary" size="sm" onClick={handleShareLink} loading={sharing}>
                {shared ? <><Check className="w-4 h-4 text-green-400" /> Copied link!</> : <><Share2 className="w-4 h-4" /> Share Link</>}
              </Button>
              <Button variant="secondary" size="sm" onClick={handleEmailCopy} loading={emailing}>
                {emailSent ? <><Check className="w-4 h-4 text-green-400" /> Emailed!</> : <><Mail className="w-4 h-4" /> Email Copy</>}
              </Button>
              <Button variant="primary" size="sm" onClick={handleDownloadPdf} loading={downloadingPdf}>
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Split controls sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="glass rounded-2xl p-4 sticky top-24 border border-slate-200 space-y-6">
                
                {/* Tabs Selector */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveSidebarTab("templates")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${activeSidebarTab === "templates" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"}`}
                  >
                    Templates
                  </button>
                  <button
                    onClick={() => setActiveSidebarTab("sections")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${activeSidebarTab === "sections" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"}`}
                  >
                    Sections
                  </button>
                  <button
                    onClick={() => setActiveSidebarTab("edit")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${activeSidebarTab === "edit" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"}`}
                  >
                    Quick Edit
                  </button>
                </div>

                {/* Tab: Templates */}
                {activeSidebarTab === "templates" && (
                  <div className="space-y-3">
                    <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Select Layout</h2>
                    <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                      {TEMPLATES.map((tmpl) => (
                        <button
                          key={tmpl.id}
                          onClick={() => handleTemplateChange(tmpl.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                            selectedTemplate === tmpl.id
                              ? "bg-blue-50 border border-blue-200 text-blue-700"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                          }`}
                        >
                          <div className="w-10 h-12 rounded bg-white/90 flex-shrink-0 overflow-hidden shadow-sm">
                            <div className="w-full h-full scale-75 origin-top-left" style={{ transform: "scale(0.3)", transformOrigin: "top left", width: "333%", height: "333%" }}>
                              <div className="bg-white h-full">
                                {tmpl.id === "bold" && <div className="h-5 bg-gray-900" />}
                                {tmpl.id === "modern" && <div className="h-3 bg-blue-600" />}
                                <div className="p-1 space-y-0.5">
                                  <div className="h-2 bg-gray-300 rounded w-2/3" />
                                  <div className="h-1 bg-gray-200 rounded w-full" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{tmpl.name}</div>
                            <div className="text-xs text-slate-500">{tmpl.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Sections */}
                {activeSidebarTab === "sections" && (
                  <div className="space-y-4">
                    <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5" /> Show / Hide Sections
                    </h2>
                    <div className="space-y-2">
                      {Object.keys(visibleSections).map((sec) => (
                        <button
                          key={sec}
                          onClick={() => handleVisibilityToggle(sec)}
                          className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-left transition-all"
                        >
                          <span className="text-xs font-medium capitalize text-slate-700">{sec === "personalInfo" ? "Personal Info" : sec}</span>
                          {visibleSections[sec] ? (
                            <Eye className="w-4 h-4 text-blue-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Quick Edit */}
                {activeSidebarTab === "edit" && (
                  <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                    <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">In-Place Quick Fields</h2>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Full Name</label>
                        <input
                          type="text"
                          value={resumeData.personalInfo.name}
                          onChange={(e) => handleFieldChange("personalInfo", "name", e.target.value)}
                          className="w-full p-2 text-xs border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Email</label>
                        <input
                          type="email"
                          value={resumeData.personalInfo.email}
                          onChange={(e) => handleFieldChange("personalInfo", "email", e.target.value)}
                          className="w-full p-2 text-xs border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Phone</label>
                        <input
                          type="text"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => handleFieldChange("personalInfo", "phone", e.target.value)}
                          className="w-full p-2 text-xs border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Location</label>
                        <input
                          type="text"
                          value={resumeData.personalInfo.location}
                          onChange={(e) => handleFieldChange("personalInfo", "location", e.target.value)}
                          className="w-full p-2 text-xs border rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Professional Summary</label>
                        <textarea
                          rows={4}
                          value={resumeData.summary}
                          onChange={(e) => handleFieldChange("summary", "summary", e.target.value)}
                          className="w-full p-2 text-xs border rounded-lg focus:outline-none focus:border-blue-500 resize-y"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">References</label>
                        <textarea
                          rows={3}
                          value={resumeData.references}
                          onChange={(e) => handleFieldChange("references", "references", e.target.value)}
                          className="w-full p-2 text-xs border rounded-lg focus:outline-none focus:border-blue-500 resize-y"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick actions strip */}
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Export</h2>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={handleDownloadPdf} disabled={downloadingPdf} className="btn-primary !py-2.5 text-xs justify-center flex items-center gap-1.5">
                      {downloadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                      PDF
                    </button>
                    <button onClick={handleDownloadDocx} disabled={downloadingDoc} className="btn-secondary !py-2.5 text-xs justify-center flex items-center gap-1.5">
                      {downloadingDoc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                      Word
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Resume Preview */}
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-[794px]">
                <div className="text-xs text-slate-500 text-center mb-4">A4 Preview — changes reflect instantly</div>
                <div
                  ref={previewRef}
                  className="bg-white shadow-2xl rounded-sm overflow-hidden"
                  style={{ minHeight: "1056px" }}
                >
                  <TemplateComponent data={filteredData} />
                </div>
                <div className="text-xs text-slate-500 text-center mt-4 flex items-center justify-center gap-4">
                  <span>✓ ATS-Safe Format</span>
                  <span>·</span>
                  <span>✓ Single Column</span>
                  <span>·</span>
                  <span>✓ No Tables / Images</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
