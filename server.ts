import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for raw resume text pasting and images
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Lazy initialisation of the Gemini client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// ---------------------------------------------------------
// Helper endpoints & Core AI logic
// ---------------------------------------------------------

// API Route: Build/Optimize ResumeData from raw text or partial data
app.post("/api/generate-cv", async (req, res) => {
  try {
    const { rawText, currentData } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are an expert resume writer and recruiter specializing specifically in the Saudi Arabian (KSA) job market with 15+ years of high-tier recruitment experience.
Your goal is to parse and convert any unstructured or raw professional details, text, or incomplete resumes into a perfectly structured, professionally polished CV conforming strictly to the ResumeData format, optimized for Saudi corporate standards (including Vision 2030 alignment).

When optimizing content:
1. Professionalize phrasing: Rewrite bullets to start with powerful Action Verbs (e.g. Optimized, Guided, Orchestrated, Engineered, Spearheaded, Maximized) and inject measurable business metrics where possible.
2. Localize for KSA: Frame experiences around Saudi context (e.g., highlighting contributions to Saudi Vision 2030 pillars, localization metrics, digital transformation goals, or public-private partnerships in Riyadh, Jeddah, Dammam, NEOM, etc.).
3. Group skills logically into categories (e.g., Technical, Leadership, Compliance).
4. Draft a high-impact, compelling Professional Summary (3-4 sentences) outlining how their expertise accelerates the company's regional growth objectives.
5. Standardize KSA contact details: Format mobile numbers using "+966" style if applicable.

You MUST respond with a single valid JSON object following this exact structure and nothing else. Ensure nulls or empty arrays are initialized if data is missing, never omit keys.

Expected ResumeData JSON structure:
{
  "personalInfo": {
    "name": "full name or blank",
    "email": "email or blank",
    "mobile": "mobile or blank (+966-5x-xxxxxxx or blank)",
    "location": "City, Saudi Arabia or blank",
    "linkedin": "linkedin url or blank",
    "website": "portfolio url or blank",
    "jobTitle": "targeted executive or professional job title (e.g. Senior Project Manager, Saudi Vision 2030 Specialist)"
  },
  "summary": "comprehensive professional punchy summary optimized for Saudi recruitment",
  "experience": [
    {
      "id": "exp_1",
      "company": "company name (e.g. Saudi Aramco, NEOM, stc)",
      "role": "job title/role",
      "location": "location of company (e.g. Riyadh, Saudi Arabia)",
      "startDate": "Month Year or format",
      "endDate": "Month Year, Present, etc",
      "current": true/false status,
      "bulletPoints": [
        "Action-oriented result targeting Saudi transformation objectives",
        "Action-oriented metric bullet 2"
      ]
    }
  ],
  "education": [
    {
      "id": "edu_1",
      "institution": "university/school (e.g. King Saud University, KFUPM, KAUST)",
      "degree": "degree program (e.g. Bachelor of Science)",
      "fieldOfStudy": "field (e.g. Software Engineering)",
      "location": "location of school (e.g. Dhahran, Saudi Arabia)",
      "startDate": "Year",
      "endDate": "Year",
      "gpa": "GPA or blank (out of 4.0 or 5.0)",
      "description": "honors, achievements or local Saudi honors"
    }
  ],
  "skills": ["flat array of raw skills including local regulatory structures"],
  "skillCategories": [
    {
      "category": "Soft Skills / Engineering / Public Sector",
      "skills": ["Skill A", "Skill B"]
    }
  ],
  "certifications": [
    {
      "id": "cert_1",
      "title": "cert title (e.g. SCE, SOCPA, PMP)",
      "issuer": "certifying organization (e.g. Saudi Council of Engineers)",
      "date": "Year or date",
      "description": ""
    }
  ],
  "projects": [
    {
      "id": "proj_1",
      "title": "project title (e.g. Riyadh Metro sub-component)",
      "role": "your role in project",
      "link": "url or blank",
      "description": "brief descriptions"
    }
  ],
  "languages": ["Arabic (Native)", "English (Professional)"]
}`;

    const userPrompt = `
Here is the input provided by the user. Parse, complete, elevate, and transform it into the expected JSON shape.
Raw text input:
"""
${rawText || ""}
"""

Existing interactive structured inputs (merge, correct, and optimize if present):
${currentData ? JSON.stringify(currentData, null, 2) : "None"}

Generate ONLY the JSON string. Do not wrap in markdown \`\`\`json blocks. Return raw JSON text.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsedJson = JSON.parse(response.text || "{}");
    res.json(parsedJson);
  } catch (error: any) {
    console.error("Error generating CV:", error);
    res.status(500).json({ error: error.message || "Failed to generate CV." });
  }
});

// API Route: Analyze CV against ATS (Applicant Tracking System) rules
app.post("/api/analyze-ats", async (req, res) => {
  try {
    const { resumeData, targetJobDescription } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are an elite Applicant Tracking System (ATS) parsing bot and Senior HR Recruiter in the Saudi Arabian (KSA) corporate ecosystem.
Evaluate the provided candidate resume data against standard recruiter filters, localization mandates (Saudization/Nitaqat compliance readiness), and algorithmic KSA market ratings.

Assess specifically:
1. Formatting & Parsability (Are headers correct, bilingual presentation suitable, contacts formatted correctly for Saudi recruiters?)
2. KSA Corporate Alignment (Highlighting local credentials: Saudi Council of Engineers (SCE) for developers/architects, SOCPA for accounting/auditing, or Saudi nationality/Iqama status for Nitaqat optimization)
3. Vision 2030 Relevance (Are transformation metrics, localized project management achievements, or bilingual capability clearly visible?)
4. Professional Impact & Metrics (Are bullet points action-oriented with concrete financial/percentage impacts?)

You MUST return a JSON object conforming to this exact schema (no additional markdown wrap, just raw JSON) containing rating scores from 0 to 100, and Saudi-centric actionable tips:

{
  "score": 82, // composite rating 0-100
  "grade": "A-", // letter grade (A+, A, A-, B+, etc.)
  "summary": "Recruiter summary of the CV compliance level with KSA local market requirements and Vision 2030 key sectors...",
  "formattingScore": 85,
  "contentScore": 78,
  "keywordScore": 80,
  "impactScore": 85,
  "tips": [
    {
      "category": "Formatting", // Must be "Formatting" | "Content" | "Keywords" | "Impact"
      "severity": "high", // Must be "high" | "medium" | "low"
      "tip": "Include reference to your 'Saudi Council of Engineers (SCE)' credential to pass tech recruiter filters.",
      "exampleFix": "Add to Certifications: 'Registered Associate Engineer - Saudi Council of Engineers (License ID: 1245xx)'"
    }
  ],
  "extractedKeywords": ["Saudi Vision 2030 Alignment", "Project Management", "ERP Systems", "Arabic Bilingual"],
  "suggestedKeywords": ["Saudi HRSD systems", "Qiwa Portal", "Mudad", "Project Management Office (PMO)", "SAR Budget Controls"] // Key elements in KSA missing from their CV
}`;

    const userPrompt = `
Analyze the following resume details:
${JSON.stringify(resumeData || {}, null, 2)}

Target Job Description (if any, use to pinpoint missing critical keywords and alignment):
"""
${targetJobDescription || "Not provided. Analyze generally for their target job title: " + (resumeData?.personalInfo?.jobTitle || "any general position")}
"""

Provide the completed ATS assessment in JSON format:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsedOutput = JSON.parse(response.text || "{}");
    res.json(parsedOutput);
  } catch (error: any) {
    console.error("Error analyzing ATS:", error);
    res.status(500).json({ error: error.message || "Failed to analyze resume on ATS rules." });
  }
});

// API Route: Suggest tailored Cover Letter
app.post("/api/generate-cover-letter", async (req, res) => {
  try {
    const { resumeData, jobDescription, companyName, jobTitle, recipientName } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are a professional copywriter and cover letter strategist specializing in Saudi Arabia (KSA) executive applications.
Write a top-tier, persuasive, custom-tailored cover letter based on the user's resume data and target job details.
The letter must follow Saudi business etiquettes, emphasize support for the host employer's goals under Saudi Vision 2030, maintain high-level respectful greetings (e.g., targeting Ministry departments, stc, Aramco, PIF subsidiaries, or NEOM leaders). Avoid generic templates.

You MUST respond strictly with a valid JSON matching this schema:
{
  "recipientName": "string or 'Hiring Committee'",
  "companyName": "string",
  "jobTitle": "string",
  "salutation": "Dear Hiring Committee, / Respectful Hiring Manager at [Company],",
  "introduction": "first hook paragraph that state interest and key level, mentioning excitement to contribute to their expansion in the Kingdom of Saudi Arabia",
  "bodyParagraphs": [
    "Paragraph 1 establishing a core operational match (e.g., how they managed projects aligned to the Giga-project timelines or stc/Aramco frameworks)",
    "Paragraph 2 highlighting bilingual Arabic/English competence, team saudization mentorship, or local context mastery"
  ],
  "conclusion": "Closing paragraph proposing an interview/call in Riyadh/Jeddah or online, and expressing premium enthusiasm",
  "signOff": "With respect and dynamic thanks, \\n[Name]",
  "fullLetter": "complete ready-to-copy aggregated cover letter string with spacing and salutation"
}`;

    const userPrompt = `
Candidate Resume Data:
${JSON.stringify(resumeData || {}, null, 2)}

Job Details:
- Company Name: ${companyName || "Target Company"}
- Job Title: ${jobTitle || "Desired Position"}
- Recipient/Hiring Manager Name: ${recipientName || "Hiring Team"}
- Job Description:
"""
${jobDescription || "Not provided. Draft a compelling cover letter for the job title: " + (jobTitle || resumeData?.personalInfo?.jobTitle || "General Role")}
"""

Generate the tailored cover letter in raw JSON shape:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const output = JSON.parse(response.text || "{}");
    res.json(output);
  } catch (error: any) {
    console.error("Error generating cover letter:", error);
    res.status(500).json({ error: error.message || "Failed to generate cover letter." });
  }
});

// API Route: Custom Career Coach & Mock Interview Chat Advisor
app.post("/api/chat-career", async (req, res) => {
  try {
    const { messages, resumeData } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `You are 'Elite Coach Pro', an experienced corporate recruitment lead, KSA HR regulations strategist, and Saudi Vision 2030 career mentor.
You have full details of the candidate's resume optimized for Saudi Arabia:
${JSON.stringify(resumeData || {}, null, 2)}

Your tone is exceedingly Warm, Respectful, Professional, comforting yet deeply Insightful and Pragmatic in terms of the Gulf Cooperation Council (GCC) corporate style.
When interacting with the candidate:
1. Provide actionable help, like updating resume achievements for Saudi Aramco, NEOM, PIF, SABIC, or stc; preparing Riyadh-based salaries; or understanding the Saudi Labor Law.
2. If asked to do a Mock Interview, ask them one tough role-relevant question at a time (e.g., handling rapid digital scale, localization/saudization dynamics, or managing PMO under tight timelines). Evaluate using the STAR format.
3. Incorporate local Saudi recruitment frameworks: Qiwa Portal, Mudad system, HRSD regulations, SCE, and GOSI.
4. Ensure advice is structured beautifully using clean typography, bold heading lines, and clear, respectful paragraphs.`;

    const chatInputMessages = (messages || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Generate output utilizing generic generateContent
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatInputMessages,
      config: {
        systemInstruction,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in career chat:", error);
    res.status(500).json({ error: error.message || "Failed to execute career coach chat." });
  }
});

// API Route: Recommend relevant simulated job vacancies based on resume skills
app.post("/api/suggest-jobs", async (req, res) => {
  try {
    const { resumeData, preferredLocation, companySize } = req.body;
    const ai = getGeminiClient();

    const companySizeText = companySize === "corporate" 
      ? "only large corporate conglomerates, government ministries, or famous KSA Giga-projects (e.g., Saudi Aramco, NEOM, stc, SABIC, PIF, Al Rajhi Bank, Diriyah DGDA, King Salman Park, etc.)"
      : companySize === "medium"
        ? "only mid-market enterprises (MMEs), key regional digital partners, specialized logistics suppliers, and established multi-office domestic agencies"
        : companySize === "small"
          ? "only agile high-growth startups, boutique professional consultancies, localized software shops, or premium scaleups incubated in Riyadh hubs like The Garage, KACST, or Jada"
          : "a healthy, realistic mixture of large Giga-projects (Corporates), Medium Enterprises (MMEs), and high-growth Tech Startups/Boutiques (SMEs) to demonstrate full Saudi market coverage";

    const systemPrompt = `You are a career matching search engine calibrated primarily for the Saudi Arabia (KSA) job marketplace. Analyze the candidate's core qualifications, skills, and experience.
Generate at least 20 distinct, highly realistic, and up-to-date job vacancies suited for their profile, filtered specifically to target ${companySizeText}.

Because the current date context is after June 2026:
- Always generate updated, valid expiry dates in the future (e.g., between September 2026 and March 2027) in YYYY-MM-DD or Month Year.
- Provide a realistic, authoritative source like "LinkedIn", "stc Careers Portal", "Aramco e-Recruiting", "Bayt.com", "The Garage Job Board", "GulfTalent", or specific company landing pages.
- Ensure the matchPercentage is an integer between 75 and 99.
- Target cities in Saudi Arabia like Riyadh, Jeddah, Dammam, Khobar, Jubail, Dhahran, NEOM, Tabuk, or Thuwal.

You MUST return exactly a JSON list of at least 20 solid, distinct items conforming strictly to this Schema:
[
  {
    "id": "job_1",
    "title": "Saudi Market Job Title (e.g., digital lead / Director of PMO / Associate Developer)",
    "company": "Employer Name (reflecting the requested company bracket)",
    "location": "Location within Saudi Arabia (e.g., Riyadh, Saudi Arabia)",
    "salary": "Compensation range in SAR (e.g., 18,000 SAR - 25,000 SAR / Month)",
    "type": "Full-time (Saudization Eligible) | Hybrid | On-Site",
    "matchPercentage": 93,
    "matchingSkills": ["Skill A", "Skill B", "Skill C"],
    "description": "Short 2-3 sentence overview of this exciting opportunity matching the resume summary.",
    "howToApply": "Optimize your resume's Vision 2030 alignment, and click to apply through their corporate desk!",
    "source": "LinkedIn",
    "expiryDate": "2026-10-31"
  }
]`;

    const userPrompt = `
Analyze this candidate for matching job suggestions:
${JSON.stringify(resumeData || {}, null, 2)}
Preferred general location or setting: ${preferredLocation || "Riyadh or Hybrid"}
Target company bracket requested: ${companySize || "all"}

Provide the JSON array containing exactly 20-24 matching items:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error suggesting jobs:", error);
    res.status(500).json({ error: error.message || "Failed to fetch job suggestions." });
  }
});

// ---------------------------------------------------------
// Vite Integration & Base Serving Layout
// ---------------------------------------------------------

async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Global server listener
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting securely on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err: any) => {
  console.error("Bootstrapping server failed:", err);
});
