import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Apply middleware to dashboard routes, login, and register pages
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
