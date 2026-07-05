import Link from "next/link";
import { CheckCircle, XCircle, ArrowRight, AlertTriangle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const atsChecklist = [
  { label: "Use standard section headings (Experience, Education, Skills)", pass: true },
  { label: "Avoid tables, columns, or text boxes", pass: true },
  { label: "No images, graphics, or icons in the resume body", pass: true },
  { label: "Use standard fonts (Arial, Calibri, Times New Roman)", pass: true },
  { label: "Save as PDF or DOCX (not PNG, JPG)", pass: true },
  { label: "Include relevant keywords from the job description", pass: true },
  { label: "Use bullet points starting with action verbs", pass: true },
  { label: "Include contact info at the top", pass: true },
  { label: "No headers/footers with important information", pass: false },
  { label: "No fancy templates with sidebars or decorative elements", pass: false },
];

const atsTips = [
  {
    title: "Mirror the Job Description",
    desc: "Copy exact keywords from the job posting. If they say 'project management', use those exact words — not 'managing projects'.",
    icon: "🎯",
  },
  {
    title: "Use Strong Action Verbs",
    desc: "Start every bullet point with a powerful verb: Led, Developed, Implemented, Optimized, Reduced, Increased, Launched, Designed.",
    icon: "💪",
  },
  {
    title: "Quantify Everything",
    desc: "Numbers grab attention. Don't say 'improved performance' — say 'improved API response time by 40%, reducing load time from 3s to 1.8s'.",
    icon: "📊",
  },
  {
    title: "Keep it ATS-Parseable",
    desc: "ATS systems struggle with tables, columns, and graphics. Use a single-column layout with standard section headings.",
    icon: "🤖",
  },
  {
    title: "Customize Per Application",
    desc: "Tailor your resume for each job. Different roles need different keywords. Use Intellico to quickly create variations.",
    icon: "✏️",
  },
  {
    title: "Include a Skills Section",
    desc: "List 10-15 relevant technical and soft skills. ATS systems scan for exact skill matches against the job requirements.",
    icon: "⚡",
  },
];

export default function ATSGuidePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="section-label mb-3">ATS Guide</div>
            <h1 className="font-display text-5xl md:text-6xl font-black mb-4">
              What is{" "}
              <span className="gradient-text">ATS</span> and Why It Matters
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Learn how Applicant Tracking Systems work and how to make your resume beat them every time.
            </p>
          </div>

          {/* What is ATS */}
          <div className="glass rounded-2xl p-8 mb-10 border border-slate-200">
            <h2 className="font-display text-2xl font-bold mb-4">What is an ATS?</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              An <strong className="text-slate-900">Applicant Tracking System (ATS)</strong> is software used by companies to manage job applications.
              It automatically scans, filters, and ranks resumes before a human recruiter ever sees them.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              According to Jobscan, <strong className="text-slate-900">99% of Fortune 500 companies</strong> use ATS software.
              Studies show that <strong className="text-slate-900">75% of resumes are rejected by ATS</strong> before reaching a hiring manager —
              often due to simple formatting or keyword issues.
            </p>
            <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                <strong>Key insight:</strong> Your resume might be perfect for a human, but if an ATS can&apos;t parse it correctly,
                it will be auto-rejected. ATS optimization is not optional — it&apos;s mandatory.
              </p>
            </div>
          </div>

          {/* How ATS Works */}
          <div className="glass rounded-2xl p-8 mb-10 border border-slate-200">
            <h2 className="font-display text-2xl font-bold mb-6">How ATS Works — Step by Step</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Resume Received", desc: "You submit your resume through a job portal or company website." },
                { step: "2", title: "Text Extraction", desc: "ATS extracts text from your PDF/DOCX. Complex formatting can cause parsing errors." },
                { step: "3", title: "Keyword Scanning", desc: "The system looks for keywords from the job description: skills, titles, qualifications." },
                { step: "4", title: "Score & Rank", desc: "Your resume gets a match score. Low scores mean auto-rejection." },
                { step: "5", title: "Human Review", desc: "Only top-scoring resumes reach the recruiter's screen." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700 flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-0.5">{item.title}</div>
                    <div className="text-sm text-slate-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ATS Checklist */}
          <div className="glass rounded-2xl p-8 mb-10 border border-slate-200">
            <h2 className="font-display text-2xl font-bold mb-6">ATS Resume Checklist</h2>
            <div className="space-y-3">
              {atsChecklist.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  {item.pass ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={`text-sm ${item.pass ? "text-slate-700" : "text-red-700"}`}>
                    {item.label}
                    {!item.pass && <span className="ml-2 text-xs text-red-500">(Common mistake!)</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Grid */}
          <div className="mb-10">
            <h2 className="font-display text-2xl font-bold mb-6">6 Tips to Beat ATS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {atsTips.map((tip) => (
                <div key={tip.title} className="glass rounded-xl p-5 border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all">
                  <div className="text-2xl mb-3">{tip.icon}</div>
                  <h3 className="font-semibold text-base mb-2">{tip.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords section */}
          <div className="glass rounded-2xl p-8 mb-10 border border-slate-200">
            <h2 className="font-display text-2xl font-bold mb-4">Power Keywords by Industry</h2>
            <div className="space-y-4">
              {[
                { industry: "Software Engineering", keywords: ["React", "Node.js", "Python", "AWS", "CI/CD", "Agile", "REST API", "Docker", "Kubernetes", "Microservices"] },
                { industry: "Marketing", keywords: ["SEO", "SEM", "Google Analytics", "Content Strategy", "Brand Management", "Campaign Management", "CRM", "ROI", "A/B Testing"] },
                { industry: "Data Science", keywords: ["Machine Learning", "Python", "TensorFlow", "SQL", "Data Analysis", "Predictive Modeling", "ETL", "Tableau", "Statistical Analysis"] },
                { industry: "Product Management", keywords: ["Product Roadmap", "Agile", "User Research", "KPIs", "Stakeholder Management", "Go-to-Market", "OKRs", "A/B Testing"] },
              ].map((cat) => (
                <div key={cat.industry}>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">{cat.industry}</h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.keywords.map((kw) => (
                      <span key={kw} className="badge-brand text-xs">{kw}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center glass rounded-2xl p-10 border border-slate-200">
            <h2 className="font-display text-3xl font-bold mb-3">Ready to build your ATS resume?</h2>
            <p className="text-slate-500 mb-8">
              Intellico automatically handles all ATS optimization. Just fill in your details and let AI do the rest.
            </p>
            <Link href="/builder" className="btn-primary text-base px-8 py-4">
              Build My ATS Resume
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
