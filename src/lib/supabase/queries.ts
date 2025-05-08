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
  pageSize: number = 10 // Default page size
): Promise<Job[]> {
  const supabase = await createSupabaseServerClient();

  const rpcParams = {
    p_page_number: page,
    p_page_size: pageSize,
  };

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
// This function remains unchanged as sorting doesn't affect the count of matching items.
export async function getTopScoredJobsCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true }) // Select count only
    .eq("is_active", true)
    .eq("status", "new")
    .eq("job_state", "new")
    // .not("resume_score", "is", null); // Apply the same filters
    .gte("resume_score", 50);

  if (error) {
    console.error("Supabase count error:", error);
    throw new Error(error.message); // Or return 0, depending on desired behavior
  }

  return count ?? 0; // Return the count or 0 if null
}

export async function getNewJobs(
  page: number = 1,
  pageSize: number = 10
): Promise<Job[]> {
  const supabase = await createSupabaseServerClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const response = await supabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .eq("status", "new") // Filter by status
    .eq("job_state", "new")
    .order("scraped_at", { ascending: false })
    .range(from, to); // Added pagination
  return handleResponse(response);
}

// Function to get the count of applied jobs
export async function getAllActiveJobsCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();

  const { count, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true }) // Select count only
    .eq("is_active", true)
    .eq("status", "new")
    .eq("job_state", "new");

  if (error) {
    console.error("Supabase count error (applied jobs):", error);
    throw new Error(error.message); // Or return 0, depending on desired behavior
  }

  return count ?? 0; // Return the count or 0 if null
}

export async function getAppliedJobs(
  page: number = 1,
  pageSize: number = 10
): Promise<Job[]> {
  const appliedStatuses = ["applied", "interviewing", "offered  "]; // Define statuses to fetch
  const supabase = await createSupabaseServerClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const response = await supabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .in("status", appliedStatuses) // Filter by relevant statuses
    .eq("job_state", "new")
    .order("application_date", { ascending: false }) // Or order by another relevant field
    .range(from, to); // Added pagination
  return handleResponse(response);
}

// Function to get the count of applied jobs
export async function getAppliedJobsCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const appliedStatuses = ["applied", "interviewing", "offer"]; // Define statuses to fetch

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

export async function getJobById(job_id: string): Promise<Job | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("job_id", job_id)
    .single(); // Use single() if you expect only one or zero results

  if (error && error.code !== "PGRST116") {
    // PGRST116: Row not found, which is okay for single()
    console.error("Supabase response error:", error);
    throw new Error(error.message);
  }
  return data;
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
