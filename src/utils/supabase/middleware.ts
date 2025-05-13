import { isProviderSetupComplete } from "@/lib/supabase/queries";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-current-path", request.nextUrl.pathname);

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Define paths for clarity and easier maintenance
  const loginPath = "/login";
  const signupPath = "/signup";
  const initialSetupPath = "/initial-setup";
  const homePath = "/"; // Or your main dashboard path
  const authRelatedPrefix = "/auth"; // Covers /auth/callback, /auth/signout etc.

  // Helper function to create a redirect response.
  // It ensures that any cookies present in the `response` object (which might have been
  // set/modified by Supabase) are carried over to the new redirect response.
  const createRedirect = (destinationUrl: string | URL) => {
    const redirectUrl = new URL(destinationUrl.toString(), request.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);

    // Transfer all cookies from the current `response` object to the `redirectResponse`
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      // The cookie object itself contains name, value, and options
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  };

  // If the user is not authenticated
  if (!user) {
    // --- User is NOT Authenticated ---
    const allowedUnauthenticatedPaths = [loginPath, signupPath];
    // Allow access to login, signup, and /auth/* routes (e.g., for OAuth start, callback).
    // Also, the matcher already excludes static assets.
    if (
      !allowedUnauthenticatedPaths.includes(pathname) &&
      !pathname.startsWith(authRelatedPrefix)
    ) {
      // For any other path (including /initial-setup if unauthenticated), redirect to login.
      return createRedirect(loginPath);
    }
  } else {
    // --- User IS Authenticated ---
    const restrictedAuthenticatedPaths = [loginPath, signupPath];
    if (restrictedAuthenticatedPaths.includes(pathname)) {
      return createRedirect(homePath);
    }
    // Allow /auth/* routes to proceed without profile check.
    // For example, /auth/callback needs to complete session exchange.
    // The page reached *after* the /auth/callback will then be subject to middleware again.
    if (pathname.startsWith(authRelatedPrefix)) {
      return supabaseResponse; // Let auth-related requests pass through
    }

    // For all other authenticated routes, check profile setup status.
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        "setup_completed, supabase_setup_completed_at, gemini_setup_completed_at, default_resume_id"
      )
      .eq("id", user.id)
      .single();

    // Handle potential errors fetching profile (e.g., network issues, RLS misconfiguration)
    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116: 'Exact one row not found' (means no profile or multiple)
      console.error(
        `Middleware: Error fetching profile for user ${user.id}: ${profileError.message}. Path: ${pathname}`
      );
      // Decide on error handling. For now, let's redirect to home as a safe default.
      // You might want a dedicated error page or attempt logout.
      // If PGRST116, it means no profile, which our logic below handles as setup_incomplete.
      return createRedirect(homePath + "?error=profile_fetch_failed");
    }

    const setupCompleted = profile?.setup_completed || false; // Default to false if profile is null/undefined (e.g. PGRST116)
    const supabaseSetupCompleted = profile?.supabase_setup_completed_at;
    const geminiSetupCompleted = profile?.gemini_setup_completed_at;
    const resumeUploaded = profile?.default_resume_id;
    const providerSetupCompleted = isProviderSetupComplete(user.id);

    if (!setupCompleted) {
      // Setup is NOT complete
      // Check if supabase setup is completed
      if (
        pathname !== initialSetupPath &&
        pathname !== `${initialSetupPath}/supabase` &&
        pathname !== `${initialSetupPath}/gemini` &&
        pathname !== `${initialSetupPath}/resume` &&
        pathname !== `${initialSetupPath}/providers`
      ) {
        // If user is not on either setup page, redirect based on supabase setup status
        if (supabaseSetupCompleted === null) {
          // If supabase_setup_completed_at is null, redirect to supabase setup
          return createRedirect(`${initialSetupPath}/supabase`);
        } else if (geminiSetupCompleted === null) {
          return createRedirect(`${initialSetupPath}/gemini`);
        } else if (resumeUploaded === null) {
          return createRedirect(`${initialSetupPath}/resume`);
        } else if (providerSetupCompleted === null) {
          return createRedirect(`${initialSetupPath}/providers`);
        } else {
          // If supabase_setup_completed_at and gemini_setup_completed_at has a value, redirect to main setup page
          return createRedirect(initialSetupPath);
        }
      } else if (
        pathname === initialSetupPath &&
        supabaseSetupCompleted === null
      ) {
        // If they're on the main setup page but haven't completed supabase setup,
        // redirect them to complete supabase setup first
        return createRedirect(`${initialSetupPath}/supabase`);
      } else if (
        pathname === initialSetupPath &&
        geminiSetupCompleted === null
      ) {
        return createRedirect(`${initialSetupPath}/gemini`);
      } else if (pathname === initialSetupPath && resumeUploaded === null) {
        return createRedirect(`${initialSetupPath}/resume`);
      } else if (
        pathname === initialSetupPath &&
        providerSetupCompleted === null
      ) {
        return createRedirect(`${initialSetupPath}/providers`);
      } else if (
        pathname === `${initialSetupPath}/supabase` &&
        supabaseSetupCompleted !== null
      ) {
        // If they're on the supabase setup page but have already completed it,
        // redirect them to the main setup page
        return createRedirect(initialSetupPath);
      } else if (
        pathname === `${initialSetupPath}/gemini` &&
        geminiSetupCompleted !== null
      ) {
        // If they're on the supabase setup page but have already completed it,
        // redirect them to the main setup page
        return createRedirect(initialSetupPath);
      }
      // Otherwise, they're on the correct setup page for their current state
    } else if (
      pathname === `${initialSetupPath}/resume` &&
      resumeUploaded !== null
    ) {
      // If they're on the supabase setup page but have already completed it,
      // redirect them to the main setup page
      return createRedirect(initialSetupPath);
    } else if (
      pathname === `${initialSetupPath}/providers` &&
      providerSetupCompleted !== null
    ) {
      // If they're on the supabase setup page but have already completed it,
      // redirect them to the main setup page
      return createRedirect(initialSetupPath);
    } else {
      // Setup IS complete
      if (
        pathname === initialSetupPath ||
        pathname === `${initialSetupPath}/supabase` ||
        pathname === `${initialSetupPath}/gemini` ||
        pathname === `${initialSetupPath}/resume` ||
        pathname === `${initialSetupPath}/providers`
      ) {
        // If setup is complete and they try to access any setup page, redirect to home
        return createRedirect(homePath);
      }
      // Otherwise, setup is complete, and they are on a valid protected page. Allow access.
    }
  }

  // If no redirections occurred, return the `response` object.
  // This `response` will have any cookies updated by `supabase.auth.getUser()` via the `setAll` handler.
  return supabaseResponse;
}
