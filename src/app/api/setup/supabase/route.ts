import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js"; // Added import

// Ensure your encryption key is set in environment variables and is 32 bytes for aes-256-cbc
const ENCRYPTION_KEY = process.env.SUPABASE_SERVICE_KEY_ENCRYPTION_KEY;
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_KEY_ENCRYPTION_KEY is not set in environment variables."
    );
  }
  if (Buffer.from(ENCRYPTION_KEY).length !== 32) {
    throw new Error(
      "SUPABASE_SERVICE_KEY_ENCRYPTION_KEY must be 32 bytes long."
    );
  }
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export async function POST(req: NextRequest) {
  const { projectUrl, anonKey, serviceRoleKey, userId } = await req.json();

  if (!projectUrl || !anonKey || !serviceRoleKey || !userId) {
    return NextResponse.json(
      { success: false, message: "Missing required credentials or userId." },
      { status: 400 }
    );
  }

  if (!ENCRYPTION_KEY) {
    console.error(
      "CRITICAL: SUPABASE_SERVICE_KEY_ENCRYPTION_KEY is not set in environment variables."
    );
    return NextResponse.json(
      {
        success: false,
        message: "Server configuration error: Encryption key missing.",
      },
      { status: 500 }
    );
  }

  if (Buffer.from(ENCRYPTION_KEY).length !== 32) {
    console.error(
      "CRITICAL: SUPABASE_SERVICE_KEY_ENCRYPTION_KEY must be 32 bytes long."
    );
    return NextResponse.json(
      {
        success: false,
        message: "Server configuration error: Invalid encryption key length.",
      },
      { status: 500 }
    );
  }

  try {
    // Create a client for the user's Supabase project
    const userSupabaseClient = createClient(projectUrl, serviceRoleKey);

    let jobsTableExists = false;
    try {
      // Try a lightweight query to check if 'jobs' table exists.
      // { head: true } fetches only the headers (metadata), not the data.
      // .select('*', { head: true, count: 'exact' }) is also a good option.
      const { error: jobsError } = await userSupabaseClient
        .from("jobs")
        .select("job_id", { head: true, count: "exact" }) // Select a known column, get only count, no data
        .limit(1); // Limit to 1 or 0 is fine

      if (jobsError) {
        // If error code is 42P01, it means table not found.
        if (jobsError.code === "42P01") {
          jobsTableExists = false;
        } else {
          // For other errors, re-throw to be caught by the generic handler below
          console.error(
            "Error probing 'jobs' table in user's Supabase:",
            jobsError
          );
          let userSupabaseErrorMessage = `Error interacting with your Supabase project (checking 'jobs' table): ${jobsError.message}`;
          if (
            jobsError.message.toLowerCase().includes("failed to fetch") ||
            jobsError.message.toLowerCase().includes("network error")
          ) {
            userSupabaseErrorMessage =
              "Network error: Could not reach your Supabase Project URL. Please verify the URL and your network connection.";
          } else if (
            jobsError.message.toLowerCase().includes("invalid api key") ||
            jobsError.message.toLowerCase().includes("unauthorized")
          ) {
            userSupabaseErrorMessage =
              "Authentication error: Invalid Supabase Service Role Key provided for your project. Please verify the key.";
          }
          return NextResponse.json(
            { success: false, message: userSupabaseErrorMessage },
            { status: 400 }
          );
        }
      } else {
        jobsTableExists = true;
      }
    } catch (e: any) {
      // Catch unexpected errors during the probe
      console.error("Unexpected error probing 'jobs' table:", e);
      return NextResponse.json(
        {
          success: false,
          message: `Unexpected error while checking your Supabase 'jobs' table: ${e.message}`,
        },
        { status: 400 }
      );
    }

    let resumesTableExists = false;
    try {
      const { error: resumesError } = await userSupabaseClient
        .from("customized_resumes")
        .select("id", { head: true, count: "exact" })
        .limit(1);

      if (resumesError) {
        if (resumesError.code === "42P01") {
          resumesTableExists = false;
        } else {
          console.error(
            "Error probing 'customized_resumes' table in user's Supabase:",
            resumesError
          );
          let userSupabaseErrorMessage = `Error interacting with your Supabase project (checking 'customized_resumes' table): ${resumesError.message}`;
          if (
            resumesError.message.toLowerCase().includes("failed to fetch") ||
            resumesError.message.toLowerCase().includes("network error")
          ) {
            userSupabaseErrorMessage =
              "Network error: Could not reach your Supabase Project URL. Please verify the URL and your network connection.";
          } else if (
            resumesError.message.toLowerCase().includes("invalid api key") ||
            resumesError.message.toLowerCase().includes("unauthorized")
          ) {
            userSupabaseErrorMessage =
              "Authentication error: Invalid Supabase Service Role Key provided for your project. Please verify the key.";
          }
          return NextResponse.json(
            { success: false, message: userSupabaseErrorMessage },
            { status: 400 }
          );
        }
      } else {
        resumesTableExists = true;
      }
    } catch (e: any) {
      // Catch unexpected errors during the probe
      console.error("Unexpected error probing 'customized_resumes' table:", e);
      return NextResponse.json(
        {
          success: false,
          message: `Unexpected error while checking your Supabase 'customized_resumes' table: ${e.message}`,
        },
        { status: 400 }
      );
    }

    if (!jobsTableExists || !resumesTableExists) {
      const missingTables: string[] = [];
      if (!jobsTableExists) missingTables.push("'jobs'");
      if (!resumesTableExists) missingTables.push("'customized_resumes'");
      return NextResponse.json(
        {
          success: false,
          message: `The required table(s) ${missingTables.join(
            " and "
          )} were not found in your Supabase project. Please go back to Step 4, copy the SQL query, and run it in your Supabase SQL Editor.`,
        },
        { status: 400 }
      );
    }

    // If tables exist, proceed with the original logic
    const appSupabase = await createSupabaseServerClient();

    const encryptedServiceRoleKey = encrypt(serviceRoleKey);
    const currentTime = new Date().toISOString();

    const { error: profileUpdateError } = await appSupabase
      .from("profiles")
      .update({
        supabase_project_url: projectUrl,
        supabase_project_anon_key: anonKey,
        supabase_project_service_key_encrypted: encryptedServiceRoleKey,
        supabase_setup_completed_at: currentTime,
      })
      .eq("id", userId);

    if (profileUpdateError) {
      console.error(
        "Error updating profile in application DB:",
        profileUpdateError
      );
      // User's DB is set up, but app DB update failed. This is a partial success/failure.
      // Log this for manual intervention.
      return NextResponse.json(
        {
          success: false,
          message: `User's Supabase configured, but failed to save settings in your application: ${profileUpdateError.message}. Please contact support.`,
        },
        { status: 500 } // Or a specific status code indicating partial success
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Supabase project configured and database schema initialized successfully.",
    });
  } catch (error: any) {
    console.error("Overall error in Supabase setup API:", error);
    let message = "An unexpected error occurred during Supabase setup.";
    if (error.message) {
      message = error.message;
    }
    // Avoid exposing too much internal error detail to the client for security
    if (
      message.includes("fetch failed") ||
      message.includes("ENOTFOUND") ||
      message.includes("EAI_AGAIN")
    ) {
      message =
        "Network error: Could not reach the provided Supabase Project URL. Please verify the URL and your network connection.";
    } else if (
      message.includes("Invalid API key") ||
      message.includes("Unauthorized")
    ) {
      message =
        "Authentication error: Invalid Supabase Service Role Key. Please verify the key.";
    }

    return NextResponse.json(
      { success: false, message: message },
      { status: 500 }
    );
  }
}
