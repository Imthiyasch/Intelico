"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Loader2, Save, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { BoldTemplate } from "@/components/templates/BoldTemplate";
import { ExecutiveTemplate } from "@/components/templates/ExecutiveTemplate";
import { ResumeData, TemplateId, TEMPLATES, EMPTY_RESUME } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";

export default function PreviewPage() {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(EMPTY_RESUME);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("modern");
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [resumeTitle, setResumeTitle] = useState("My Resume");
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingDoc, setDownloadingDoc] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("intellico_resume");
    const storedTemplate = localStorage.getItem("intellico_template") as TemplateId | null;
    const storedId = localStorage.getItem("intellico_resume_id");
    const storedTitle = localStorage.getItem("intellico_resume_title");
    if (stored) { try { setResumeData(JSON.parse(stored)); } catch {} }
    if (storedTemplate) setSelectedTemplate(storedTemplate);
    if (storedId) setResumeId(storedId);
    if (storedTitle) setResumeTitle(storedTitle);
  }, []);

  const handleTemplateChange = (id: TemplateId) => {
    setSelectedTemplate(id);
    localStorage.setItem("intellico_template", id);
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;
    setDownloadingPdf(true);
    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgRatio = canvas.height / canvas.width;
      const imgH = pageWidth * imgRatio;
      
      if (imgH <= pageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgH);
      } else {
        let position = 0;
        let remainingHeight = imgH;
        while (remainingHeight > 0) {
          pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgH);
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

  const TemplateComponent = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    bold: BoldTemplate,
    executive: ExecutiveTemplate,
  }[selectedTemplate];

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
                Edit
              </Link>
              <div>
                <h1 className="font-display text-2xl font-bold">{resumeTitle}</h1>
                <p className="text-slate-500 text-sm">Preview & Download</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" onClick={handleSave} loading={saving}>
                {saved ? <><Check className="w-4 h-4 text-green-400" /> Saved!</> : <><Save className="w-4 h-4" /> Save</>}
              </Button>
              <Button variant="secondary" size="sm" onClick={handleDownloadDocx} loading={downloadingDoc}>
                <FileText className="w-4 h-4" />
                Word
              </Button>
              <Button variant="primary" size="sm" onClick={handleDownloadPdf} loading={downloadingPdf}>
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Template Switcher Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="glass rounded-2xl p-4 sticky top-24 border border-slate-200">
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Templates</h2>
                <div className="space-y-2">
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
                      {/* Mini preview */}
                      <div className="w-10 h-12 rounded bg-white/90 flex-shrink-0 overflow-hidden">
                        <div className="w-full h-full scale-75 origin-top-left" style={{ transform: "scale(0.3)", transformOrigin: "top left", width: "333%", height: "333%" }}>
                          <div className="bg-white h-full">
                            {tmpl.id === "bold" && <div className="h-5 bg-gray-900" />}
                            {tmpl.id === "modern" && <div className="h-3 bg-blue-600" />}
                            <div className="p-1 space-y-0.5">
                              <div className="h-2 bg-gray-300 rounded w-2/3" />
                              <div className="h-1 bg-gray-200 rounded w-full" />
                              <div className="h-1 bg-gray-100 rounded w-3/4" />
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

                <div className="mt-6 pt-4 border-t border-slate-200">
                  <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Download</h2>
                  <div className="space-y-2">
                    <button onClick={handleDownloadPdf} disabled={downloadingPdf} className="w-full btn-primary !py-2.5 text-xs justify-center">
                      {downloadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                      PDF
                    </button>
                    <button onClick={handleDownloadDocx} disabled={downloadingDoc} className="w-full btn-secondary !py-2.5 text-xs justify-center">
                      {downloadingDoc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                      Word (.docx)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Preview */}
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-[794px]">
                <div className="text-xs text-slate-500 text-center mb-4">A4 Preview — actual PDF will be crisp</div>
                <div
                  ref={previewRef}
                  className="bg-white shadow-2xl rounded-sm overflow-hidden"
                  style={{ minHeight: "1056px" }}
                >
                  <TemplateComponent data={resumeData} />
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
