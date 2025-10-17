import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// Allow these paths without authentication
	const publicPaths = ['/login'];
	const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

	// Skip middleware for Next.js internals and static files
	if (
		pathname.startsWith('/_next') ||
		pathname.startsWith('/api') ||
		pathname.includes('.')
	) {
		return NextResponse.next();
	}

	const token = req.cookies.get('token')?.value;

	// Redirect to login if trying to access protected route without token
	if (!isPublicPath && !token) {
		const url = req.nextUrl.clone();
		url.pathname = '/login';
		url.searchParams.set('from', pathname);
		return NextResponse.redirect(url);
	}

	// Redirect to products if already logged in and trying to access login
	if (isPublicPath && token) {
		const url = req.nextUrl.clone();
		url.pathname = '/products';
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (public folder)
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
};
