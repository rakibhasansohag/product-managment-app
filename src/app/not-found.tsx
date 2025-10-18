import Link from 'next/link';

export default function NotFoundPage() {
	return (
		<div className='min-h-screen flex items-center justify-center px-4'>
			<div className='max-w-2xl w-full text-center bg-card border border-border rounded-2xl p-4 py-6 sm:p-10 shadow-md'>
				<div className='w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center bg-secondary text-secondary-foreground text-3xl font-bold'>
					404
				</div>

				<h1 className='text-3xl font-extrabold text-foreground mb-2'>
					Page not found
				</h1>
				<p className='text-muted-foreground mb-6'>
					The page you were looking for doesn’t exist or has been moved.
				</p>

				<div className='flex flex-col sm:flex-row gap-3 justify-center'>
					<Link
						href='/products'
						className='inline-flex items-center justify-center rounded-md px-4 py-2 bg-primary text-primary-foreground font-medium shadow-sm hover:opacity-95'
					>
						Go to Products
					</Link>

					<Link
						href='/'
						className='inline-flex items-center justify-center rounded-md px-4 py-2 border border-border text-foreground bg-transparent'
					>
						Return home
					</Link>
				</div>

				<p className='text-xs text-muted-foreground mt-6'>
					If you think this is an error,{' '}
					<a className='underline' href='mailto:rakibhasansohag133@gmail.com'>
						contact support
					</a>
					.
				</p>
			</div>
		</div>
	);
}
