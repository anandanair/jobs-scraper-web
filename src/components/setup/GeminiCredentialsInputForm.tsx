// GeminiCredentialsInputForm.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Info,
  KeyRound,
  Copy,
} from "lucide-react";
import Image from "next/image";

const GeminiCredentialsInputForm = () => {
  const router = useRouter();
  const [firstApiKey, setFirstApiKey] = useState("");
  const [secondApiKey, setSecondApiKey] = useState("");
  const [showFirstApiKey, setShowFirstApiKey] = useState(false);
  const [showSecondApiKey, setShowSecondApiKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validate inputs
    if (!firstApiKey || !secondApiKey) {
      setError("Both API keys are required");
      setIsSubmitting(false);
      return;
    }

    if (firstApiKey === secondApiKey) {
      setError("The two API keys must be different");
      setIsSubmitting(false);
      return;
    }

    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch("/api/setup/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstApiKey,
          secondApiKey,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save API keys");
      }

      // Success
      setSuccess(true);

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard"); // Replace with your next route
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred while saving your API keys");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
      {/* Header with modern gradient */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 px-8 py-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
            <KeyRound className="h-6 w-6 text-white" />
          </div>
          Step 4: Connect Your API Keys
        </h2>
        <p className="text-green-100 mt-2 ml-11">
          Enter your API keys to complete the setup process
        </p>
      </div>

      {/* Main content */}
      <div className="p-8">
        {/* Introduction */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed mb-4">
            You're almost done! Enter both Gemini API keys you created in the
            previous steps to complete the setup.
          </p>
        </div>

        {/* API Key Copy Instructions */}
        <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            How to copy your API keys:
          </h3>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4 mt-1">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 font-medium">
                  1
                </div>
              </div>
              <div>
                <p className="text-gray-700">
                  In the Google AI Studio API key page, you'll see a table
                  listing your API keys with columns for Project Number, Project
                  Name, API Key, Created, and Plan.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4 mt-1">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 font-medium">
                  2
                </div>
              </div>
              <div>
                <p className="text-gray-700">
                  Click on the API key value in the table. A box will appear
                  displaying the full API key with a copy button.
                </p>
                <div className="mt-3 bg-white border border-gray-200 rounded-lg p-3 flex items-center">
                  <div className="flex-1 bg-gray-100 px-3 py-2 rounded mr-2 font-mono text-sm text-gray-500 truncate">
                    AI...key...example...
                  </div>
                  <button className="bg-gray-200 hover:bg-gray-300 p-2 rounded-md flex items-center">
                    <Copy className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mr-4 mt-1">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 font-medium">
                  3
                </div>
              </div>
              <div>
                <p className="text-gray-700">
                  Click the copy button and paste the API key into the
                  corresponding field below. Repeat this process for both API
                  keys.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-green-800">Setup Complete!</h4>
              <p className="text-sm text-green-700">
                Your Gemini API keys have been saved successfully. Redirecting
                you to the dashboard...
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-800">Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First API Key */}
          <div>
            <label
              htmlFor="firstApiKey"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First API Key
            </label>
            <div className="relative">
              <input
                id="firstApiKey"
                type={showFirstApiKey ? "text" : "password"}
                value={firstApiKey}
                onChange={(e) => setFirstApiKey(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your first Gemini API key"
              />
              <button
                type="button"
                onClick={() => setShowFirstApiKey(!showFirstApiKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showFirstApiKey ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              This is the API key you created in Step 2
            </p>
          </div>

          {/* Second API Key */}
          <div>
            <label
              htmlFor="secondApiKey"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Second API Key
            </label>
            <div className="relative">
              <input
                id="secondApiKey"
                type={showSecondApiKey ? "text" : "password"}
                value={secondApiKey}
                onChange={(e) => setSecondApiKey(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your second Gemini API key"
              />
              <button
                type="button"
                onClick={() => setShowSecondApiKey(!showSecondApiKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showSecondApiKey ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              This is the API key you created in Step 3 (from a different
              project)
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || success}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
                isSubmitting || success
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>Setup Complete!</span>
                </>
              ) : (
                <span>Complete Setup</span>
              )}
            </button>
          </div>
        </form>

        {/* Usage Information */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 rounded-lg p-5">
          <div className="flex items-start">
            <Info className="h-6 w-6 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 mb-2">
                Important Information
              </h4>
              <ul className="space-y-2 text-blue-700">
                <li>
                  <span className="font-medium">Free Usage:</span> This
                  application uses the free tier of the Gemini API. You will not
                  be charged for the API usage.
                </li>
                <li>
                  <span className="font-medium">Limited Scope:</span> Your API
                  keys will only be used for specific features of this
                  application, such as job scoring and resume generation.
                </li>
                <li>
                  <span className="font-medium">Security:</span> Your API keys
                  are stored securely and are not shared with any third parties.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">What happens next?</h4>
          <p className="text-gray-600">
            After submitting your API keys, you'll be redirected to the
            dashboard where you can start using the application. Your API keys
            will be securely stored and used to power the AI features of the
            application.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeminiCredentialsInputForm;
