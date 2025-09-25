import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { handlers } from "@/auth";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { findUser } from "@/lib/api";
// import { trueDependencies } from "mathjs";

const isProtectedAdminRoute = createRouteMatcher([
  "/(.*)/admin(.*)",
  "/admin(.*)",
]);

const isProtectedRoute = createRouteMatcher(["/(.*)/walkthrough(.*)"]);

// async function checkAdminStatus(userId: string, request: NextRequest) {
//   const response = await findUser(userId);
//   if (response.status === 200) {
//     return response.data.admin;
//   } else return false;
// }

// export function middleware(request: NextRequest) {

// }

// export const config = {

// }

export default clerkMiddleware(async (auth, req) => {
  // const user = await currentUser();
  if (isProtectedAdminRoute(req)) {
    await auth.protect((has) => {
      return has({ role: "org:admin" });
    });
    // const isAdmin = await checkAdminStatus(user?.externalId);
    // if (isAdmin) return true;
    // else return false;
  }
  if (isProtectedRoute(req)) await auth.protect();
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
