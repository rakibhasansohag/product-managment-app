'use client';

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '@/redux/features/authSlice';
import { usePathname, useRouter } from 'next/navigation';

function AuthCheck({ children }: { children: React.ReactNode }) {
	const dispatch = useDispatch();
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		// Check for token in cookie on mount
		const token = document.cookie
			.split('; ')
			.find((row) => row.startsWith('token='))
			?.split('=')[1];

		if (token) {
			dispatch(setToken(token));
		} else if (pathname !== '/login') {
			// If no token and not on login page, redirect
			router.push(`/login?from=${encodeURIComponent(pathname)}`);
		}
	}, [dispatch, pathname, router]);

	return <>{children}</>;
}

export default function ClientProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Provider store={store}>
			<AuthCheck>
				{children}
				<Toaster
					position='top-right'
					toastOptions={{
						duration: 3000,
						style: {
							background: '#fff',
							color: '#1e293b',
							border: '1px solid #e2e8f0',
							borderRadius: '0.5rem',
							boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
						},
						success: {
							iconTheme: {
								primary: '#10b981',
								secondary: '#fff',
							},
						},
						error: {
							iconTheme: {
								primary: '#ef4444',
								secondary: '#fff',
							},
						},
					}}
				/>
			</AuthCheck>
		</Provider>
	);
}
