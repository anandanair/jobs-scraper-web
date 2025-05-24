import { Job, Resume } from "@/types";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";

// Helper function to handle Supabase response errors
async function handleResponse({
  data,
  error,
}: {
  data: any[] | null; // Keep 'any' for flexibility or refine if possible
  error: PostgrestError | null;
}): Promise<any> {
  // Keep 'any' or refine return type
  if (error) {
    console.error("Supabase response error:", error);
    throw new Error(error.message); // Or handle error more gracefully
  }
  // Allow returning empty arrays or potentially null for single results handled elsewhere
  // Removed the !data check here as it might be too strict for all cases
  return data;
}

// --- Query Functions ---

export async function getTopScoredJobs(
  page: number = 1, // Default to page 1
  pageSize: number = 10, // Default page size
  provider?: string, // Optional provider filter
  minScore: number = 50, // Default minScore
  maxScore: number = 100, // Default maxScore
  isInterested?: boolean | null, // Optional interest filter (true, false, or null for 'not marked')
  searchQuery?: string // Optional search query
): Promise<Job[]> {
  const supabase = await createSupabaseServerClient();

  const rpcParams: any = {
    p_page_number: page,
    p_page_size: pageSize,
    p_provider: provider || null,
    p_min_score: minScore,
    p_max_score: maxScore,
    p_search_query: searchQuery || null, // Add search query to RPC params
  };

  // Determine the string value for p_is_interested_option
  let interestOption: string | undefined = undefined;
  if (isInterested === true) {
    interestOption = "true";
  } else if (isInterested === false) {
    interestOption = "false";
  } else if (isInterested === null) {
    interestOption = "null_value";
  }
  // If isInterested is undefined (meaning 'all'), interestOption remains undefined,
  // and p_is_interested_option will not be added to rpcParams,
  // so the RPC function will use its default 'all'.

  if (interestOption !== undefined) {
    rpcParams.p_is_interested_option = interestOption;
  }

  const response = await supabase.rpc(
    "get_top_scored_jobs_custom_sort",
    rpcParams
  );

  // The existing handleResponse function can be used if it expects { data, error }
  // and data is the array of jobs.
  // If rpc() returns data directly in response.data without an outer data property, adjust accordingly.
  // Assuming supabase.rpc returns { data: Job[], error: PostgrestError | null }
  const data = await handleResponse(response);
  return data ?? []; // Return empty array if data is null/undefined
}

// New function to get the count of top scored jobs
// Updated to support provider, score, interest, and search filtering
export async function getTopScoredJobsCount(
  provider?: string,
  minScore: number = 50, // Default minScore
  maxScore: number = 100, // Default maxScore
  isInterested?: boolean | null, // Optional interest filter
  searchQuery?: string // Optional search query
): Promise<number> {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("jobs")
    .select("*", { count: "exact", head: true }) // Select count only
    .eq("is_active", true)
    .eq("status", "new")
    .eq("job_state", "new")
    .gte("resume_score", minScore) // Apply minScore filter
    .lte("resume_score", maxScore); // Apply maxScore filter

  // Add provider filter if specified
  if (provider) {
    query = query.eq("provider", provider);
  }

  // Add interest filter if specified
  // undefined means 'all' (no filter on is_interested)
  // null means 'is_interested IS NULL' (not marked)
  // true means 'is_interested IS TRUE'
  // false means 'is_interested IS FALSE'
  if (isInterested === true) {
    query = query.is("is_interested", true);
  } else if (isInterested === false) {
    query = query.is("is_interested", false);
  } else if (isInterested === null) {
    query = query.is("is_interested", null);
  }
  // If isInterested is undefined, no additional filter is applied for interest status.

  // Add search query filter if specified
  if (searchQuery) {
    // Assuming you want to search in 'job_title' and 'company' fields
    // Adjust the fields and logic as per your database schema and search requirements
    query = query.or(
      `job_title.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%`
    ); // Changed 'role' to 'job_title'
  }

  const { count, error } = await query;

  if (error) {
    console.error("Supabase count error:", error.message || "Unknown error"); // Added a fallback for empty error message
    throw new Error(error.message || "Failed to get job count"); // Added a fallback for empty error message
  }

  return count ?? 0; // Return the count or 0 if null
}

