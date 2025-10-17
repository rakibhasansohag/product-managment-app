'use client';
import Link from 'next/link';
import { LayoutGrid, PlusSquare, LogOut, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/features/authSlice';

export default function Sidebar({ onClose }: { onClose?: () => void }) {
	const dispatch = useDispatch();

	return (
		<div className='flex flex-col justify-between h-full p-4'>
			<div>
				<div className='flex items-center justify-between mb-6'>
					<h2 className='text-xl font-bold tracking-tight'>Product Manager</h2>
					<button className='md:hidden' onClick={onClose}>
						<X size={20} />
					</button>
				</div>
				<nav className='space-y-2'>
					<Link
						className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition'
						href='/products'
					>
						<LayoutGrid size={18} /> <span>Products</span>
					</Link>
					<Link
						className='flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition'
						href='/products/new'
					>
						<PlusSquare size={18} /> <span>New Product</span>
					</Link>
				</nav>
			</div>

			<button
				onClick={() => dispatch(logout())}
				className='flex items-center gap-2 text-red-600 p-2 rounded-md hover:bg-red-50 w-full transition'
			>
				<LogOut size={16} /> Logout
			</button>
		</div>
	);
}
