import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { is } from "date-fns/locale";
// import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const isProtectedAdminRoute = createRouteMatcher([
  "/(.*)/admin(.*)",
  "/admin(.*)",
]);

const isProtectedRoute = createRouteMatcher(["/(.*)/walkthrough(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = (await auth()) as {
    sessionClaims: { metadata?: { role?: string; enabled?: boolean } };
  };
  // console.log("Middleware sessionClaims:", sessionClaims?.metadata);
  // If you need to access the current user, you can do so with the following:
  // const user = await currentUser();
  if (isProtectedAdminRoute(req)) {
    await auth.protect((has) => {
      return has({ role: "org:admin" });
    });
    // const isAdmin = await checkAdminStatus(user?.externalId);
    // if (isAdmin) return true;
    // else return false;
  }

  // use metadata role to check for walkthrough access
  if (isProtectedRoute(req)) {
    await auth.protect();
    const role = sessionClaims?.metadata?.role;
    const isEnabled = sessionClaims?.metadata?.enabled;

    if (isEnabled) {
      console.log("Is Enabled");
    }
    if (!isEnabled) {
      console.log("Is Not Enabled");
    }

    // Grab department from pathname: /electrical/walkthrough
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/");
    const departmentParam = pathParts[1]; // e.g. "electrical", "mechanical", "operations"

    // Map Clerk roles to route params
    const roleMap: Record<string, string> = {
      "org:electrical": "electrical",
      "org:mechanical": "mechanical",
      "org:operations": "operations",
    };

    if (
      !isEnabled ||
      !role ||
      roleMap[role] !== departmentParam.toLowerCase()
    ) {
      // const cookieStore = await cookies();
      // cookieStore.set("reason", "forbidden");
      const redirectUrl = new URL("/", req.url);
      redirectUrl.searchParams.set("reason", "forbidden");
      return NextResponse.redirect(redirectUrl);
    }
  }
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
