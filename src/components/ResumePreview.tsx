import React from "react";
import { ResumeData } from "../types";
import { Mail, Phone, MapPin, Linkedin, Globe, Briefcase, GraduationCap, Award, FolderKanban, Speech } from "lucide-react";

interface ResumePreviewProps {
  data: ResumeData;
  template: "minimalist" | "executive";
}

export default function ResumePreview({ data, template }: ResumePreviewProps) {
  const { personalInfo, summary, experience, education, skills, skillCategories, certifications, projects, languages } = data;

  const fontClass = template === "executive" ? "font-serif" : "font-sans";

  return (
    <div 
      id="printable-resume-area" 
      className={`w-full bg-white text-slate-800 shadow-sm border border-slate-200/60 rounded-xl p-8 md:p-12 ${fontClass} transition-all duration-300 print:shadow-none print:border-none print:p-0 print:m-0`}
    >
      {/* HEADER SECTION */}
      {template === "executive" ? (
        <div className="text-center border-b border-slate-300 pb-5 mb-6">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight uppercase">
            {personalInfo.name || "YOUR NAME"}
          </h1>
          <p className="text-md font-medium text-slate-600 tracking-wide mt-1 uppercase">
            {personalInfo.jobTitle || "TARGET PROFESSION"}
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-3 font-mono">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail size={12} /> {personalInfo.email}
              </span>
            )}
            {personalInfo.mobile && (
              <span className="flex items-center gap-1">
                <Phone size={12} /> {personalInfo.mobile}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {personalInfo.location}
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin size={12} /> {personalInfo.linkedin}
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-1">
                <Globe size={12} /> {personalInfo.website}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="pb-6 mb-6 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {personalInfo.name || "YOUR NAME"}
              </h1>
              <p className="text-lg font-semibold text-indigo-600 tracking-tight mt-0.5">
                {personalInfo.jobTitle || "Desired/Target Title"}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-slate-600 font-sans md:text-right">
              {personalInfo.email && (
                <div className="flex items-center md:justify-end gap-1.5">
                  <span className="text-slate-400"><Mail size={12} /></span>
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.mobile && (
                <div className="flex items-center md:justify-end gap-1.5 font-mono">
                  <span className="text-slate-400"><Phone size={12} /></span>
                  <span>{personalInfo.mobile}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center md:justify-end gap-1.5">
                  <span className="text-slate-400"><MapPin size={12} /></span>
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center md:justify-end gap-1.5">
                  <span className="text-slate-400"><Linkedin size={12} /></span>
                  <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline text-indigo-600">{personalInfo.linkedin.replace(/https?:\/\/(www\.)?/, '')}</a>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center md:justify-end gap-1.5">
                  <span className="text-slate-400"><Globe size={12} /></span>
                  <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline text-indigo-600">{personalInfo.website.replace(/https?:\/\/(www\.)?/, '')}</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUMMARY */}
      {summary && (
        <div className="mb-6">
          <h2 className={`text-sm font-bold tracking-wider uppercase text-slate-900 mb-2 border-b border-slate-100 pb-1 flex items-center gap-1.5 ${template === "executive" ? "border-slate-300" : ""}`}>
            Professional Summary
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed text-justify whitespace-pre-wrap">
            {summary}
          </p>
        </div>
      )}

      {/* WORK EXPERIENCE */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className={`text-sm font-bold tracking-wider uppercase text-slate-900 mb-3 border-b border-slate-100 pb-1 flex items-center gap-1.5 ${template === "executive" ? "border-slate-300" : ""}`}>
            <Briefcase size={14} className="text-slate-700" /> Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="group">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {exp.role || "Role Title"}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600">
                      {exp.company || "Company Name"}
                      {exp.location ? ` — ${exp.location}` : ""}
                    </p>
                  </div>
                  <div className="text-xs text-slate-500 font-mono sm:text-right">
                    {exp.startDate || "Date Intro"} – {exp.current ? "Present" : (exp.endDate || "Date End")}
                  </div>
                </div>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="list-disc list-inside mt-2 text-slate-600 text-xs space-y-1 pl-1">
                    {exp.bulletPoints.map((bullet, idx) => (
                      <li key={idx} className="leading-relaxed list-item align-top text-justify">
                        <span className="font-sans ml-1 text-slate-600">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDUCATION */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className={`text-sm font-bold tracking-wider uppercase text-slate-900 mb-3 border-b border-slate-100 pb-1 flex items-center gap-1.5 ${template === "executive" ? "border-slate-300" : ""}`}>
            <GraduationCap size={14} className="text-slate-700" /> Education Background
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {edu.degree || "Degree"} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600">
                      {edu.institution || "School Name"}{edu.location ? `, ${edu.location}` : ""}
                    </p>
                  </div>
                  <div className="text-xs text-slate-500 font-mono sm:text-right">
                    {edu.startDate ? `${edu.startDate} – ` : ""}{edu.endDate || ""}
                  </div>
                </div>
                {edu.gpa && (
                  <p className="text-xs font-semibold text-emerald-600 mt-0.5">GPA: {edu.gpa}</p>
                )}
                {edu.description && (
                  <p className="text-slate-500 text-xs mt-1 italic whitespace-pre-wrap">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SKILLS */}
      {((skillCategories && skillCategories.length > 0) || (skills && skills.length > 0)) && (
        <div className="mb-6">
          <h2 className={`text-sm font-bold tracking-wider uppercase text-slate-900 mb-3 border-b border-slate-100 pb-1 flex items-center gap-1.5 ${template === "executive" ? "border-slate-300" : ""}`}>
            Core Core Skills & Competencies
          </h2>
          
          {skillCategories && skillCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skillCategories.map((cat, idx) => (
                <div key={idx} className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {cat.category}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((s, sIdx) => (
                      <span key={sIdx} className="bg-white px-2 py-0.5 rounded border border-slate-200/60 text-[11px] text-slate-600 font-medium font-sans">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span key={idx} className="bg-slate-50 px-2.5 py-1 rounded border border-slate-200 text-xs text-slate-700 font-medium">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROJECTS & CERTIFICATIONS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PROJECTS */}
        {projects && projects.length > 0 && (
          <div>
            <h2 className={`text-sm font-bold tracking-wider uppercase text-slate-900 mb-3 border-b border-slate-100 pb-1 flex items-center gap-1.5 ${template === "executive" ? "border-slate-300" : ""}`}>
              <FolderKanban size={13} className="text-slate-700" /> Selected Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xs font-bold text-slate-900">{proj.title}</h3>
                    {proj.link && (
                      <span className="text-[10px] text-indigo-600 hover:underline break-all max-w-[120px] text-right font-mono">{proj.link.replace(/https?:\/\/(www\.)?/, '')}</span>
                    )}
                  </div>
                  {proj.role && <p className="text-[11px] font-semibold text-slate-500 italic mt-0.5">{proj.role}</p>}
                  <p className="text-slate-600 text-[11px] mt-1 text-justify leading-normal whitespace-pre-wrap">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS */}
        {certifications && certifications.length > 0 && (
          <div>
            <h2 className={`text-sm font-bold tracking-wider uppercase text-slate-900 mb-3 border-b border-slate-100 pb-1 flex items-center gap-1.5 ${template === "executive" ? "border-slate-300" : ""}`}>
              <Award size={13} className="text-slate-700" /> Certifications & Credentials
            </h2>
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert.id}>
                  <div className="flex justify-between items-baseline gap-1">
                    <h3 className="text-xs font-bold text-slate-900">{cert.title}</h3>
                    <span className="text-[10px] text-slate-500 font-mono">{cert.date}</span>
                  </div>
                  <p className="text-[11px] text-indigo-600 font-semibold">{cert.issuer}</p>
                  {cert.description && <p className="text-slate-500 text-[10px] mt-0.5 leading-normal">{cert.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* LANGUAGES */}
      {languages && languages.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Languages:</span>
            <div className="flex flex-wrap gap-2 text-xs text-slate-600">
              {languages.map((lang, idx) => (
                <span key={idx} className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200/50 text-[11px] font-medium text-slate-700">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
