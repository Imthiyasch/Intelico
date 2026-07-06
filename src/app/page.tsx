import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Sparkles, TrendingUp, CheckCircle2, FileText, Check, Cpu } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text & Actions */}
          <div className="max-w-xl animate-fade-in z-10">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-semibold tracking-wide mb-6">
              Backed by AI & Built for Your Career
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-8 text-slate-900">
              Get Your Resume Reviewed <span className="text-blue-600 italic">Instantly</span>
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <Link href="/auth" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all transition-colors text-center shadow-lg shadow-blue-600/20">
                Get Started
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
                    <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" fill className="object-cover" unoptimized />
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium text-slate-600">
                <span className="font-bold text-slate-900">1M+</span> Active users
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Resume Optimizer Dashboard */}
          <div className="relative h-[600px] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-glow-lg animate-slide-up flex flex-col justify-between p-6 md:p-8">
            {/* Background Grid Accent */}
            <div className="absolute inset-0 bg-[radial-gradient(#312e81_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
            
            {/* Ambient Glowing Orbs */}
            <div className="absolute top-10 right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Dashboard Header Bar */}
            <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60 flex items-center gap-1.5 ml-2">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  resume_v2_optimized.pdf
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse-slow">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Score: 98/100
                </span>
              </div>
            </div>

            {/* Resume Workspace / Document Simulator */}
            <div className="relative z-10 flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
              {/* Paper Sheet Representation */}
              <div className="bg-white text-slate-800 p-5 md:p-6 rounded-2xl shadow-2xl border border-slate-200 w-full font-sans transition-all duration-300">
                {/* Simulated Header */}
                <div className="text-center border-b border-slate-200 pb-3 mb-4">
                  <h3 className="font-extrabold text-base tracking-widest text-slate-900 leading-none">SARAH M. JENKINS</h3>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1.5 uppercase tracking-wide">
                    Senior Software Engineer • San Francisco, CA • contact@sarahjenkins.dev
                  </p>
                </div>

                {/* Section */}
                <div className="mb-4">
                  <h4 className="text-[11px] font-bold tracking-widest text-blue-600 border-b border-blue-100 pb-1 mb-2 uppercase">Professional Experience</h4>
                  
                  {/* Job Header */}
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-bold text-slate-900">Senior React Architect</span>
                    <span className="text-[10px] text-slate-500 font-semibold">2023 - Present</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-[10px] italic text-slate-600">GlobalTech Solutions Inc.</span>
                    <span className="text-[10px] text-slate-500">San Francisco, CA</span>
                  </div>

                  {/* Bullet points with Before/After visual comparison */}
                  <div className="space-y-3.5 text-[10.5px] leading-relaxed text-slate-700">
                    {/* Before Draft (Weak) */}
                    <div className="bg-red-50/70 border border-red-100 p-2.5 rounded-lg relative overflow-hidden group">
                      <div className="absolute top-0 right-0 bg-red-100 px-1.5 py-0.5 rounded-bl text-[8px] font-bold text-red-600 uppercase tracking-wider">
                        Weak Bullet
                      </div>
                      <span className="font-medium text-slate-500 line-through decoration-red-400 decoration-2">
                        Wrote code for the user login page and resolved database performance issues.
                      </span>
                    </div>

                    {/* AI Optimization Animation / Divider */}
                    <div className="flex items-center justify-center gap-3">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-blue-200"></div>
                      <div className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-600 font-bold text-[9px] uppercase tracking-widest rounded-full shadow-sm flex items-center gap-1">
                        <Cpu className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '6s' }} />
                        AI ATS Optimizer
                      </div>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-blue-200"></div>
                    </div>

                    {/* After Draft (Strong & Optimized) */}
                    <div className="bg-emerald-50/80 border border-emerald-200 p-2.5 rounded-lg relative overflow-hidden shadow-sm">
                      <div className="absolute top-0 right-0 bg-emerald-500 text-white px-1.5 py-0.5 rounded-bl text-[8px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                        ATS Score Up
                      </div>
                      <span className="font-semibold text-emerald-800 flex gap-1.5 items-start">
                        <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                        Architected and delivered high-traffic authentication flows, reducing query latency by 42% and optimizing load speeds.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Overlays */}
            {/* Left Overlay */}
            <div className="absolute left-4 top-24 z-20 bg-slate-950/90 backdrop-blur-md border border-slate-800/80 p-3.5 rounded-xl shadow-glow w-44 hover:scale-105 transition-transform duration-300 animate-float hidden md:block">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1 rounded-lg bg-blue-500/10 text-blue-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-200">Keywords Injected</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">
                Added: <span className="text-blue-400 font-semibold">CI/CD, RESTful API, Performance Tuning</span>
              </p>
            </div>

            {/* Right Overlay */}
            <div className="absolute right-4 bottom-24 z-20 bg-slate-950/90 backdrop-blur-md border border-slate-800/80 p-3.5 rounded-xl shadow-glow w-44 hover:scale-105 transition-transform duration-300 [animation-delay:3s] animate-float hidden md:block">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-200">ATS Formatting</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                ✓ Standard margins ok
              </p>
              <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                ✓ No graphics blocking parser
              </p>
            </div>

            {/* Decorative Scanning Laser Line */}
            <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/80 to-transparent pointer-events-none animate-scan z-30"></div>

            {/* Small Footer Text */}
            <div className="relative z-10 text-center text-[10px] text-slate-500 font-medium tracking-wide border-t border-slate-800/60 pt-3">
              ⚡ Tailored ATS feedback powered by GPT-4o-mini
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Section: Template Previews */}
      <section className="py-20 px-4 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              Proven, ATS-Optimized <span className="text-blue-600">Templates</span>
            </h2>
            <p className="text-slate-600 mt-2 text-base max-w-xl">
              Choose from our professionally engineered designs built to pass automatic parsers and land interviews.
            </p>
          </div>
          <Link href="/builder/preview" className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold hover:border-slate-300 rounded-full transition-colors flex items-center gap-2 text-sm shadow-sm">
            Explore All 5 Templates <ArrowRight className="w-4 h-4 text-blue-600" />
          </Link>
        </div>
        
        {/* Real-looking Template Previews */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Card 1: Classic Professional */}
          <div className="group cursor-pointer">
            <div className="aspect-[3/4] bg-white rounded-2xl border border-slate-200 shadow-sm mb-4 group-hover:shadow-xl transition-all duration-300 p-5 overflow-hidden flex flex-col select-none relative">
              <div className="absolute top-3 right-3 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100 opacity-0 group-hover:opacity-100 transition-opacity">
                Classic
              </div>
              {/* Miniature Classic Resume Layout */}
              <div className="font-serif text-slate-800 text-[9px] flex-1 flex flex-col justify-start">
                <div className="text-center border-b border-slate-800 pb-1.5 mb-2.5">
                  <h4 className="font-bold text-xs uppercase tracking-wide text-slate-900">JONATHAN R. VANCE</h4>
                  <p className="text-[7.5px] text-slate-500 mt-0.5">Finance Partner • New York, NY • j.vance@email.com</p>
                </div>
                
                {/* Summary */}
                <div className="mb-2">
                  <h5 className="font-bold text-[8.5px] border-b border-slate-300 pb-0.5 mb-1 uppercase tracking-wider text-slate-900">Professional Summary</h5>
                  <p className="text-slate-600 leading-normal text-[7.5px] italic">
                    Analytical and detail-oriented Corporate Finance Professional with 6+ years of experience leading strategic operations, financial forecasting, and cost-reduction initiatives.
                  </p>
                </div>

                {/* Experience */}
                <div className="mb-2">
                  <h5 className="font-bold text-[8.5px] border-b border-slate-300 pb-0.5 mb-1 uppercase tracking-wider text-slate-900">Professional Experience</h5>
                  <div className="mb-1.5">
                    <div className="flex justify-between font-bold text-[8px] text-slate-900">
                      <span>Lead Financial Analyst | Apex Advisory</span>
                      <span>2021 – Present</span>
                    </div>
                    <ul className="list-disc pl-3 text-slate-600 space-y-0.5 text-[7px] leading-normal mt-0.5">
                      <li>Directed $12M budgeting workflow, reducing operational variance by 14%.</li>
                      <li>Developed automated forecast pipelines across 4 business segments.</li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-[8px] text-slate-900">
                      <span>Junior Analyst | Vantage Analytics</span>
                      <span>2019 – 2021</span>
                    </div>
                    <ul className="list-disc pl-3 text-slate-600 space-y-0.5 text-[7px] leading-normal mt-0.5">
                      <li>Conducted strategic research to support $18M client acquisition.</li>
                    </ul>
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h5 className="font-bold text-[8.5px] border-b border-slate-300 pb-0.5 mb-1 uppercase tracking-wider text-slate-900">Education</h5>
                  <div className="flex justify-between font-bold text-[8px] text-slate-900">
                    <span>MBA in Corporate Finance | Wharton School</span>
                    <span>Class of 2019</span>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">Classic Professional</h3>
            <p className="text-sm text-slate-500">Perfect for banking, consulting, law, and corporate finance.</p>
          </div>

          {/* Card 2: Creative Modern */}
          <div className="group cursor-pointer">
            <div className="aspect-[3/4] bg-white rounded-2xl border border-slate-200 shadow-sm mb-4 group-hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col select-none relative">
              <div className="absolute top-3 right-3 bg-purple-50 text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-100 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                Creative
              </div>
              {/* Top Accent Bar */}
              <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 w-full"></div>
              
              {/* Miniature Creative Resume Layout */}
              <div className="font-sans text-slate-800 text-[9px] flex-1 flex flex-col justify-start p-4 pt-3.5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-extrabold text-sm tracking-tight text-slate-900">ALEXA CHEN</h4>
                    <p className="text-[7.5px] font-bold text-blue-600 uppercase tracking-wider mt-0.5">Senior UX/UI & Product Designer</p>
                  </div>
                  <div className="text-[7px] text-right text-slate-500 leading-normal">
                    <p>Seattle, WA</p>
                    <p>alexa.design@email.com</p>
                  </div>
                </div>
                
                {/* Skills Row */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {["Figma", "Design Systems", "React", "Webflow", "Research"].map((sk) => (
                      <span key={sk} className="text-[6.5px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-full border border-indigo-100/60">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-1">
                    <h5 className="font-bold text-[8.5px] text-slate-900">EXPERIENCE</h5>
                    <div className="h-px flex-1 bg-slate-100"></div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between font-bold text-[8px] text-slate-900">
                      <span>Lead Product Designer | PixelForge Studios</span>
                      <span className="font-normal text-slate-500">2022 – Present</span>
                    </div>
                    <ul className="list-disc pl-3 text-slate-600 space-y-0.5 text-[7px] leading-normal mt-0.5">
                      <li>Architected core design system, reducing design-to-dev shipping latency by 32%.</li>
                      <li>Re-designed mobile checkout funnel, driving a 24% increase in conversion rate.</li>
                    </ul>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-[8px] text-slate-900">
                      <span>Product Designer | TechLaunch Mobile</span>
                      <span className="font-normal text-slate-500">2020 – 2022</span>
                    </div>
                    <ul className="list-disc pl-3 text-slate-600 space-y-0.5 text-[7px] leading-normal mt-0.5">
                      <li>Shipped iOS companion app rated 4.8★ with 150k+ downloads.</li>
                    </ul>
                  </div>
                </div>

                {/* Education */}
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <h5 className="font-bold text-[8.5px] text-slate-900">EDUCATION</h5>
                    <div className="h-px flex-1 bg-slate-100"></div>
                  </div>
                  <div className="flex justify-between text-[7.5px] text-slate-700">
                    <span className="font-bold text-slate-900">B.S. Human-Computer Interaction</span>
                    <span>Univ. of Washington</span>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">Creative Modern</h3>
            <p className="text-sm text-slate-500">Ideal for tech startups, product designers, software engineers, and marketers.</p>
          </div>

          {/* Card 3: Executive Layout */}
          <div className="group cursor-pointer">
            <div className="aspect-[3/4] bg-white rounded-2xl border border-slate-200 shadow-sm mb-4 group-hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col select-none relative">
              <div className="absolute top-3 right-3 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-slate-950">
                Executive
              </div>
              
              {/* Miniature Executive Resume Layout */}
              <div className="font-sans text-slate-800 text-[9px] flex-1 flex flex-col justify-start">
                {/* Bold Dark Header */}
                <div className="bg-slate-900 text-white p-3.5 pb-3">
                  <h4 className="font-black text-sm tracking-tight text-white">DERRICK S. VANCE</h4>
                  <p className="text-[7.5px] text-slate-300 font-semibold tracking-wider mt-0.5 uppercase">VP of Engineering & Tech Operations</p>
                  <p className="text-[6.5px] text-slate-400 mt-1">Austin, TX • d.vance@cloudcore.io • (512) 555-0199</p>
                </div>
                
                <div className="p-4 pt-3 flex-1 flex flex-col justify-between">
                  {/* Executive Summary */}
                  <div className="mb-2">
                    <h5 className="font-extrabold text-[8.5px] text-slate-900 border-b border-slate-900 pb-0.5 mb-1.5 uppercase">Executive Summary</h5>
                    <p className="text-slate-600 leading-normal text-[7.5px]">
                      Transformational Technology Leader with 12+ years of experience scaling global cloud infrastructure, building high-performing engineering orgs, and orchestrating multi-million dollar digital migrations.
                    </p>
                  </div>

                  {/* Core Experience */}
                  <div className="mb-2">
                    <h5 className="font-extrabold text-[8.5px] text-slate-900 border-b border-slate-900 pb-0.5 mb-1.5 uppercase">Key Leadership</h5>
                    
                    <div className="mb-1.5">
                      <div className="flex justify-between font-bold text-[8px] text-slate-900">
                        <span>VP of Infrastructure | CloudCore Tech</span>
                        <span className="font-semibold text-slate-500">2020 – Present</span>
                      </div>
                      <ul className="list-disc pl-3 text-slate-600 space-y-0.5 text-[7px] leading-normal mt-0.5">
                        <li>Spearheaded multi-cloud migration saving $1.4M in annual operating costs.</li>
                        <li>Scales engineering organization from 12 to 95+ engineers.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-[8px] text-slate-900">
                        <span>Director of DevOps | Global scale Inc.</span>
                        <span className="font-semibold text-slate-500">2016 – 2020</span>
                      </div>
                      <ul className="list-disc pl-3 text-slate-600 space-y-0.5 text-[7px] leading-normal mt-0.5">
                        <li>Architected high-availability orchestration platform, achieving 99.99% uptime.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div>
                    <h5 className="font-extrabold text-[8.5px] text-slate-900 border-b border-slate-900 pb-0.5 mb-1 uppercase">Core Competencies</h5>
                    <p className="text-[7.5px] text-slate-600 leading-normal mt-0.5 font-medium">
                      Cloud Architecture (AWS/GCP) • Scale Organization • Cybersecurity • Executive Strategy
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">Executive Premium</h3>
            <p className="text-sm text-slate-500">Tailored for VPs, directors, team leaders, and senior executives.</p>
          </div>

        </div>
      </section>

      {/* About Intellico Section */}
      <section className="py-24 px-4 bg-white border-t border-slate-100 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-6">
            <Cpu className="w-3.5 h-3.5 animate-pulse" /> About Intellico
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-6">
            The End-to-End <span className="text-blue-600">AI-Powered</span> Resume Builder
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            At Intellico, we believe that job searching shouldn't be held back by formatting rules and writer's block. We build tools that integrate state-of-the-art LLMs (GPT-4o-mini & Gemini) with professional resume writing expertise. Our platform parses your existing credentials, structures them into clean, ATS-compliant formats, and tailors every bullet point to hit target job keywords.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-2xl font-bold text-slate-900">99.4%</div>
              <div className="text-xs text-slate-500 mt-1">ATS Pass Rate</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-2xl font-bold text-slate-900">42%</div>
              <div className="text-xs text-slate-500 mt-1">Avg. Interview Increase</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 col-span-2 md:col-span-1">
              <div className="text-2xl font-bold text-slate-900">10k+</div>
              <div className="text-xs text-slate-500 mt-1">Resumes Created</div>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Key Features Section */}
      <section className="py-24 px-4 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight font-display">
              Packed with <span className="text-blue-600">Advanced Features</span>
            </h2>
            <p className="text-slate-600 mt-3 text-base max-w-xl mx-auto">
              Everything you need to create, optimize, customize, and export professional resumes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Processing Engine</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Powered by ChatGPT-4o-mini and Gemini, our AI analyzes job descriptions, rewrites bullet points with strong action verbs, injects relevant keywords, and improves summaries instantly.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-6">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">ATS-Optimized Output</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                All templates follow strict compliance guidelines: single-column layout, standard margins, no images/tables that disrupt parses, and standard resume section headers.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Feedback & Scoring</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Upload your CV or write your details manually, then scan it against target job descriptions to receive an immediate ATS Score and keyword checklist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight font-display">
              Flexible <span className="text-blue-600">Subscription Plans</span>
            </h2>
            <p className="text-slate-600 mt-3 text-base max-w-xl mx-auto">
              Start building today. Upgrade anytime to access premium layouts and advanced AI tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-950 mb-2">Starter</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold text-slate-950">₹499</span>
                  <span className="text-slate-500 text-xs">/ 3 months</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 mb-8">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Unlimited Resumes</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> All 5 ATS Templates</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> PDF Download</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Basic AI optimization</li>
                </ul>
              </div>
              <Link href="/pricing" className="w-full text-center py-3 bg-slate-100 hover:bg-slate-200 text-slate-950 rounded-xl font-semibold transition-colors text-sm">
                Get Starter
              </Link>
            </div>
            
            {/* Popular Plan */}
            <div className="border-2 border-blue-500 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between relative bg-blue-50/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                ⭐ Most Popular
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-950 mb-2">Popular</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold text-slate-950">₹799</span>
                  <span className="text-slate-500 text-xs">/ 6 months</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 mb-8">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Everything in Starter</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Word Download (.docx)</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Advanced AI optimization</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> CV Upload & Parse</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> ATS Score Check</li>
                </ul>
              </div>
              <Link href="/pricing" className="w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors text-sm">
                Get Popular
              </Link>
            </div>
            
            {/* Best Value Plan */}
            <div className="border border-slate-200 rounded-2xl p-8 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-950 mb-2">Best Value</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold text-slate-950">₹1299</span>
                  <span className="text-slate-500 text-xs">/ 12 months</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 mb-8">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Everything in Popular</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> WhatsApp Support widget</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> LinkedIn Optimizer</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Cover Letter Builder</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 1-on-1 Review Session</li>
                </ul>
              </div>
              <Link href="/pricing" className="w-full text-center py-3 bg-slate-100 hover:bg-slate-200 text-slate-955 rounded-xl font-semibold transition-colors text-sm">
                Get Best Value
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
