import {
  getUserProfileByEmail,
  getActiveResumeStyle,
  getAllResumeStyles,
} from "@/lib/supabase/queries";
import ResumeStyleClient from "@/components/resume-style/ResumeStyleClient";

export const dynamic = "force-dynamic";

export default async function ResumeStylePage() {
  const [baseResume, activeStyle, allPresets] = await Promise.all([
    getUserProfileByEmail(),
    getActiveResumeStyle(),
    getAllResumeStyles(),
  ]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-165px)] overflow-hidden">
      <div className="mb-2 shrink-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Resume Design &amp; Style Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Customize the typography, colors, layout, and section order for all generated resumes.
          These styles are strictly ATS-compliant and apply automatically to future custom resumes.
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <ResumeStyleClient
          initialBaseResume={baseResume}
          initialThemeConfig={activeStyle}
          initialSavedSettings={allPresets}
        />
      </div>
    </div>
  );
}
