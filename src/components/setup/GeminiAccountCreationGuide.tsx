// GeminiAccountCreationGuide.tsx
import React from "react";
import { ExternalLink, Info, ArrowRight } from "lucide-react";
import Image from "next/image";

const GeminiAccountCreationGuide = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
      {/* Header with modern gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          Step 1: Access Google AI Studio
        </h2>
        <p className="text-blue-100 mt-2 ml-11">
          Get started with Gemini API by accessing Google's AI development
          platform
        </p>
      </div>

      {/* Main content with more spacing and cleaner layout */}
      <div className="p-8">
        {/* Introduction with cleaner design */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed mb-6">
            To get started with Gemini API, you'll need to access Google AI
            Studio, which is Google's platform for AI development and API key
            management.
          </p>

          {/* Google AI Studio info card with modern design */}
          <div className="flex items-start p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl mb-8 border border-blue-100">
            <div className="flex-shrink-0 mr-5">
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 192 192"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M96 176C131.346 176 160 147.346 160 112C160 76.6538 131.346 48 96 48C60.6538 48 32 76.6538 32 112C32 147.346 60.6538 176 96 176Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M96 176V48C60.6538 48 32 76.6538 32 112C32 147.346 60.6538 176 96 176Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M96 176C131.346 176 160 147.346 160 112H96V176Z"
                    fill="#34A853"
                  />
                  <path
                    d="M96 48V112H160C160 76.6538 131.346 48 96 48Z"
                    fill="#FBBC04"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What is Google AI Studio?
              </h3>
              <p className="text-gray-600">
                Google AI Studio is a platform that allows developers to access
                Google's AI models, including Gemini, through APIs. You can
                create API keys here to integrate AI capabilities into your
                applications.
              </p>
            </div>
          </div>
        </div>

        {/* Steps with modern visual indicators */}
        <div className="mb-10">
          <h3 className="font-semibold text-gray-800 mb-6">
            Follow these steps:
          </h3>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-5">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold shadow-md">
                  1
                </div>
              </div>
              <div className="pt-1">
                <p className="text-gray-700 ">
                  Click the button below to open Google AI Studio in a new tab.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-5">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold shadow-md">
                  2
                </div>
              </div>
              <div className="pt-1">
                <p className="text-gray-700 ">
                  Sign in with your Google account if prompted.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-5">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold shadow-md">
                  3
                </div>
              </div>
              <div className="pt-1">
                <p className="text-gray-700 ">
                  Once logged in, you'll see the Google AI Studio dashboard
                  where you can create API keys.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern image display */}
        <div className="mb-8 overflow-hidden rounded-2xl shadow-lg">
          <div className="w-full relative" style={{ height: "450px" }}>
            <Image
              src="/initial-setup/gemini/google_ai_studio_api_key_page.png"
              alt="Google AI Studio API Key Page"
              fill
              style={{ objectFit: "cover", objectPosition: "top" }}
              className="transition-transform hover:scale-105 duration-500"
              quality={100}
            />
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm p-4 text-white text-sm">
            The Google AI Studio homepage where you'll create your API keys
          </div>
        </div>

        {/* CTA Button with modern design */}
        <div className="flex justify-center mb-8">
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <span className="text-lg">Go to Google AI Studio</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>

        {/* Tips box with modern design */}
        <div className="mt-8 bg-amber-50 border-l-4 border-amber-400 rounded-lg p-5">
          <div className="flex items-start">
            <Info className="h-6 w-6 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-800  mb-1">
                Important Note
              </h4>
              <p className="text-amber-700">
                You'll need to create two separate API keys in different
                projects. In the next steps, we'll guide you through creating
                both keys.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiAccountCreationGuide;
