import { Suspense } from "react";
import { Filter } from "lucide-react";
import RefreshButton from "@/components/jobs/RefreshButton";
import { Job } from "@/types";
import { getAppliedJobs, getAppliedJobsCount } from "@/lib/supabase/queries";
import AppliedJobsList from "@/components/jobs/AppliedJobsList";
import JobListSkeleton from "@/components/jobs/JobListSkeleton";
import SearchComponent from "@/components/jobs/SearchComponent";
import FilterButton from "@/components/jobs/FilterButton";

const PAGE_SIZE = 10; // Define page size

export default async function AppliedJobsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  // Get current page from search params, default to 1
  const currentPage = parseInt(params?.page as string) || 1;

  // Get search query from search params
  const searchQuery = params?.query as string;

  // Get provider filter from search params
  const provider = params?.provider as string;
  const providerFilter = provider && provider !== "all" ? provider : undefined;

  // Fetch the jobs for the current page
  const appliedJobs: Job[] = await getAppliedJobs(
    currentPage,
    PAGE_SIZE,
    providerFilter,
    searchQuery
  );

  // Fetch total count
  const totalCount = await getAppliedJobsCount(providerFilter, searchQuery);

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
          <SearchComponent />
          <FilterButton interestOptions={false} scoreOptions={false} />
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
