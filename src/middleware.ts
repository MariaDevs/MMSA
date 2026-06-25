export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dealer/dashboard/:path*", "/admin/:path*"],
};
