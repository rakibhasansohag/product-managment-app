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

	const { data: relatedProducts } = useGetProductsQuery(
		{
			categoryId: product?.category?.id ?? '',
			limit: 5,
		},
		{
			skip: !product?.category?.id,
		},
	);

	const filteredRelatedProducts = relatedProducts
		?.filter((p) => p.id !== product?.id)
		.slice(0, 4);

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<div className='text-center'>
					<Loader2 className='w-12 h-12 animate-spin text-primary mx-auto mb-4' />
					<p className='text-muted-foreground'>Loading product details...</p>
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className='flex items-center justify-center min-h-[400px]'>
				<div className='text-center'>
					<div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
						<Package size={32} className='text-muted-foreground' />
					</div>
					<h2 className='text-xl font-semibold text-foreground mb-2'>
						Product Not Found
					</h2>
					<p className='text-muted-foreground mb-4'>
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
			<div className='flex items-start gap-4'>
				<Button size='icon' asChild variant='default'>
					<Link href='/products'>
						<ArrowLeft />
					</Link>
				</Button>
				<div className='flex-1 md:block hidden'>
					<h1 className='text-3xl font-bold text-foreground'>
						Product Details
					</h1>
					<p className='text-muted-foreground mt-1'>
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
					<div className='aspect-square relative bg-muted'>
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
						<div className='inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20'>
							<Tag size={14} />
							{product.category.name}
						</div>
					)}

					{/* Product Name */}
					<div>
						<h2 className='text-3xl font-bold text-foreground'>
							{product.name}
						</h2>
						<p className='text-sm text-muted-foreground mt-1'>
							SKU: {product.id.slice(0, 8)}
						</p>
					</div>

					{/* Price */}
					<div className='bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg p-6 border border-primary/20'>
						<p className='text-sm text-muted-foreground mb-1'>Price</p>
						<p className='text-4xl font-bold text-foreground'>
							৳ {product.price.toLocaleString()}
						</p>
					</div>

					{/* Description */}
					<Card>
						<CardContent className='p-6'>
							<h3 className='font-semibold text-foreground mb-3'>
								Description
							</h3>
							<p className='text-muted-foreground leading-relaxed'>
								{product.description || 'No description available'}
							</p>
						</CardContent>
					</Card>

					{/* Meta Information */}
					<Card>
						<CardContent className='p-6'>
							<h3 className='font-semibold text-foreground mb-4'>
								Additional Information
							</h3>
							<div className='space-y-3'>
								<div className='flex items-center gap-3 text-sm'>
									<Calendar size={16} className='text-muted-foreground' />
									<span className='text-muted-foreground'>Created:</span>
									<span className='font-medium text-foreground'>
										{formatDate(product.createdAt)}
									</span>
								</div>
								<div className='flex items-center gap-3 text-sm'>
									<Calendar size={16} className='text-muted-foreground' />
									<span className='text-muted-foreground'>Updated:</span>
									<span className='font-medium text-foreground'>
										{formatDate(product.updatedAt)}
									</span>
								</div>
								{product.slug && (
									<div className='flex items-center gap-3 text-sm'>
										<Package size={16} className='text-muted-foreground' />
										<span className='text-muted-foreground'>Slug:</span>
										<code className='px-2 py-1 bg-muted rounded text-xs font-mono text-foreground'>
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
							<h2 className='text-2xl font-bold text-foreground'>
								Related Products
							</h2>
							<p className='text-muted-foreground mt-1'>
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
