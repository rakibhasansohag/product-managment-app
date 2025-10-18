'use client';
import Link from 'next/link';
import type { Product } from '@/types/product';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProductCard({
	product,
	onDelete,
	viewOnly = false,
}: {
	product: Product;
	onDelete?: () => void;
	viewOnly?: boolean;
}) {
	return (
		<div className='bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200 group'>
			{/* Image */}
			<div className='relative h-48 overflow-hidden bg-slate-100'>
				<img
					src={product.images?.[0] ?? '/placeholder.png'}
					alt={product.name}
					className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
				/>
				<div className='absolute top-3 right-3'>
					<span className='bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-slate-800'>
						৳ {product.price}
					</span>
				</div>
			</div>

			{/* Content */}
			<div className='p-5'>
				<h3 className='font-semibold text-lg text-slate-800 mb-2 line-clamp-1'>
					{product.name}
				</h3>
				<p className='text-sm text-slate-500 line-clamp-2 mb-4 min-h-[2.5rem]'>
					{product.description || 'No description available'}
				</p>

				{/* Actions */}
				{viewOnly ? (
					// View Only Mode - Just the View button
					<Button asChild variant='secondary' size='sm' className='w-full'>
						<Link href={`/products/${product.slug ?? product.id}`}>
							<Eye />
							View Details
						</Link>
					</Button>
				) : (
					// Full Mode - All actions
					<div className='flex items-center gap-2'>
						<Button asChild variant='secondary' size='sm' className='flex-1'>
							<Link href={`/products/${product.slug ?? product.id}`}>
								<Eye />
								View
							</Link>
						</Button>
						<Button asChild variant='outline' size='icon-sm'>
							<Link href={`/products/${product.slug ?? product.id}/edit`}>
								<Edit />
							</Link>
						</Button>
						{onDelete && (
							<Button
								onClick={onDelete}
								variant='outline'
								size='icon-sm'
								className='border-red-200 text-red-600 hover:bg-red-50'
							>
								<Trash2 />
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