export async function getNewJobs(
  page: number = 1,
  pageSize: number = 10,
  provider?: string, // Optional provider filter
  minScore: number = 0, // Default minScore (assuming 0 as a base for 'new' jobs if not specified)
  maxScore: number = 100, // Default maxScore
  isInterested?: boolean | null, // Optional interest filter (true, false, or null for 'not marked')
  searchQuery?: string // Optional search query
): Promise<Job[]> {
  const supabase = await createSupabaseServerClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .eq("status", "new") // Filter by status
    .eq("job_state", "new")
    .gte("resume_score", minScore) // Apply minScore filter
    .lte("resume_score", maxScore); // Apply maxScore filter

  // Add provider filter if specified
  if (provider) {
    query = query.eq("provider", provider);
  }

  // Add interest filter if specified
  if (isInterested === true) {
    query = query.is("is_interested", true);
  } else if (isInterested === false) {
    query = query.is("is_interested", false);
  } else if (isInterested === null) {
    query = query.is("is_interested", null);
  } else {
    // Default behavior from original function: is_interested is null or true
    query = query.or("is_interested.is.null,is_interested.eq.true");
  }

  // Add search query filter if specified
  if (searchQuery) {
    query = query.or(
      `job_title.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%`
    );
  }

  query = query.order("scraped_at", { ascending: false }).range(from, to); // Added pagination

  const response = await query;
  return handleResponse(response);
}

// Function to get the count of all active jobs with filters
export async function getAllActiveJobsCount(
  provider?: string, // Optional provider filter
  minScore: number = 0, // Default minScore (assuming 0 as a base if not specified)
  maxScore: number = 100, // Default maxScore
  isInterested?: boolean | null, // Optional interest filter
  searchQuery?: string // Optional search query
): Promise<number> {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("jobs")
    .select("*", { count: "exact", head: true }) // Select count only
    .eq("is_active", true)
    .eq("status", "new")
    .eq("job_state", "new")
    .gte("resume_score", minScore) // Apply minScore filter
    .lte("resume_score", maxScore); // Apply maxScore filter

  // Add provider filter if specified
  if (provider) {
    query = query.eq("provider", provider);
  }

  // Add interest filter if specified
  if (isInterested === true) {
    query = query.is("is_interested", true);
  } else if (isInterested === false) {
    query = query.is("is_interested", false);
  } else if (isInterested === null) {
    query = query.is("is_interested", null);
  }
  // If isInterested is undefined, no additional filter is applied for interest status.

  // Add search query filter if specified
  if (searchQuery) {
    query = query.or(
      `job_title.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%`
    );
  }

  const { count, error } = await query;

  if (error) {
    console.error("Supabase count error (all active jobs):", error);
    throw new Error(error.message); // Or return 0, depending on desired behavior
  }

  return count ?? 0; // Return the count or 0 if null
}

export async function getAppliedJobs(
  page: number = 1,
  pageSize: number = 10
): Promise<Job[]> {
  // const appliedStatuses = ["applied", "interviewing", "offered"]; // This is no longer directly used here
  const supabase = await createSupabaseServerClient();

  // Call the RPC function
  const rpcParams = {
    p_page_number: page,
    p_page_size: pageSize,
  };

  const response = await supabase.rpc(
    "get_applied_jobs_sorted", // Name of your RPC function
    rpcParams
  );

  // The existing handleResponse function can be used
  const data = await handleResponse(response);
  return data ?? []; // Return empty array if data is null/undefined
}

