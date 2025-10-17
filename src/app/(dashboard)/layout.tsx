'use client';

import Sidebar from '@/components/layout/sidebar';
import Topbar from '@/components/layout/topbar';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='flex h-screen overflow-hidden bg-slate-50'>
			{/* Fixed Sidebar */}
			<Sidebar />

			{/* Main Content Area */}
			<div className='flex-1 flex flex-col overflow-hidden'>
				<Topbar />
				<main className='flex-1 overflow-y-auto'>
					<div className='p-6 w-full mx-auto'>{children}</div>
				</main>
			</div>
		</div>
	);
}
