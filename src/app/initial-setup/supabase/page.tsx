"use client";

import { useState } from "react";
import CredentialsInputIntro from "@/components/setup/CredentialsInputIntro";
import SupabaseAccountCreationGuide from "@/components/setup/SupabaseAccountCreationGuide";
import SupabaseApiCredentialsGuide from "@/components/setup/SupabaseApiCredentialsGuide";
import SupabaseProjectCreationGuide from "@/components/setup/SupabaseProjectCreationGuide";
import SupabaseSqlInitGuide from "@/components/setup/SupabaseSqlInitGuide";

export default function InitialSupabaseSetup() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Create Account",
      component: <SupabaseAccountCreationGuide />,
      description: "Set up your Supabase account",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      title: "Create Project",
      component: <SupabaseProjectCreationGuide />,
      description: "Create a new Supabase project",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      title: "API Keys",
      component: <SupabaseApiCredentialsGuide />,
      description: "Get your API credentials",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
      ),
    },
    {
      title: "Initialize DB",
      component: <SupabaseSqlInitGuide />,
      description: "Set up database schema",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
          />
        </svg>
      ),
    },
    {
      title: "Connect",
      component: <CredentialsInputIntro />,
      description: "Enter credentials to complete",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="py-6 px-8">
        <h1 className="text-2xl font-bold text-indigo-900 dark:text-white">
          Supabase Setup Wizard
        </h1>
      </header>

      {/* Main content area with fixed height */}
      <div className="flex flex-1 p-4 overflow-hidden">
        {/* Left sidebar with steps */}
        <div className="w-64 bg-white rounded-lg shadow-lg mr-4 p-4 flex flex-col">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800">
              Setup Progress
            </h2>
            <p className="text-sm text-gray-500">
              {currentStep + 1} of {steps.length} steps
            </p>
          </div>

          <div className="space-y-1 flex-1">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-full flex items-center px-3 py-3 rounded-md transition-all duration-200 ${
                  currentStep === index
                    ? "bg-indigo-100 text-indigo-700"
                    : index < currentStep
                    ? "text-indigo-600 hover:bg-indigo-50"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                    index < currentStep
                      ? "bg-indigo-600 text-white"
                      : currentStep === index
                      ? "bg-indigo-100 border-2 border-indigo-600 text-indigo-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">{step.title}</div>
                  <div className="text-xs opacity-75">{step.description}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Need help?</div>
            <a
              href="#"
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Documentation
            </a>
          </div>
        </div>

        {/* Main content - card with fixed height and scrollable content if needed */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Step content - scrollable if needed */}
          <div className="flex-1 p-6 overflow-auto">
            {steps[currentStep].component}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-md flex items-center ${
                currentStep === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>
            <button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              className={`px-4 py-2 rounded-md flex items-center ${
                currentStep === steps.length - 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Next
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
