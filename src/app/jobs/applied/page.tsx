import { Suspense } from "react";
import { Filter } from "lucide-react";
import RefreshButton from "@/components/jobs/RefreshButton";
import { Job } from "@/types";
import { getAppliedJobs, getAppliedJobsCount } from "@/lib/supabase/queries";
import AppliedJobsList from "@/components/jobs/AppliedJobsList";
import JobListSkeleton from "@/components/jobs/JobListSkeleton";

const PAGE_SIZE = 10; // Define page size

export default async function AppliedJobsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  // Get current page from search params, default to 1
  const currentPage = parseInt(params?.page as string) || 1;

  // Fetch the jobs for the current page
  const appliedJobs: Job[] = await getAppliedJobs(currentPage, PAGE_SIZE);

  // Fetch total count
  const totalCount = await getAppliedJobsCount();

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page header with actions */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applied Jobs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Showing applied jobs ({totalCount} total)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            Filter
          </button>

          <RefreshButton currentPage={currentPage} />
        </div>
      </div>

      {/* Main content with loading state */}
      <Suspense fallback={<JobListSkeleton />}>
        <AppliedJobsList
          jobs={appliedJobs}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </Suspense>
    </div>
  );
}

// Optional: Add revalidation if needed
export const revalidate = 3600; // Revalidate once per hour
