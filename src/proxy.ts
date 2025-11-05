import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/site",
  "/",
  "/api/uploadthing",
]);

const isAppRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/agency(.*)",
  "/subaccount(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req) && isAppRoute(req)) {
    await auth.protect();
  }
  // Logic for after auth
  const url = req.nextUrl;
  const searchParams = url.searchParams.toString();
  const hostname = req.headers;
  const pathWithSearchParams = `${url.pathname}${
    searchParams.length > 0 ? `${searchParams}` : ""
  }`;

  const customDomain = hostname
    .get("host")
    ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
    .filter(Boolean)[0];

  // If Sub domains exist (send the user to [domain]/path along with the search params)
  if (customDomain) {
    return NextResponse.rewrite(
      new URL(`/${customDomain}${pathWithSearchParams}`, req.url)
    );
  }

  // so No Sub domain
  // 1 check url.pathname = sign-in or sign-up
  if (url.pathname === "sign-in" || url.pathname === "sign-up") {
    // Rewrite to /agency/sign-in or sign-up
    return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
  }
  console.log(url.pathname, "pathname");

  // try to access the website
  if (
    url.pathname === "/" ||
    url.pathname === "/site" ||
    url.host === process.env.NEXT_PUBLIC_DOMAIN
  ) {
    return NextResponse.rewrite(new URL(`/site`, req.url));
  }

  // try to access the agency
  if (
    url.pathname.startsWith("/agency") ||
    url.pathname.startsWith("/subaccount")
  ) {
    return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
