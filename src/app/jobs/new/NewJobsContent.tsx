import { getAllActiveJobsCount, getNewJobs } from "@/lib/supabase/queries";
import TopMatchesList from "@/components/jobs/TopMatchesList";
import { Job } from "@/types";

interface NewJobsContentProps {
  currentPage: number;
  providerFilter?: string;
  minScore?: number;
  maxScore?: number;
  interestFilter?: boolean | null;
  searchQuery?: string;
}

export default async function NewJobsContent({
  currentPage,
  providerFilter,
  minScore,
  maxScore,
  interestFilter,
  searchQuery,
}: NewJobsContentProps) {
  const PAGE_SIZE = 10;

  // Fetch the jobs for the current page
  const newJobs: Job[] = await getNewJobs(
    currentPage,
    PAGE_SIZE,
    providerFilter,
    minScore,
    maxScore,
    interestFilter,
    searchQuery,
  );

  // Fetch total count
  const totalCount = await getAllActiveJobsCount(
    providerFilter,
    minScore,
    maxScore,
    interestFilter,
    searchQuery,
  );

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <TopMatchesList
      jobs={newJobs}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
