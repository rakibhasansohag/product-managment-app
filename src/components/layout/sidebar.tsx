'use client';
import Link from 'next/link';
import { LayoutGrid, PlusSquare, LogOut, Package, Menu, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/features/authSlice';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '../shared/confirmDialog';
import toast from 'react-hot-toast';

export default function Sidebar() {
	const dispatch = useDispatch();
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [logoutOpen, setLogoutOpen] = useState(false);

	// Close mobile menu on route change
	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [pathname]);

	// Prevent body scroll when mobile menu is open
	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isMobileMenuOpen]);

	const isActive = (path: string) => {
		if (path === '/products') {
			return pathname === '/products';
		}
		return pathname === path;
	};

	const handleLogout = () => {
		dispatch(logout());
		document.cookie = 'token=; path=/; max-age=0; samesite=lax';
		toast.success('Logged out successfully');
		window.location.href = '/login';
	};

	const SidebarContent = () => (
		<>
			{/* Logo Section */}
			<div className='p-6 border-b border-border'>
				<div className='flex items-center gap-3'>
					<div className='w-10 h-10 bg-primary rounded-lg flex items-center justify-center'>
						<Package className='text-primary-foreground' size={22} />
					</div>
					<div>
						<h2 className='text-lg font-bold text-foreground'>Product Hub</h2>
						<p className='text-xs text-muted-foreground'>Management System</p>
					</div>
				</div>
			</div>

			{/* Navigation */}
			<nav className='flex-1 p-4 space-y-1'>
				<Link
					href='/products'
					className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
						isActive('/products')
							? 'bg-primary/10 text-primary font-medium'
							: 'text-foreground/70 hover:bg-muted hover:text-foreground'
					}`}
				>
					<LayoutGrid size={20} />
					<span>All Products</span>
				</Link>

				<Link
					href='/products/new'
					className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
						isActive('/products/new')
							? 'bg-primary/10 text-primary font-medium'
							: 'text-foreground/70 hover:bg-muted hover:text-foreground'
					}`}
				>
					<PlusSquare size={20} />
					<span>Add Product</span>
				</Link>
			</nav>

			{/* Logout Button */}
			<div className='p-4 border-t border-border'>
				<Button
					onClick={() => setLogoutOpen(true)}
					variant='ghost'
					className='w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive'
				>
					<LogOut size={20} />
					<span className='font-medium'>Logout</span>
				</Button>
			</div>
		</>
	);

	return (
		<>
			{/* Mobile Menu Button */}
			<Button
				variant='ghost'
				size='icon'
				onClick={() => setIsMobileMenuOpen(true)}
				className='fixed top-4 left-4 z-50 lg:hidden'
			>
				<Menu size={24} />
			</Button>

			{/* Desktop Sidebar */}
			<aside className='hidden lg:flex w-64 bg-card border-r border-border flex-col h-screen'>
				<SidebarContent />
			</aside>

			{/* Mobile Sidebar Overlay */}
			{isMobileMenuOpen && (
				<div
					className='fixed inset-0 bg-foreground/50 z-40 lg:hidden'
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}

			{/* Mobile Sidebar */}
			<aside
				className={`fixed top-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col h-screen transform transition-transform duration-300 lg:hidden ${
					isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				{/* Close Button */}
				<div className='absolute top-4 right-4'>
					<Button
						variant='ghost'
						size='icon-sm'
						onClick={() => setIsMobileMenuOpen(false)}
					>
						<X size={20} />
					</Button>
				</div>
				<SidebarContent />
			</aside>

			<ConfirmDialog
				open={logoutOpen}
				onOpenChange={setLogoutOpen}
				title='Log out?'
				description='You will be logged out of the dashboard. Continue?'
				confirmLabel='Log out'
				cancelLabel='Cancel'
				intent='default'
				onConfirm={handleLogout}
				onCancel={() => setLogoutOpen(false)}
			/>
		</>
	);
}
