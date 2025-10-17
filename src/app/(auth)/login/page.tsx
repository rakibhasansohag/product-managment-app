'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { setToken } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const schema = z.object({ email: z.string().email('Invalid email') });
type Form = z.infer<typeof schema>;

export default function LoginPage() {
	const dispatch = useDispatch();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Form>({ resolver: zodResolver(schema) });

	const onSubmit = async (data: Form) => {
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth`.replace(/\/$/, ''),
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				},
			);
			const json = await res.json();
			if (json.token) {
				document.cookie = `token=${json.token}; path=/; max-age=${
					60 * 60 * 24 * 7
				}; samesite=lax`;
				dispatch(setToken(json.token));
				const from =
					new URLSearchParams(window.location.search).get('from') ??
					'/products';
				toast.success('Logged in');
				router.push(from || '/products');
			} else {
				toast.error('Login failed');
			}
		} catch (e) {
			toast.error('Network error');
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='bg-white p-8 rounded shadow w-[420px]'
			>
				<h2 className='text-xl font-semibold mb-4'>Login</h2>
				<input
					{...register('email')}
					placeholder='you@example.com'
					className='w-full border rounded px-3 py-2 mb-1'
				/>
				{errors.email && (
					<p className='text-red-500 text-sm'>{errors.email.message}</p>
				)}
				<button
					type='submit'
					className='mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded'
				>
					Login
				</button>
			</form>
		</div>
	);
}
