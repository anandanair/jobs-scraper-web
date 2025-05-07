"use client"; // Ensure this is a client component

import {
  Resume,
  Education,
  Experience,
  Project,
  Certification,
  Links,
} from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface ResumeEditProps {
  resumeData: Resume;
  job_id: string;
}

export default function ResumeEditClient({
  resumeData,
  job_id,
}: ResumeEditProps) {
  const [formData, setFormData] = useState<Resume>(resumeData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Update formData if the initial resumeData prop changes
    setFormData(resumeData);
  }, [resumeData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNestedChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: keyof Resume,
    index?: number,
    field?: keyof any // Used for arrays of objects or simple objects like Links
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const newData = { ...prevData };
      const currentSection = newData[section];

      if (Array.isArray(currentSection) && index !== undefined && field) {
        // Handle arrays of objects (Education, Experience, etc.)
        const newArray = [...currentSection];
        if (newArray[index]) {
          newArray[index] = { ...newArray[index], [field as string]: value };
          (newData[section] as any) = newArray;
        }
      } else if (
        typeof currentSection === "object" &&
        !Array.isArray(currentSection) &&
        field
      ) {
        // Handle simple objects (Links)
        (newData[section] as any) = {
          ...(currentSection as object),
          [field as string]: value,
        };
      } else {
        // For top-level fields or JSON textareas
        (newData[section] as any) = value;
      }
      return newData;
    });
  };

  // Specific handler for JSON textareas (skills, languages, and initially for arrays)
  const handleJsonTextareaChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    field: keyof Resume
  ) => {
    const { value } = e.target;
    setFormData((prevData) => {
      try {
        // For fields that are expected to be objects or arrays from JSON
        if (
          field === "skills" ||
          field === "education" ||
          field === "experience" ||
          field === "projects" ||
          field === "certifications" ||
          field === "languages"
        ) {
          const parsedValue = JSON.parse(value);
          return { ...prevData, [field]: parsedValue };
        }
        return { ...prevData, [field]: value };
      } catch (err) {
        console.warn(`Invalid JSON for field ${field}:`, value);
        return { ...prevData, [field]: value };
      }
    });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const { id, created_at, parsed_at, ...updateData } = formData;

    const finalUpdateData = { ...updateData };
    (
      Object.keys(finalUpdateData) as Array<keyof typeof finalUpdateData>
    ).forEach((key) => {
      if (typeof finalUpdateData[key] === "string") {
        if (
          key === "skills" ||
          key === "education" ||
          key === "experience" ||
          key === "projects" ||
          key === "certifications" ||
          key === "languages" ||
          key === "links"
        ) {
          try {
            (finalUpdateData as any)[key] = JSON.parse(
              finalUpdateData[key] as string
            );
          } catch (parseError) {
            console.error(
              `Failed to parse JSON for ${key} before saving. Saving as string.`,
              parseError
            );
            // Decide how to handle: save as string, show error, or skip update for this field
          }
        }
      }
    });

    try {
      // Generate PDF
      const generatedPdfUrl = await generateResumePdf(formData);

      if (generatedPdfUrl) {
        finalUpdateData.resume_link = generatedPdfUrl;
      } else {
        console.warn(
          "PDF generation/upload failed. Proceeding to save other resume data without PDF link."
        );
      }

      const response = await fetch(`/api/customized_resumes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          finalUpdateData as Partial<
            Omit<Resume, "id" | "created_at" | "last_updated">
          >
        ),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const updatedResume: Resume = await response.json();

      if (updatedResume) {
        setFormData(updatedResume); // Update form with data from server (e.g., if server modifies it)
        setSuccessMessage("Resume updated successfully!");
        router.push(`/jobs/${job_id}/resumes/${id}`);
      } else {
        setError(
          "Failed to update resume. The resume might not have been found or an unknown error occurred."
        );
      }
    } catch (err) {
      console.error("Error updating resume:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderArrayField = <T extends object>(
    sectionName: keyof Resume,
    items: T[],
    fields: Array<keyof T>
  ) => {
    return (items as any[]).map((item, index) => (
      <div
        key={`${String(sectionName)}-${index}`}
        className="mb-4 p-3 border rounded-md"
      >
        <h4 className="font-semibold capitalize mb-2">
          {String(sectionName).slice(0, -1)} {index + 1}
        </h4>
        {fields.map((field) => (
          <div key={String(field)} className="mb-2">
            <label
              htmlFor={`${String(sectionName)}-${index}-${String(field)}`}
              className="block text-sm font-medium text-gray-700 capitalize"
            >
              {String(field).replace(/_/g, " ")}
            </label>
            <input
              type="text"
              name={`${String(sectionName)}-${index}-${String(field)}`}
              id={`${String(sectionName)}-${index}-${String(field)}`}
              value={(item as any)[field] || ""}
              onChange={(e) =>
                handleNestedChange(e, sectionName, index, field as keyof any)
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        ))}
      </div>
    ));
  };

  async function generateResumePdf(resumeDataForPdf: Resume) {
    const {
      id,
      created_at,
      parsed_at,
      last_updated,
      resume_link,
      ...cleanedResumeDataForPdf
    } = resumeDataForPdf;

    try {
      const pdfResponse = await axios.post(
        "https://generate-pdf-resume-production.up.railway.app/generate-resume/",
        cleanedResumeDataForPdf,
        {
          responseType: "blob", // PDF is binary
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 2. Store the PDF blob in a variable
      const pdfBlob = pdfResponse.data;

      // 3. Convert blob to File (for Supabase upload)
      const fileName = `resume_${job_id}.pdf`;
      const file = new File([pdfBlob], fileName, {
        type: "application/pdf",
      });

      // Step 3: Upload the file using the new API endpoint
      const formDataToUpload = new FormData();
      formDataToUpload.append("file", file);
      formDataToUpload.append("fileName", fileName);

      const uploadResponse = await fetch(`/api/customized_resumes/${id}/`, {
        // Using job_id from props
        method: "POST",
        body: formDataToUpload,
        // Headers for FormData (like Content-Type: multipart/form-data) are set automatically by the browser
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({
          error: "Upload failed with no JSON response",
          details: `HTTP status: ${uploadResponse.status}`,
        }));
        throw new Error(
          errorData.error || `Failed to upload PDF: ${errorData.details}`
        );
      }

      const { publicUrl } = await uploadResponse.json();
      console.log(
        "Uploaded personalized resume via API, public URL:",
        publicUrl
      );
      return publicUrl;
    } catch (error) {
      console.error(
        "Error in generateResumePdf (generating or uploading PDF):",
        error
      );
      setError(
        // Assuming setError is available in this scope (it is, as part of ResumeEditClient)
        error instanceof Error
          ? `Failed to generate or upload resume: ${error.message}`
          : "An unexpected error occurred while generating/uploading the resume."
      );
      return undefined;
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Resume</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="summary"
            className="block text-sm font-medium text-gray-700"
          >
            Summary
          </label>
          <textarea
            name="summary"
            id="summary"
            rows={4}
            value={formData.summary}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Skills (as JSON) */}
        <div>
          <label
            htmlFor="skills"
            className="block text-sm font-medium text-gray-700"
          >
            Skills (JSON format)
          </label>
          <textarea
            name="skills"
            id="skills"
            rows={5}
            value={
              typeof formData.skills === "string"
                ? formData.skills
                : JSON.stringify(formData.skills, null, 2)
            }
            onChange={(e) => handleJsonTextareaChange(e, "skills")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
            placeholder='e.g., { "Programming": ["JavaScript", "Python"], "Tools": ["Git", "Docker"] }'
          />
        </div>

        {/* Education Section */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold">Education</legend>
          {renderArrayField<Education>("education", formData.education, [
            "degree",
            "field_of_study",
            "institution",
            "start_year",
            "end_year",
          ])}
          {/* Add button for new education entry would go here */}
        </fieldset>

        {/* Experience Section */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold">Experience</legend>
          {renderArrayField<Experience>("experience", formData.experience, [
            "job_title",
            "company",
            "location",
            "start_date",
            "end_date",
            "description",
          ])}
          {/* Add button for new experience entry would go here */}
        </fieldset>

        {/* Projects Section */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold">Projects</legend>
          {renderArrayField<Project>("projects", formData.projects, [
            "name",
            "description",
            "technologies",
          ])}
          {/* Add button for new project entry would go here */}
        </fieldset>

        {/* Certifications Section */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold">Certifications</legend>
          {renderArrayField<Certification>(
            "certifications",
            formData.certifications,
            ["name", "issuer", "year"]
          )}
          {/* Add button for new certification entry would go here */}
        </fieldset>

        {/* Languages (as JSON array) */}
        <div>
          <label
            htmlFor="languages"
            className="block text-sm font-medium text-gray-700"
          >
            Languages (JSON array format)
          </label>
          <textarea
            name="languages"
            id="languages"
            rows={3}
            value={
              typeof formData.languages === "string"
                ? formData.languages
                : JSON.stringify(formData.languages, null, 2)
            }
            onChange={(e) => handleJsonTextareaChange(e, "languages")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
            placeholder='e.g., [{ "language": "English", "proficiency": "Native" }, { "language": "Spanish", "proficiency": "Fluent" }]'
          />
        </div>

        {/* Links */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold">Links</legend>
          {(Object.keys(formData.links) as Array<keyof Links>).map((key) => (
            <div key={key} className="mb-2">
              <label
                htmlFor={`links-${key}`}
                className="block text-sm font-medium text-gray-700 capitalize"
              >
                {key}
              </label>
              <input
                type="url"
                name={`links-${key}`}
                id={`links-${key}`}
                value={formData.links[key] || ""}
                onChange={(e) => handleNestedChange(e, "links", undefined, key)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          ))}
        </fieldset>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
