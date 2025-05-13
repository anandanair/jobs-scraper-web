// SupabaseApiCredentialsGuide.tsx
import React from "react";
import {
  KeyRound,
  Settings,
  Copy,
  AlertTriangle,
  ExternalLink,
  Info,
} from "lucide-react";

const SupabaseApiCredentialsGuide = () => {
  return (
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl overflow-hidden shadow-lg border border-purple-100">
      {/* Header with icon */}
      <div className="bg-purple-600 px-6 py-4 flex items-center">
        <div className="bg-white p-2 rounded-full mr-4">
          <KeyRound className="h-6 w-6 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Step 3: Get Your Project's API Details
        </h2>
      </div>

      {/* Main content */}
      <div className="p-6">
        {/* Introduction */}
        <div className="mb-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Your Supabase project needs to be fully created and active for
                  this step.
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            Now, let's find the special codes (API credentials) we need from
            your new Supabase project. These credentials will allow your
            application to securely connect to your database.
          </p>
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
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold">
                  1
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-medium">
                  Navigate to Project Dashboard
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  In your Supabase project's dashboard (the main screen for your
                  project), look at the menu on the left side.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold">
                  2
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-medium">
                  Access Project Settings
                </p>
                <div className="flex items-center mt-1">
                  <Settings className="h-4 w-4 text-gray-500 mr-2" />
                  <p className="text-gray-600 text-sm">
                    Find and click on <strong>Project Settings</strong> (it
                    usually has a gear icon).
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold">
                  3
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-medium">Go to API Section</p>
                <p className="text-gray-600 text-sm mt-1">
                  In the 'Project Settings' menu, click on <strong>API</strong>.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold">
                  4
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-medium">
                  Locate Your API Credentials
                </p>
                <p className="text-gray-600 text-sm mt-1 mb-3">
                  On this 'API' page, you'll find the details we need. You'll
                  need to copy these three items carefully:
                </p>

                <div className="space-y-4">
                  {/* Project URL */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          Project URL
                        </h4>
                        <p className="text-sm text-gray-600">
                          Look under the 'Config' or 'Project Configuration'
                          section.
                        </p>
                        <div className="mt-2 bg-gray-100 p-2 rounded flex items-center">
                          <code className="text-sm text-purple-700">
                            https://&lt;something-unique&gt;.supabase.co
                          </code>
                          <Copy className="h-4 w-4 text-gray-400 ml-2 cursor-pointer hover:text-gray-600" />
                        </div>
                      </div>
                      <div className="bg-purple-100 p-1 rounded-full">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-200 text-purple-600 text-xs font-medium">
                          1
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* anon key */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          `anon` (public) key
                        </h4>
                        <p className="text-sm text-gray-600">
                          Under 'Project API Keys', find the key labeled{" "}
                          <strong>`anon`</strong> and <strong>`public`</strong>.
                        </p>
                        <div className="mt-2 bg-gray-100 p-2 rounded flex items-center">
                          <code className="text-sm text-purple-700">
                            eyJh...example...key
                          </code>
                          <Copy className="h-4 w-4 text-gray-400 ml-2 cursor-pointer hover:text-gray-600" />
                        </div>
                      </div>
                      <div className="bg-purple-100 p-1 rounded-full">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-200 text-purple-600 text-xs font-medium">
                          2
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* service_role key */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          `service_role` (secret) key
                        </h4>
                        <p className="text-sm text-gray-600">
                          Also under 'Project API Keys', find the key labeled{" "}
                          <strong>`service_role`</strong> and{" "}
                          <strong>`secret`</strong>.
                        </p>
                        <div className="mt-2 bg-gray-100 p-2 rounded flex items-center">
                          <code className="text-sm text-purple-700">
                            eyJh...example...key
                          </code>
                          <Copy className="h-4 w-4 text-gray-400 ml-2 cursor-pointer hover:text-gray-600" />
                        </div>

                        <div className="mt-3 flex items-start bg-red-50 p-3 rounded-md border border-red-200">
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-700">
                            <strong>VERY IMPORTANT:</strong> This key is like a
                            master password for your project. Treat it with
                            extreme care. We need it to help set up the initial
                            database structure. We promise to store it securely
                            and encrypted.
                          </p>
                        </div>
                      </div>
                      <div className="bg-purple-100 p-1 rounded-full">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-200 text-purple-600 text-xs font-medium">
                          3
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pro tip */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <div className="p-1 bg-blue-100 rounded-full">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-blue-800">Pro Tip</h4>
              <p className="text-sm text-blue-700 mt-1">
                Supabase provides a convenient 'copy' icon next to each of these
                values. Clicking it will copy the value to your clipboard,
                making it easier and reducing typos.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-6">
          <a
            href="https://supabase.com/dashboard/project/_/settings/api"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span>Go to API Settings</span>
            <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupabaseApiCredentialsGuide;
