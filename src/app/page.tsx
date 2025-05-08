import Link from "next/link";
import {
  getAllActiveJobsCount,
  getAppliedJobsCount,
  getTopScoredJobsCount,
  getExpiredJobsCount,
  getPendingScoreJobsCount,
  getScoredJobsCount,
  getCustomResumeJobsCount,
  getNoCustomResumeJobsCount,
  getScoredWithOriginalResumeCount,
  getScoredWithCustomResumeCount,
} from "@/lib/supabase/queries";
import {
  Briefcase,
  CheckSquare,
  Star,
  Zap,
  Archive,
  FileClock,
  FileCheck,
  FileText,
  FileX,
  FileUp,
  FileSignature,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  href: string;
  description: string;
}

function StatCard({ title, value, icon, href, description }: StatCardProps) {
  return (
    <Link href={href} className="block p-1">
      <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {title}
          </h3>
          <div className="text-indigo-500 bg-indigo-100 p-2 rounded-lg">
            {icon}
          </div>
        </div>
        <p className="text-4xl font-bold text-gray-800 mb-1">{value}</p>
        <p className="text-xs text-gray-500 mt-auto">{description}</p>
      </div>
    </Link>
  );
}

export default async function Home() {
  const totalNewJobs = await getAllActiveJobsCount();
  const totalAppliedJobs = await getAppliedJobsCount();
  const totalTopMatches = await getTopScoredJobsCount();
  const expiredJobsCount = await getExpiredJobsCount();
  const pendingScoreJobsCount = await getPendingScoreJobsCount();
  const scoredJobsCount = await getScoredJobsCount(); // Total scored (new, job_state new)
  const customResumeJobsCount = await getCustomResumeJobsCount(); // Has custom resume ID
  const noCustomResumeJobsCount = await getNoCustomResumeJobsCount(); // No custom resume ID
  const scoredWithOriginalResumeCount =
    await getScoredWithOriginalResumeCount();
  const scoredWithCustomResumeCount = await getScoredWithCustomResumeCount();

  const stats = [
    {
      title: "New Jobs",
      value: totalNewJobs,
      icon: <Zap size={24} />,
      href: "/jobs/new",
      description: "Recently scraped job opportunities.",
    },
    {
      title: "Applied Jobs",
      value: totalAppliedJobs,
      icon: <CheckSquare size={24} />,
      href: "/jobs/applied",
      description: "Jobs you have applied to.",
    },
    {
      title: "Top Matches",
      value: totalTopMatches,
      icon: <Star size={24} />,
      href: "/jobs/top-matches",
      description: "Jobs that best match your profile.",
    },
    {
      title: "Expired Jobs",
      value: expiredJobsCount,
      icon: <Archive size={24} />,
      href: "/", // Or a relevant page if it exists
      description: "Jobs that are no longer active.",
    },
    {
      title: "Pending Scoring",
      value: pendingScoreJobsCount,
      icon: <FileClock size={24} />,
      href: "/jobs/new", // Likely new jobs that need scoring
      description: "Active new jobs awaiting resume score.",
    },
    {
      title: "Scored Jobs (New)",
      value: scoredJobsCount,
      icon: <FileCheck size={24} />,
      href: "/jobs/top-matches", // Scored jobs are often top matches
      description: "Active new jobs that have a resume score.",
    },
    {
      title: "Scored (Original)",
      value: scoredWithOriginalResumeCount,
      icon: <FileUp size={24} />,
      href: "/jobs/top-matches",
      description: "Jobs scored using the original resume.",
    },
    {
      title: "Scored (Custom)",
      value: scoredWithCustomResumeCount,
      icon: <FileSignature size={24} />,
      href: "/jobs/top-matches",
      description: "Jobs scored using a customized resume.",
    },
    {
      title: "Custom Resumes",
      value: customResumeJobsCount,
      icon: <FileText size={24} />,
      href: "/", // Or a page listing jobs with custom resumes
      description: "Jobs with a generated custom resume.",
    },
    {
      title: "No Custom Resumes",
      value: noCustomResumeJobsCount,
      icon: <FileX size={24} />,
      href: "/jobs/new", // Likely new jobs that might need one
      description: "Active jobs without a custom resume.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Briefcase className="w-8 h-8 mr-3 text-indigo-600" />
            Job Application Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Welcome back! Here's an overview of your job search.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              href={stat.href}
              description={stat.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
