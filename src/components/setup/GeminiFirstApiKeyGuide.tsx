// GeminiFirstApiKeyGuide.tsx
import React from "react";
import {
  KeyRound,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

const GeminiFirstApiKeyGuide = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
      {/* Header with modern gradient */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
            <KeyRound className="h-6 w-6 text-white" />
          </div>
          Step 2: Create Your First API Key
        </h2>
        <p className="text-green-100 mt-2 ml-11">
          Generate your first Gemini API key in just a few simple steps
        </p>
      </div>

      {/* Main content */}
      <div className="p-8">
        {/* Introduction */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed mb-4">
            Now, let's create your first Gemini API key. This process is
            straightforward and only takes a few clicks.
          </p>
        </div>

        {/* Steps with visual indicators */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">
            Follow these steps:
          </h3>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-bold shadow-md">
                  1
                </div>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-gray-800 font-medium">
                  Navigate to the API Key Page
                </p>
                <p className="text-gray-600 mt-1">
                  If you're not already there, go to{" "}
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline font-medium"
                  >
                    https://aistudio.google.com/apikey
                  </a>
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-bold shadow-md">
                  2
                </div>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-gray-800 font-medium">
                  Click "Create API Key"
                </p>
                <p className="text-gray-600 mt-1">
                  Look for the "Create API key" button at the top right and
                  click it. You may need to accept terms and conditions if this
                  is your first time.
                </p>
                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">
                    If prompted to accept terms of service, click "I agree" to
                    continue.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-bold shadow-md">
                  3
                </div>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-gray-800 font-medium">
                  Select "Create in a new project"
                </p>
                <p className="text-gray-600 mt-1">
                  When prompted, choose the option to create the API key in a
                  new project.
                </p>
                <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700">
                        <span className="font-medium">Success!</span> After
                        creating the API key, it will appear in the table below.
                        You can view and copy it at any time.
                      </p>
                      <p className="text-gray-600 text-sm mt-2">
                        You're now ready to proceed to the next step to create
                        your second API key.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-8">
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>Go to API Key Page</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default GeminiFirstApiKeyGuide;
