"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError(null);
      } else {
        setError("Please upload a PDF file");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Please upload a PDF file");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a resume file");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Create form data to send the file
      const formData = new FormData();
      formData.append("file", file);

      // Send the file to the parsing API
      console.log("Sending file to parsing API...");
      const parseResponse = await fetch(
        "https://parse-pdf-resume.onrender.com/parse-resume",
        {
          method: "POST",
          body: formData,
        }
      );
      console.log("Parsing API response:", parseResponse);

      if (!parseResponse.ok) {
        throw new Error("Failed to parse resume");
      }

      // Get the parsed resume data
      const resumeData = await parseResponse.json();
      console.log("Parsed resume data:", resumeData);

      // TODO: Save the resume data to the database

      // Insert the resume data into the resumes table
      const { data: resumeInsertData, error: resumeInsertError } =
        await supabase
          .from("resumes")
          .insert({
            user_id: user.id,
            ...resumeData,
          })
          .select("id")
          .single();

      if (resumeInsertError) {
        throw new Error(`Failed to save resume: ${resumeInsertError.message}`);
      }

      // Update the user's profile with the default resume ID
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          default_resume_id: resumeInsertData.id,
        })
        .eq("id", user.id);

      if (profileUpdateError) {
        throw new Error(
          `Failed to update profile: ${profileUpdateError.message}`
        );
      }

      // Success!
      setSuccess(true);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      console.error("Error uploading resume:", err);
      setError(err.message || "An error occurred while uploading your resume");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            Upload Your Resume
          </h1>
          <p className="text-blue-100 mt-2 ml-11">
            Let us analyze your resume to personalize your job search experience
          </p>
        </div>

        {/* Main content */}
        <div className="p-8">
          {/* Success message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-800">
                  Resume Uploaded Successfully!
                </h4>
                <p className="text-sm text-green-700">
                  Your resume has been analyzed and saved. Redirecting you to
                  the dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800">Error</h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Upload form */}
          <form onSubmit={handleSubmit}>
            {/* File drop area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 mb-6 text-center transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : file
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center">
                {file ? (
                  <>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-lg font-medium text-gray-800 mb-1">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => setFile(null)}
                    >
                      Choose a different file
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-lg font-medium text-gray-800 mb-1">
                      Drag and drop your resume here
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      or click to browse files (PDF only)
                    </p>
                    <label className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors">
                      Browse Files
                      <input
                        type="file"
                        className="hidden"
                        accept="application/pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!file || isUploading || success}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
                !file || isUploading || success
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Analyzing Resume...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Resume Uploaded!</span>
                </>
              ) : (
                <span>Upload and Analyze Resume</span>
              )}
            </button>
          </form>

          {/* Information box */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 rounded-lg p-5">
            <div className="flex items-start">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">
                  Why upload your resume?
                </h4>
                <ul className="space-y-2 text-blue-700 list-disc pl-5">
                  <li>
                    We'll analyze your skills and experience to find the best
                    job matches
                  </li>
                  <li>
                    Automatically fill out job applications with your resume
                    information
                  </li>
                  <li>
                    Get personalized job recommendations based on your
                    qualifications
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
