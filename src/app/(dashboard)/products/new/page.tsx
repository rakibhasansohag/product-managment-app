'use client';
import ProductForm from '@/components/product/productForm';
import { useCreateProductMutation } from '@/redux/features/productApi';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function NewProductPage() {
	const [create] = useCreateProductMutation();
	const router = useRouter();

	return (
		<div className='max-w-2xl'>
			<h2 className='text-xl font-semibold mb-4'>Create New Product</h2>
			<ProductForm
				onSubmit={async (payload) => {
					try {
						await create(payload).unwrap();
						toast.success('Product created');
						router.push('/products');
					} catch (e) {
						toast.error('Create failed');
					}
				}}
			/>
		</div>
	);
}
