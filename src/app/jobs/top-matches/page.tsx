import {
  getTopScoredJobs,
  getTopScoredJobsCount,
  Job,
} from "@/lib/supabase/queries";
import TopMatchesList from "@/components/jobs/TopMatchesList";
import { Suspense } from "react";
import { Filter } from "lucide-react";
import RefreshButton from "@/components/jobs/RefreshButton";

const PAGE_SIZE = 10; // Define page size

// Loading skeleton component
function TopMatchesListSkeleton() {
  return (
    <div className="h-[calc(100vh-10rem)] bg-gray-50 rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="flex flex-col md:flex-row h-full">
        {/* Left skeleton */}
        <div className="w-full md:w-1/3 bg-white border-r border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="divide-y divide-gray-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
        {/* Right skeleton */}
        <div className="w-full md:w-2/3 bg-white">
          <div className="p-6 border-b border-gray-200">
            <div className="h-8 bg-gray-200 rounded w-2/3 mb-3"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="flex gap-2 mt-4">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="p-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gray-200 rounded w-full mb-3"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function TopMatchesPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  // Get current page from search params, default to 1
  const currentPage = parseInt(params?.page as string) || 1;

  // Fetch the jobs for the current page
  const topJobs: Job[] = await getTopScoredJobs(currentPage, PAGE_SIZE);

  // Fetch total count
  const totalCount = await getTopScoredJobsCount();

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page header with actions */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Top Job Matches</h1>
          <p className="mt-1 text-sm text-gray-500">
            Showing jobs that best match your resume ({totalCount} total)
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
      <Suspense fallback={<TopMatchesListSkeleton />}>
        <TopMatchesList
          jobs={topJobs}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </Suspense>
    </div>
  );
}

// Optional: Add revalidation if needed
export const revalidate = 3600; // Revalidate once per hour
