import {
  getTopScoredJobs,
  getTopScoredJobsCount,
  Job,
} from "@/lib/supabase/queries";
import TopMatchesList from "@/components/jobs/TopMatchesList"; // Import the client component
// Assume you add this function to queries.ts
// import { getTopScoredJobsCount } from "@/lib/supabase/queries";

const PAGE_SIZE = 10; // Define page size

// The page component now accepts searchParams
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

  // --- Fetch total count  ---
  const totalCount = await getTopScoredJobsCount();

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Top Job Matches</h1>
      {/* Pass jobs, currentPage, and totalPages to the client component */}
      <TopMatchesList
        jobs={topJobs}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}

// Optional: Add revalidation if needed
// export const revalidate = 3600;
