"use client";

import {
  Resume,
  Education,
  Experience,
  Project,
  Certification,
  Links,
} from "@/types";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Briefcase,
  GraduationCap,
  FolderOpen,
  Award,
  Languages,
  Pencil,
  Save,
  X,
  Download,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, ChangeEvent } from "react";

interface ProfileClientProps {
  initialData: Resume;
}

// --- Reusable sub-components ---

function SectionCard({
  icon,
  title,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${className}`}
    >
      <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2.5">
        <span className="text-navy-600">{icon}</span>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

function SkillTag({ skill }: { skill: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-navy-50 text-navy-700 border border-navy-100 transition-colors hover:bg-navy-100">
      {skill}
    </span>
  );
}

function TimelineItem({
  title,
  subtitle,
  meta,
  description,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  description?: string | null;
}) {
  return (
    <div className="relative pl-6 pb-6 last:pb-0 group">
      {/* Timeline line */}
      <div className="absolute left-0 top-2 bottom-0 w-px bg-gray-200 group-last:hidden" />
      {/* Timeline dot */}
      <div className="absolute left-[-3.5px] top-2 w-[8px] h-[8px] rounded-full bg-navy-500 border-2 border-white shadow-sm" />

      <h3 className="text-sm font-semibold text-slate-800 leading-tight">
        {title}
      </h3>
      {subtitle && <p className="text-sm text-slate-600 mt-0.5">{subtitle}</p>}
      {meta && (
        <p className="text-xs text-slate-400 mt-0.5 font-medium">{meta}</p>
      )}
      {description && (
        <div className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {description}
        </div>
      )}
    </div>
  );
}

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium border transition-all animate-slide-up ${
        type === "success"
          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
          : "bg-red-50 text-red-800 border-red-200"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 size={16} />
      ) : (
        <AlertCircle size={16} />
      )}
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

// --- Form field helpers ---

function FormField({
  label,
  id,
  value,
  onChange,
  type = "text",
  placeholder,
  rows,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  rows?: number;
}) {
  const baseClasses =
    "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-navy-400 focus:ring-1 focus:ring-navy-400/20 transition-all outline-none placeholder:text-gray-400";

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider"
      >
        {label}
      </label>
      {rows ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          className={`${baseClasses} resize-y`}
        />
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
    </div>
  );
}

// --- Main Component ---

export default function ProfileClient({ initialData }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Resume>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Reset form when exiting edit mode
  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  // --- Field change handlers ---
  const updateField = (field: keyof Resume, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = <T extends object>(
    section: keyof Resume,
    index: number,
    field: keyof T,
    value: string,
  ) => {
    setFormData((prev) => {
      const arr = [...(prev[section] as any[])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [section]: arr };
    });
  };

  const updateLinkField = (field: keyof Links, value: string) => {
    setFormData((prev) => ({
      ...prev,
      links: { ...prev.links, [field]: value },
    }));
  };

  const addArrayItem = (section: keyof Resume, template: object) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...(prev[section] as any[]), template],
    }));
  };

  const removeArrayItem = (section: keyof Resume, index: number) => {
    setFormData((prev) => {
      const arr = [...(prev[section] as any[])];
      arr.splice(index, 1);
      return { ...prev, [section]: arr };
    });
  };

  // --- Save to Supabase ---
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const {
        id,
        created_at,
        parsed_at,
        last_updated,
        resume_link,
        ...cleanData
      } = formData;

      const response = await fetch("/api/base-resume", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.error || `Save failed (${response.status})`);
      }

      setToast({ message: "Profile saved successfully!", type: "success" });
      setIsEditing(false);
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to save profile",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // --- Generate & Download PDF ---
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const {
        id,
        created_at,
        parsed_at,
        last_updated,
        resume_link,
        ...cleanData
      } = formData;

      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        throw new Error(`PDF generation failed (${response.status})`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.name?.replace(/\s+/g, "_") || "resume"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setToast({ message: "Resume PDF downloaded!", type: "success" });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Failed to generate PDF",
        type: "error",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // --- View Mode ---
  if (!isEditing) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Hero Header */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-16 bg-gradient-to-r from-navy-700 via-navy-600 to-navy-500 mb-4" />
          <div className="px-6 pb-6 -mt-8">
            <div className="flex items-end justify-between">
              <div className="flex items-end gap-4">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-navy-500 to-navy-700 flex items-center justify-center shadow-lg border-4 border-white">
                  <span className="text-white text-2xl font-bold">
                    {formData.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "?"}
                  </span>
                </div>
                <div className="pb-1">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {formData.name}
                  </h1>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                    {formData.email && (
                      <span className="flex items-center gap-1">
                        <Mail size={13} /> {formData.email}
                      </span>
                    )}
                    {formData.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={13} /> {formData.phone}
                      </span>
                    )}
                    {formData.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={13} /> {formData.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pb-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-navy-600 rounded-lg hover:bg-navy-700 transition-all shadow-sm disabled:opacity-50"
                >
                  {isGeneratingPdf ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Download size={14} />
                  )}
                  {isGeneratingPdf ? "Generating..." : "Download PDF"}
                </button>
              </div>
            </div>

            {/* Social Links */}
            {formData.links && (
              <div className="flex items-center gap-2 mt-4">
                {formData.links.linkedin && (
                  <a
                    href={
                      formData.links.linkedin.startsWith("http")
                        ? formData.links.linkedin
                        : `https://${formData.links.linkedin}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 border border-slate-200 transition-all"
                  >
                    <Linkedin size={13} /> LinkedIn
                  </a>
                )}
                {formData.links.github && (
                  <a
                    href={
                      formData.links.github.startsWith("http")
                        ? formData.links.github
                        : `https://${formData.links.github}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 border border-slate-200 transition-all"
                  >
                    <Github size={13} /> GitHub
                  </a>
                )}
                {formData.links.portfolio && (
                  <a
                    href={
                      formData.links.portfolio.startsWith("http")
                        ? formData.links.portfolio
                        : `https://${formData.links.portfolio}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 border border-slate-200 transition-all"
                  >
                    <Globe size={13} /> Portfolio
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {formData.summary && (
          <SectionCard
            icon={<Sparkles size={18} />}
            title="Professional Summary"
          >
            <p className="text-sm text-slate-600 leading-relaxed">
              {formData.summary}
            </p>
          </SectionCard>
        )}

        {/* Skills */}
        {formData.skills && formData.skills.length > 0 && (
          <SectionCard icon={<Sparkles size={18} />} title="Skills">
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <SkillTag key={skill} skill={skill} />
              ))}
            </div>
          </SectionCard>
        )}

        {/* Experience */}
        {formData.experience && formData.experience.length > 0 && (
          <SectionCard icon={<Briefcase size={18} />} title="Experience">
            <div className="space-y-0">
              {formData.experience.map((exp, i) => (
                <TimelineItem
                  key={i}
                  title={`${exp.job_title}${exp.company ? ` at ${exp.company}` : ""}`}
                  subtitle={exp.location || undefined}
                  meta={
                    exp.start_date
                      ? `${exp.start_date} — ${exp.end_date || "Present"}`
                      : undefined
                  }
                  description={exp.description}
                />
              ))}
            </div>
          </SectionCard>
        )}

        {/* Education */}
        {formData.education && formData.education.length > 0 && (
          <SectionCard icon={<GraduationCap size={18} />} title="Education">
            <div className="space-y-0">
              {formData.education.map((edu, i) => (
                <TimelineItem
                  key={i}
                  title={`${edu.degree}${edu.field_of_study ? ` in ${edu.field_of_study}` : ""}`}
                  subtitle={edu.institution}
                  meta={
                    edu.start_year
                      ? `${edu.start_year} — ${edu.end_year || "Present"}`
                      : edu.end_year
                        ? `Graduated ${edu.end_year}`
                        : undefined
                  }
                />
              ))}
            </div>
          </SectionCard>
        )}

        {/* Projects */}
        {formData.projects && formData.projects.length > 0 && (
          <SectionCard icon={<FolderOpen size={18} />} title="Projects">
            <div className="space-y-4">
              {formData.projects.map((proj, i) => (
                <div key={i}>
                  <h3 className="text-sm font-semibold text-slate-800">
                    {proj.name}
                  </h3>
                  {proj.description && (
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {proj.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-xs font-medium text-slate-500 bg-slate-100 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Certifications */}
        {formData.certifications && formData.certifications.length > 0 && (
          <SectionCard icon={<Award size={18} />} title="Certifications">
            <div className="space-y-3">
              {formData.certifications.map((cert, i) => (
                <div key={i} className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      {cert.name}
                    </h3>
                    {cert.issuer && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {cert.issuer}
                      </p>
                    )}
                  </div>
                  {cert.year && (
                    <span className="text-xs text-slate-400 font-medium shrink-0">
                      {cert.year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Languages */}
        {formData.languages && formData.languages.length > 0 && (
          <SectionCard icon={<Languages size={18} />} title="Languages">
            <div className="flex flex-wrap gap-2">
              {formData.languages.map((lang, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg border border-slate-200"
                >
                  {lang}
                </span>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Metadata */}
        <div className="text-xs text-slate-400 text-center pb-4 space-x-3">
          {formData.created_at && (
            <span>
              Created {new Date(formData.created_at).toLocaleDateString()}
            </span>
          )}
          {formData.parsed_at && (
            <span>
              · Parsed {new Date(formData.parsed_at).toLocaleDateString()}
            </span>
          )}
          {formData.last_updated && (
            <span>
              · Updated {new Date(formData.last_updated).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    );
  }

  // --- Edit Mode ---
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Edit Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Pencil size={18} className="text-navy-600" />
            <h1 className="text-xl font-bold text-slate-900">Edit Profile</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            >
              <X size={14} /> Cancel
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-navy-700 bg-navy-50 border border-navy-200 rounded-lg hover:bg-navy-100 transition-all disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              {isGeneratingPdf ? "Generating..." : "Download PDF"}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-navy-600 rounded-lg hover:bg-navy-700 transition-all shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Full Name"
            id="edit-name"
            value={formData.name || ""}
            onChange={(e) => updateField("name", e.target.value)}
          />
          <FormField
            label="Email"
            id="edit-email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => updateField("email", e.target.value)}
          />
          <FormField
            label="Phone"
            id="edit-phone"
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => updateField("phone", e.target.value)}
          />
          <FormField
            label="Location"
            id="edit-location"
            value={formData.location || ""}
            onChange={(e) => updateField("location", e.target.value)}
          />
        </div>
      </div>

      {/* Links */}
      <SectionCard icon={<Globe size={18} />} title="Links">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="LinkedIn"
            id="edit-linkedin"
            value={formData.links?.linkedin || ""}
            onChange={(e) => updateLinkField("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/..."
          />
          <FormField
            label="GitHub"
            id="edit-github"
            value={formData.links?.github || ""}
            onChange={(e) => updateLinkField("github", e.target.value)}
            placeholder="https://github.com/..."
          />
          <FormField
            label="Portfolio"
            id="edit-portfolio"
            value={formData.links?.portfolio || ""}
            onChange={(e) => updateLinkField("portfolio", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </SectionCard>

      {/* Summary */}
      <SectionCard icon={<Sparkles size={18} />} title="Professional Summary">
        <FormField
          label="Summary"
          id="edit-summary"
          value={formData.summary || ""}
          onChange={(e) => updateField("summary", e.target.value)}
          rows={4}
        />
      </SectionCard>

      {/* Skills */}
      <SectionCard icon={<Sparkles size={18} />} title="Skills">
        <p className="text-xs text-slate-400 mb-3">
          Comma-separated list of skills
        </p>
        <FormField
          label="Skills"
          id="edit-skills"
          value={
            Array.isArray(formData.skills) ? formData.skills.join(", ") : ""
          }
          onChange={(e) =>
            updateField(
              "skills",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
          rows={3}
          placeholder="JavaScript, Python, React, ..."
        />
      </SectionCard>

      {/* Experience */}
      <SectionCard icon={<Briefcase size={18} />} title="Experience">
        <div className="space-y-4">
          {formData.experience?.map((exp, i) => (
            <div
              key={i}
              className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 relative"
            >
              <button
                onClick={() => removeArrayItem("experience", i)}
                className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <Trash2 size={14} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                <FormField
                  label="Job Title"
                  id={`exp-title-${i}`}
                  value={exp.job_title || ""}
                  onChange={(e) =>
                    updateNestedField<Experience>(
                      "experience",
                      i,
                      "job_title",
                      e.target.value,
                    )
                  }
                />
                <FormField
                  label="Company"
                  id={`exp-company-${i}`}
                  value={exp.company || ""}
                  onChange={(e) =>
                    updateNestedField<Experience>(
                      "experience",
                      i,
                      "company",
                      e.target.value,
                    )
                  }
                />
                <FormField
                  label="Location"
                  id={`exp-location-${i}`}
                  value={exp.location || ""}
                  onChange={(e) =>
                    updateNestedField<Experience>(
                      "experience",
                      i,
                      "location",
                      e.target.value,
                    )
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Start Date"
                    id={`exp-start-${i}`}
                    value={exp.start_date || ""}
                    onChange={(e) =>
                      updateNestedField<Experience>(
                        "experience",
                        i,
                        "start_date",
                        e.target.value,
                      )
                    }
                  />
                  <FormField
                    label="End Date"
                    id={`exp-end-${i}`}
                    value={exp.end_date || ""}
                    onChange={(e) =>
                      updateNestedField<Experience>(
                        "experience",
                        i,
                        "end_date",
                        e.target.value,
                      )
                    }
                    placeholder="Present"
                  />
                </div>
              </div>
              <div className="mt-3">
                <FormField
                  label="Description"
                  id={`exp-desc-${i}`}
                  value={exp.description || ""}
                  onChange={(e) =>
                    updateNestedField<Experience>(
                      "experience",
                      i,
                      "description",
                      e.target.value,
                    )
                  }
                  rows={3}
                />
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              addArrayItem("experience", {
                job_title: "",
                company: "",
                location: "",
                start_date: "",
                end_date: "",
                description: "",
              } as Experience)
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-navy-600 border border-dashed border-navy-300 rounded-lg hover:bg-navy-50 transition-all"
          >
            <Plus size={14} /> Add Experience
          </button>
        </div>
      </SectionCard>

      {/* Education */}
      <SectionCard icon={<GraduationCap size={18} />} title="Education">
        <div className="space-y-4">
          {formData.education?.map((edu, i) => (
            <div
              key={i}
              className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 relative"
            >
              <button
                onClick={() => removeArrayItem("education", i)}
                className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <Trash2 size={14} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                <FormField
                  label="Degree"
                  id={`edu-degree-${i}`}
                  value={edu.degree || ""}
                  onChange={(e) =>
                    updateNestedField<Education>(
                      "education",
                      i,
                      "degree",
                      e.target.value,
                    )
                  }
                />
                <FormField
                  label="Field of Study"
                  id={`edu-field-${i}`}
                  value={edu.field_of_study || ""}
                  onChange={(e) =>
                    updateNestedField<Education>(
                      "education",
                      i,
                      "field_of_study",
                      e.target.value,
                    )
                  }
                />
                <FormField
                  label="Institution"
                  id={`edu-inst-${i}`}
                  value={edu.institution || ""}
                  onChange={(e) =>
                    updateNestedField<Education>(
                      "education",
                      i,
                      "institution",
                      e.target.value,
                    )
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    label="Start Year"
                    id={`edu-start-${i}`}
                    value={edu.start_year || ""}
                    onChange={(e) =>
                      updateNestedField<Education>(
                        "education",
                        i,
                        "start_year",
                        e.target.value,
                      )
                    }
                  />
                  <FormField
                    label="End Year"
                    id={`edu-end-${i}`}
                    value={edu.end_year || ""}
                    onChange={(e) =>
                      updateNestedField<Education>(
                        "education",
                        i,
                        "end_year",
                        e.target.value,
                      )
                    }
                    placeholder="Present"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              addArrayItem("education", {
                degree: "",
                field_of_study: "",
                institution: "",
                start_year: "",
                end_year: "",
              } as Education)
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-navy-600 border border-dashed border-navy-300 rounded-lg hover:bg-navy-50 transition-all"
          >
            <Plus size={14} /> Add Education
          </button>
        </div>
      </SectionCard>

      {/* Projects */}
      <SectionCard icon={<FolderOpen size={18} />} title="Projects">
        <div className="space-y-4">
          {formData.projects?.map((proj, i) => (
            <div
              key={i}
              className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 relative"
            >
              <button
                onClick={() => removeArrayItem("projects", i)}
                className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <Trash2 size={14} />
              </button>
              <div className="grid grid-cols-1 gap-3 pr-8">
                <FormField
                  label="Name"
                  id={`proj-name-${i}`}
                  value={proj.name || ""}
                  onChange={(e) =>
                    updateNestedField<Project>(
                      "projects",
                      i,
                      "name",
                      e.target.value,
                    )
                  }
                />
                <FormField
                  label="Description"
                  id={`proj-desc-${i}`}
                  value={proj.description || ""}
                  onChange={(e) =>
                    updateNestedField<Project>(
                      "projects",
                      i,
                      "description",
                      e.target.value,
                    )
                  }
                  rows={2}
                />
                <FormField
                  label="Technologies (comma-separated)"
                  id={`proj-tech-${i}`}
                  value={
                    Array.isArray(proj.technologies)
                      ? proj.technologies.join(", ")
                      : ""
                  }
                  onChange={(e) => {
                    const techs = e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean);
                    updateNestedField<Project>(
                      "projects",
                      i,
                      "technologies",
                      techs as any,
                    );
                  }}
                  placeholder="React, Node.js, ..."
                />
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              addArrayItem("projects", {
                name: "",
                description: "",
                technologies: [],
              } as Project)
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-navy-600 border border-dashed border-navy-300 rounded-lg hover:bg-navy-50 transition-all"
          >
            <Plus size={14} /> Add Project
          </button>
        </div>
      </SectionCard>

      {/* Certifications */}
      <SectionCard icon={<Award size={18} />} title="Certifications">
        <div className="space-y-4">
          {formData.certifications?.map((cert, i) => (
            <div
              key={i}
              className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 relative"
            >
              <button
                onClick={() => removeArrayItem("certifications", i)}
                className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 transition-colors"
                title="Remove"
              >
                <Trash2 size={14} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-8">
                <FormField
                  label="Name"
                  id={`cert-name-${i}`}
                  value={cert.name || ""}
                  onChange={(e) =>
                    updateNestedField<Certification>(
                      "certifications",
                      i,
                      "name",
                      e.target.value,
                    )
                  }
                />
                <FormField
                  label="Issuer"
                  id={`cert-issuer-${i}`}
                  value={cert.issuer || ""}
                  onChange={(e) =>
                    updateNestedField<Certification>(
                      "certifications",
                      i,
                      "issuer",
                      e.target.value,
                    )
                  }
                />
                <FormField
                  label="Year"
                  id={`cert-year-${i}`}
                  value={cert.year || ""}
                  onChange={(e) =>
                    updateNestedField<Certification>(
                      "certifications",
                      i,
                      "year",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              addArrayItem("certifications", {
                name: "",
                issuer: "",
                year: "",
              } as Certification)
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-navy-600 border border-dashed border-navy-300 rounded-lg hover:bg-navy-50 transition-all"
          >
            <Plus size={14} /> Add Certification
          </button>
        </div>
      </SectionCard>

      {/* Languages */}
      <SectionCard icon={<Languages size={18} />} title="Languages">
        <p className="text-xs text-slate-400 mb-3">
          Comma-separated list of languages
        </p>
        <FormField
          label="Languages"
          id="edit-languages"
          value={
            Array.isArray(formData.languages)
              ? formData.languages.join(", ")
              : ""
          }
          onChange={(e) =>
            updateField(
              "languages",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
          placeholder="English, Spanish, ..."
        />
      </SectionCard>

      {/* Bottom action bar — fixed at bottom of viewport */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Changes are not saved until you click &quot;Save&quot;
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            >
              <X size={14} /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-navy-600 rounded-lg hover:bg-navy-700 transition-all shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
