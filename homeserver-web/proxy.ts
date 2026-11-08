import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("sessionCookie");
  const currentPath = request.nextUrl.pathname;
  const isProtectedRoute =
    currentPath === "/home" || currentPath.startsWith("/home/");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const tokenJWT = process.env.JWT_SECRET;

  if (!tokenJWT || !sessionCookie?.value) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(tokenJWT);

    const { payload } = await jose.jwtVerify(sessionCookie.value, secret, {
      algorithms: ["HS256"],
    });

    if (!payload.sub || !payload.email || !payload.role) {
      throw new Error("Invalid JWT payload");
    }

    if (!isProtectedRoute) {
      const response = NextResponse.next();
      response.cookies.delete("sessionCookie");
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.error(error);
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("sessionCookie");

    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
