import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Allow this portfolio to be embedded as an iframe from the AJPortX marketplace
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', "frame-ancestors *");
  response.headers.delete('X-Frame-Options');
  return response;
}

export const config = { matcher: '/:path*' };
