export { default } from "next-auth/middleware"


export const config = { 
    // here we protect this route to be login first. 
  matcher: [
    "/trips",
    "/reservations",
    "/properties",
    "/favorites"
  ]
};