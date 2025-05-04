"use client";

import { useState } from "react";
import Link from "next/link"; // Import Link for the button
import { Job } from "@/lib/supabase/queries";
import PaginationControls from "./PaginationControls";
import { ExternalLink } from "lucide-react"; // Icon for the link button
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
  // State to keep track of the selected job
  const [selectedJob, setSelectedJob] = useState<Job | null>(
    jobs.length > 0 ? jobs[0] : null // Select the first job by default if available
  );

  // Function to handle clicking on a job item
  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-10rem)]">
      {" "}
      {/* Adjust height as needed */}
      {/* Left Column: Job List */}
      <div className="w-full md:w-1/3 flex flex-col">
        {jobs.length > 0 ? (
          <>
            <ul className="space-y-3 overflow-y-auto flex-grow pr-2">
              {" "}
              {/* Added padding-right */}
              {jobs.map((job) => (
                <li
                  key={job.job_id}
                  onClick={() => handleJobSelect(job)}
                  className={`border p-3 rounded-md shadow-sm cursor-pointer transition-colors duration-150 ${
                    selectedJob?.job_id === job.job_id
                      ? "bg-indigo-50 border-indigo-300" // Highlight selected job
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
                    </p>
                  )}
                </li>
              ))}
            </ul>
            {/* Render Pagination Controls below the list */}
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
              </p>
            )}

            {/* Link to Original Job Post */}
            <Link
              href={`https://www.linkedin.com/jobs/view/${selectedJob.job_id}`}
              target="_blank" // Open in new tab
              rel="noopener noreferrer" // Security best practice
              className="inline-flex items-center px-4 py-2 mb-6 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              View Job Post
              <ExternalLink size={16} className="ml-2" />
            </Link>

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
