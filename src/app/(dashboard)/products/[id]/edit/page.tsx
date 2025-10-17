'use client';
import React from 'react';
import ProductForm from '@/components/product/productForm';
import {
	useGetProductByIdQuery,
	useUpdateProductMutation,
} from '@/redux/features/productApi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft,  TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import GlobalLoading from '@/components/globalLoading';

export default function EditProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = React.use(params);

	const { data: product, isLoading, isError } = useGetProductByIdQuery(id);
	const [update] = useUpdateProductMutation();
	const router = useRouter();

	if (isLoading) {
		return <GlobalLoading />;
	}

	if (isError || !product) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<div className='text-center'>
					<div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
						<TriangleAlert className='w-8 h-8 text-red-600' />
					</div>
					<h2 className='text-xl font-semibold text-slate-800 mb-2'>
						Product Not Found
					</h2>
					<p className='text-slate-600 mb-4'>
						The product you&apos;re looking for doesn&apos;t exist.
					</p>
					<Button asChild>
						<Link href='/products'>
							<ArrowLeft />
							Back to Products
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center gap-4'>
				<Button variant='ghost' size='icon' asChild>
					<Link href={`/products/${product.slug ?? product.id}`}>
						<ArrowLeft />
					</Link>
				</Button>
				<div>
					<h1 className='text-3xl font-bold text-slate-800'>Edit Product</h1>
					<p className='text-slate-500 mt-1'>
						Update details for{' '}
						<span className='font-medium'>{product.name}</span>
					</p>
				</div>
			</div>

			{/* Form */}
			<div className='max-w-7xl'>
				<ProductForm
					defaultValues={{
						name: product.name,
						description: product.description ?? '',
						price: product.price,
						images: product.images ?? undefined,
						categoryId: product.category?.id ?? '',
					}}
					onSubmit={async (payload) => {
						try {
							await update({ id: product.id, ...payload }).unwrap();
							toast.success('Product updated successfully!');
							router.push(`/products/${product.slug ?? product.id}`);
						} catch (err) {
							console.error('Update error:', err);
							toast.error('Failed to update product');
						}
					}}
					submitLabel='Update Product'
				/>
			</div>
		</div>
	);
}
