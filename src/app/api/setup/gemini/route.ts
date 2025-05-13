import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import crypto from "crypto";

// Ensure your encryption key is set in environment variables and is 32 bytes for aes-256-cbc
const ENCRYPTION_KEY = process.env.GEMINI_API_KEY_ENCRYPTION_KEY;
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error(
      "GEMINI_API_KEY_ENCRYPTION_KEY is not set in environment variables."
    );
  }
  if (Buffer.from(ENCRYPTION_KEY).length !== 32) {
    throw new Error("GEMINI_API_KEY_ENCRYPTION_KEY must be 32 bytes long.");
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
  const { firstApiKey, secondApiKey } = await req.json();

  if (!firstApiKey || !secondApiKey) {
    return NextResponse.json(
      { success: false, message: "Missing required API keys." },
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
      "CRITICAL: GEMINI_API_KEY_ENCRYPTION_KEY must be 32 bytes long."
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
    // If tables exist, proceed with the original logic
    const appSupabase = await createSupabaseServerClient();

    const encryptedGeminiFirstApiKey = encrypt(firstApiKey);
    const encryptedGeminiSecondApiKey = encrypt(secondApiKey);
    const currentTime = new Date().toISOString();

    // Get the user ID from the session
    const {
      data: { session },
    } = await appSupabase.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "User not authenticated." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const { error: profileUpdateError } = await appSupabase
      .from("profiles")
      .update({
        gemini_api_key_1: encryptedGeminiFirstApiKey,
        gemini_api_key_2: encryptedGeminiSecondApiKey,
        gemini_setup_completed_at: currentTime,
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
          message: `User's Gemini configured, but failed to save settings in your application: ${profileUpdateError.message}. Please contact support.`,
        },
        { status: 500 } // Or a specific status code indicating partial success
      );
    }

    return NextResponse.json({
      success: true,
      message: "Gemini configured.",
    });
  } catch (error: any) {
    console.error("Overall error in Gemini setup API:", error);
    let message = "An unexpected error occurred during Gemini setup.";
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
        "Network error: Could not reach the provided Gemini API. Please verify the URL and your network connection.";
    } else if (
      message.includes("Invalid API key") ||
      message.includes("Unauthorized")
    ) {
      message =
        "Authentication error: Invalid Gemini API Key. Please verify the key.";
    }

    return NextResponse.json(
      { success: false, message: message },
      { status: 500 }
    );
  }
}
