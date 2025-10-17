/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useCallback } from 'react';
import ProductForm from '@/components/product/productForm';
import {
	useGetProductByIdQuery,
	useUpdateProductMutation,
} from '@/redux/features/productApi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import GlobalLoading from '@/components/globalLoading';
import ConfirmDialog from '@/components/shared/confirmDialog';

export default function EditProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = React.use(params);

	const { data: product, isLoading, isError } = useGetProductByIdQuery(id);
	const [update] = useUpdateProductMutation();
	const router = useRouter();

	// confirmation flow state
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [pendingPayload, setPendingPayload] = useState<Record<
		string,
		any
	> | null>(null);

	// resolver for the promise returned to ProductForm
	const [submitResolver, setSubmitResolver] = useState<
		((value?: void | PromiseLike<void>) => void) | null
	>(null);
	const [submitRejecter, setSubmitRejecter] = useState<
		((reason?: any) => void) | null
	>(null);

	const handleFormSubmit = useCallback(
		(payload: Record<string, any>) =>
			new Promise<void>((resolve, reject) => {
				// save payload then open confirm dialog
				setPendingPayload(payload);
				setSubmitResolver(() => resolve);
				setSubmitRejecter(() => reject);
				setConfirmOpen(true);
			}),
		[],
	);

	const confirmAndSave = useCallback(async () => {
		if (!pendingPayload || !product) {
			// nothing to save
			setConfirmOpen(false);
			submitResolver?.();
			return;
		}

		setConfirmLoading(true);
		try {
			await update({ id: product.id, ...pendingPayload }).unwrap();
			toast.success('Product updated successfully!');

			console.log('Product updated successfully!', product);
			submitResolver?.();
			// close dialog then navigate to details page
			setConfirmOpen(false);
			router.push(`/products/${product.slug ?? product.id}`);
		} catch (err) {
			console.error('Update error:', err);
			toast.error('Failed to update product');

			submitRejecter?.(err);
		} finally {
			setConfirmLoading(false);
			// cleanup pending payload / resolvers after a tick
			setPendingPayload(null);
			setSubmitResolver(null);
			setSubmitRejecter(null);
		}
	}, [pendingPayload, product, update, router, submitResolver, submitRejecter]);

	const cancelConfirm = useCallback(() => {
		setConfirmOpen(false);

		submitRejecter?.(new Error('User cancelled'));

		// cleanup
		setPendingPayload(null);
		setSubmitResolver(null);
		setSubmitRejecter(null);
	}, [submitRejecter]);

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
					// instead of immediately updating, we open confirmation first
					onSubmit={handleFormSubmit}
					submitLabel='Update Product'
				/>
			</div>

			{/* Confirm dialog shown when form submits */}
			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={(v) => {
					// if user closes via overlay/esc key, treat as cancel
					if (!v) cancelConfirm();
					setConfirmOpen(v);
				}}
				title='Save changes?'
				description='Are you sure you want to save these changes to the product?'
				confirmLabel='Save'
				cancelLabel='Cancel'
				intent='default'
				loading={confirmLoading}
				onConfirm={confirmAndSave}
				onCancel={cancelConfirm}
			/>
		</div>
	);
}
