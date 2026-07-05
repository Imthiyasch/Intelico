export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  certifications?: CertificationItem[];
  projects?: ProjectItem[];
  achievements?: string[];
  languages?: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  gpa?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export type TemplateId = "classic" | "modern" | "minimal" | "bold" | "executive";

export interface Resume {
  id?: string;
  user_id?: string;
  title: string;
  content_json: ResumeData;
  template_id: TemplateId;
  created_at?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  highlighted: boolean;
  razorpayPlanId?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    features: [
      "1 Resume",
      "3 ATS Templates",
      "PDF Download",
      "Basic AI optimization",
    ],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 499,
    period: "3 months",
    features: [
      "Unlimited Resumes",
      "All 5 ATS Templates",
      "PDF & Word Download",
      "Advanced AI optimization",
      "CV Upload & Parse",
      "ATS Score Check",
      "Priority Support",
    ],
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 999,
    period: "year",
    features: [
      "Everything in Pro",
      "Unlimited Resumes",
      "Cover Letter Builder",
      "LinkedIn Optimizer",
      "Interview Prep Tips",
      "1-on-1 Review Session",
      "White-glove Support",
    ],
    highlighted: false,
  },
];

export const TEMPLATES = [
  { id: "classic" as TemplateId, name: "Classic", description: "Timeless black & white" },
  { id: "modern" as TemplateId, name: "Modern", description: "Blue accents, clean" },
  { id: "minimal" as TemplateId, name: "Minimal", description: "Whitespace-focused" },
  { id: "bold" as TemplateId, name: "Bold", description: "Strong dark header" },
  { id: "executive" as TemplateId, name: "Executive", description: "Conservative, professional" },
];

export const EMPTY_RESUME: ResumeData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  achievements: [],
  languages: [],
};
