'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { setToken } from '@/redux/features/authSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Mail, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const schema = z.object({
	email: z.string().email('Please enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
	const dispatch = useDispatch();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },

		setValue,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: '',
		},
	});

	const onSubmit = async (data: FormData) => {
		setIsLoading(true);
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth`.replace(/\/$/, ''),
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: data.email }),
				},
			);

			if (!res.ok) {
				throw new Error('Authentication failed');
			}

			const json = await res.json();

			if (json.token) {
				// Set cookie with token
				document.cookie = `token=${json.token}; path=/; max-age=${
					60 * 60 * 24 * 7
				}; samesite=lax`;

				// Update Redux store
				dispatch(setToken(json.token));

				// Get redirect URL or default to products
				const from = searchParams.get('from') || '/products';

				toast.success('Welcome back!');
				router.push(from);
				router.refresh();
			} else {
				throw new Error('No token received');
			}
		} catch (error) {
			console.error('Login error:', error);
			toast.error('Login failed. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleEmailClick = () => {
		const demoEmail = 'rakibhasansohag133@gmail.com';

		setValue('email', demoEmail, { shouldValidate: true, shouldDirty: true });
		toast.success('Demo email filled! Please login.');
	};

	return (
		<div className='h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-4 overflow-hidden'>
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl'></div>
				<div className='absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl'></div>
			</div>

			<div className='w-full max-w-md relative z-10'>
				{/* Logo and Title */}
				<div className='text-center mb-8'>
					<div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4'>
						<Package className='text-white' size={32} />
					</div>
					<h1 className='text-3xl font-bold text-slate-800 mb-2'>
						Welcome Back
					</h1>
					<p className='text-slate-600'>
						Sign in to access your product dashboard
					</p>
				</div>

				{/* Login Form Card */}
				<div className='bg-white rounded-2xl shadow-xl border border-slate-200 p-8'>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
						{/* Email Field */}
						<div className='space-y-2'>
							<Label htmlFor='email' className='text-slate-700'>
								Email Address
							</Label>
							<div className='relative'>
								<Mail
									className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
									size={18}
								/>
								<Input
									{...register('email')}
									id='email'
									type='email'
									placeholder='you@example.com'
									className='pl-10'
									disabled={isLoading}
									autoFocus
								/>
							</div>
							{errors.email && (
								<div className='flex items-center gap-1.5 text-red-600 text-sm'>
									<AlertCircle size={14} />
									<span>{errors.email.message}</span>
								</div>
							)}
						</div>

						{/* Submit Button */}
						<Button type='submit' className='w-full h-11' disabled={isLoading}>
							{isLoading ? (
								<>
									<div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2'></div>
									Signing in...
								</>
							) : (
								'Sign In'
							)}
						</Button>
					</form>

					{/* Demo Credentials Info */}
					<div className='mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
						<p className='text-sm text-blue-800 font-medium mb-1'>
							Demo Authentication :{' '}
							<span
								onClick={handleEmailClick}
								className='font-bold cursor-pointer underline text-blue-900 hover:text-blue-700 transition duration-150'
							>
								rakibhasansohag133@gmail.com
							</span>
						</p>
						<p className='text-xs text-blue-600'>
							Enter any valid email format to receive an authentication token
						</p>
					</div>
				</div>

				{/* Footer */}
				<div className='text-center mt-6'>
					<p className='text-sm text-slate-500'>Powered by BitechX Mock API</p>
				</div>
			</div>
		</div>
	);
}