// Function to get the count of applied jobs
export async function getAppliedJobsCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  // IMPORTANT: Ensure these statuses match those in your RPC and database
  // Suggestion: Standardize to ['applied', 'interviewing', 'offered'] if 'offered' is correct
  const appliedStatuses = ["applied", "interviewing", "offer"];

  const { count, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true }) // Select count only
    .eq("is_active", true)
    .in("status", appliedStatuses) // Filter by relevant statuses
    .eq("job_state", "new");

  if (error) {
    console.error("Supabase count error (applied jobs):", error);
    throw new Error(error.message); // Or return 0, depending on desired behavior
  }

  return count ?? 0; // Return the count or 0 if null
}

/**
 * Gets the count of applied jobs on a specific date.
 * @param dateThe date string in 'YYYY-MM-DD' format.
 * @returns A promise that resolves to the number of jobs applied on that date.
 */
export async function getAppliedJobsCountByDate(
  localDateString: string
): Promise<number> {
  // localDateString is "YYYY-MM-DD", e.g., "2025-05-21" from server's local TZ
  const supabase = await createSupabaseServerClient();
  const appliedStatuses = ["applied", "interviewing", "offer"];

  // Create a Date object representing the start of the local day (00:00:00 local time)
  // For "2025-05-21", this will be 2025-05-21T00:00:00 in the server's local timezone.
  const startOfLocalDay = new Date(localDateString);

  // Convert the start of the local day to a UTC ISO string for the query
  const startOfDayUTCForQuery = startOfLocalDay.toISOString();

  // Create a Date object for the end of the local day
  // Start with the beginning of the local day again
  const endOfLocalDay = new Date(localDateString);
  // Advance it by one full day to get the start of the *next* local day
  endOfLocalDay.setDate(startOfLocalDay.getDate() + 1);

  // Convert the start of the next local day to a UTC ISO string for the query boundary
  const startOfNextDayUTCForQuery = endOfLocalDay.toISOString();

  // For debugging:
  // console.log(`Querying for applications on local date: ${localDateString}`);
  // console.log(`UTC Range: >= ${startOfDayUTCForQuery} and < ${startOfNextDayUTCForQuery}`);

  const { count, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)
    .in("status", appliedStatuses)
    .eq("job_state", "new") // Retained this filter if it's still relevant
    .gte("application_date", startOfDayUTCForQuery) // Greater than or equal to the start of the local day (in UTC)
    .lt("application_date", startOfNextDayUTCForQuery); // Less than the start of the next local day (in UTC)

  if (error) {
    console.error(
      `Supabase count error (applied jobs on local date ${localDateString}):`,
      error
    );
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function getJobById(job_id: string): Promise<Job | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*, customized_resumes(resume_link)") // Fetches all job fields and the resume_link from the related customized_resume
    .eq("job_id", job_id)
    .single(); // Use single() if you expect only one or zero results

  if (error && error.code !== "PGRST116") {
    // PGRST116: Row not found, which is okay for single()
    console.error("Supabase response error:", error);
    throw new Error(error.message);
  }
  // The 'data' object will now potentially include a 'customized_resumes' field:
  // e.g., { ..., customized_resume_id: 'xyz', customized_resumes: { resume_link: '...' } }
  // or { ..., customized_resume_id: null, customized_resumes: null }
  return data as Job | null; // Ensure your Job type definition accommodates this structure
}

export async function getUserResume(): Promise<Resume | null> {
  const supabase = await createSupabaseServerClient();
  const response = await supabase
    .from("resumes") // Use the 'resumes' table
    .select("*")
    .eq("email", "anand@itsmeanand.com")
    .maybeSingle();

  return handleResponse(response);
}

// New function to update a job by its ID
export async function updateJobById(
  job_id: string,
  updates: Partial<Omit<Job, "job_id">>
): Promise<Job | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("jobs")
    .update(updates)
    .eq("job_id", job_id)
    .select() // Select the updated row
    .single(); // Expect a single row to be returned

  // The handleResponse function might need adjustment if it's not designed for single object returns
  // or if you want specific error handling for updates.
  // For now, we'll adapt the error handling similar to getJobById.
  if (error) {
    // PGRST116: Row not found, which means the job_id didn't match any record.
    if (error.code === "PGRST116") {
      console.warn(`Job with ID ${job_id} not found for update.`);
      return null;
    }
    console.error("Supabase update error:", error);
    throw new Error(error.message);
  }
  return data as Job | null; // Cast to Job or null
}

