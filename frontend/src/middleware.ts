import { withAuth} from "next-auth/middleware";
import { NextResponse } from "next/server";
export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // Protección para rutas de administrador
    if (pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

   
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Esto asegura que cualquier token válido permite el acceso a las rutas no protegidas por el condicional anterior.
    },
  }
);

export const config = { matcher: ["/admin/:path*", "/profile"] };


/*import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: async ({ req, token }) => {
      if (req.nextUrl.pathname.startsWith("/admin")) return token?.role === "admin";
      return !!token;
    },
  },
});
export const config = { matcher: ["/admin:path*", "/profile"] };
*/