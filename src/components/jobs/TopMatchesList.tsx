"use client"; // Mark this as a Client Component

import { Job } from "@/lib/supabase/queries"; // Import the Job type
import PaginationControls from "./PaginationControls"; // Import pagination controls

interface TopMatchesListProps {
  jobs: Job[];
  currentPage: number; // Add currentPage prop
  totalPages: number; // Add totalPages prop
}

export default function TopMatchesList({
  jobs,
  currentPage,
  totalPages,
}: TopMatchesListProps) {
  return (
    <div>
      {jobs.length > 0 ? (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job.job_id}
              className="border p-4 rounded-md shadow-sm bg-white"
            >
              {" "}
              {/* Added bg-white */}
              <h2 className="text-xl font-semibold text-indigo-700">
                {job.job_title}
              </h2>{" "}
              {/* Styled title */}
              <p className="text-gray-700">{job.company}</p>
              <p className="text-gray-600 text-sm">{job.location}</p>{" "}
              {/* Smaller location text */}
              {job.resume_score && (
                <p className="mt-2 font-medium text-green-600">
                  {" "}
                  {/* Styled score */}
                  Resume Score: {job.resume_score.toFixed(2)}
                </p>
              )}
              {/* Add more job details or links as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">
          No top-matched jobs found for this page.
        </p>
      )}

      {/* Render Pagination Controls if there are multiple pages */}
      {totalPages > 1 && (
        <PaginationControls currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
