import { createClient } from "@/utils/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";

const supabase = await createClient();

// Define basic types (you can refine these later based on your actual table structure)
export interface Job {
  job_id: string;
  company: string;
  job_title: string;
  level: string;
  location: string;
  description: string;
  status: string;
  application_date: string;
  resume_score?: number;
  scraped_at: string;
  last_checked: string;
  job_state: string;
}

// --- Resume Related Interfaces ---

export interface Education {
  degree: string;
  field_of_study: string | null;
  institution: string;
  start_year: string | null;
  end_year: string | null;
}

export interface Experience {
  job_title: string;
  company: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
}

export interface Project {
  name: string;
  description: string | null;
  technologies: string[] | null;
}

export interface Certification {
  name: string;
  issuer: string | null;
  year: string | null;
}

export interface Links {
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
}

// Updated Resume Interface
export interface Resume {
  id: string; // Assuming this is the primary key for the resume table
  name: string;
  email: string;
  created_at: string; // Keep this if it's the resume creation timestamp
  phone: string;
  location: string;
  summary: string;
  skills: Record<string, any>; // Keep generic or define more specific skill structure if known
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  languages: Record<string, any>[]; // Keep generic or define language structure if known
  links: Links; // Changed to single object based on Python model
  parsed_at: string;
}

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

export async function getAllJobs(): Promise<Job[]> {
  const response = await supabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .order("scraped_at", { ascending: false });
  return handleResponse(response);
}

export async function getTopScoredJobs(
  page: number = 1, // Default to page 1
  pageSize: number = 10 // Default page size
): Promise<Job[]> {
  const from = (page - 1) * pageSize; // Calculate starting index (0-based)
  const to = from + pageSize - 1; // Calculate ending index

  const response = await supabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .not("resume_score", "is", null) // Ensure score exists
    .order("resume_score", { ascending: false })
    .range(from, to); // Use range for pagination instead of limit
  // Use handleResponse, but ensure it handles empty arrays correctly
  const data = await handleResponse(response);
  return data ?? []; // Return empty array if data is null/undefined
}

// New function to get the count of top scored jobs
export async function getTopScoredJobsCount(): Promise<number> {
  const { count, error } = await supabase
    .from("jobs")
    .select("*", { count: "exact", head: true }) // Select count only
    .eq("is_active", true)
    .not("resume_score", "is", null); // Apply the same filters

  if (error) {
    console.error("Supabase count error:", error);
    throw new Error(error.message); // Or return 0, depending on desired behavior
  }

  return count ?? 0; // Return the count or 0 if null
}

export async function getNewJobs(limit: number = 20): Promise<Job[]> {
  const response = await supabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .eq("status", "new") // Filter by status
    .order("scraped_at", { ascending: false })
    .limit(limit);
  return handleResponse(response);
}

export async function getAppliedJobs(): Promise<Job[]> {
  const appliedStatuses = ["applied", "interviewing", "offer"]; // Define statuses to fetch
  const response = await supabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .in("status", appliedStatuses) // Filter by relevant statuses
    .order("application_date", { ascending: false }); // Or order by another relevant field
  return handleResponse(response);
}

export async function getJobById(job_id: string): Promise<Job | null> {
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
  const response = await supabase
    .from("resumes") // Use the 'resumes' table
    .select("*")
    .eq("email", "anand@itsmeanand.com")
    .maybeSingle();

  return handleResponse(response);
}
