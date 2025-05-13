// SupabaseAccountCreationGuide.tsx
import React from "react";
import { UserPlus, ArrowRight, CheckCircle, ExternalLink } from "lucide-react";
import Image from "next/image";

const SupabaseAccountCreationGuide = () => {
  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl overflow-hidden shadow-lg border border-indigo-100">
      {/* Header with icon */}
      <div className="bg-indigo-600 px-6 py-4 flex items-center">
        <div className="bg-white p-2 rounded-full mr-4">
          <UserPlus className="h-6 w-6 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Step 1: Create Your Free Supabase Account
        </h2>
      </div>

      {/* Main content */}
      <div className="p-6">
        {/* Introduction */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed mb-4">
            To securely manage your application data, you'll need to create a
            free Supabase account. This gives you full ownership and control
            over your database and authentication.
          </p>

          {/* Supabase logo and info */}
          <div className="flex items-center p-4 bg-blue-50 rounded-lg mb-6 border border-blue-100">
            <div className="flex-shrink-0 mr-4">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                <span className="text-green-500 font-bold text-xl">S</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">What is Supabase?</h3>
              <p className="text-sm text-gray-600">
                Supabase is an open-source Firebase alternative that provides
                database, authentication, and storage services for modern
                applications.
              </p>
            </div>
          </div>
        </div>

        {/* Steps with visual indicators */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Follow these steps:
          </h3>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  1
                </div>
              </div>
              <div>
                <p className="text-gray-700">
                  Click the button below to open the Supabase signup page in a
                  new tab.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  2
                </div>
              </div>
              <div>
                <p className="text-gray-700">
                  Create your account with your email and a secure password,
                  then verify your email address.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold">
                  3
                </div>
              </div>
              <div>
                <p className="text-gray-700">
                  Once logged in, you'll see your Supabase Dashboard where you
                  can manage your projects.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <a
            href="https://supabase.com/dashboard/sign-up"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span>Sign Up for Supabase</span>
            <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Tips box */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-800">Pro Tip</h4>
              <p className="text-sm text-amber-700">
                Supabase offers a generous free tier that's perfect for personal
                projects and small applications. No credit card is required to
                get started!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseAccountCreationGuide;
