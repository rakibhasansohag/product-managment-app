'use client';
import ProductForm from '@/components/product/productForm';
import { useCreateProductMutation } from '@/redux/features/productApi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NewProductPage() {
	const [create] = useCreateProductMutation();
	const router = useRouter();

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex items-center gap-4'>
				<Button variant='ghost' size='icon' asChild>
					<Link href='/products'>
						<ArrowLeft />
					</Link>
				</Button>
				<div>
					<h1 className='text-3xl font-bold text-slate-800'>
						Create New Product
					</h1>
					<p className='text-slate-500 mt-1'>
						Add a new product to your inventory
					</p>
				</div>
			</div>

			{/* Form */}
			<div className='max-w-7xl'>
				<ProductForm
					onSubmit={async (payload) => {
						try {
							const result = await create(payload).unwrap();
							toast.success('Product created successfully!');
							router.push('/products');
						} catch (error) {
							console.error('Create error:', error);
							toast.error('Failed to create product');
						}
					}}
					submitLabel='Create Product'
				/>
			</div>
		</div>
	);
}
