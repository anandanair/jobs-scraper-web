// CredentialsInputIntro.tsx
"use client";

import React, { useState } from "react";
import {
  KeyRound,
  Database,
  Save,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import axios from "axios";

const CredentialsInputIntro = () => {
  const { user, refreshProfile } = useUser();
  const [formData, setFormData] = useState({
    projectUrl: "",
    anonKey: "",
    serviceRoleKey: "",
    userId: user?.id ?? "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({});

    try {
      const response = await axios.post(
        "/api/setup/supabase",
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.data;

      if (!result.success) {
        setSubmitStatus({
          success: false,
          message: result.message || "Invalid credentials.",
        });
      } else {
        setSubmitStatus({
          success: true,
          message: "Credentials validated successfully!",
        });
        refreshProfile();
        // You can now proceed to store/save them
      }
    } catch (err) {
      setSubmitStatus({
        success: false,
        message: "Validation failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-green-50 rounded-xl overflow-hidden shadow-lg border border-green-100">
      {/* Header with icon */}
      <div className="bg-green-600 px-6 py-4 flex items-center">
        <div className="bg-white p-2 rounded-full mr-4">
          <KeyRound className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Step 4: Enter Your Supabase Details
        </h2>
      </div>

      {/* Main content */}
      <div className="p-6">
        {/* Introduction */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed mb-4">
            You're almost done! Now, please carefully paste the Project URL,
            Anon Key, and Service Role Key that you just copied from your
            Supabase project into the form fields below.
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> Double-check that each value is
              correct before you submit. These credentials are essential for
              your application to connect to your Supabase project.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project URL field */}
          <div className="space-y-2">
            <label
              htmlFor="projectUrl"
              className="block text-sm font-medium text-gray-700"
            >
              Project URL
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Database className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="projectUrl"
                id="projectUrl"
                value={formData.projectUrl}
                onChange={handleChange}
                className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
                placeholder="https://your-project.supabase.co"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">URL</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Example: https://abcdefghijklm.supabase.co
            </p>
          </div>

          {/* Anon Key field */}
          <div className="space-y-2">
            <label
              htmlFor="anonKey"
              className="block text-sm font-medium text-gray-700"
            >
              Anon (Public) Key
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="anonKey"
                id="anonKey"
                value={formData.anonKey}
                onChange={handleChange}
                className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              This is the key labeled as "anon" and "public" in your Supabase
              API settings.
            </p>
          </div>

          {/* Service Role Key field */}
          <div className="space-y-2">
            <label
              htmlFor="serviceRoleKey"
              className="block text-sm font-medium text-gray-700"
            >
              Service Role (Secret) Key
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="serviceRoleKey"
                id="serviceRoleKey"
                value={formData.serviceRoleKey}
                onChange={handleChange}
                className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              This is the key labeled as "service_role" and "secret" in your
              Supabase API settings. We'll store this securely.
            </p>
          </div>

          {/* Status message */}
          {submitStatus.message && (
            <div
              className={`p-4 rounded-md ${
                submitStatus.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {submitStatus.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm ${
                      submitStatus.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {submitStatus.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Credentials & Connect
                </>
              )}
            </button>
          </div>
        </form>

        {/* Help text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Need help? If you encounter any issues, please check that you've
            copied the credentials correctly or contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CredentialsInputIntro;
