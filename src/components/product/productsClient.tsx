'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
	useGetProductsQuery,
	useDeleteProductMutation,
	useSearchProductsQuery,
} from '@/redux/features/productApi';
import ProductCard from '@/components/product/productCard';
import ConfirmDialog from '@/components/shared/confirmDialog';
import toast from 'react-hot-toast';
import Link from 'next/link';
import debounce from 'lodash.debounce';
import type { Product } from '@/types/product';

export default function ProductsClient() {
	const [offset, setOffset] = useState<number>(0);
	const limit = 9;
	const [searchText, setSearchText] = useState<string>('');
	const [queryEnabled, setQueryEnabled] = useState<boolean>(false);

	const {
		data: products,
		isLoading,
		isError,
		refetch,
	} = useGetProductsQuery({ offset, limit });
	const { data: searchResults } = useSearchProductsQuery(searchText, {
		skip: !queryEnabled,
	});
	const [deleteProduct] = useDeleteProductMutation();
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	useEffect(() => {
		setQueryEnabled(Boolean(searchText && searchText.trim()));
	}, [searchText]);

	const debouncedSet = useMemo(
		() =>
			debounce((v: string) => {
				setSearchText(v);
			}, 350),
		[],
	);

	useEffect(() => {
		return () => debouncedSet.cancel();
	}, [debouncedSet]);

	const handleDelete = async (id: string) => {
		try {
			await deleteProduct(id).unwrap();
			toast.success('Deleted');
			refetch();
			setConfirmOpen(false);
		} catch (err) {
			toast.error('Delete failed');
		}
	};

	const list: Product[] = (
		queryEnabled ? searchResults ?? [] : products ?? []
	) as Product[];

	return (
		<div>
			<div className='mb-4 flex items-center justify-between gap-4'>
				<input
					placeholder='Search products...'
					onChange={(e) => debouncedSet(e.target.value)}
					className='border px-3 py-2 rounded w-80'
				/>
				<Link
					href='/products/new'
					className='px-4 py-2 rounded bg-blue-600 text-white'
				>
					New Product
				</Link>
			</div>

			{isLoading && <div>Loading...</div>}
			{isError && <div>Error loading products</div>}

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
				{list.map((p) => (
					<div key={p.id} className='relative'>
						<ProductCard product={p} />
						<div className='p-2 flex gap-2 mt-2'>
							<Link
								href={`/products/${p.slug ?? p.id}`}
								className='text-sm text-blue-600'
							>
								View
							</Link>
							<Link
								href={`/products/${p.slug ?? p.id}/edit`}
								className='text-sm text-gray-700'
							>
								Edit
							</Link>
							<button
								onClick={() => {
									setSelectedId(p.id);
									setConfirmOpen(true);
								}}
								className='text-sm text-red-600'
							>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>

			<div className='mt-6 flex items-center justify-between'>
				<div>
					<button
						disabled={offset === 0}
						className='px-3 py-2 border rounded mr-2 disabled:opacity-50'
						onClick={() => setOffset(Math.max(0, offset - limit))}
					>
						Prev
					</button>
					<button
						className='px-3 py-2 border rounded'
						onClick={() => setOffset(offset + limit)}
					>
						Next
					</button>
				</div>
			</div>

			<ConfirmDialog
				open={confirmOpen}
				title='Delete product?'
				message='This will simulate deletion (mock api). Continue?'
				onCancel={() => setConfirmOpen(false)}
				onConfirm={() => selectedId && handleDelete(selectedId)}
			/>
		</div>
	);
}
