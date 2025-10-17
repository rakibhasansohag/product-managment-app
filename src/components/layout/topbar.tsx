'use client';
import { Menu } from 'lucide-react';

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
	return (
		<header className='bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-30'>
			<div className='flex items-center gap-2'>
				<button className='md:hidden' onClick={onMenuClick}>
					<Menu size={22} />
				</button>
				<h1 className='font-semibold text-lg'>Dashboard</h1>
			</div>
			<div className='text-sm text-gray-600'>Welcome back 👋</div>
		</header>
	);
}
