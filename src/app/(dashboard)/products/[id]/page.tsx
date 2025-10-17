'use client';
import { useGetProductBySlugQuery } from '@/redux/features/productApi';
import Link from 'next/link';

import { useGetProductByIdQuery } from '@/redux/features/productApi';
import React from 'react';
import Image from 'next/image';

export default function ProductDetails({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = React.use(params);

	const { data: productBySlug, isLoading } = useGetProductBySlugQuery(id);

	const { data: productById } = useGetProductByIdQuery(id, {
		skip: !!productBySlug,
	});

	const product = productBySlug ?? productById;

	if (isLoading) return <div>Loading...</div>;
	if (!product) return <div>Not found</div>;

	return (
		<div className='max-w-3xl'>
			{/* ERROR : Remoed the next js image cuz  of the lot of domain coming in the server and also there is this image doamin that code buggeed 
				
				{
				protocol: 'https',
				hostname: 'letsenhance.io',
				port: '',
				pathname: '/**',
			},
				*/}
			<img
				src={product.images?.[0] ?? '/placeholder.png'}
				className='w-full h-64 object-cover rounded'
				alt={product.name}
				// width={500}
				// height={500}
			/>
			<div className='mt-4'>
				<h2 className='text-2xl font-semibold'>{product.name}</h2>
				<p className='mt-2 text-gray-600'>{product.description}</p>
				<div className='mt-4 flex items-center justify-between'>
					<div className='text-lg font-medium'>৳ {product.price}</div>
					<div className='flex gap-2'>
						<Link
							href={`/products/${product.slug}/edit`}
							className='px-3 py-2 border rounded'
						>
							Edit
						</Link>
						<Link href='/products' className='px-3 py-2 rounded bg-gray-100'>
							Back
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
