'use client';
import React from 'react';
import ProductForm from '@/components/product/productForm';
import {
	useGetProductByIdQuery,
	useUpdateProductMutation,
} from '@/redux/features/productApi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EditProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = React.use(params);

	const { data: product, isLoading } = useGetProductByIdQuery(id);
	const [update] = useUpdateProductMutation();
	const router = useRouter();

	if (isLoading) return <div>Loading...</div>;
	if (!product) return <div>Not found</div>;

	return (
		<div className='max-w-2xl'>
			<h2 className='text-xl font-semibold mb-4'>Edit Product</h2>
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
						toast.success(`Product ${product.name} updated successfully`);
						router.push('/products/' + product.slug);
					} catch {
						toast.error('Update failed');
					}
				}}
				submitLabel='Update'
			/>
		</div>
	);
}
