"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Plus, Trash2, Sparkles, Loader2, ChevronDown, ChevronUp, Save, Eye } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { ResumeData, ExperienceItem, EducationItem, EMPTY_RESUME } from "@/lib/types";
import { generateId } from "@/lib/utils";

type Tab = "upload" | "manual" | "ats-match";

export default function BuilderPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("manual");
  const [resumeData, setResumeData] = useState<ResumeData>(EMPTY_RESUME);
  const [resumeTitle, setResumeTitle] = useState("My Resume");
  const [resumeId, setResumeId] = useState<string | null>(null);

  // Upload states
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  // AI optimize states
  const [optimizing, setOptimizing] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  // Save states
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ATS & Tailoring states
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [tailoring, setTailoring] = useState(false);
  const [atsResult, setAtsResult] = useState<{
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    suggestions: string[];
  } | null>(null);
  const [atsError, setAtsError] = useState("");

  // Expanded sections
  const [expandedExp, setExpandedExp] = useState<string[]>([]);

  useEffect(() => {
    // Load from localStorage if editing existing resume
    const stored = localStorage.getItem("intellico_resume");
    const storedId = localStorage.getItem("intellico_resume_id");
    const storedTitle = localStorage.getItem("intellico_resume_title");
    if (stored) {
      try { setResumeData(JSON.parse(stored)); } catch {}
    }
    if (storedId) setResumeId(storedId);
    if (storedTitle) setResumeTitle(storedTitle);
  }, []);

  // Update localStorage on every change
  useEffect(() => {
    localStorage.setItem("intellico_resume", JSON.stringify(resumeData));
  }, [resumeData]);

  // ── Personal Info ──────────────────────────────────────────────────────
  const updatePersonal = (field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  // ── Experience ─────────────────────────────────────────────────────────
  const addExperience = () => {
    const id = generateId();
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id, company: "", role: "", startDate: "", endDate: "", current: false, bullets: [""] },
      ],
    }));
    setExpandedExp((prev) => [...prev, id]);
  };

  const updateExperience = (id: string, field: string, value: unknown) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const updateBullet = (expId: string, idx: number, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => {
        if (exp.id !== expId) return exp;
        const bullets = [...exp.bullets];
        bullets[idx] = value;
        return { ...exp, bullets };
      }),
    }));
  };

  const addBullet = (expId: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === expId ? { ...exp, bullets: [...exp.bullets, ""] } : exp
      ),
    }));
  };

  const removeBullet = (expId: string, idx: number) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => {
        if (exp.id !== expId) return exp;
        const bullets = exp.bullets.filter((_, i) => i !== idx);
        return { ...exp, bullets: bullets.length ? bullets : [""] };
      }),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((e) => e.id !== id),
    }));
  };

  // ── Education ──────────────────────────────────────────────────────────
  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: generateId(), institution: "", degree: "", field: "", startYear: "", endYear: "", gpa: "" },
      ],
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  // ── Skills ─────────────────────────────────────────────────────────────
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !resumeData.skills.includes(trimmed)) {
      setResumeData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  // ── Projects ───────────────────────────────────────────────────────────
  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        { id: generateId(), name: "", description: "", technologies: [], link: "" },
      ],
    }));
  };

  const updateProject = (id: string, field: string, value: unknown) => {
    setResumeData((prev) => ({
      ...prev,
      projects: (prev.projects || []).map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((p) => p.id !== id),
    }));
  };

  // ── Achievements ───────────────────────────────────────────────────────
  const addAchievement = () => {
    setResumeData((prev) => ({
      ...prev,
      achievements: [...(prev.achievements || []), ""],
    }));
  };

  const updateAchievement = (idx: number, value: string) => {
    setResumeData((prev) => {
      const achievements = [...(prev.achievements || [])];
      achievements[idx] = value;
      return { ...prev, achievements };
    });
  };

  const removeAchievement = (idx: number) => {
    setResumeData((prev) => ({
      ...prev,
      achievements: (prev.achievements || []).filter((_, i) => i !== idx),
    }));
  };

  // ── Languages ──────────────────────────────────────────────────────────
  const addLanguage = () => {
    const trimmed = languageInput.trim();
    if (trimmed && !(resumeData.languages || []).includes(trimmed)) {
      setResumeData((prev) => ({
        ...prev,
        languages: [...(prev.languages || []), trimmed],
      }));
      setLanguageInput("");
    }
  };

  const removeLanguage = (lang: string) => {
    setResumeData((prev) => ({
      ...prev,
      languages: (prev.languages || []).filter((l) => l !== lang),
    }));
  };

  // ── AI Optimize ────────────────────────────────────────────────────────
  const handleOptimize = async () => {
    setOptimizing(true);
    try {
      const res = await fetch("/api/optimize-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData }),
      });
      const json = await res.json();
      if (json.resumeData) {
        setResumeData(json.resumeData);
        localStorage.setItem("intellico_resume", JSON.stringify(json.resumeData));
      }
    } catch {
      alert("AI optimization failed. Please check your OpenAI API key.");
    } finally {
      setOptimizing(false);
    }
  };

  // ── CV Upload & Parse ──────────────────────────────────────────────────
  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadFile(file);
  }, []);

  const handleParseCv = async () => {
    if (!uploadFile) return;
    setParsing(true);
    setParseError("");
    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const res = await fetch("/api/parse-cv", { method: "POST", body: formData });
      const json = await res.json();
      if (json.resumeData) {
        setResumeData(json.resumeData);
        setActiveTab("manual");
      } else {
        setParseError(json.error || "Failed to parse CV. Try again.");
      }
    } catch {
      setParseError("Network error. Please try again.");
    } finally {
      setParsing(false);
    }
  };

  // ── ATS Match & Tailor ──────────────────────────────────────────────────
  const handleAnalyzeAts = async () => {
    if (!jobDescription.trim()) return;
    setAnalyzing(true);
    setAtsError("");
    setAtsResult(null);
    try {
      const res = await fetch("/api/analyze-ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, jobDescription }),
      });
      const json = await res.json();
      if (res.ok) {
        setAtsResult(json);
      } else {
        setAtsError(json.error || "Failed to analyze resume. Try again.");
      }
    } catch {
      setAtsError("Network error. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTailorResume = async () => {
    if (!jobDescription.trim()) return;
    setTailoring(true);
    setAtsError("");
    try {
      const res = await fetch("/api/tailor-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, jobDescription }),
      });
      const json = await res.json();
      if (res.ok && json.resumeData) {
        setResumeData(json.resumeData);
        localStorage.setItem("intellico_resume", JSON.stringify(json.resumeData));
        alert("Success! Your resume has been tailored to the job description.");
        // Re-analyze after tailoring to show improvement!
        const reAnalyzeRes = await fetch("/api/analyze-ats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeData: json.resumeData, jobDescription }),
        });
        const reAnalyzeJson = await reAnalyzeRes.json();
        if (reAnalyzeRes.ok) {
          setAtsResult(reAnalyzeJson);
        }
      } else {
        setAtsError(json.error || "Failed to tailor resume. Try again.");
      }
    } catch {
      setAtsError("Network error. Please try again.");
    } finally {
      setTailoring(false);
    }
  };

  // ── Save Resume ────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth"); return; }

    const template = localStorage.getItem("intellico_template") || "modern";
    const payload = {
      user_id: user.id,
      title: resumeTitle,
      content_json: resumeData,
      template_id: template,
    };

    let error;
    if (resumeId) {
      ({ error } = await supabase.from("resumes").update(payload).eq("id", resumeId));
    } else {
      const result = await supabase.from("resumes").insert(payload).select().single();
      error = result.error;
      if (result.data) setResumeId(result.data.id);
    }

    setSaving(false);
    if (!error) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // ── Preview ─────────────────────────────────────────────────────────────
  const handlePreview = () => {
    localStorage.setItem("intellico_resume", JSON.stringify(resumeData));
    router.push("/builder/preview");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="pt-20 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-8">
            <div>
              <input
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="bg-transparent border-none outline-none text-2xl font-display font-bold text-slate-900 placeholder-slate-400 w-full"
                placeholder="Resume Title..."
                aria-label="Resume title"
              />
              <p className="text-slate-500 text-sm mt-1">Fill in your details and let AI optimize it</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Button variant="secondary" onClick={handleSave} loading={saving} size="sm">
                {saveSuccess ? "✓ Saved!" : <><Save className="w-4 h-4" /> Save</>}
              </Button>
              <Button variant="primary" onClick={handlePreview} size="sm">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl p-1 mb-8 gap-1 w-fit bg-slate-200/50 border border-slate-200">
            {([
              { key: "manual" as Tab, icon: FileText, label: "Manual Form" },
              { key: "upload" as Tab, icon: Upload, label: "Upload CV" },
              { key: "ats-match" as Tab, icon: Sparkles, label: "ATS Match & Tailor" },
            ]).map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === key
                    ? "bg-white text-blue-600 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <div className="animate-fade-in">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-200 cursor-pointer ${
                  dragOver
                    ? "border-blue-500 bg-blue-50"
                    : uploadFile
                    ? "border-green-500 bg-green-50"
                    : "border-slate-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
                onClick={() => document.getElementById("cv-upload-input")?.click()}
              >
                <input
                  id="cv-upload-input"
                  type="file"
                  accept=".pdf,.docx,.doc"
                  className="hidden"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
                <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                {uploadFile ? (
                  <div>
                    <p className="text-lg font-semibold text-green-600">{uploadFile.name}</p>
                    <p className="text-slate-500 text-sm mt-1">
                      {(uploadFile.size / 1024).toFixed(1)} KB · Click to change
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-semibold mb-2">Drop your CV here</p>
                    <p className="text-slate-500 text-sm">Supports PDF and Word (.docx) · Max 5MB</p>
                  </div>
                )}
              </div>

              {parseError && (
                <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                  {parseError}
                </div>
              )}

              {uploadFile && (
                <div className="mt-6 flex justify-center">
                  <Button onClick={handleParseCv} loading={parsing} size="lg">
                    <Sparkles className="w-5 h-5" />
                    {parsing ? "Parsing your CV..." : "Parse with AI"}
                  </Button>
                </div>
              )}

              <div className="mt-8 glass rounded-xl p-5 border border-slate-200">
                <h3 className="font-semibold text-sm mb-3 text-slate-700">What happens when you upload?</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  {[
                    "AI extracts your name, email, phone, and location",
                    "Work experience with company, role, dates, and bullet points",
                    "Education history with degrees and institutions",
                    "Skills, certifications, and projects",
                    "All fields auto-fill in the Manual Form tab",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Manual Form Tab */}
          {activeTab === "manual" && (
            <div className="space-y-8 animate-fade-in">

              {/* Personal Info */}
              <Section title="Personal Information" icon="👤">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" value={resumeData.personalInfo.name} onChange={(e) => updatePersonal("name", e.target.value)} placeholder="Rahul Kumar" />
                  <Input label="Email" type="email" value={resumeData.personalInfo.email} onChange={(e) => updatePersonal("email", e.target.value)} placeholder="rahul@example.com" />
                  <Input label="Phone" value={resumeData.personalInfo.phone} onChange={(e) => updatePersonal("phone", e.target.value)} placeholder="+91 98765 43210" />
                  <Input label="Location" value={resumeData.personalInfo.location} onChange={(e) => updatePersonal("location", e.target.value)} placeholder="Bengaluru, Karnataka" />
                  <Input label="LinkedIn URL" value={resumeData.personalInfo.linkedin || ""} onChange={(e) => updatePersonal("linkedin", e.target.value)} placeholder="linkedin.com/in/rahulkumar" />
                  <Input label="Portfolio / Website" value={resumeData.personalInfo.portfolio || ""} onChange={(e) => updatePersonal("portfolio", e.target.value)} placeholder="rahulkumar.dev" />
                </div>
              </Section>

              {/* Professional Summary */}
              <Section title="Professional Summary" icon="📝">
                <Textarea
                  label="Summary"
                  rows={5}
                  value={resumeData.summary}
                  onChange={(e) => setResumeData((p) => ({ ...p, summary: e.target.value }))}
                  placeholder="Results-driven software engineer with 5+ years of experience..."
                  hint="Tip: Keep it 3-4 sentences. Focus on your top achievements and what you bring."
                />
              </Section>

              {/* Work Experience */}
              <Section title="Work Experience" icon="💼">
                <div className="space-y-4">
                  {resumeData.experience.map((exp) => (
                    <ExperienceCard
                      key={exp.id}
                      exp={exp}
                      expanded={expandedExp.includes(exp.id)}
                      onToggle={() =>
                        setExpandedExp((prev) =>
                          prev.includes(exp.id) ? prev.filter((i) => i !== exp.id) : [...prev, exp.id]
                        )
                      }
                      onChange={(field, val) => updateExperience(exp.id, field, val)}
                      onUpdateBullet={(idx, val) => updateBullet(exp.id, idx, val)}
                      onAddBullet={() => addBullet(exp.id)}
                      onRemoveBullet={(idx) => removeBullet(exp.id, idx)}
                      onRemove={() => removeExperience(exp.id)}
                    />
                  ))}
                  <button onClick={addExperience} className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 hover:text-blue-600 hover:border-blue-400 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Work Experience
                  </button>
                </div>
              </Section>

              {/* Education */}
              <Section title="Education" icon="🎓">
                <div className="space-y-4">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="glass rounded-xl p-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input label="Institution" value={edu.institution} onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} placeholder="IIT Bombay" />
                        <Input label="Degree" value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} placeholder="B.Tech" />
                        <Input label="Field of Study" value={edu.field} onChange={(e) => updateEducation(edu.id, "field", e.target.value)} placeholder="Computer Science" />
                        <Input label="GPA / Percentage" value={edu.gpa || ""} onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)} placeholder="8.5 / 10" />
                        <Input label="Start Year" value={edu.startYear} onChange={(e) => updateEducation(edu.id, "startYear", e.target.value)} placeholder="2019" />
                        <Input label="End Year" value={edu.endYear} onChange={(e) => updateEducation(edu.id, "endYear", e.target.value)} placeholder="2023" />
                      </div>
                      <button onClick={() => removeEducation(edu.id)} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  ))}
                  <button onClick={addEducation} className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 hover:text-blue-600 hover:border-blue-400 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Education
                  </button>
                </div>
              </Section>

              {/* Skills */}
              <Section title="Skills" icon="⚡">
                <div className="flex gap-2 mb-4">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    placeholder="Type a skill and press Enter..."
                    className="input-field flex-1"
                    aria-label="Add skill"
                  />
                  <Button variant="secondary" size="sm" onClick={addSkill}>Add</Button>
                </div>
                {resumeData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill) => (
                      <span key={skill} className="badge-brand flex items-center gap-1.5 pr-1">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="ml-1 text-blue-300 hover:text-blue-700" aria-label={`Remove ${skill}`}>×</button>
                      </span>
                    ))}
                  </div>
                )}
                {resumeData.skills.length === 0 && (
                  <p className="text-xs text-slate-400">Add skills like React, Python, SQL, Project Management...</p>
                )}
              </Section>

              {/* Projects */}
              <Section title="Projects" icon="🚀">
                <div className="space-y-4">
                  {(resumeData.projects || []).map((proj) => (
                    <div key={proj.id} className="glass rounded-xl p-4 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          label="Project Name"
                          value={proj.name}
                          onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                          placeholder="E-commerce Platform"
                        />
                        <Input
                          label="Project Link (Optional)"
                          value={proj.link || ""}
                          onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                          placeholder="https://github.com/username/project"
                        />
                        <div className="sm:col-span-2">
                          <Input
                            label="Technologies Used"
                            value={proj.technologies ? proj.technologies.join(", ") : ""}
                            onChange={(e) => updateProject(proj.id, "technologies", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                            placeholder="React, Node.js, MongoDB"
                            hint="Separate technologies with commas"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Textarea
                            label="Description"
                            rows={3}
                            value={proj.description}
                            onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                            placeholder="Developed a fully responsive e-commerce web application featuring user authentication, payment gateway integration, and order management."
                          />
                        </div>
                      </div>
                      <button onClick={() => removeProject(proj.id)} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Remove Project
                      </button>
                    </div>
                  ))}
                  <button onClick={addProject} className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 hover:text-blue-600 hover:border-blue-400 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                </div>
              </Section>

              {/* Achievements */}
              <Section title="Key Achievements" icon="🏆">
                <div className="space-y-3">
                  {(resumeData.achievements || []).map((ach, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="text-slate-400 mt-3 text-sm">•</span>
                      <textarea
                        value={ach}
                        onChange={(e) => updateAchievement(idx, e.target.value)}
                        rows={2}
                        placeholder="Secured 1st place among 50 teams at TechQuest national level hackathon."
                        className="input-field flex-1 resize-none text-sm"
                      />
                      <button onClick={() => removeAchievement(idx)} className="mt-2 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button onClick={addAchievement} className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 hover:text-blue-600 hover:border-blue-400 transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Achievement
                  </button>
                </div>
              </Section>

              {/* Languages */}
              <Section title="Languages" icon="🌐">
                <div className="flex gap-2 mb-4">
                  <input
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                    placeholder="Type a language (e.g. English) and press Enter..."
                    className="input-field flex-1"
                    aria-label="Add language"
                  />
                  <Button variant="secondary" size="sm" onClick={addLanguage}>Add</Button>
                </div>
                {(resumeData.languages || []).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {(resumeData.languages || []).map((lang) => (
                      <span key={lang} className="badge-brand flex items-center gap-1.5 pr-1">
                        {lang}
                        <button onClick={() => removeLanguage(lang)} className="ml-1 text-blue-300 hover:text-blue-700" aria-label={`Remove ${lang}`}>×</button>
                      </span>
                    ))}
                  </div>
                )}
                {(resumeData.languages || []).length === 0 && (
                  <p className="text-xs text-slate-400">Add languages like English, Spanish, Hindi, German...</p>
                )}
              </Section>

              {/* AI Optimize Button */}
              <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 border border-slate-200">
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1 flex items-center gap-2 text-slate-900">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    AI Resume Optimizer
                  </h3>
                  <p className="text-sm text-slate-500">
                    Let GPT-4o-mini rewrite your resume with ATS keywords, action verbs, and quantified achievements.
                  </p>
                </div>
                <Button onClick={handleOptimize} loading={optimizing} size="md">
                  {optimizing ? "Optimizing..." : "Optimize with AI"}
                </Button>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="secondary" onClick={handleSave} loading={saving}>
                  {saveSuccess ? "✓ Saved!" : <><Save className="w-4 h-4" /> Save Resume</>}
                </Button>
                <Button variant="primary" onClick={handlePreview}>
                  <Eye className="w-4 h-4" />
                  Preview & Download
                </Button>
              </div>
            </div>
          )}

          {/* ATS Match Tab */}
          {activeTab === "ats-match" && (
            <div className="animate-fade-in space-y-6">
              <div className="glass rounded-2xl p-6 border border-slate-200 space-y-4">
                <h2 className="font-display font-semibold text-lg text-slate-800 flex items-center gap-2">
                  <span>🎯</span>
                  ATS Score & Job Matcher
                </h2>
                <p className="text-sm text-slate-500">
                  Paste a target job description below. The AI will scan your resume, compute an ATS compatibility score, identify matched and missing keywords, and suggest improvements.
                </p>
                
                <Textarea
                  label="Job Description"
                  rows={8}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here (responsibilities, requirements, skills)..."
                />

                {atsError && (
                  <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                    {atsError}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleAnalyzeAts}
                    loading={analyzing}
                    disabled={!jobDescription.trim() || tailoring}
                    size="md"
                  >
                    Analyze ATS Match
                  </Button>
                  {atsResult && (
                    <Button
                      variant="secondary"
                      onClick={handleTailorResume}
                      loading={tailoring}
                      disabled={analyzing}
                      size="md"
                    >
                      <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                      Tailor Resume to Job
                    </Button>
                  )}
                </div>
              </div>

              {/* Audit Results */}
              {atsResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
                  {/* ATS Score Card */}
                  <div className="glass rounded-2xl p-6 border border-slate-200 flex flex-col items-center justify-center text-center">
                    <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-widest mb-4">ATS Compatibility</h3>
                    
                    {/* Circular Gauge */}
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          className="stroke-slate-100"
                          strokeWidth="10"
                          fill="transparent"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="60"
                          className={`transition-all duration-1000 ${
                            atsResult.score >= 80
                              ? "stroke-green-500"
                              : atsResult.score >= 60
                              ? "stroke-amber-500"
                              : "stroke-red-500"
                          }`}
                          strokeWidth="10"
                          strokeDasharray={2 * Math.PI * 60}
                          strokeDashoffset={2 * Math.PI * 60 * (1 - atsResult.score / 100)}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-3xl font-black text-slate-800">{atsResult.score}</span>
                        <span className="text-sm font-semibold text-slate-400">/100</span>
                      </div>
                    </div>

                    <p className="mt-4 text-xs font-semibold text-slate-500">
                      {atsResult.score >= 80 ? (
                        <span className="text-green-600 bg-green-50 px-2.5 py-1 rounded-full">✓ Strong Match</span>
                      ) : atsResult.score >= 60 ? (
                        <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">⚠ Needs Improvement</span>
                      ) : (
                        <span className="text-red-600 bg-red-50 px-2.5 py-1 rounded-full">✗ Low Match</span>
                      )}
                    </p>
                  </div>

                  {/* Keywords Analysis */}
                  <div className="glass rounded-2xl p-6 border border-slate-200 md:col-span-2 space-y-4">
                    <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-widest">Keyword Analysis</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Matched Keywords ({atsResult.matchedKeywords.length})</span>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          {atsResult.matchedKeywords.map((kw) => (
                            <span key={kw} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                              ✓ {kw}
                            </span>
                          ))}
                          {atsResult.matchedKeywords.length === 0 && (
                            <p className="text-xs text-slate-400 italic">No matched keywords found yet.</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">Missing Keywords ({atsResult.missingKeywords.length})</span>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          {atsResult.missingKeywords.map((kw) => (
                            <span key={kw} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                              + {kw}
                            </span>
                          ))}
                          {atsResult.missingKeywords.length === 0 && (
                            <p className="text-xs text-green-600 italic">Excellent! No major keywords missing.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Checklist suggestions */}
                  <div className="glass rounded-2xl p-6 border border-slate-200 md:col-span-3 space-y-4">
                    <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      📝 Actionable Recommendations
                    </h3>
                    <ul className="space-y-3">
                      {atsResult.suggestions.map((sug, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                          <span className="text-blue-500 mt-0.5 font-bold">□</span>
                          {sug}
                        </li>
                      ))}
                      {atsResult.suggestions.length === 0 && (
                        <li className="text-sm text-green-600 italic flex items-center gap-2">
                          <span>✓</span> Your resume matches the job description perfectly! No recommendations needed.
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6 border border-slate-200">
      <h2 className="font-display font-semibold text-lg text-slate-800 mb-5 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function ExperienceCard({
  exp, expanded, onToggle, onChange, onUpdateBullet, onAddBullet, onRemoveBullet, onRemove,
}: {
  exp: ExperienceItem;
  expanded: boolean;
  onToggle: () => void;
  onChange: (field: string, val: unknown) => void;
  onUpdateBullet: (idx: number, val: string) => void;
  onAddBullet: () => void;
  onRemoveBullet: (idx: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="glass rounded-xl overflow-hidden border border-slate-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-slate-50 transition-colors"
      >
        <div>
          <div className="font-semibold text-sm text-slate-800">{exp.role || "New Position"}</div>
          <div className="text-xs text-slate-500">{exp.company || "Company Name"}</div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-200 pt-4 animate-slide-down">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Company" value={exp.company} onChange={(e) => onChange("company", e.target.value)} placeholder="Google" />
            <Input label="Job Title / Role" value={exp.role} onChange={(e) => onChange("role", e.target.value)} placeholder="Software Engineer" />
            <Input label="Start Date" type="month" value={exp.startDate} onChange={(e) => onChange("startDate", e.target.value)} />
            <div>
              <Input
                label="End Date"
                type="month"
                value={exp.endDate}
                onChange={(e) => onChange("endDate", e.target.value)}
                disabled={exp.current}
              />
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => onChange("current", e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span className="text-xs text-slate-500">Currently working here</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Key Achievements / Responsibilities
            </label>
            {exp.bullets.map((bullet, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <span className="text-slate-400 mt-3 text-sm">•</span>
                <textarea
                  value={bullet}
                  onChange={(e) => onUpdateBullet(idx, e.target.value)}
                  rows={2}
                  placeholder="Reduced API response time by 40% through caching optimization..."
                  className="input-field flex-1 resize-none text-sm"
                />
                {exp.bullets.length > 1 && (
                  <button onClick={() => onRemoveBullet(idx)} className="mt-2 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button onClick={onAddBullet} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-1">
              <Plus className="w-3 h-3" /> Add bullet point
            </button>
          </div>

          <button onClick={onRemove} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 mt-2">
            <Trash2 className="w-3 h-3" /> Remove this experience
          </button>
        </div>
      )}
    </div>
  );
}
