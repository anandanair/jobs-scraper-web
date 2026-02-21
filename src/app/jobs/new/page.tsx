import { Suspense } from "react";
import RefreshButton from "@/components/jobs/RefreshButton";
import JobListSkeleton from "@/components/jobs/JobListSkeleton";
import SearchComponent from "@/components/jobs/SearchComponent";
import FilterButton from "@/components/jobs/FilterButton";
import NewJobsContent from "./NewJobsContent";
import { getAllActiveJobsCount } from "@/lib/supabase/queries";

const PAGE_SIZE = 10;

export default async function NewJobsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params?.page as string) || 1;
  const searchQuery = params?.query as string;
  const provider = params?.provider as string;
  const providerFilter = provider && provider !== "all" ? provider : undefined;

  const interestParam = params?.interest as string;
  let interestFilter: boolean | null | undefined = undefined;
  if (interestParam === "true") {
    interestFilter = true;
  } else if (interestParam === "false") {
    interestFilter = false;
  } else if (interestParam === "null") {
    interestFilter = null;
  }

  const minScoreParam = params?.minScore as string;
  const maxScoreParam = params?.maxScore as string;
  const minScore = minScoreParam ? parseInt(minScoreParam) : undefined;
  const maxScore = maxScoreParam ? parseInt(maxScoreParam) : undefined;

  // Fetch count for header (fast query)
  const totalCount = await getAllActiveJobsCount(
    providerFilter,
    minScore,
    maxScore,
    interestFilter,
    searchQuery,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page header with actions */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Jobs</h1>
          <p className="mt-1 text-sm text-gray-500">
            New jobs ({totalCount} total)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <SearchComponent />
          <FilterButton />
          <RefreshButton currentPage={currentPage} />
        </div>
      </div>

      {/* Main content with loading state */}
      <Suspense fallback={<JobListSkeleton />}>
        <NewJobsContent
          currentPage={currentPage}
          providerFilter={providerFilter}
          minScore={minScore}
          maxScore={maxScore}
          interestFilter={interestFilter}
          searchQuery={searchQuery}
        />
      </Suspense>
    </div>
  );
}

export const revalidate = 3600;
