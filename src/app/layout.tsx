import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Import the Navbar component
import { headers } from "next/headers"; // Import headers
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Krowten Jobs", // Updated title
  description: "Track and manage job applications scraped from LinkedIn.", // Updated description
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-current-path") || "";

  // Determine if Navbar and Footer should be shown
  console.log(pathname);
  // Exclude /login, /signup, and also /auth for OAuth callback routes
  const isAuthPage =
    ["/login", "/signup"].includes(pathname) ||
    pathname.startsWith("/initial-setup") ||
    pathname.startsWith("/auth");
  const showNavbarAndFooter = !isAuthPage;

  // Define main class based on whether it's an auth page or not
  let mainClassNames = "flex-1 bg-white dark:bg-navy-900 h-screen"; // Base class

  if (isAuthPage) {
    mainClassNames += " flex items-center justify-center p-4";
  } else {
    mainClassNames += " overflow-y-auto p-4 md:p-6 lg:p-8";
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} `}>
        <ThemeProvider>
          <UserProvider>
            {showNavbarAndFooter && <Navbar />}
            {/* Main content area with overflow scrolling */}
            <main className={mainClassNames}>{children}</main>
            {/* Footer fixed at bottom */}
            {showNavbarAndFooter && (
              <footer className="bg-muted p-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Job App Tracker
              </footer>
            )}
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
