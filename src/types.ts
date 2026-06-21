export interface PersonalInfo {
  name: string;
  email: string;
  mobile: string;
  location: string;
  linkedin: string;
  website: string;
  jobTitle: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bulletPoints: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  link: string;
  description: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[]; // flat list or grouped
  skillCategories: SkillCategory[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  languages: string[];
}

export interface AtsAssessmentTip {
  category: "Formatting" | "Content" | "Keywords" | "Impact";
  severity: "high" | "medium" | "low";
  tip: string;
  exampleFix?: string;
}

export interface AtsAnalysis {
  score: number;
  grade: string;
  summary: string;
  formattingScore: number;
  contentScore: number;
  keywordScore: number;
  impactScore: number;
  tips: AtsAssessmentTip[];
  extractedKeywords: string[];
  suggestedKeywords: string[];
}

export interface CoverLetter {
  recipientName?: string;
  companyName: string;
  jobTitle: string;
  salutation: string;
  introduction: string;
  bodyParagraphs: string[];
  conclusion: string;
  signOff: string;
  fullLetter: string;
}

export interface JobOpening {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string; // Full-time, Remote, etc.
  matchPercentage: number;
  matchingSkills: string[];
  description: string;
  howToApply: string;
  source?: string;
  expiryDate?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}
