'use client';

import React, { useCallback, useState } from 'react';
import ProductForm, { ProductPayload } from '@/components/product/productForm';
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
import { productApi } from '@/redux/features/productApi';
import { useAppDispatch } from '@/redux/hooks';
import type { Product } from '@/types/product';

export default function EditProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = React.use(params);

	const { data: product, isLoading, isError } = useGetProductByIdQuery(id);
	const [update] = useUpdateProductMutation();
	const router = useRouter();
	const dispatch = useAppDispatch();

	// confirmation flow state
	const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
	const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
	const [pendingPayload, setPendingPayload] = useState<ProductPayload | null>(
		null,
	);

	// resolver for the promise returned to ProductForm
	const [submitResolver, setSubmitResolver] = useState<
		((value?: void | PromiseLike<void>) => void) | null
	>(null);
	const [submitRejecter, setSubmitRejecter] = useState<
		((reason?: unknown) => void) | null
	>(null);

	const handleFormSubmit = useCallback(
		(payload: ProductPayload) =>
			new Promise<void>((resolve, reject) => {
				setPendingPayload(payload);
				setSubmitResolver(() => resolve);
				setSubmitRejecter(() => reject);
				setConfirmOpen(true);
			}),
		[],
	);

	const confirmAndSave = useCallback(async () => {
		if (!pendingPayload || !product) {
			setConfirmOpen(false);
			submitResolver?.();
			return;
		}

		setConfirmLoading(true);
		try {
			const updated: Product = await update({
				id: product.id,
				...pendingPayload,
			}).unwrap();

			toast.success('Product updated successfully!');

			// update caches safely
			try {
				dispatch(
					productApi.util.updateQueryData(
						'getProductById',
						updated.id,
						(draft: Product) => {
							Object.assign(draft, updated);
						},
					),
				);
			} catch {
				// ignore
			}

			if (updated.slug) {
				try {
					dispatch(
						productApi.util.updateQueryData(
							'getProductBySlug',
							updated.slug,
							(draft: Product) => {
								Object.assign(draft, updated);
							},
						),
					);
				} catch {
					// ignore
				}
			}

			dispatch(
				productApi.util.invalidateTags([{ type: 'Product', id: 'LIST' }]),
			);

			submitResolver?.();

			setConfirmOpen(false);
			const destination = updated.slug
				? `/products/${updated.slug}`
				: `/products/${updated.id}`;
			router.push(destination);
		} catch (err) {
			console.error('Update error:', err);
			toast.error('Failed to update product');
			submitRejecter?.(err);
		} finally {
			setConfirmLoading(false);
			setPendingPayload(null);
			setSubmitResolver(null);
			setSubmitRejecter(null);
		}
	}, [
		pendingPayload,
		product,
		update,
		dispatch,
		router,
		submitResolver,
		submitRejecter,
	]);

	const cancelConfirm = useCallback(() => {
		setConfirmOpen(false);
		submitRejecter?.(new Error('User cancelled'));
		setPendingPayload(null);
		setSubmitResolver(null);
		setSubmitRejecter(null);
	}, [submitRejecter]);

	if (isLoading) return <GlobalLoading />;

	if (isError || !product) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<div className='text-center'>
					<div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
						<TriangleAlert className='w-8 h-8 text-red-600' />
					</div>
					<h2 className='text-xl font-semibold text-foreground mb-2'>
						Product Not Found
					</h2>
					<p className='text-foreground mb-4'>
						The product you&apos;re looking for doesn&apos;t exist.
					</p>
					<Button asChild>
						<Link href='/products'>
							<ArrowLeft /> Back to Products
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex gap-4 items-center'>
				<Button variant='default' size='icon' asChild>
					<Link href={`/products/${product.slug ?? product.id}`}>
						<ArrowLeft />
					</Link>
				</Button>

				<div>
					<h1 className='text-3xl font-bold text-slate-800'>Edit Product</h1>
					<p className='text-foreground mt-1'>
						Update details for{' '}
						<span className='font-medium'>{product.name}</span>
					</p>
				</div>
			</div>

			<div className='max-w-7xl'>
				<ProductForm
					defaultValues={{
						name: product.name,
						description: product.description ?? '',
						price: product.price,
						images: product.images ?? undefined,
						categoryId: product.category?.id ?? '',
					}}
					onSubmit={handleFormSubmit}
					submitLabel='Update Product'
				/>
			</div>

			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={(v) => {
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
