'use client';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Topbar() {
	return (
		<header className='bg-white border-b border-slate-200 px-4 lg:px-6 py-4'>
			<div className='flex items-center justify-between'>
				{/* Title - Hidden on mobile when sidebar button is visible */}
				<div className='ml-12 lg:ml-0'>
					<h1 className='font-semibold text-lg text-slate-800'>
						<span className='hidden sm:inline mr-1'>Product</span>
						Management
					</h1>
				</div>

				{/* Right Side Actions */}
				<div className='flex items-center gap-2 lg:gap-4'>
					<Button variant='ghost' size='icon' className='relative'>
						<Bell size={20} className='text-slate-600' />
						<span className='absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full'></span>
					</Button>

					<div className='flex items-center gap-3 pl-2 lg:pl-4 border-l border-slate-200'>
						<div className='w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center'>
							<User size={18} className='text-white' />
						</div>
						<div className='hidden md:block'>
							<p className='text-sm font-medium text-slate-800'>Admin User</p>
							<p className='text-xs text-slate-500'>
								rakibhasansohag133@gmail.com
							</p>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
