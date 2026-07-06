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
  tools?: string[];
  references?: string;
  jobRole?: string;
  industry?: string;
  additionalInstructions?: string;
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
    id: "starter",
    name: "Starter",
    price: 499,
    period: "3 months",
    features: [
      "Unlimited Resumes",
      "All 5 ATS Templates",
      "PDF Download",
      "Basic AI optimization",
      "Basic Email Support",
    ],
    highlighted: false,
  },
  {
    id: "popular",
    name: "Popular",
    price: 799,
    period: "6 months",
    features: [
      "Everything in Starter",
      "Word Download (.docx)",
      "Advanced AI optimization",
      "CV Upload & Parse",
      "ATS Score Check",
    ],
    highlighted: true,
  },
  {
    id: "best_value",
    name: "Best Value",
    price: 1299,
    period: "12 months",
    features: [
      "Everything in Popular",
      "Priority WhatsApp Support",
      "LinkedIn Optimizer",
      "Cover Letter Builder",
      "1-on-1 Review Session",
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
  tools: [],
  references: "",
  jobRole: "",
  industry: "",
  additionalInstructions: "",
};
