'use client';
import Link from 'next/link';
import type { Product } from '@/types/product';
import Image from 'next/image';

export default function ProductCard({ product }: { product: Product }) {
	console.log(product);

	return (
		<div className='bg-white shadow rounded overflow-hidden'>
			<Image
				width={500}
				height={500}
				src={product.images?.[0] ?? '/placeholder.png'}
				alt={product.name}
				className='w-full h-44 object-cover'
			/>
			<div className='p-4'>
				<h3 className='font-semibold'>{product.name}</h3>
				<p className='text-sm text-gray-500 mt-1 line-clamp-2'>
					{product.description}
				</p>
				<div className='mt-3 flex items-center justify-between'>
					<span className='font-medium'>৳ {product.price}</span>
					<Link
						href={`/products/${product.slug ?? product.id}`}
						className='text-sm text-blue-600'
					>
						Details
					</Link>
				</div>
			</div>
		</div>
	);
}
