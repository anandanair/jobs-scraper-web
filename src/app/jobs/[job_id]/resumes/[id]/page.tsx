import CustomPdfViewer from "@/components/CustomPdfViewer";
import { getCustomizedResumeById } from "@/lib/supabase/queries";
import { Resume } from "@/types";
import { notFound } from "next/navigation";

type Params = {
  params: Promise<{ job_id: string; id: string }>;
};

export default async function ResumeView({ params }: Params) {
  const { job_id, id } = await params;

  try {
    const resume_data: Resume | null = await getCustomizedResumeById(id);

    if (!resume_data) return notFound();
    return <CustomPdfViewer fileUrl={resume_data.resume_link || ""} />;
  } catch (error) {
    console.error("Error getting resume:", error);
  }

  return <div>Resume Edit Page {id}</div>;
}
