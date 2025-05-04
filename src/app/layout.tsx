import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Import the Navbar component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Application Tracker", // Updated title
  description: "Track and manage job applications scraped from LinkedIn.", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-gray-50`} // Added a light background color
      >
        <Navbar /> {/* Use the Navbar component here */}
        {/* Main content area */}
        <main className="flex-grow container mx-auto p-4">{children}</main>
        {/* Placeholder for Footer */}
        <footer className="bg-gray-200 p-4 text-center text-sm text-gray-600 mt-auto">
          {" "}
          {/* Added mt-auto to help push footer down */}
          {/* Add your Footer content here */}© {new Date().getFullYear()} Job
          App Tracker
        </footer>
      </body>
    </html>
  );
}
