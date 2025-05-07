import ResumeEditClient from "@/components/resume/ResumeEditClient";
import { getCustomizedResumeById } from "@/lib/supabase/queries";
import { Resume } from "@/types";
import { notFound } from "next/navigation";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function ResumeEdit({ params }: Params) {
  const { id } = await params;

  try {
    const resume_data: Resume | null = await getCustomizedResumeById(id);

    if (!resume_data) return notFound();

    return <ResumeEditClient resumeData={resume_data} />;
  } catch (error) {
    console.error("Error getting resume:", error);
  }

  return <div>Resume Edit Page {id}</div>;
}
