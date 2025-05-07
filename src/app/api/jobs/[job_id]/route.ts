import { NextResponse } from "next/server";
import { updateJobById, Job } from "@/lib/supabase/queries"; // Adjust path as needed

// Handler for PATCH requests to update a job
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ job_id: string }> }
) {
  try {
    const { job_id } = await params;
    if (!job_id) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const updates = (await request.json()) as Partial<Omit<Job, "job_id">>;
    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Update payload is required" },
        { status: 400 }
      );
    }

    const updatedJob = await updateJobById(job_id, updates);

    if (!updatedJob) {
      return NextResponse.json(
        { error: `Job with ID ${job_id} not found or update failed` },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedJob, { status: 200 });
  } catch (error) {
    console.error("API Error updating job:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Failed to update job", details: errorMessage },
      { status: 500 }
    );
  }
}
