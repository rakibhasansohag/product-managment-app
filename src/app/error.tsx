'use client';
import { useEffect } from 'react';
import Link from 'next/link';

type Props = {
	error: Error;
	reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
	useEffect(() => {
		console.error('Unhandled error caught by app/error.tsx:', error);
	}, [error]);

	return (
		<div className='min-h-[70vh] flex items-center justify-center px-4'>
			<div className='max-w-2xl w-full text-center bg-card border border-border rounded-2xl p-8 shadow-md'>
				<div className='mx-auto mb-5 w-20 h-20 rounded-full flex items-center justify-center bg-accent text-accent-foreground text-2xl font-bold'>
					!
				</div>

				<h2 className='text-2xl font-bold text-foreground mb-2'>
					Something went wrong
				</h2>
				<p className='text-muted-foreground mb-6'>
					An unexpected error occurred. Try reloading the page or go back to the
					Products page.
				</p>

				<div className='flex gap-3 justify-center'>
					<button
						onClick={() => reset()}
						className='rounded-md px-4 py-2 bg-primary text-primary-foreground hover:opacity-95'
					>
						Try again
					</button>

					<Link
						href='/products'
						className='rounded-md px-4 py-2 border border-border text-foreground inline-flex items-center justify-center'
					>
						Back to Products
					</Link>
				</div>

				<details className='mt-6 text-left text-xs text-muted-foreground p-3 bg-muted rounded'>
					<summary className='cursor-pointer'>Error details</summary>
					<pre className='whitespace-pre-wrap mt-2'>
						{String(error?.message)}
					</pre>
				</details>
			</div>
		</div>
	);
}
