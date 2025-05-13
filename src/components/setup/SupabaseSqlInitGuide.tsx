// SupabaseSqlInitGuide.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  Copy,
  CheckCircle,
  ExternalLink,
  AlertTriangle,
  FileText,
} from "lucide-react";

const SupabaseSqlInitGuide = () => {
  const [copied, setCopied] = useState(false);
  const [sqlQuery, setSqlQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSql, setShowSql] = useState(false);

  useEffect(() => {
    const fetchSqlFile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/setup/supabase/get-init-sql");

        if (!response.ok) {
          throw new Error(`Failed to fetch SQL file: ${response.status}`);
        }

        const data = await response.json();
        setSqlQuery(data.sql);
      } catch (err) {
        console.error("Error fetching SQL file:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load SQL file"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSqlFile();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleShowSql = () => {
    setShowSql(!showSql);
  };

  return (
    <div className="bg-gradient-to-br from-white to-teal-50 rounded-xl overflow-hidden shadow-lg border border-teal-100">
      {/* Header with icon */}
      <div className="bg-teal-600 px-6 py-4 flex items-center">
        <div className="bg-white p-2 rounded-full mr-4">
          <Database className="h-6 w-6 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold text-white">
          Step 4: Initialize Database Schema
        </h2>
      </div>

      {/* Main content */}
      <div className="p-6">
        {/* Introduction */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed mb-4">
            Now that your Supabase project is set up, you need to initialize the
            database schema with the required tables and security policies for
            your application.
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  <strong>Important:</strong> This step is crucial for your
                  application to work correctly. The SQL script will create the
                  necessary tables and security rules.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SQL Copy Section */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-teal-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-800">
              Database Initialization SQL
            </h3>
          </div>

          <p className="text-gray-600 mb-5">
            This SQL script will create all necessary tables, security policies,
            and triggers for your application.
          </p>

          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Error loading SQL: {error}
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-2 ${
                  copied
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100"
                } border rounded-lg py-4 px-6 font-medium transition-all duration-200`}
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>SQL Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    <span>Copy SQL Query to Clipboard</span>
                  </>
                )}
              </button>

              <div className="flex justify-center">
                <button
                  onClick={toggleShowSql}
                  className="text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center gap-1"
                >
                  {showSql ? "Hide SQL Content" : "Show SQL Content"}
                </button>
              </div>

              {showSql && (
                <div className="mt-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4 overflow-x-auto">
                    <pre className="text-sm font-mono text-gray-700 whitespace-pre-wrap">
                      <code>{sqlQuery}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
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
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-600 font-bold">
                  1
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-medium">
                  Go to the SQL Editor in Supabase
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  In your Supabase project dashboard, click on "SQL Editor" in
                  the left sidebar.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-600 font-bold">
                  2
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-medium">Copy the SQL Query</p>
                <p className="text-gray-600 text-sm mt-1">
                  Click the "Copy SQL Query to Clipboard" button above to copy
                  the initialization SQL.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-600 font-bold">
                  3
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-medium">
                  Create a New Query and Paste the SQL
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Click on "New Query" in the SQL Editor, then paste the SQL
                  code you just copied.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-600 font-bold">
                  4
                </div>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-medium">Run the Query</p>
                <p className="text-gray-600 text-sm mt-1">
                  Click the "Run" button to execute the SQL query. This will
                  create all the necessary tables and security policies for your
                  application.
                </p>
                <div className="mt-2 bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-green-700">
                      When the query runs successfully, you'll see a message
                      indicating that the query was executed. Your database is
                      now ready for use!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-6">
          <a
            href="https://supabase.com/dashboard/project/_/sql"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <span>Go to SQL Editor</span>
            <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupabaseSqlInitGuide;
