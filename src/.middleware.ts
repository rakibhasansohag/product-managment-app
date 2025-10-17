import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
	'/login',
	'/api/auth',
	'/favicon.ico',
	'/_next',
	'/robots.txt',
];

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// allow public/static paths (skip Next internals)
	if (
		pathname.startsWith('/_next') ||
		pathname.startsWith('/static') ||
		PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p))
	) {
		return NextResponse.next();
	}

	// get token cookie
	const token = req.cookies.get('token')?.value;

	// protect everything under /products and /dashboard if no token
	const protectedMatch =
		pathname.startsWith('/products') ||
		pathname.startsWith('/dashboard') ||
		pathname === '/';

	if (protectedMatch && !token) {
		// redirect to login if no token
		const url = req.nextUrl.clone();
		url.pathname = '/login';
		url.search = `from=${encodeURIComponent(pathname)}`;
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
