import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /workshop routes — but /participate is public (participants don't log in)
  if (pathname.startsWith('/workshop') && !pathname.endsWith('/participate')) {
    const auth = request.cookies.get('wl_auth')?.value;
    if (!auth) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/workshop/:path*'],
};