/**
 * Retrieves a specific customized resume by its ID.
 * @param resume_id The ID of the customized resume to retrieve.
 * @returns A promise that resolves to the Resume object or null if not found.
 */
export async function getCustomizedResumeById(
  resume_id: string
): Promise<Resume | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("customized_resumes") // Target the 'customized_resumes' table
    .select("*")
    .eq("id", resume_id) // Assuming 'id' is the primary key column
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116: Row not found, which is okay for single()
    console.error("Supabase error fetching customized resume:", error);
    throw new Error(error.message);
  }
  return data as Resume | null;
}

/**
 * Updates specified fields of a customized resume by its ID.
 * @param resume_id The ID of the customized resume to update.
 * @param updates An object containing the fields to update.
 * @returns A promise that resolves to the updated Resume object or null if not found.
 */
export async function updateCustomizedResumeById(
  resume_id: string,
  updates: Partial<Omit<Resume, "id" | "created_at" | "last_updated">> // Exclude system-managed fields from direct update via this function
): Promise<Resume | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("customized_resumes") // Target the 'customized_resumes' table
    .update(updates)
    .eq("id", resume_id) // Assuming 'id' is the primary key column
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Row not found
      console.warn(
        `Customized resume with ID ${resume_id} not found for update.`
      );
      return null;
    }
    console.error("Supabase error updating customized resume:", error);
    throw new Error(error.message);
  }
  return data as Resume | null;
}

// New function to upload a personalized resume PDF to Supabase Storage
/**
 * Uploads a personalized resume PDF to Supabase Storage.
 * @param job_id The ID of the job for which the resume is personalized.
 * @param file The PDF file to upload.
 * @returns A promise that resolves to an object containing the public URL of the uploaded file.
 * @throws Will throw an error if the upload fails or the public URL cannot be retrieved.
 */
export async function uploadPersonalizedResume(
  fileName: string,
  file: File
): Promise<{ publicUrl: string }> {
  const supabase = await createSupabaseServerClient();
  const filePath = `personalized_resumes/${fileName}`;

  console.log("Uploading file to path:", filePath);

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("resumes") // Your specified bucket name
    .upload(filePath, file, {
      upsert: true, // Overwrite if file already exists
    });

  if (uploadError) {
    console.error("Supabase storage upload error:", uploadError);
    throw new Error(
      `Failed to upload personalized resume: ${uploadError.message}`
    );
  }

  if (!uploadData || !uploadData.path) {
    console.error(
      "Supabase storage upload error: No path returned despite no error."
    );
    throw new Error(
      "Failed to upload personalized resume: No path returned from storage."
    );
  }

  // Get the public URL of the uploaded file
  const { data: publicUrlData } = supabase.storage
    .from("resumes")
    .getPublicUrl(uploadData.path);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    console.error(
      "Supabase storage error: Could not retrieve public URL for uploaded file."
    );
    // It might be useful to also log uploadData.path here for debugging
    throw new Error(
      "Failed to get public URL for personalized resume. The file was uploaded, but its URL could not be retrieved."
    );
  }

  return { publicUrl: publicUrlData.publicUrl };
}

// --- New Count Functions ---

/**
 * Gets the count of expired jobs.
 * @returns A promise that resolves to the number of expired jobs.
 */
export async function getExpiredJobsCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("job_state", "expired");

  if (error) {
    console.error("Supabase count error (expired jobs):", error);
    throw new Error(error.message);
  }
  return count ?? 0;
}

