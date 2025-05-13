// GeminiSecondApiKeyGuide.tsx
import React from "react";
import { ExternalLink, Info, AlertTriangle } from "lucide-react";
import Image from "next/image";

const GeminiSecondApiKeyGuide = () => {
  return (
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl overflow-hidden shadow-lg border border-purple-100">
      {/* Header with icon */}
      <div className="bg-purple-600 px-6 py-4 flex items-center">
        <div className="bg-white p-2 rounded-full mr-4">
          <svg
            className="h-6 w-6 text-purple-600"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">
          Step 3: Create Your Second API Key
        </h2>
      </div>

      {/* Main content */}
      <div className="p-6">
        {/* Introduction */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed mb-4">
            Now you need to create a second API key in a different project. This
            is necessary because the application requires two separate API keys
            for redundancy and load balancing.
          </p>

          <div className="flex items-start p-4 bg-amber-50 rounded-lg mb-6 border border-amber-200">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800">Important</h3>
              <p className="text-sm text-amber-700">
                Your second API key must be created in a different Google Cloud
                project than your first key. This ensures proper isolation and
                quota management.
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
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold">
                  1
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 mb-2">
                  Return to the Google AI Studio API key page and click "Create
                  API Key".
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
                <p className="text-gray-700 mb-2">
                  When the project selection dialog appears, check if you have
                  multiple projects available:
                </p>
                {/* Modern image display */}
                <div className="mb-8 overflow-hidden rounded-2xl shadow-lg">
                  <div
                    className="w-full bg-gray-200 relative"
                    style={{ height: "450px" }}
                  >
                    <Image
                      src="/initial-setup/gemini/google_ai_studio_multiple_projects.png"
                      alt="Google AI Studio API Key Page"
                      fill
                      style={{ objectFit: "contain", objectPosition: "top" }}
                      className="transition-transform hover:scale-105 duration-500"
                      quality={100}
                    />
                  </div>
                  <div className="bg-gray-900/80 backdrop-blur-sm p-4 text-white text-sm">
                    The Google AI Studio homepage where you'll create your API
                    keys
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <h4 className="font-medium text-blue-800 mb-1">
                    If you see multiple projects:
                  </h4>
                  <p className="text-sm text-blue-700 mb-2">
                    Select a different project than the one you used for your
                    first API key.
                  </p>
                  <h4 className="font-medium text-blue-800 mb-1">
                    If you only see one project:
                  </h4>
                  <p className="text-sm text-blue-700">
                    You'll need to create a new Google Cloud project first (see
                    next step).
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 - Creating a new project if needed */}
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold">
                  3
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 mb-2">
                  If you need to create a new project, click the button below to
                  open Google Cloud console:
                </p>
                <div className="mb-4">
                  <a
                    href="https://console.cloud.google.com/projectcreate?previousPage=%2Fwelcome%2Fnew%3Finv%3D1%26invt%3DAbxKmQ%26organizationId%3D0&organizationId=0&inv=1&invt=AbxKmQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <span>Create New Google Cloud Project</span>
                    <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
                {/* Modern image display */}
                <div className="mb-8 overflow-hidden rounded-2xl shadow-lg">
                  <div
                    className="w-full relative bg-gray-200"
                    style={{ height: "450px" }}
                  >
                    <Image
                      src="/initial-setup/gemini/gcp_project_creation.png"
                      alt="Google AI Studio API Key Page"
                      fill
                      style={{ objectFit: "contain", objectPosition: "top" }}
                      className="transition-transform hover:scale-105 duration-500"
                      quality={100}
                    />
                  </div>
                  <div className="bg-gray-900/80 backdrop-blur-sm p-4 text-white text-sm">
                    The Google AI Studio homepage where you'll create your API
                    keys
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Enter a project name and click "Create". The process takes a
                  few seconds to complete.
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
                <p className="text-gray-700 mb-2">
                  After creating a new project (if needed), return to Google AI
                  Studio, refresh the page, and click "Create API Key" again:
                </p>
                <div className="mb-4">
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <span>Return to Google AI Studio</span>
                    <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold">
                  5
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 mb-2">
                  Select your newly created project from the dropdown, create
                  the API key, and copy it:
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiSecondApiKeyGuide;
