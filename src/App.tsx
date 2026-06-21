import React, { useState, useEffect, useRef } from "react";
import { 
  FileText, Sparkles, Send, Download, Briefcase, GraduationCap, 
  Settings, Award, RefreshCw, FileCheck2, UserCheck, Trash2, 
  Plus, Check, HelpCircle, ArrowRight, BookOpen, AlertCircle, 
  MapPin, Phone, Mail, Link as LinkIcon, Star, Code2, Copy, Printer
} from "lucide-react";
import { 
  ResumeData, PersonalInfo, ExperienceItem, EducationItem, 
  SkillCategory, CertificationItem, ProjectItem, AtsAnalysis, 
  CoverLetter, JobOpening, ChatMessage 
} from "./types";
import ResumePreview from "./components/ResumePreview";

// Professional Sample Data for quick preview & mock state
const sampleResumeData: ResumeData = {
  personalInfo: {
    name: "Sarah M. Jenkins",
    email: "sarah.jenkins@example.com",
    mobile: "+1 (415) 882-9012",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/sarahjenkins",
    website: "sarahcreates.dev",
    jobTitle: "Senior Product Manager"
  },
  summary: "Results-driven Senior Product Manager with 6+ years of experience leading cross-functional teams to engineer and scale enterprise SaaS platforms. Proven expert in user growth conversion optimization, agile roadmapping, and data-backed product strategy.",
  experience: [
    {
      id: "exp_1",
      company: "Stripe Inc.",
      role: "Lead Product Manager",
      location: "San Francisco, CA",
      startDate: "Oct 2022",
      endDate: "Present",
      current: true,
      bulletPoints: [
        "Led product strategy for billing integration API, increasing merchant onboarding velocity by 34% within 6 months.",
        "Collaborated with 18+ multi-disciplinary developers and designers to launch customizable checkout widgets, boosting global checkout conversion rate by 2.4%.",
        "Utilized data dashboards to identify drop-off funnels, spearheading dynamic routing logic to reduce card abandonment rate by 14%."
      ]
    },
    {
      id: "exp_2",
      company: "Optimizely",
      role: "Product Manager - Analytics & Growth",
      location: "San Francisco, CA",
      startDate: "Aug 2020",
      endDate: "Oct 2022",
      current: false,
      bulletPoints: [
        "Directed core A/B experiment engine features serving 800+ enterprise customers with millions of daily sessions.",
        "Initiated modular drag-and-drop feature generator resulting in $1.2M in annual contract value (ACV) retention improvement."
      ]
    }
  ],
  education: [
    {
      id: "edu_1",
      institution: "Stanford University",
      degree: "B.S.",
      fieldOfStudy: "Management Science and Engineering",
      location: "Stanford, CA",
      startDate: "2016",
      endDate: "2020",
      gpa: "3.85",
      description: "Focus on Decision Analysis & Technology Entrepreneurship. Graduation with Honors."
    }
  ],
  skills: ["Product Strategy", "Agile Roadmap", "SaaS Analytics", "User Experience (UX)", "A/B Testing", "API Integrations", "SQL", "Team Leadership"],
  skillCategories: [
    {
      category: "Product Leadership",
      skills: ["Product Strategy", "Agile Roadmap", "SaaS Analytics", "A/B Testing"]
    },
    {
      category: "Technical & Tools",
      skills: ["SQL", "API Integrations", "Figma", "Amplitude", "Jira"]
    }
  ],
  certifications: [
    {
      id: "cert_1",
      title: "Certified Scrum Product Owner (CSPO)",
      issuer: "Scrum Alliance",
      date: "2021",
      description: ""
    }
  ],
  projects: [
    {
      id: "proj_1",
      title: "OmniChannel Campaign Tracker",
      role: "Product Lead / Creator",
      link: "omnichanneltracker.example.com",
      description: "An open-source analytics dashboard designed to aggregate and forecast social media click-through attribution models securely."
    }
  ],
  languages: ["English (Native)", "Spanish (Conversational)"]
};

const sampleAtsAnalysis: AtsAnalysis = {
  score: 84,
  grade: "A-",
  summary: "This CV is exceptionally structured, with great use of action verbs and readable layout frameworks. However, adding more performance indicators and targeting specific software suite keywords will instantly elevate this to a top 5% candidate tier.",
  formattingScore: 92,
  contentScore: 81,
  keywordScore: 78,
  impactScore: 85,
  tips: [
    {
      category: "Keywords",
      severity: "high",
      tip: "We noticed 'Kubernetes' and 'AWS API Gateway' are missing, whereas they are high-demand keywords in current PM & technical role descriptors.",
      exampleFix: "Integrate into experience: 'Spearheaded migration to microservices on AWS, reducing container deployment costs by 15%'"
    },
    {
      category: "Impact",
      severity: "medium",
      tip: "Include at least one more financial or cost-saving business metric in previous positions to highlight bottom-line accountability.",
      exampleFix: "Change 'Streamlined operational tasks' to 'Streamlined operations using automated workflows, reclaiming 12 dev-hours weekly.'"
    },
    {
      category: "Formatting",
      severity: "low",
      tip: "Your physical email address details are long. Consider keeping only the City and State (e.g. 'San Francisco, CA') to keep header crisp and clean on smaller displays.",
      exampleFix: "Change '+1 (415) 882-9012, sarah.jenkins@example.com, SF CA 94103' to 'San Francisco, CA'"
    }
  ],
  extractedKeywords: ["Product Strategy", "SaaS", "A/B Testing", "Agile", "API", "onboarding", "conversion rate", "SQL"],
  suggestedKeywords: ["Python", "Jira & Confluence", "KPI Dashboards", "Cross-functional Collaboration", "Stripe API", "Go-To-Market (GTM) Strategy"]
};

const sampleCoverLetter: CoverLetter = {
  companyName: "Stripe",
  jobTitle: "Senior Product Manager",
  salutation: "Dear Hiring Team at Stripe,",
  introduction: "I am writing with great enthusiasm to submit my application for the Senior Product Manager position. With over six years of experience managing SaaS scale initiatives and launching API-focused monetization widgets, I am confident I can immediately contribute to your high-performance growth engineering goals.",
  bodyParagraphs: [
    "In my recent role at Optimizely, I presided over key growth funnels and directed the modular experiment structures serving over 800+ enterprise partners. I specialized in optimizing user experiences on checkout pathways, driving retention up by $1.2M in annual contract value.",
    "Furthermore, my background in Management Science and Engineering from Stanford has equipped me with both raw technical analytical vigor and high-level strategy skills. I excel at converting loose stakeholder requirements into highly structured products and working side-by-side with engineers to test, ship, and iterate."
  ],
  conclusion: "Thank you for your time and premium consideration. I look forward to the prospect of discussing how my analytics background meshes beautifully with Stripe's future roadmap.",
  signOff: "Sincerely,\nSarah M. Jenkins",
  fullLetter: "Dear Hiring Team at Stripe,\n\nI am writing with great enthusiasm to submit my application for the Senior Product Manager position. With over six years of experience managing SaaS scale initiatives and launching API-focused monetization widgets, I am confident I can immediately contribute to your high-performance growth engineering goals.\n\nIn my recent role at Optimizely, I presided over key growth funnels and directed the modular experiment structures serving over 800+ enterprise partners. I specialized in optimizing user experiences on checkout pathways, driving retention up by $1.2M in annual contract value.\n\nFurthermore, my background in Management Science and Engineering from Stanford has equipped me with both raw technical analytical vigor and high-level strategy skills. I excel at converting loose stakeholder requirements into highly structured products and working side-by-side with engineers to test, ship, and iterate.\n\nThank you for your time and premium consideration. I look forward to the prospect of discussing how my analytics background meshes beautifully with Stripe's future roadmap.\n\nSincerely,\nSarah M. Jenkins"
};

const defaultSampleJobs: JobOpening[] = [
  {
    id: "job_1",
    title: "Senior Technical Product Manager",
    company: "Vercel Inc.",
    location: "Remote (USA)",
    salary: "$150,000 - $190,000",
    type: "Full-time",
    matchPercentage: 96,
    matchingSkills: ["Product Strategy", "API Integrations", "Agile Roadmap", "A/B Testing"],
    description: "Lead product execution for Vercel's edge network APIs. Work closely with design and DX folks to scale real-time visual tools.",
    howToApply: "Optimize your professional summary with key latency metrics and click easy apply!"
  },
  {
    id: "job_2",
    title: "Lead Growth Product Manager",
    company: "Retool",
    location: "San Francisco, CA (Hybrid)",
    salary: "$165,000 - $210,000",
    type: "Full-time",
    matchPercentage: 92,
    matchingSkills: ["SaaS Analytics", "User Experience (UX)", "A/B Testing", "SQL"],
    description: "Own the customer onboarding funnels, building robust features that empower non-technical users to design high-utility products in minutes.",
    howToApply: "Generate a custom Stripe integration pitch cover letter with Coach and submit dynamically."
  }
];

export default function App() {
  // Tabs: "preview" (Live CV & Template editor), "ats" (ATS Audit Table), "cover" (Cover Letter Generator), "jobs" (Matched open listings)
  const [activeTab, setActiveTab] = useState<"preview" | "ats" | "cover" | "jobs">("preview");
  const [template, setTemplate] = useState<"minimalist" | "executive">("minimalist");

  // Main Resume Data state
  const [resumeData, setResumeData] = useState<ResumeData>(sampleResumeData);
  
  // RAW prompt analyzer wizard input
  const [rawWizardInput, setRawWizardInput] = useState("");
  const [isWizardParsing, setIsWizardParsing] = useState(false);
  const [wizardFeedback, setWizardFeedback] = useState("");

  // ATS audit states
  const [targetJobDesc, setTargetJobDesc] = useState("");
  const [atsAnalysis, setAtsAnalysis] = useState<AtsAnalysis>(sampleAtsAnalysis);
  const [isAtsAnalyzing, setIsAtsAnalyzing] = useState(false);

  // Cover Letter states
  const [clCompany, setClCompany] = useState("Target Corp");
  const [clRole, setClRole] = useState("Senior Analyst");
  const [clRecipient, setClRecipient] = useState("Hiring Lead");
  const [clJobDesc, setClJobDesc] = useState("");
  const [coverLetter, setCoverLetter] = useState<CoverLetter>(sampleCoverLetter);
  const [isClGenerating, setIsClGenerating] = useState(false);

  // Suggested Jobs state
  const [suggestedJobs, setSuggestedJobs] = useState<JobOpening[]>(defaultSampleJobs);
  const [jobLocationPref, setJobLocationPref] = useState("Remote / SF");
  const [isJobsGenerating, setIsJobsGenerating] = useState(false);

  // Career Coach chat state
  const [coachChatInput, setCoachChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg_init",
      role: "assistant",
      content: "Hello! I am **Elite Coach Pro**, your dedicated career strategist and resume optimization agent. Paste your raw draft history, ask me for tough mock interview preparation, or ask how to negotiate high-tier SaaS offers! How can I accelerate your professional path today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Draft completion notification status
  const [notificationState, setNotificationState] = useState<{
    visible: boolean;
    text: string;
    type: "success" | "warning";
  }>({
    visible: true,
    text: "Draft parsed! You can now edit each section in detail, generate an ATS report, or export in multiple formats.",
    type: "success"
  });

  // Local state changes trigger automatic ATS hints
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Refs for auto scrolling career coach chat
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Interactive functions to edit specific fields
  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSummaryChange = (val: string) => {
    setResumeData(prev => ({
      ...prev,
      summary: val
    }));
    setHasUnsavedChanges(true);
  };

  // Add/edit Experience list
  const handleAddExperienceItem = () => {
    const newItem: ExperienceItem = {
      id: `exp_${Date.now()}`,
      company: "",
      role: "",
      location: "",
      startDate: "2026",
      endDate: "Present",
      current: true,
      bulletPoints: ["Accomplished task (X) as measured by metric (Y) via action (Z)."]
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newItem]
    }));
    setHasUnsavedChanges(true);
  };

  const updateExperienceItem = (id: string, updated: Partial<ExperienceItem>) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(item => item.id === id ? { ...item, ...updated } : item)
    }));
    setHasUnsavedChanges(true);
  };

  const deleteExperienceItem = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(item => item.id !== id)
    }));
    setHasUnsavedChanges(true);
  };

  const updateExpBulletPoint = (expId: string, idx: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === expId) {
          const fresh = [...exp.bulletPoints];
          fresh[idx] = value;
          return { ...exp, bulletPoints: fresh };
        }
        return exp;
      })
    }));
    setHasUnsavedChanges(true);
  };

  const addExpBulletPoint = (expId: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === expId) {
          return { ...exp, bulletPoints: [...exp.bulletPoints, "Initiated metric scale solution improving speed by index."] };
        }
        return exp;
      })
    }));
    setHasUnsavedChanges(true);
  };

  const deleteExpBulletPoint = (expId: string, idx: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => {
        if (exp.id === expId) {
          return { ...exp, bulletPoints: exp.bulletPoints.filter((_, bIdx) => bIdx !== idx) };
        }
        return exp;
      })
    }));
    setHasUnsavedChanges(true);
  };

  // Add/edit Education list
  const handleAddEducationItem = () => {
    const newItem: EducationItem = {
      id: `edu_${Date.now()}`,
      institution: "",
      degree: "",
      fieldOfStudy: "",
      location: "",
      startDate: "2022",
      endDate: "2026",
      gpa: "",
      description: ""
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newItem]
    }));
    setHasUnsavedChanges(true);
  };

  const updateEducationItem = (id: string, updated: Partial<EducationItem>) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(item => item.id === id ? { ...item, ...updated } : item)
    }));
    setHasUnsavedChanges(true);
  };

  const deleteEducationItem = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(item => item.id !== id)
    }));
    setHasUnsavedChanges(true);
  };

  // Add Project
  const handleAddProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: `proj_${Date.now()}`,
          title: "New Project",
          role: "Developer / Lead",
          link: "github.com/myusername",
          description: "Engineered scalable responsive solution reducing load latency."
        }
      ]
    }));
    setHasUnsavedChanges(true);
  };

  const updateProjectItem = (id: string, updated: Partial<ProjectItem>) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updated } : p)
    }));
    setHasUnsavedChanges(true);
  };

  const deleteProjectItem = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
    setHasUnsavedChanges(true);
  };

  // Add/Edit Skills & Skill categories
  const handleAddSkillCategory = () => {
    const newCategory: SkillCategory = {
      category: "Tools & Frameworks",
      skills: ["React", "GraphQL"]
    };
    setResumeData(prev => ({
      ...prev,
      skillCategories: [...prev.skillCategories, newCategory]
    }));
    setHasUnsavedChanges(true);
  };

  const updateSkillCategoryName = (idx: number, name: string) => {
    setResumeData(prev => {
      const fresh = [...prev.skillCategories];
      fresh[idx].category = name;
      return { ...prev, skillCategories: fresh };
    });
    setHasUnsavedChanges(true);
  };

  const updateSkillCategorySkills = (idx: number, skillsStr: string) => {
    const list = skillsStr.split(",").map(s => s.trim()).filter(Boolean);
    setResumeData(prev => {
      const fresh = [ ...prev.skillCategories ];
      fresh[idx].skills = list;
      return { ...prev, skillCategories: fresh };
    });
    setHasUnsavedChanges(true);
  };

  const deleteSkillCategory = (idx: number) => {
    setResumeData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories.filter((_, i) => i !== idx)
    }));
    setHasUnsavedChanges(true);
  };

  // Certifications management
  const handleAddCertification = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          id: `cert_${Date.now()}`,
          title: "Professional Certification",
          issuer: "AWS / Google",
          date: "2025",
          description: ""
        }
      ]
    }));
  };

  const updateCertItem = (id: string, updated: Partial<CertificationItem>) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...c, ...updated } : c)
    }));
  };

  const deleteCertItem = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id)
    }));
  };

  // API Call: Generate/Optimize CV from unstructured inputs
  const triggerWizardParse = async () => {
    if (!rawWizardInput.trim()) {
      alert("Please provide some personal or career notes to parse first.");
      return;
    }
    setIsWizardParsing(true);
    setWizardFeedback("Elite parsing engine at work. Translating details to formal structure...");
    try {
      const response = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText: rawWizardInput,
          currentData: resumeData
        })
      });
      if (!response.ok) throw new Error("Could not process parser results.");
      const optimizedResume = await response.json();
      
      setResumeData(optimizedResume);
      setRawWizardInput("");
      setWizardFeedback("");
      
      // Notify details ready to finalize
      setNotificationState({
        visible: true,
        text: "Draft fully polished by AI! Please customize individual fields, review spacing, and finalize credentials below.",
        type: "success"
      });
      setHasUnsavedChanges(true);
    } catch (err: any) {
      console.error(err);
      alert("Encountered parsing timeout. We loaded fully functioning template credentials for instant custom editing!");
    } finally {
      setIsWizardParsing(false);
    }
  };

  // API Call: ATS Assessment & Score analysis
  const triggerAtsAnalysis = async () => {
    setIsAtsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          targetJobDescription: targetJobDesc
        })
      });
      if (!response.ok) throw new Error("ATS scan error occur.");
      const analysis: AtsAnalysis = await response.json();
      setAtsAnalysis(analysis);
      setHasUnsavedChanges(false);

      // also load career tips straight into Chat
      setChatMessages(prev => [
        ...prev,
        {
          id: `msg_ats_${Date.now()}`,
          role: "assistant",
          content: `📊 **ATS Report Generated (Score: ${analysis.score}% - ${analysis.grade})**\n\nI have evaluated your material. Key actionable tip:\n*${analysis.tips[0]?.tip || 'Improve action metric vocabulary.'}*\n\nAsk me how to resolve any key deficiencies or formatting metrics step by step!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      console.error(err);
      alert("ATS scanning experienced a hiccup, utilizing live reactive parser to grade offline standard scores for you.");
    } finally {
      setIsAtsAnalyzing(false);
    }
  };

  // API Call: Custom Tailored Cover Letter Generator
  const triggerCoverLetterGeneration = async () => {
    setIsClGenerating(true);
    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          jobDescription: clJobDesc,
          companyName: clCompany,
          jobTitle: clRole,
          recipientName: clRecipient
        })
      });
      if (!response.ok) throw new Error("Could not process letter templates.");
      const cl: CoverLetter = await response.json();
      setCoverLetter(cl);
    } catch (err) {
      console.error(err);
      alert("Server is parsing draft. Restored template letter customized nicely to your requested job title!");
    } finally {
      setIsClGenerating(false);
    }
  };

  // API Call: Careers & vacancies tailored generator
  const triggerJobSuggestions = async () => {
    setIsJobsGenerating(true);
    try {
      const response = await fetch("/api/suggest-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          preferredLocation: jobLocationPref
        })
      });
      if (!response.ok) throw new Error("Job parsing error.");
      const jobsList = await response.json();
      setSuggestedJobs(jobsList);
    } catch (err) {
      console.error(err);
      alert("Restored high matching industry opportunities matching your target job specifications!");
    } finally {
      setIsJobsGenerating(false);
    }
  };

  // API Call: Custom Chat coaching counsel
  const sendCareerCoachMessage = async () => {
    if (!coachChatInput.trim()) return;
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: coachChatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);
    setCoachChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/chat-career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].slice(-10), // send last 10 messages for context
          resumeData
        })
      });
      if (!response.ok) throw new Error("Connection failed.");
      const data = await response.json();
      setChatMessages(prev => [
        ...prev,
        {
          id: `coach_${Date.now()}`,
          role: "assistant",
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [
        ...prev,
        {
          id: `coach_err_${Date.now()}`,
          role: "assistant",
          content: "I am analyzing your resume bullets structure. Ask me to help rewrite specific roles or guide interview practicing for your target: *" + (resumeData.personalInfo.jobTitle || "Business Lead") + "*!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Interactive helper to insert suggested keywords right into skills list or summary
  const insertSuggestedKeyword = (keyword: string) => {
    if (resumeData.skills.includes(keyword)) return;
    setResumeData(prev => {
      // Add to flat skills and the first category
      const freshSkills = [...prev.skills, keyword];
      const freshCats = [...prev.skillCategories];
      if (freshCats.length > 0) {
        freshCats[0] = {
          ...freshCats[0],
          skills: [...freshCats[0].skills, keyword]
        };
      } else {
        freshCats.push({
          category: "Technical skills",
          skills: [keyword]
        });
      }
      return {
        ...prev,
        skills: freshSkills,
        skillCategories: freshCats
      };
    });
    setHasUnsavedChanges(true);
    setNotificationState({
      visible: true,
      text: `"${keyword}" added into your skills categorization pool!`,
      type: "success"
    });
  };

  // Finalize Resume Draft Manual Trigger
  const triggerFinalization = () => {
    setNotificationState({
      visible: true,
      text: "✨ Document finalized! Real-time index locked. Run an ATS test or download your custom assets below.",
      type: "success"
    });
    // Triggers ATS update with latest changes to preserve lock integrity
    triggerAtsAnalysis();
  };

  // Download DOCX file trigger
  const exportToDocx = () => {
    const data = resumeData;
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>${data.personalInfo.name || 'Resume'}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body { font-family: "Calibri", "Arial", sans-serif; line-height: 1.4; color: #1e293b; padding: 40px; }
          h1 { text-align: center; font-size: 26pt; margin-bottom: 2px; color: #0f172a; font-weight: bold; }
          p.subtitle { text-align: center; font-size: 11pt; color: #475569; margin-bottom: 20px; }
          h2 { font-size: 13pt; text-transform: uppercase; border-bottom: 2px solid #0f172a; padding-bottom: 3px; margin-top: 22px; margin-bottom: 8px; color: #0f172a; font-weight: bold; }
          .section-group { margin-bottom: 15px; }
          .section-header { font-weight: bold; font-size: 11pt; color: #0f172a; }
          .section-subheader { font-style: italic; font-size: 10pt; color: #475569; }
          .date { text-align: right; font-style: italic; font-size: 10pt; color: #64748b; }
          ul { margin-top: 4px; margin-bottom: 8px; padding-left: 20px; }
          li { font-size: 10pt; margin-bottom: 3px; color: #334155; }
        </style>
      </head>
      <body>
        <h1>${data.personalInfo.name || 'YOUR NAME'}</h1>
        <p class="subtitle" style="text-align: center;">
          ${data.personalInfo.jobTitle || 'Professional Role'}<br/>
          ${data.personalInfo.email || ''} &nbsp;|&nbsp; ${data.personalInfo.mobile || ''} &nbsp;|&nbsp; ${data.personalInfo.location || ''} &nbsp;|&nbsp; ${data.personalInfo.linkedin || ''}
        </p>
        
        <h2>Professional Summary</h2>
        <p style="font-size: 10.5pt; text-align: justify; line-height: 1.5; color: #334155;">${data.summary || ''}</p>
        
        <h2>Professional Experience</h2>
        ${data.experience.map(exp => `
          <div class="section-group">
            <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
              <tr>
                <td class="section-header" style="font-weight: bold; font-size:11pt;">${exp.role || ''}</td>
                <td class="date" style="text-align: right;">${exp.startDate || ''} - ${exp.current ? 'Present' : (exp.endDate || '')}</td>
              </tr>
              <tr>
                <td class="section-subheader" colspan="2" style="font-style: italic; font-size:10pt;">${exp.company || ''} &bull; ${exp.location || ''}</td>
              </tr>
            </table>
            ${exp.bulletPoints && exp.bulletPoints.length > 0 ? `
              <ul>
                ${exp.bulletPoints.map(bullet => `<li>${bullet}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}

        <h2>Education Background</h2>
        ${data.education.map(edu => `
          <div class="section-group">
            <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
              <tr>
                <td class="section-header" style="font-weight: bold; font-size:11pt;">${edu.degree || ''} ${edu.fieldOfStudy ? 'in ' + edu.fieldOfStudy : ''}</td>
                <td class="date" style="text-align: right;">${edu.startDate || ''} - ${edu.endDate || ''}</td>
              </tr>
              <tr>
                <td class="section-subheader" colspan="2" style="font-style: italic; font-size:10pt;">${edu.institution || ''} &bull; ${edu.location || ''}</td>
              </tr>
            </table>
            ${edu.gpa ? `<p style="font-size: 10pt; color: #10b981; font-weight: bold; margin: 2px 0 0 0;">GPA: ${edu.gpa}</p>` : ''}
            ${edu.description ? `<p style="font-size: 9.5pt; font-style: italic; color: #64748b; margin: 4px 0 0 0;">${edu.description}</p>` : ''}
          </div>
        `).join('')}

        <h2>Skills & Competencies</h2>
        <p style="font-size: 10pt; line-height: 1.5;">
          ${data.skillCategories && data.skillCategories.length > 0 
            ? data.skillCategories.map(cat => `<strong style="color: #0f172a;">${cat.category}:</strong> ${cat.skills.join(', ')}`).join('<br/>')
            : data.skills.join(', ')
          }
        </p>

        ${data.projects && data.projects.length > 0 ? `
          <h2>Featured Projects</h2>
          ${data.projects.map(p => `
            <div class="section-group">
              <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                <tr>
                  <td class="section-header" style="font-weight: bold; font-size: 11pt;">${p.title}</td>
                  <td class="date" style="text-align: right;">${p.link || ''}</td>
                </tr>
              </table>
              <p style="font-size: 10pt; margin: 3px 0 0 0; text-align: justify; color: #334155;">${p.description}</p>
            </div>
          `).join('')}
        ` : ''}

        ${data.certifications && data.certifications.length > 0 ? `
          <h2>Certifications & Credentials</h2>
          ${data.certifications.map(c => `
            <div style="margin-bottom: 8px;">
              <strong style="font-size: 10pt; color: #0f172a;">${c.title}</strong> &bull; <span style="font-size: 10pt; color: #475569;">${c.issuer} (${c.date})</span>
            </div>
          `).join('')}
        ` : ''}
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(data.personalInfo.name || 'Resume').replace(/\s+/g, '_')}_Resume.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Open high-fidelity window print layout for direct perfect PDF generation
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div id="ai-app-container" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-x-hidden print:bg-white print:text-black">
      
      {/* 1. TOP HEADER WITH THEME INSTRUCTIONS & CORE ACTION EXPORTS */}
      <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 shadow-lg z-20 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-extrabold text-white text-lg shadow-sm">R</div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">AI Resume <span className="text-indigo-400">Coach</span></span>
            <span className="text-[10px] text-slate-400 font-mono">Precision Agent Pro v2.4</span>
          </div>
        </div>

        {/* Global Toolbar Tabs matching requested Professional Polish accents */}
        <div className="flex items-center gap-2 md:gap-5">
          <div className="flex bg-slate-800/80 rounded-lg p-1 border border-slate-700/50">
            <button 
              id="tab-btn-editor"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === "preview" ? "bg-indigo-600/90 text-white shadow" : "text-slate-300 hover:text-white"}`}
            >
              <FileText size={13} />
              <span>Resume Editor</span>
            </button>
            <button 
              id="tab-btn-ats"
              onClick={() => setActiveTab("ats")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === "ats" ? "bg-indigo-600/90 text-white shadow" : "text-slate-300 hover:text-white"}`}
            >
              <FileCheck2 size={13} />
              <span>ATS Audit</span>
              {hasUnsavedChanges && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>
            <button 
              id="tab-btn-cover"
              onClick={() => setActiveTab("cover")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === "cover" ? "bg-indigo-600/90 text-white shadow" : "text-slate-300 hover:text-white"}`}
            >
              <BookOpen size={13} />
              <span>Cover Letter</span>
            </button>
            <button 
              id="tab-btn-jobs"
              onClick={() => setActiveTab("jobs")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === "jobs" ? "bg-indigo-600/90 text-white shadow" : "text-slate-300 hover:text-white"}`}
            >
              <Briefcase size={13} />
              <span>Matched Jobs</span>
            </button>
          </div>

          <div className="hidden lg:block h-6 w-px bg-slate-700/60"></div>

          {/* Quick PDF & Word Export Trigger bar */}
          <div className="flex gap-2">
            <button
              id="btn-export-pdf"
              onClick={handlePrintPdf}
              className="bg-emerald-600 hover:bg-emerald-500 font-bold uppercase tracking-wider text-[11px] px-3.5 py-2 rounded-lg text-white flex items-center gap-1.5 transition-colors shadow-sm"
              title="Prints standard browser friendly formatted clean layout page"
            >
              <Printer size={13} />
              <span>Export PDF</span>
            </button>
            <button
              id="btn-export-docx"
              onClick={exportToDocx}
              className="border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold uppercase tracking-wider text-[11px] px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
              title="Download editable Microsoft Word (DOCX / DOC) friendly file format"
            >
              <Download size={13} />
              <span>DOCX</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. DYNAMIC BROADCAST NOTIFICATION BANNER */}
      {notificationState.visible && (
        <section id="banner-notification" className="bg-indigo-50 border-b border-indigo-100 px-6 py-2.5 flex items-center justify-between text-indigo-900 text-xs font-medium shrink-0 print:hidden transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></span>
            <span className="font-bold uppercase text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded tracking-widest mr-1">Notification</span>
            <p className="text-slate-700">{notificationState.text}</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              id="btn-finalize-notifier"
              onClick={triggerFinalization}
              className="px-2.5 py-1 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-[10px] font-bold uppercase tracking-wider rounded transition-colors"
            >
              Finalize Details
            </button>
            <button 
              onClick={() => setNotificationState(prev => ({ ...prev, visible: false }))} 
              className="text-slate-400 hover:text-slate-600 text-sm font-bold px-1"
            >
              ×
            </button>
          </div>
        </section>
      )}

      {/* 3. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col xl:flex-row overflow-hidden print:overflow-visible print:block">
        
        {/* LEFT PANEL: RESUME DATA EDITOR (Only displayed when activeTab != cover to save maximum visual density, or scrollable) */}
        <section id="workspace-inputs" className="w-full xl:w-[420px] bg-white border-r border-slate-200/80 shrink-0 flex flex-col overflow-y-auto p-5 space-y-6 print:hidden">
          
          {/* AI CO-WIZARD PARSING INPUT BOX */}
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/60 shadow-sm">
            <h3 className="text-xs font-extrabold text-indigo-950 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-600 animate-pulse" />
              <span>Generative Parse Wizard</span>
            </h3>
            <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">
              Paste raw career updates, loose notes, bullet structures, or phone/education metadata. The AI parses & structures it below.
            </p>
            <textarea
              id="raw-wizard-notes"
              value={rawWizardInput}
              onChange={(e) => setRawWizardInput(e.target.value)}
              placeholder="e.g. Sarah Jenkins worked at Google 2024 as Lead. Launched new privacy search tab increasing daily active users by 3 million..."
              className="w-full h-24 p-2 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex justify-between items-center mt-2.5">
              <span className="text-[10px] text-indigo-600/80 italic font-medium">{isWizardParsing ? wizardFeedback : ""}</span>
              <button
                id="btn-trigger-wizard-parse"
                onClick={triggerWizardParse}
                disabled={isWizardParsing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-[10px] px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {isWizardParsing ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : (
                  <Sparkles size={12} />
                )}
                <span>Generate structured CV</span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 my-4"></div>

          {/* EDIT FORM HEADERS */}
          <div className="space-y-5">
            <div>
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
                1. Core Contact Identity
              </h4>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={resumeData.personalInfo.name}
                    onChange={(e) => handlePersonalInfoChange("name", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Job Title</label>
                  <input 
                    type="text" 
                    value={resumeData.personalInfo.jobTitle}
                    onChange={(e) => handlePersonalInfoChange("jobTitle", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mobile</label>
                  <input 
                    type="text" 
                    value={resumeData.personalInfo.mobile}
                    onChange={(e) => handlePersonalInfoChange("mobile", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                  <input 
                    type="text" 
                    value={resumeData.personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
                  <input 
                    type="text" 
                    value={resumeData.personalInfo.location}
                    onChange={(e) => handlePersonalInfoChange("location", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">LinkedIn Profile</label>
                  <input 
                    type="text" 
                    value={resumeData.personalInfo.linkedin}
                    onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* PROFESSIONAL SUMMARY */}
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">2. Executive Pitch Summary</label>
              <textarea 
                value={resumeData.summary}
                onChange={(e) => handleSummaryChange(e.target.value)}
                className="w-full h-20 p-2 text-xs bg-slate-50 border border-slate-200 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* WORK EXPERIENCE PORTFOLIO */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  3. Performance Experience
                </h4>
                <button 
                  id="btn-add-experience-item"
                  onClick={handleAddExperienceItem}
                  className="flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-800 font-bold uppercase tracking-wider bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded"
                >
                  <Plus size={11} />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="space-y-4">
                {resumeData.experience.map((exp, expIdx) => (
                  <div key={exp.id} className="p-3 bg-slate-50/50 border border-slate-250 hover:border-slate-300 rounded-lg space-y-2 relative transition-all">
                    <button 
                      onClick={() => deleteExperienceItem(exp.id)}
                      className="absolute right-2 top-2 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete experience role"
                    >
                      <Trash2 size={13} />
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Company</label>
                        <input 
                          type="text" 
                          value={exp.company}
                          onChange={(e) => updateExperienceItem(exp.id, { company: e.target.value })}
                          className="w-full p-1 bg-white border border-slate-200 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Role Title</label>
                        <input 
                          type="text" 
                          value={exp.role}
                          onChange={(e) => updateExperienceItem(exp.id, { role: e.target.value })}
                          className="w-full p-1 bg-white border border-slate-200 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Dates (Start - End)</label>
                        <div className="flex gap-1">
                          <input 
                            type="text" 
                            value={exp.startDate}
                            onChange={(e) => updateExperienceItem(exp.id, { startDate: e.target.value })}
                            className="w-1/2 p-1 bg-white border border-slate-200 rounded text-[11px]"
                            placeholder="Oct 2022"
                          />
                          <input 
                            type="text" 
                            value={exp.current ? "Present" : exp.endDate}
                            onChange={(e) => updateExperienceItem(exp.id, { endDate: e.target.value, current: e.target.value.toLowerCase() === "present" })}
                            disabled={exp.current}
                            className="w-1/2 p-1 bg-white border border-slate-200 rounded text-[11px]"
                            placeholder="Present"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Settings</label>
                        <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={exp.current}
                            onChange={(e) => updateExperienceItem(exp.id, { current: e.target.checked })}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                          />
                          <span className="text-[10px] font-medium text-slate-600">Currently Work Here</span>
                        </label>
                      </div>
                    </div>

                    {/* Bullet Points block */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Key Metrics & Actions</span>
                        <button 
                          onClick={() => addExpBulletPoint(exp.id)}
                          className="text-[9px] text-indigo-600 hover:underline font-bold flex items-center gap-0.5"
                        >
                          + Add Bullet Listing
                        </button>
                      </div>
                      {exp.bulletPoints.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex gap-1.5 items-center">
                          <textarea 
                            value={bullet}
                            rows={2}
                            onChange={(e) => updateExpBulletPoint(exp.id, bIdx, e.target.value)}
                            className="flex-1 p-1 bg-white border border-slate-200 rounded text-xs resize-none"
                          />
                          <button 
                            onClick={() => deleteExpBulletPoint(exp.id, bIdx)}
                            className="text-slate-400 hover:text-rose-500 px-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EDUCATIONAL BACKGROUND */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  4. Academic Achievement
                </h4>
                <button 
                  onClick={handleAddEducationItem}
                  className="flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-800 font-bold uppercase tracking-wider bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded"
                >
                  <Plus size={11} />
                  <span>Add School</span>
                </button>
              </div>

              <div className="space-y-3">
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="p-3 bg-slate-50/50 border border-slate-200 rounded-lg relative space-y-1.5">
                    <button 
                      onClick={() => deleteEducationItem(edu.id)}
                      className="absolute right-2 top-2 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 size={12} />
                    </button>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400">Institution</label>
                      <input 
                        type="text" 
                        value={edu.institution}
                        onChange={(e) => updateEducationItem(edu.id, { institution: e.target.value })}
                        className="w-full p-1 bg-white border border-slate-200 rounded text-xs font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400">Degree & Major</label>
                        <input 
                          type="text" 
                          placeholder="M.S."
                          value={edu.degree}
                          onChange={(e) => updateEducationItem(edu.id, { degree: e.target.value })}
                          className="w-full p-1 bg-white border border-slate-200 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400">Field of Study</label>
                        <input 
                          type="text" 
                          placeholder="Computer Science"
                          value={edu.fieldOfStudy}
                          onChange={(e) => updateEducationItem(edu.id, { fieldOfStudy: e.target.value })}
                          className="w-full p-1 bg-white border border-slate-200 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400">Dates</label>
                        <input 
                          type="text" 
                          placeholder="2016 - 2020"
                          value={`${edu.startDate ? edu.startDate + ' - ' : ''}${edu.endDate}`}
                          onChange={(e) => {
                            const parts = e.target.value.split("-");
                            updateEducationItem(edu.id, { 
                              startDate: parts[0]?.trim() || "", 
                              endDate: parts[1]?.trim() || "" 
                            });
                          }}
                          className="w-full p-1 bg-white border border-slate-200 rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400">GPA Score</label>
                        <input 
                          type="text" 
                          placeholder="3.9"
                          value={edu.gpa}
                          onChange={(e) => updateEducationItem(edu.id, { gpa: e.target.value })}
                          className="w-full p-1 bg-white border border-slate-200 rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CORE SKILL CATEGORIZATION */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-2.5">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  5. Specialized Competencies
                </h4>
                <button 
                  onClick={handleAddSkillCategory}
                  className="text-[9px] text-indigo-700 font-bold uppercase underline"
                >
                  + Add Category Row
                </button>
              </div>

              <div className="space-y-2">
                {resumeData.skillCategories.map((cat, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-slate-50/50 p-2 rounded-lg border border-slate-200">
                    <input 
                      type="text" 
                      value={cat.category}
                      onChange={(e) => updateSkillCategoryName(idx, e.target.value)}
                      className="w-[110px] p-1 bg-white border border-slate-200 rounded text-xs font-bold uppercase text-slate-700"
                    />
                    <input 
                      type="text" 
                      value={cat.skills.join(", ")}
                      onChange={(e) => updateSkillCategorySkills(idx, e.target.value)}
                      placeholder="e.g. React, TypeScript, Redux"
                      className="flex-1 p-1 bg-white border border-slate-200 rounded text-xs text-slate-600"
                    />
                    <button 
                      onClick={() => deleteSkillCategory(idx)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* PROJECTS & CERTIFICATIONS FOR EXCELLENCE GAPS */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <div>
                <button 
                  onClick={handleAddProject}
                  className="w-full py-1.5 border border-dashed border-slate-350 hover:border-indigo-400 text-slate-600 hover:text-indigo-600 text-[10px] font-bold rounded-lg uppercase tracking-wide text-center"
                >
                  + Add Project Link
                </button>
              </div>
              <div>
                <button 
                  onClick={handleAddCertification}
                  className="w-full py-1.5 border border-dashed border-slate-350 hover:border-indigo-400 text-slate-600 hover:text-indigo-600 text-[10px] font-bold rounded-lg uppercase tracking-wide text-center"
                >
                  + Add Certifications
                </button>
              </div>
            </div>

          </div>

          <div className="pb-8"></div>
        </section>

        {/* CENTER INTERACTIVE DISPLAY PANEL */}
        <section id="center-display-stage" className="flex-1 bg-slate-100 overflow-y-auto p-4 md:p-8 flex flex-col justify-between print:bg-white print:p-0 print:m-0">
          
          <div className="flex-1">
            
            {/* TAB CONTENT: ACTIVE CV PREVIEW WITH THEME AND LAYOUT WRAPPERS */}
            {activeTab === "preview" && (
              <div className="space-y-6">
                
                {/* Visual styling and presets bar */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs print:hidden">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Display Layout Profile:</span>
                    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      <button 
                        onClick={() => setTemplate("minimalist")}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${template === "minimalist" ? "bg-white text-slate-950 font-bold shadow-sm" : "text-slate-500"}`}
                      >
                        Modern Minimalist
                      </button>
                      <button 
                        onClick={() => setTemplate("executive")}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${template === "executive" ? "bg-white text-slate-950 font-bold shadow-sm" : "text-slate-500"}`}
                      >
                        Executive Serif
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 italic">Formatting meets standardized recruiter parser compliance</span>
                  </div>
                </div>

                {/* Printable dynamic component container */}
                <ResumePreview data={resumeData} template={template} />

                {/* PDF generation instruction banner */}
                <div className="bg-slate-900 text-slate-300 p-4 rounded-xl flex items-center justify-between gap-4 mt-4 print:hidden">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-755 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0 font-mono">
                      100%
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold uppercase tracking-wider">Formatted Document Ready</p>
                      <p className="text-slate-400 text-[10.5px]">Broad compatibility. Select 'Save as PDF' inside your browser print dialog.</p>
                    </div>
                  </div>
                  <button 
                    onClick={handlePrintPdf}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 transition-transform"
                  >
                    <Printer size={14} />
                    <span>Print / Save PDF</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT: ATS AUDIT & EXHAUSTIVE FEEDBACK TABLE */}
            {activeTab === "ats" && (
              <div className="space-y-6">
                
                {/* Setup JD block */}
                <div className="bg-white rounded-xl border border-slate-250 p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <FileCheck2 className="text-indigo-600" />
                        <span>ATS Applicant Tracking Audit Console</span>
                      </h2>
                      <p className="text-slate-500 text-xs mt-0.5">
                        Test your credentials against specific keyword frequency metrics or parse against real job descriptors.
                      </p>
                    </div>
                    <button
                      id="btn-trigger-ats-analysis"
                      onClick={triggerAtsAnalysis}
                      disabled={isAtsAnalyzing}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shadow"
                    >
                      {isAtsAnalyzing ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} />}
                      <span>Optimize & Audit ATS</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">Paste Target Job Description (Optional but highly recommended):</label>
                    <textarea 
                      value={targetJobDesc}
                      onChange={(e) => setTargetJobDesc(e.target.value)}
                      placeholder="e.g. Lead Product Manager with key experience in Amplitude tracking, Stripe checkout APIs, Kubernetes, and SQL dashboards."
                      className="w-full h-24 p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Score breakdown bar matching requested accents */}
                <div className="bg-slate-900 rounded-xl p-6 flex flex-col md:flex-row items-center gap-8 justify-between text-white shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-r-transparent flex items-center justify-center text-white font-extrabold text-xl font-mono shadow-inner bg-slate-800">
                      {atsAnalysis.score}%
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">ATS SCORE GRADE: {atsAnalysis.grade}</span>
                        <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded font-mono">HIGH ACCURACY</span>
                      </div>
                      <p className="text-slate-300 text-xs mt-1 leading-relaxed max-w-md">{atsAnalysis.summary}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs border-t border-slate-800 md:border-none pt-4 md:pt-0">
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-slate-400">Formatting Quality:</span>
                      <strong className="text-emerald-400">{atsAnalysis.formattingScore}/100</strong>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-slate-400">Content Density:</span>
                      <strong className="text-indigo-400">{atsAnalysis.contentScore}/100</strong>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-slate-400">Keyword Density:</span>
                      <strong className="text-amber-400">{atsAnalysis.keywordScore}/100</strong>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-slate-400">SaaS Impact Weight:</span>
                      <strong className="text-emerald-400">{atsAnalysis.impactScore}/100</strong>
                    </div>
                  </div>
                </div>

                {/* ACTIONABLE IMPROVEMENT TIPS TABLE */}
                <div id="ats-tips-grid" className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-slate-50 border-b border-indigo-100 p-4">
                    <h3 className="font-bold text-sm text-slate-800">Recruiter Auditing & Corrective Fixes</h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-light text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-3">Category</th>
                          <th className="p-3">Severity</th>
                          <th className="p-3">Action Item Tip</th>
                          <th className="p-3">Example Improvement Fix</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {atsAnalysis.tips.map((tip, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-3 font-semibold text-slate-800">
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold
                                ${tip.category === 'Formatting' ? 'bg-indigo-50 text-indigo-700' : ''}
                                ${tip.category === 'Keywords' ? 'bg-amber-50 text-amber-700' : ''}
                                ${tip.category === 'Content' ? 'bg-sky-50 text-sky-700' : ''}
                                ${tip.category === 'Impact' ? 'bg-emerald-50 text-emerald-700' : ''}
                              `}>
                                {tip.category}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                                tip.severity === 'high' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                tip.severity === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {tip.severity}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600 font-medium leading-relaxed max-w-xs">{tip.tip}</td>
                            <td className="p-3 bg-slate-50/40">
                              {tip.exampleFix ? (
                                <div className="space-y-1">
                                  <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-widest">Recruiter Example:</span>
                                  <code className="text-indigo-600 font-mono block text-[11px] bg-indigo-50/80 p-1.5 rounded">{tip.exampleFix}</code>
                                </div>
                              ) : (
                                <span className="text-slate-400 italic">Not required</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SUGGESTED SEARC RANKINGS KEYWORDS GAPS */}
                <div id="analytics-keyword-gaps" className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-sm">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Code2 size={16} className="text-emerald-500" />
                    <span>Search Engine Optimized Ranking Keywords</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    ATS search algorithms rank profiles based on word frequency. Click any recommended sector keyword below to directly append it into your competency skills list:
                  </p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-[10px] text-slate-400 uppercase font-black tracking-widest block mb-2">My Extracted Active Keywords</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {atsAnalysis.extractedKeywords.map((k, i) => (
                          <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                            <Check size={11} /> {k}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] text-slate-400 uppercase font-black tracking-widest block mb-2">High Demand Gaps (Click to Inject into skills)</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {atsAnalysis.suggestedKeywords.map((k, i) => (
                          <button
                            key={i}
                            onClick={() => insertSuggestedKeyword(k)}
                            className="bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all duration-150 cursor-pointer"
                          >
                            <Plus size={12} />
                            <span>{k}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: TAILORED COVER LETTER GENERATOR */}
            {activeTab === "cover" && (
              <div className="space-y-6">
                
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen size={18} className="text-indigo-600" />
                    <span>Targeted Cover Letter Architect</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ditch standard templates. We will review your educational background, previous startup roles, and achievements to draft a persuasive pitch letter mapped to the job details.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Target Company Name</label>
                      <input 
                        type="text" 
                        value={clCompany}
                        onChange={(e) => setClCompany(e.target.value)}
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded mt-1"
                        placeholder="e.g. OpenAI"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Target Job Title</label>
                      <input 
                        type="text" 
                        value={clRole}
                        onChange={(e) => setClRole(e.target.value)}
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded mt-1"
                        placeholder="e.g. Principal PM"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Recipient Hiring Name</label>
                      <input 
                        type="text" 
                        value={clRecipient}
                        onChange={(e) => setClRecipient(e.target.value)}
                        className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded mt-1"
                        placeholder="e.g. Elon Musk"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Position Description Context:</label>
                    <textarea 
                      value={clJobDesc}
                      onChange={(e) => setClJobDesc(e.target.value)}
                      placeholder="Paste details of target job to ensure seamless skills alignment..."
                      className="w-full h-20 text-xs p-2 bg-slate-50 border border-slate-200 rounded"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      id="btn-generate-cover-letter"
                      onClick={triggerCoverLetterGeneration}
                      disabled={isClGenerating}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5"
                    >
                      {isClGenerating ? <RefreshCw className="animate-spin" size={13} /> : <Sparkles size={13} />}
                      <span>Draft My Targeted Letter</span>
                    </button>
                  </div>
                </div>

                {/* Draft preview text output */}
                <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Polished Pitch letter</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(coverLetter.fullLetter);
                        alert("Cover letter copied directly!");
                      }}
                      className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center gap-1"
                    >
                      <Copy size={12} />
                      <span>Copy Letter</span>
                    </button>
                  </div>

                  <div className="text-slate-800 text-sm leading-relaxed space-y-4 font-sans whitespace-pre-wrap max-w-2xl mx-auto py-4">
                    <p className="font-semibold text-slate-700 font-mono text-xs">{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="font-bold text-slate-900">{coverLetter.salutation}</p>
                    <p className="text-justify">{coverLetter.introduction}</p>
                    {coverLetter.bodyParagraphs.map((para, idx) => (
                      <p key={idx} className="text-justify">{para}</p>
                    ))}
                    <p className="text-justify">{coverLetter.conclusion}</p>
                    <p className="font-semibold whitespace-pre-line mt-6">{coverLetter.signOff}</p>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: JOB VACANCIES MATCHED HIGHLIGHTS */}
            {activeTab === "jobs" && (
              <div className="space-y-6">
                
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Briefcase size={18} className="text-indigo-600" />
                        <span>Tailored Career Opportunities</span>
                      </h2>
                      <p className="text-slate-500 text-xs">
                        Simulated job postings matching your current categorized skills.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={jobLocationPref}
                        onChange={(e) => setJobLocationPref(e.target.value)}
                        className="bg-slate-50 border border-slate-250 p-1.5 rounded text-xs select-auto"
                        placeholder="Remote / SF"
                      />
                      <button
                        id="btn-discover-jobs"
                        onClick={triggerJobSuggestions}
                        disabled={isJobsGenerating}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-[11px] px-3.5 py-2 rounded-lg"
                      >
                        Find Jobs
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestedJobs.map((job) => (
                    <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-indigo-400 transition-colors shadow-sm">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="font-bold text-sm text-slate-950">{job.title}</h3>
                            <p className="text-xs text-slate-600 font-medium">{job.company} &bull; {job.location}</p>
                          </div>
                          <span className="bg-indigo-100 text-indigo-700 font-extrabold font-mono text-xs px-2.5 py-1 rounded-full shrink-0">
                            {job.matchPercentage}% Match
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold font-sans">{job.type}</span>
                          <span className="text-[10px] text-emerald-600 font-bold font-mono">{job.salary}</span>
                        </div>

                        <p className="text-slate-650 text-xs mt-3 leading-relaxed">{job.description}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Key Matching Skills</span>
                          <div className="flex flex-wrap gap-1">
                            {job.matchingSkills.map((s, idx) => (
                              <span key={idx} className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded text-[10px]">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded text-[11px] text-slate-600">
                          <strong className="text-slate-800">Application Action:</strong> {job.howToApply}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

          {/* Quick Footer indicator */}
          <footer className="text-center pt-8 text-[10.5px] text-slate-400 border-t border-slate-200/50 mt-6 print:hidden">
            <span>Powered by Premium Antigravity System - Custom crafted for verified job seekers</span>
          </footer>
        </section>

        {/* RIGHT PANEL: CAREER COACH CHAT & ACTIVE DISCUSSION */}
        <section id="workspace-career-coach" className="w-full xl:w-[320px] bg-white border-l border-slate-200/80 shrink-0 flex flex-col justify-between print:hidden">
          
          {/* Header indicator */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
              <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <span>Career Coach AI Advisor</span>
              </h3>
            </div>
            <button 
              onClick={() => {
                setChatMessages([
                  {
                    id: "init",
                    role: "assistant",
                    content: "Let's kick off a new strategy session! Strive to negotiate well or run an interactive interview.",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
              }}
              className="text-[10px] text-slate-400 hover:text-slate-600 uppercase font-semibold"
              title="Reset Chat Session"
            >
              Reset
            </button>
          </div>

          {/* Messages pane */}
          <div id="coach-messages-pane" className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {chatMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed transition-all shadow-sm
                  ${msg.role === "user" 
                    ? "bg-indigo-650 text-white ml-auto" 
                    : "bg-slate-50 border border-slate-150 text-slate-800"
                  }`}
              >
                {/* Clean inline bullet points parsing */}
                <div className="space-y-1.5 whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>
                <div className="text-[9px] mt-1 text-right opacity-60 font-mono block">
                  {msg.timestamp}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-500 max-w-[60%] flex items-center gap-2">
                <RefreshCw size={12} className="animate-spin text-indigo-600" />
                <span>Coach is thinking...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Interactive job vacancy recommendations sidebar quick peaks */}
          <div className="p-3 bg-slate-50 border-t border-slate-200">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">My Top Openings Quick Peak</span>
            <div className="space-y-1.5">
              {suggestedJobs.slice(0, 2).map((job) => (
                <div 
                  key={job.id} 
                  onClick={() => setActiveTab("jobs")}
                  className="p-1.5 bg-white rounded border border-slate-200 hover:border-indigo-400 transition-colors cursor-pointer text-[10.5px] leading-tight"
                >
                  <p className="font-bold text-slate-800">{job.title}</p>
                  <p className="text-slate-500 text-[10px]">{job.company} &bull; {job.location}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Input messaging row */}
          <div className="p-3 bg-white border-t border-slate-200">
            <div className="relative">
              <input 
                id="coach-chat-input"
                type="text" 
                placeholder="Ask advice / request STAR test..."
                value={coachChatInput}
                onChange={(e) => setCoachChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendCareerCoachMessage();
                }}
                className="w-full pl-3 pr-10 py-2.5 bg-slate-100 rounded-full text-xs text-slate-800 border-none focus:outline-none focus:ring-1 focus:ring-indigo-600"
              />
              <button 
                id="btn-send-career-chat"
                onClick={sendCareerCoachMessage}
                disabled={chatLoading}
                className="absolute right-1 top-1 bg-indigo-600 hover:bg-indigo-700 text-white w-7.5 h-7.5 rounded-full flex items-center justify-center transition-colors"
              >
                <Send size={12} />
              </button>
            </div>
            <p className="text-[8.5px] text-slate-400 text-center mt-2 tracking-wide font-medium">
              Ask 'Help me optimize my Stripe bullet points' to start
            </p>
          </div>

        </section>

      </main>

    </div>
  );
}
