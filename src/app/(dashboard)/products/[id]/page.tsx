'use client';
import {
	useGetProductBySlugQuery,
	useGetProductByIdQuery,
	useGetProductsQuery,
} from '@/redux/features/productApi';
import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Edit, Package, Tag, Calendar, Loader2 } from 'lucide-react';
import ProductCard from '@/components/product/productCard';
import GlobalLoading from '../../../../components/globalLoading';

export default function ProductDetails({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = React.use(params);

	const { data: productBySlug, isLoading: loadingBySlug } =
		useGetProductBySlugQuery(id);
	const { data: productById, isLoading: loadingById } = useGetProductByIdQuery(
		id,
		{
			skip: !!productBySlug,
		},
	);

	const product = productBySlug ?? productById;
	const isLoading = loadingBySlug || loadingById;

	// Fetch related products from the same category
	const { data: relatedProducts } = useGetProductsQuery(
		{
			categoryId: product?.category?.id ?? '',
			limit: 5, // Get 5 so we can filter out current and show 4
		},
		{
			skip: !product?.category?.id,
		},
	);

	// Filter out current product from related products
	const filteredRelatedProducts = relatedProducts
		?.filter((p) => p.id !== product?.id)
		.slice(0, 4); // Show max 4 related products

	if (isLoading) {
		return <GlobalLoading />;
	}

	if (!product) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<div className='text-center'>
					<div className='w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Package size={32} className='text-slate-400' />
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

	const formatDate = (dateString?: string) => {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	return (
		<div className='space-y-8'>
			{/* Header with Back Button */}
			<div className='flex items-start gap-4 '>
				<Button size='icon' asChild>
					<Link href='/products'>
						<ArrowLeft />
					</Link>
				</Button>
				<div className='flex-1 md:block hidden'>
					<h1 className='text-3xl font-bold text-slate-800'>Product Details</h1>
					<p className='text-slate-500 mt-1'>
						View and manage product information
					</p>
				</div>
				<Button asChild>
					<Link href={`/products/${product.slug ?? product.id}/edit`}>
						<Edit />
						Edit Product
					</Link>
				</Button>
			</div>

			{/* Main Product Details */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				{/* Product Image */}
				<Card className='overflow-hidden py-0'>
					<div className='aspect-square relative bg-slate-100'>
						<img
							src={product.images?.[0] ?? '/placeholder.png'}
							alt={product.name}
							className='w-full h-full object-cover'
						/>
					</div>
				</Card>

				{/* Product Information */}
				<div className='space-y-6'>
					{/* Category Badge */}
					{product.category && (
						<div className='inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium'>
							<Tag size={14} />
							{product.category.name}
						</div>
					)}

					{/* Product Name */}
					<div>
						<h2 className='text-3xl font-bold text-slate-800'>
							{product.name}
						</h2>
						<p className='text-sm text-slate-500 mt-1'>
							SKU: {product.id.slice(0, 8)}
						</p>
					</div>

					{/* Price */}
					<div className='bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200'>
						<p className='text-sm text-slate-600 mb-1'>Price</p>
						<p className='text-4xl font-bold text-slate-900'>
							৳ {product.price.toLocaleString()}
						</p>
					</div>

					{/* Description */}
					<Card>
						<CardContent className='p-6'>
							<h3 className='font-semibold text-slate-800 mb-3'>Description</h3>
							<p className='text-slate-600 leading-relaxed'>
								{product.description || 'No description available'}
							</p>
						</CardContent>
					</Card>

					{/* Meta Information */}
					<Card>
						<CardContent className='p-6'>
							<h3 className='font-semibold text-slate-800 mb-4'>
								Additional Information
							</h3>
							<div className='space-y-3'>
								<div className='flex items-center gap-3 text-sm'>
									<Calendar size={16} className='text-slate-400' />
									<span className='text-slate-600'>Created:</span>
									<span className='font-medium text-slate-800'>
										{formatDate(product.createdAt)}
									</span>
								</div>
								<div className='flex items-center gap-3 text-sm'>
									<Calendar size={16} className='text-slate-400' />
									<span className='text-slate-600'>Updated:</span>
									<span className='font-medium text-slate-800'>
										{formatDate(product.updatedAt)}
									</span>
								</div>
								{product.slug && (
									<div className='flex items-center gap-3 text-sm'>
										<Package size={16} className='text-slate-400' />
										<span className='text-slate-600'>Slug:</span>
										<code className='px-2 py-1 bg-slate-100 rounded text-xs font-mono text-slate-800'>
											{product.slug}
										</code>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Related Products Section */}
			{filteredRelatedProducts && filteredRelatedProducts.length > 0 && (
				<div className='space-y-4'>
					<div className='flex items-center justify-between'>
						<div>
							<h2 className='text-2xl font-bold text-slate-800'>
								Related Products
							</h2>
							<p className='text-slate-500 mt-1'>
								More products from{' '}
								<span className='font-medium'>{product.category?.name}</span>
							</p>
						</div>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
						{filteredRelatedProducts.map((relatedProduct) => (
							<ProductCard
								key={relatedProduct.id}
								product={relatedProduct}
								viewOnly={true}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
