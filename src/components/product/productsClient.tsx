'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
	useGetProductsQuery,
	useDeleteProductMutation,
	useSearchProductsQuery,
	useGetCategoriesQuery,
} from '@/redux/features/productApi';
import ProductCard from '@/components/product/productCard';
import ConfirmDialog from '@/components/shared/confirmDialog';
import toast from 'react-hot-toast';
import Link from 'next/link';
import debounce from 'lodash.debounce';
import type { Product } from '@/types/product';
import { Search, Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/components/ui/select';

export default function ProductsClient() {
	const [offset, setOffset] = useState<number>(0);
	const limit = 9;

	// search state
	const [searchText, setSearchText] = useState<string>('');
	const [queryEnabled, setQueryEnabled] = useState<boolean>(false);

	// category
	const [categoryId, setCategoryId] = useState<string>('');

	// confirm delete
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	// fetch categories
	const { data: categories, isLoading: categoriesLoading } =
		useGetCategoriesQuery({ offset: 0, limit: 9 });

	// choose whether we should use search endpoint
	useEffect(() => {
		setQueryEnabled(Boolean(searchText && searchText.trim()));
	}, [searchText]);

	// products: skip when searching or filtering
	const {
		data: products,
		isLoading,
		isError,
		refetch,
	} = useGetProductsQuery(
		{ offset, limit, ...(categoryId ? { categoryId } : {}) },
		{ skip: queryEnabled }, // skip list when search is enabled
	);

	// search results hook
	const { data: searchResults } = useSearchProductsQuery(searchText, {
		skip: !queryEnabled,
	});

	const [deleteProduct] = useDeleteProductMutation();

	// debounced setter for search input value
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

	// when category changes, reset pagination and  clear search
	const handleCategoryChange = (val: string) => {
		setCategoryId(val); // '' means all
		setOffset(0);
		// we intentionally do NOT clear searchText here because search has priority
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteProduct(id).unwrap();
			toast.success('Product deleted successfully');
			refetch();
			setConfirmOpen(false);
			setSelectedId(null);
		} catch (err) {
			toast.error('Failed to delete product');
		}
	};

	// which list to show
	const list: Product[] = (
		queryEnabled ? searchResults ?? [] : products ?? []
	) as Product[];

	const apiCategoryId = categoryId === 'all' ? undefined : categoryId;
	useGetProductsQuery(
		{ offset, limit, ...(apiCategoryId ? { categoryId: apiCategoryId } : {}) },
		{ skip: queryEnabled },
	);

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-foreground'>Products</h1>
					<p className='text-muted-foreground mt-1'>
						Manage your product inventory
					</p>
				</div>

				<Button asChild>
					<Link href='/products/new'>
						<Plus />
						Add Product
					</Link>
				</Button>
			</div>

			{/* Search + Category Row */}
			<div className='flex flex-col sm:flex-row gap-3'>
				<div className='flex-1 relative flex gap-3 sm:items-center flex-col sm:flex-row'>
					<div className='relative flex-1 w-full'>
						<Search
							className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
							size={20}
						/>
						<input
							placeholder='Search by name, description...'
							onChange={(e) => debouncedSet(e.target.value)}
							className='w-full pl-10 pr-4 py-2.5 border border-border bg-card text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground h-10'
						/>
					</div>

					<div className=''>
						<Select value={categoryId} onValueChange={handleCategoryChange}>
							<SelectTrigger className='h-10'>
								<SelectValue placeholder='All categories' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All categories</SelectItem>
								{categories?.map((c) => (
									<SelectItem key={c.id} value={c.id}>
										{c.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* Loading */}
			{isLoading && (
				<div className='flex items-center justify-center py-12'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary' />
				</div>
			)}

			{/* Error */}
			{isError && (
				<div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive'>
					<p className='font-medium'>Error loading products</p>
					<p className='text-sm mt-1'>Please try again later</p>
					<Button onClick={() => refetch()} className='mt-2' variant='outline'>
						Refresh
					</Button>
				</div>
			)}

			{/* Grid */}
			{!isLoading && !isError && (
				<>
					{list.length === 0 ? (
						<div className='text-center py-12 bg-card rounded-lg border border-border'>
							<Package
								size={48}
								className='mx-auto text-muted-foreground mb-4'
							/>
							<h3 className='text-lg font-medium text-foreground'>
								No products found
							</h3>
							<p className='text-muted-foreground mt-1'>
								Get started by creating your first product
							</p>
							<Button asChild className='mt-4'>
								<Link href='/products/new'>
									<Plus />
									Add Product
								</Link>
							</Button>
						</div>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{list.map((p) => (
								<ProductCard
									key={p.id}
									product={p}
									onDelete={() => {
										setSelectedId(p.id);
										setConfirmOpen(true);
									}}
								/>
							))}
						</div>
					)}
				</>
			)}

			{/* Pagination */}
			{!isLoading && list.length > 0 && (
				<div className='flex flex-col sm:flex-row items-center justify-between gap-4 pt-4'>
					<div>
						<p className='text-sm text-muted-foreground'>
							Showing{' '}
							<span className='font-medium text-foreground'>{offset + 1}</span>{' '}
							to{' '}
							<span className='font-medium text-foreground'>
								{offset + list.length}
							</span>{' '}
							of products
						</p>
					</div>

					<div className='flex gap-2'>
						<Button
							variant='outline'
							disabled={offset === 0}
							onClick={() => setOffset(Math.max(0, offset - limit))}
						>
							Previous
						</Button>
						<Button variant='outline' onClick={() => setOffset(offset + limit)}>
							Next
						</Button>
					</div>
				</div>
			)}

			<ConfirmDialog
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title='Delete Product'
				description='Are you sure you want to delete this product? This action cannot be undone.'
				confirmLabel='Delete'
				cancelLabel='Cancel'
				intent='danger'
				onConfirm={async () => {
					if (!selectedId) return;
					await handleDelete(selectedId);
				}}
				onCancel={() => {
					setConfirmOpen(false);
					setSelectedId(null);
				}}
			/>
		</div>
	);
}
