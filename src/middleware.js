import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/backoffice/:path*"],
};

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;

        // Log for debugging
        console.log(`[Middleware] Checking access to: ${pathname}`);

        if (pathname.startsWith("/backoffice")) {
          if (!token) {
            console.log("[Middleware] No token found. Redirecting to login.");
            return false;
          }

          // Restrict /backoffice/users to admin only
          if (pathname.startsWith("/backoffice/users") && token.role !== "admin") {
            console.log(`[Middleware] User role '${token.role}' tried to access restricted route. Access denied.`);
            return false;
          }

          // Allow both admin and user to access other backoffice routes
          // You might want to add more specific checks here if needed

          console.log("[Middleware] Access granted.");
        }

        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);
