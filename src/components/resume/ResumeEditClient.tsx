import { Resume } from "@/types";

interface ResumeEditProps {
  resumeData: Resume;
}

export default function ResumeEditClient({ resumeData }: ResumeEditProps) {
  return (
    <div>
      <h1>Resume Edit</h1>
      {/* Render the resume data here */}
    </div>
  );
}
