"use client";

import { useState } from "react";
import Link from "next/link";
import { Job } from "@/lib/supabase/queries";
import PaginationControls from "./PaginationControls";
import { ExternalLink, CheckCircle, ThumbsUp, ThumbsDown } from "lucide-react"; // Added ThumbsUp, ThumbsDown, removed Heart
import MarkdownRenderer from "./MarkdownRenderer";

interface TopMatchesListProps {
  jobs: Job[];
  currentPage: number;
  totalPages: number;
}

export default function TopMatchesList({
  jobs,
  currentPage,
  totalPages,
}: TopMatchesListProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(
    jobs.length > 0 ? jobs[0] : null
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingInterest, setIsUpdatingInterest] = useState(false);

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  const handleMarkAsApplied = async () => {
    if (!selectedJob || selectedJob.status === "applied") {
      return;
    }

    setIsUpdating(true);
    try {
      const currentDate = new Date().toISOString();
      const response = await fetch(`/api/jobs/${selectedJob.job_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "applied",
          application_date: currentDate,
        }), // Send only the status update
      });

      if (!response.ok) {
        // Try to parse error message from server if available
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const updatedJob: Job = await response.json();
      setSelectedJob(updatedJob);
      // Optionally, update the 'jobs' list in the parent component or re-fetch
      // to reflect the change in the list as well.
      alert("Job marked as applied!");
    } catch (error) {
      console.error("Error marking job as applied:", error);
      const message =
        error instanceof Error ? error.message : "An unknown error occurred.";
      alert(`An error occurred while marking the job as applied: ${message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSetInterest = async (newInterestValue: boolean | null) => {
    if (!selectedJob) {
      return;
    }

    setIsUpdatingInterest(true);
    let finalInterestValue: boolean | null;

    // If the button clicked matches the current state, set to null (toggle off)
    // Otherwise, set to the new value
    if (selectedJob.is_interested === newInterestValue) {
      finalInterestValue = null;
    } else {
      finalInterestValue = newInterestValue;
    }

    try {
      const response = await fetch(`/api/jobs/${selectedJob.job_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_interested: finalInterestValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage =
          errorData?.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      const updatedJob: Job = await response.json();
      setSelectedJob(updatedJob);
      // Optional: Add alert or toast notification
    } catch (error) {
      console.error("Error updating job interest:", error);
      const message =
        error instanceof Error ? error.message : "An unknown error occurred.";
      alert(`An error occurred while updating interest: ${message}`);
    } finally {
      setIsUpdatingInterest(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-10rem)]">
      {/* Left Column: Job List */}
      <div className="w-full md:w-1/3 flex flex-col">
        {jobs.length > 0 ? (
          <>
            <ul className="space-y-3 overflow-y-auto flex-grow pr-2">
              {jobs.map((job) => (
                <li
                  key={job.job_id}
                  onClick={() => handleJobSelect(job)}
                  className={`border p-3 rounded-md shadow-sm cursor-pointer transition-colors duration-150 ${
                    selectedJob?.job_id === job.job_id
                      ? "bg-indigo-50 border-indigo-300"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <h3 className="text-md font-semibold text-indigo-700 truncate">
                    {job.job_title}
                  </h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <p className="text-xs text-gray-500">{job.location}</p>
                  {job.resume_score && (
                    <p className="mt-1 text-sm font-medium text-green-600">
                      Score: {job.resume_score.toFixed(2)}
                      {job.resume_score_stage && (
                        <span className="text-xs text-gray-500 ml-1">
                          (
                          {job.resume_score_stage.charAt(0).toUpperCase() +
                            job.resume_score_stage.slice(1)}
                          )
                        </span>
                      )}
                    </p>
                  )}
                </li>
              ))}
            </ul>
            {totalPages > 1 && (
              <div className="mt-4 flex-shrink-0">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No top-matched jobs found for this page.
          </p>
        )}
      </div>
      {/* Right Column: Job Details */}
      <div className="w-full md:w-2/3 bg-white border rounded-md shadow-sm overflow-y-auto p-6">
        {selectedJob ? (
          <div>
            <h2 className="text-2xl font-bold mb-2">{selectedJob.job_title}</h2>
            <div className="flex items-center text-gray-700 mb-1 space-x-2">
              <span>{selectedJob.company}</span>
              <span className="text-gray-400">•</span>
              <span>{selectedJob.location}</span>
            </div>
            {selectedJob.resume_score && (
              <p className="mb-4 font-medium text-green-600">
                Resume Score: {selectedJob.resume_score.toFixed(2)}
                {selectedJob.resume_score_stage && (
                  <span className="text-sm text-gray-500 ml-1">
                    (
                    {selectedJob.resume_score_stage.charAt(0).toUpperCase() +
                      selectedJob.resume_score_stage.slice(1)}
                    )
                  </span>
                )}
              </p>
            )}

            <div className="flex flex-wrap gap-4 mb-6">
              <Link
                href={`https://www.linkedin.com/jobs/view/${selectedJob.job_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
              >
                View Job Post
                <ExternalLink size={16} className="ml-2" />
              </Link>
              {selectedJob.resume_link && (
                <Link
                  href={selectedJob.resume_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                >
                  View Resume
                  <ExternalLink size={16} className="ml-2" />
                </Link>
              )}
              {selectedJob.status !== "applied" && (
                <button
                  onClick={handleMarkAsApplied}
                  disabled={isUpdating}
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={16} className="mr-2" />
                  {isUpdating ? "Marking..." : "Mark as Applied"}
                </button>
              )}
              {/* Interested Button */}
              <button
                onClick={() => handleSetInterest(true)}
                disabled={isUpdatingInterest}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${
                  selectedJob.is_interested === true
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                <ThumbsUp
                  size={16}
                  className="mr-2"
                  fill={
                    selectedJob.is_interested === true ? "currentColor" : "none"
                  }
                />
                {isUpdatingInterest && selectedJob.is_interested !== false // Show loading only if this button initiated it
                  ? "Updating..."
                  : "Interested"}
              </button>
              {/* Not Interested Button */}
              <button
                onClick={() => handleSetInterest(false)}
                disabled={isUpdatingInterest}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${
                  selectedJob.is_interested === false
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                <ThumbsDown
                  size={16}
                  className="mr-2"
                  fill={
                    selectedJob.is_interested === false
                      ? "currentColor"
                      : "none"
                  }
                />
                {isUpdatingInterest && selectedJob.is_interested !== true // Show loading only if this button initiated it
                  ? "Updating..."
                  : "Not Interested"}
              </button>
            </div>

            <MarkdownRenderer content={selectedJob.description} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a job from the list to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
