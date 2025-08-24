
// Cloudflare Pages Functions middleware
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

    if (request.method === 'OPTIONS') {
      return response;
    }
  }

  return new Response(null, { status: 200 });
}

export const config = {
  matcher: '/api/:path*',
};
