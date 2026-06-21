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

    const systemPrompt = `You are an expert resume writer and recruiter with 15+ years experience.
Your goal is to parse and convert any unstructured or raw professional details, text, or incomplete resumes into a perfectly structured, professionally polished CV conforming strictly to the ResumeData format.

When optimizing content:
1. Professionalize phrasing: Rewrite bullets to start with powerful Action Verbs (e.g. Optimized, Headed, Spearheaded, Engineered, Designed, Maximized) and inject measurable business impact/metrics where possible.
2. Group skills logically into categories (e.g., Development, Management, Frontend).
3. Draft a high-impact, compelling Professional Summary (3-4 sentences) that highlights major expertise and career drive.
4. Correct spelling, grammar, and improve visual layout structures virtually.

You MUST respond with a single valid JSON object following this exact structure and nothing else. Ensure nulls or empty arrays are initialized if data is missing, never omit keys.

Expected ResumeData JSON structure:
{
  "personalInfo": {
    "name": "full name or blank",
    "email": "email or blank",
    "mobile": "mobile or blank",
    "location": "city, state/country or blank",
    "linkedin": "linkedin url or blank",
    "website": "portfolio url or blank",
    "jobTitle": "targeted executive or professional job title (e.g. Senior Software Engineer)"
  },
  "summary": "comprehensive professional punchy summary",
  "experience": [
    {
      "id": "exp_1",
      "company": "company name",
      "role": "job title/role",
      "location": "location of company",
      "startDate": "Month Year or format",
      "endDate": "Month Year, Present, etc",
      "current": true/false status,
      "bulletPoints": [
        "Action-oriented result metric bullet 1",
        "Action-oriented result metric bullet 2"
      ]
    }
  ],
  "education": [
    {
      "id": "edu_1",
      "institution": "university/school",
      "degree": "degree program (e.g. B.S.)",
      "fieldOfStudy": "field (e.g. Computer Science)",
      "location": "location of school",
      "startDate": "Year",
      "endDate": "Year",
      "gpa": "GPA or blank",
      "description": "honors, achievements or research work"
    }
  ],
  "skills": ["flat array of raw skills"],
  "skillCategories": [
    {
      "category": "Soft Skills / Frontend / Backend",
      "skills": ["Skill A", "Skill B"]
    }
  ],
  "certifications": [
    {
      "id": "cert_1",
      "title": "cert title",
      "issuer": "certifying organization",
      "date": "Year or date",
      "description": ""
    }
  ],
  "projects": [
    {
      "id": "proj_1",
      "title": "project title",
      "role": "your role in project",
      "link": "url or blank",
      "description": "brief descriptions"
    }
  ],
  "languages": ["English", "Spanish"]
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

    const systemPrompt = `You are an elite Applicant Tracking System (ATS) parsing bot and HR recruiter.
Evaluate the provided candidate resume data against standard recruiter filters and algorithmic scores, optionally cross-referencing with the target job description if provided.

Assess:
1. Formatting & Parsability (Are headers correct, length reasonable, clear structure?)
2. Content Strength (Bullet density, action verbs used, metrics and achievements included?)
3. Keyword Matching (Are industry-standard skills and semantic words present? If a Job Description is provided, compare match levels.)
4. Professional Impact (Job title strength, summary persuasiveness, scope level.)

You MUST return a JSON object conforming to this exact schema (no additional markdown wrap, just raw JSON) containing scoring from 0 to 100 and actionable feedback:

{
  "score": 82, // composite rating 0-100
  "grade": "A-", // letter grade (A+, A, A-, B+, etc.)
  "summary": "Recruiter summary of the CV compliance level...",
  "formattingScore": 85,
  "contentScore": 78,
  "keywordScore": 80,
  "impactScore": 85,
  "tips": [
    {
      "category": "Formatting", // Must be "Formatting" | "Content" | "Keywords" | "Impact"
      "severity": "high", // Must be "high" | "medium" | "low"
      "tip": "Increase metric usage in your experience bullet points.",
      "exampleFix": "Replace 'Responsible for writing api' with 'Engineered 14 Microservices in Node.js increasing API throughput by 24%'"
    }
  ],
  "extractedKeywords": ["React", "TypeScript", "Node.js", "Express"],
  "suggestedKeywords": ["Docker", "Kubernetes", "AWS API Gateway", "GraphQL"] // Important keywords suitable for their target/level that are missing or low
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

    const systemPrompt = `You are a professional copywriter and cover letter strategist.
Write a top-tier, persuasive, custom-tailored cover letter based on the user's resume data and target job specifics.
The letter should feel authentic, conversational yet deeply professional, demonstrate acute interest in the role, and clearly map the candidate's achievements to the core requirements in the Job Description. Avoid generic templates.

You MUST respond strictly with a valid JSON matching this schema:
{
  "recipientName": "string or 'Hiring Team'",
  "companyName": "string",
  "jobTitle": "string",
  "salutation": "Dear Recruiter / Dear Mr. Smith,",
  "introduction": "first hook paragraph that state interest and key level",
  "bodyParagraphs": [
    "Paragraph 1 establishing a core match (e.g. how they engineered scalable structures matching your Node/AWS description)",
    "Paragraph 2 highlighting leadership, soft skills, or culture add"
  ],
  "conclusion": "Closing paragraph proposing an interview/call and expressing enthusiasm",
  "signOff": "Sincerely, \\n[Name]",
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

    const systemInstruction = `You are 'Elite Coach Pro', an experienced recruitment lead, career strategist, and mock-interview trainer.
You have full details of the candidate's optimized resume:
${JSON.stringify(resumeData || {}, null, 2)}

Your tone should be Warm, Professional, encouraging yet highly Insightful and Pragmatic.
When interacting with the candidate:
1. Provide actionable help, like reviewing an individual project, simulating mock-interview answers for their stated role, or explaining salary negotiation tips.
2. If asked to do a Mock Interview, ask them one tough relevant question at a time and evaluate their answers using the STAR format (Situation, Task, Action, Result).
3. Suggest resume tweaks and keep answers structured natively with bullet points, brief strategies, or mock scripts.
4. Always support long term career planning and high confidence. Ensure formatting uses crisp typography, clean headings, and clear paragraphing.`;

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
    const { resumeData, preferredLocation } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are a career matching search engine. Analyze the candidate's core qualifications, skills, and experience.
Generate 4 highly relevant, realistic job openings suitable for their background and profile. Write complete job summaries tailored to their skills, indicating precisely why they match and listing action items for application.

Return strictly a JSON list conforming to this schema (no markdown formatting, just raw JSON array of objects):
[
  {
    "id": "job_1",
    "title": "Job Title (e.g., Software Architect)",
    "company": "Fictional Tech Inc / Meta / etc.",
    "location": "Location (e.g., San Francisco, CA / Remote)",
    "salary": "Compensation index (e.g. $120,000 - $150,000)",
    "type": "Full-time | Part-time | Remote",
    "matchPercentage": 94, // 0-100 match rating
    "matchingSkills": ["React", "GraphQL", "TypeScript"],
    "description": "Short 2-3 sentence overview of this exciting opportunity matching the resume summary.",
    "howToApply": "Click the 'Easy Apply' button inside prompt, optimize your Professional Summary header, or request Elite Coach for a custom pitch letter!"
  }
]`;

    const userPrompt = `
Analyze this candidate for matching job suggestions:
${JSON.stringify(resumeData || {}, null, 2)}
Preferred general location or setting: ${preferredLocation || "Remote or Hybrid preference"}

Provide the JSON array:`;

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
