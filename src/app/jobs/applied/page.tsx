import { Suspense } from "react";
import RefreshButton from "@/components/jobs/RefreshButton";
import JobListSkeleton from "@/components/jobs/JobListSkeleton";
import SearchComponent from "@/components/jobs/SearchComponent";
import FilterButton from "@/components/jobs/FilterButton";
import SortOptions from "@/components/jobs/SortOptions";
import AppliedJobsContent from "./AppliedJobsContent";
import { getAppliedJobsCount } from "@/lib/supabase/queries";

const PAGE_SIZE = 10;

export default async function AppliedJobsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params?.page as string) || 1;
  const searchQuery = params?.query as string;
  const provider = params?.provider as string;
  const providerFilter = provider && provider !== "all" ? provider : undefined;

  const applicationStatus = params?.applicationStatus as string;
  const applicationStatusFilter =
    applicationStatus && applicationStatus !== "all"
      ? applicationStatus
      : undefined;

  const sortBy = params?.sortBy as string;
  const sortOrder = params?.sortOrder as string;

  // Fetch count for header (fast query)
  const totalCount = await getAppliedJobsCount(
    providerFilter,
    searchQuery,
    applicationStatusFilter,
  );

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
          <FilterButton
            interestOptions={false}
            scoreOptions={false}
            applicationStatusOptions={true}
          />
          <SortOptions />
          <RefreshButton currentPage={currentPage} />
        </div>
      </div>

      {/* Main content with loading state */}
      <Suspense fallback={<JobListSkeleton />}>
        <AppliedJobsContent
          currentPage={currentPage}
          providerFilter={providerFilter}
          searchQuery={searchQuery}
          applicationStatusFilter={applicationStatusFilter}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </Suspense>
    </div>
  );
}

export const revalidate = 3600;
