import { getAppliedJobs, getAppliedJobsCount } from "@/lib/supabase/queries";
import AppliedJobsList from "@/components/jobs/AppliedJobsList";
import { Job } from "@/types";

interface AppliedJobsContentProps {
  currentPage: number;
  providerFilter?: string;
  searchQuery?: string;
  applicationStatusFilter?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default async function AppliedJobsContent({
  currentPage,
  providerFilter,
  searchQuery,
  applicationStatusFilter,
  sortBy,
  sortOrder,
}: AppliedJobsContentProps) {
  const PAGE_SIZE = 10;

  // Fetch the jobs for the current page
  const appliedJobs: Job[] = await getAppliedJobs(
    currentPage,
    PAGE_SIZE,
    providerFilter,
    searchQuery,
    applicationStatusFilter,
    sortBy,
    sortOrder,
  );

  // Fetch total count
  const totalCount = await getAppliedJobsCount(
    providerFilter,
    searchQuery,
    applicationStatusFilter,
  );

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <AppliedJobsList
      jobs={appliedJobs}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
