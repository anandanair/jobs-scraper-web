// SupabaseProjectCreationGuide.tsx
import React from "react";
import {
  Database,
  Server,
  Shield,
  Globe,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

const SupabaseProjectCreationGuide = () => {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl overflow-hidden shadow-lg border border-blue-100">
      {/* Header with icon */}
      <div className="bg-blue-600 px-6 py-4 flex items-center">
        <div className="bg-white p-2 rounded-full mr-4">
          <Database className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Step 2: Create a New Supabase Project
        </h2>
      </div>

      {/* Main content */}
      <div className="p-6">
        {/* Introduction */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed mb-4">
            Now that you have a Supabase account, let's create a new project to
            store your application data.
          </p>

          {/* Project info box */}
          <div className="flex items-center p-4 bg-blue-50 rounded-lg mb-6 border border-blue-100">
            <div className="flex-shrink-0 mr-4">
              <Server className="h-10 w-10 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                What is a Supabase Project?
              </h3>
              <p className="text-sm text-gray-600">
                A Supabase project gives you a dedicated PostgreSQL database,
                authentication system, and storage bucket for your application.
                The free tier includes generous limits for personal projects.
              </p>
            </div>
          </div>
        </div>

        {/* Steps with visual indicators */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Follow these steps:
          </h3>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                  1
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-medium">
                  Create an Organization
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  In your Supabase Dashboard, create an 'Organization' if
                  prompted. Name it something like '[Your Name]'s Projects' or
                  '[Your Company Name]'.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                  2
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-medium">Start a New Project</p>
                <p className="text-gray-600 text-sm mt-1">
                  Click the 'New project' button (it might also say '+ Create a
                  new project'). If asked, select the Organization you just
                  created.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                  3
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-medium">
                  Configure Your Project
                </p>
                <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-md border border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-2 mt-1">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">
                          a
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        <strong>Project Name:</strong> Give your project a name
                        (e.g., 'JobTrack Data')
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-2 mt-1">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">
                          b
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        <strong>Database Password:</strong> Create a strong
                        password
                        <span className="block mt-1 text-xs text-red-600 font-medium">
                          Important: Store this password securely for your own
                          use. You won't need to share it with us.
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-2 mt-1">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">
                          c
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-500 mr-1" />
                      <p className="text-sm text-gray-700">
                        <strong>Region:</strong> Choose a server location close
                        to you or your users
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-2 mt-1">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">
                          d
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">
                        <strong>Pricing Plan:</strong> Select the 'Free' plan
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                  4
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-medium">Create and Wait</p>
                <p className="text-gray-600 text-sm mt-1">
                  Click the 'Create new project' button and wait for 2-5 minutes
                  while Supabase sets up your project. You'll know it's ready
                  when your project dashboard appears and shows 'Active' or
                  'Running'.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips box */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-800">Pro Tip</h4>
              <p className="text-sm text-amber-700">
                If you already have a Supabase project that you'd like to use
                instead of creating a new one, you can skip to the next step and
                get your API credentials from that project.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-6">
          <a
            href="https://supabase.com/dashboard/projects"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span>Go to Supabase Dashboard</span>
            <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupabaseProjectCreationGuide;
