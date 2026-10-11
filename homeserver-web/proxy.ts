import { NextRequest, NextResponse } from "next/server";
export async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("sessionCookie");

  if (!sessionCookie?.value) {
  }
}
