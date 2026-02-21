import {
  getTopScoredJobs,
  getTopScoredJobsCount,
} from "@/lib/supabase/queries";
import TopMatchesList from "@/components/jobs/TopMatchesList";
import { Job } from "@/types";

interface TopMatchesContentProps {
  currentPage: number;
  providerFilter?: string;
  minScore?: number;
  maxScore?: number;
  interestFilter?: boolean | null;
  searchQuery?: string;
}

export default async function TopMatchesContent({
  currentPage,
  providerFilter,
  minScore,
  maxScore,
  interestFilter,
  searchQuery,
}: TopMatchesContentProps) {
  const PAGE_SIZE = 10;

  console.log("🔍 TopMatchesContent - Fetching with params:", {
    currentPage,
    providerFilter,
    minScore,
    maxScore,
    interestFilter,
    searchQuery,
  });

  // Fetch the jobs for the current page with filters
  const topJobs: Job[] = await getTopScoredJobs(
    currentPage,
    PAGE_SIZE,
    providerFilter,
    minScore,
    maxScore,
    interestFilter,
    searchQuery,
  );

  console.log("✅ TopMatchesContent - Got jobs:", {
    jobsCount: topJobs.length,
    jobs: topJobs.map((j) => ({
      job_id: j.job_id,
      title: j.job_title,
      status: j.status,
      score: j.resume_score,
    })),
  });

  // Fetch total count with filters
  const totalCount = await getTopScoredJobsCount(
    providerFilter,
    minScore,
    maxScore,
    interestFilter,
    searchQuery,
  );

  console.log("📊 TopMatchesContent - Count query result:", { totalCount });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <TopMatchesList
      jobs={topJobs}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