/**
 * Gets the count of jobs pending to be scored (resume_score is null).
 * @returns A promise that resolves to the number of jobs pending scoring.
 */
export async function getPendingScoreJobsCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .is("resume_score", null)
    .eq("is_active", true) // Assuming we only count active jobs
    .eq("status", "new") // And new jobs that haven't been processed beyond initial scraping
    .eq("job_state", "new");

  if (error) {
    console.error("Supabase count error (pending score jobs):", error);
    throw new Error(error.message);
  }
  return count ?? 0;
}

/**
 * Gets the count of jobs that have already been scored (resume_score is not null).
 * @returns A promise that resolves to the number of scored jobs.
 */
export async function getScoredJobsCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .not("resume_score", "is", null)
    .eq("is_active", true)
    .eq("status", "new")
    .eq("job_state", "new");

  if (error) {
    console.error("Supabase count error (scored jobs):", error);
    throw new Error(error.message);
  }
  return count ?? 0;
}

/**
 * Gets the count of jobs which have a custom resume generated (customized_resume_id is not null).
 * @returns A promise that resolves to the number of jobs with a custom resume.
 */
export async function getCustomResumeJobsCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .not("customized_resume_id", "is", null)
    .eq("is_active", true); // Assuming active jobs

  if (error) {
    console.error("Supabase count error (custom resume jobs):", error);
    throw new Error(error.message);
  }
  return count ?? 0;
}

/**
 * Gets the count of jobs which have no custom resume (customized_resume_id is null).
 * @returns A promise that resolves to the number of jobs without a custom resume.
 */
export async function getNoCustomResumeJobsCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .is("customized_resume_id", null)
    .eq("is_active", true); // Assuming active jobs

  if (error) {
    console.error("Supabase count error (no custom resume jobs):", error);
    throw new Error(error.message);
  }
  return count ?? 0;
}

/**
 * Gets the count of scored jobs based on the original resume.
 * (resume_score is not null AND resume_score_stage is "initial")
 * @returns A promise that resolves to the number of jobs scored with the original resume.
 */
export async function getScoredWithOriginalResumeCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .not("resume_score", "is", null)
    .eq("resume_score_stage", "initial")
    .eq("is_active", true)
    .eq("status", "new")
    .eq("job_state", "new");

  if (error) {
    console.error("Supabase count error (scored with original resume):", error);
    throw new Error(error.message);
  }
  return count ?? 0;
}

/**
 * Gets the count of scored jobs based on a custom resume.
 * (resume_score is not null AND resume_score_stage is "custom")
 * @returns A promise that resolves to the number of jobs scored with a custom resume.
 */
export async function getScoredWithCustomResumeCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .not("resume_score", "is", null)
    .eq("resume_score_stage", "custom")
    .eq("is_active", true)
    .eq("status", "new")
    .eq("job_state", "new");

  if (error) {
    console.error("Supabase count error (scored with custom resume):", error);
    throw new Error(error.message);
  }
  return count ?? 0;
}

/**
 * Gets the count of jobs from LinkedIn.
 * Filters for active, new status, and new job_state jobs by default.
 * @returns A promise that resolves to the number of LinkedIn jobs.
 */
export async function getLinkedInJobsCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("provider", "linkedin")
    .eq("is_active", true) // Consider if these filters are always needed
    .eq("job_state", "new");

  if (error) {
    console.error("Supabase count error (LinkedIn jobs):", error);
    throw new Error(error.message);
  }
  return count ?? 0;
}

/**
 * Gets the count of jobs from Careers Future.
 * Filters for active, new status, and new job_state jobs by default.
 * @returns A promise that resolves to the number of Careers Future jobs.
 */
export async function getCareersFutureJobsCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true })
    .eq("provider", "careers_future")
    .eq("is_active", true) // Consider if these filters are always needed
    .eq("job_state", "new");

  if (error) {
    console.error("Supabase count error (Careers Future jobs):", error);
    throw new Error(error.message);
  }
  return count ?? 0;
}
