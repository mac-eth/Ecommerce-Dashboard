import { NextResponse, type NextRequest } from "next/server";
import { getAuth, withClerkMiddleware } from "@clerk/nextjs/server";

const publicPaths = [
  "/",
  "/sign-in*",
  "/sign-up*",
  "/api/trpc*",
  "/api/webhook*",
];

const isPublic = (reqPath: string) => {
  return publicPaths.find((publicPath) =>
    reqPath.match(new RegExp(`^${publicPath}$`.replace("*$", "($|/)")))
  );
};

export default withClerkMiddleware((request: NextRequest) => {
  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const auth = getAuth(request);

  if (!auth.userId) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", request.url);
    return NextResponse.redirect(signInUrl);
  }

  if (auth.userId && !auth.orgId) {
    const orgSelection = new URL(
      "https://workable-goblin-69.accounts.dev/create-organization",
      request.url
    );
    return NextResponse.redirect(orgSelection);
  }

  return NextResponse.next();
});

// Stop Middleware running on static files and public folder
export const config = {
  matcher: "/((?!_next/image|_next/static|favicon.ico|site.webmanifest).*)",
};
