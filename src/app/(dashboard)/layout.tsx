'use client';

import Sidebar from '@/components/layout/sidebar';
import Topbar from '@/components/layout/topbar';
import { useState } from 'react';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(false);

	return (
		<div className='flex h-screen bg-gray-50 text-gray-900'>
			{/* Sidebar (fixed left) */}
			<aside
				className={`fixed z-40 inset-y-0 left-0 w-64 bg-white border-r shadow-sm transition-transform duration-300 
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
			>
				<Sidebar onClose={() => setOpen(false)} />
			</aside>

			{/* Main content area */}
			<div className='flex-1 flex flex-col ml-0 md:ml-64'>
				<Topbar onMenuClick={() => setOpen(!open)} />
				<main className='flex-1 overflow-y-auto p-6'>{children}</main>
			</div>
		</div>
	);
}
