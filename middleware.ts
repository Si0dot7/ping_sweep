import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // หากไม่มี token แต่จะเข้าหน้า /dash ให้เด้งกลับ /
  if (!token && req.nextUrl.pathname.startsWith("/dash")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dash/:path*", "/dash"], // หน้าไหนที่ต้องการ protect
};
