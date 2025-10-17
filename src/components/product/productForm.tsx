/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useGetCategoriesQuery } from '@/redux/features/productApi';
import toast from 'react-hot-toast';
import type { Category } from '@/types/product';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';

const schema = z.object({
	name: z.string().min(1, 'Product name is required'),
	description: z.string().min(10, 'Description must be at least 10 characters'),
	price: z.number().gt(0, 'Price must be greater than 0'),
	categoryId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ProductForm({
	defaultValues,
	onSubmit,
	submitLabel = 'Create Product',
}: {
	defaultValues?: Partial<FormValues & { images?: string[] }>;
	onSubmit: (payload: any) => Promise<void>;
	submitLabel?: string;
}) {
	const { data: categories, isLoading: categoriesLoading } =
		useGetCategoriesQuery({});
	const fileRef = useRef<HTMLInputElement | null>(null);
	const [preview, setPreview] = useState<string | null>(
		defaultValues?.images?.[0] ?? null,
	);
	const [uploading, setUploading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: defaultValues?.name ?? '',
			description: defaultValues?.description ?? '',
			price: defaultValues?.price ?? 0,
			categoryId: defaultValues?.categoryId ?? '',
		},
	});

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			toast.error('Please select an image file');
			return;
		}

		// Validate file size (5MB max)
		if (file.size > 5 * 1024 * 1024) {
			toast.error('Image size must be less than 5MB');
			return;
		}

		setUploading(true);
		try {
			const url = await uploadToCloudinary(file);
			setPreview(url);
			toast.success('Image uploaded successfully');
		} catch (err) {
			toast.error('Failed to upload image');
		} finally {
			setUploading(false);
		}
	};

	const removeImage = () => {
		setPreview(null);
		if (fileRef.current) {
			fileRef.current.value = '';
		}
	};

	const submit = handleSubmit(async (values) => {
		setIsSubmitting(true);
		try {
			const payload = {
				name: values.name,
				description: values.description,
				price: Number(values.price),
				images: preview ? [preview] : defaultValues?.images ?? [],
				categoryId: values.categoryId || undefined,
			};

			await onSubmit(payload);
		} catch (error) {
			console.error('Form submission error:', error);
		} finally {
			setIsSubmitting(false);
		}
	});

	return (
		<form onSubmit={submit} className='space-y-6'>
			{/* Basic Information Card */}
			<Card>
				<CardHeader>
					<CardTitle>Basic Information</CardTitle>
					<CardDescription>
						Enter the essential details about your product
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{/* Product Name */}
					<div className='space-y-2'>
						<Label htmlFor='name'>
							Product Name <span className='text-red-500'>*</span>
						</Label>
						<Input
							{...register('name')}
							id='name'
							placeholder='e.g., Wireless Headphones'
							disabled={isSubmitting}
						/>
						{errors.name && (
							<p className='text-sm text-red-600'>{errors.name.message}</p>
						)}
					</div>

					{/* Description */}
					<div className='space-y-2'>
						<Label htmlFor='description'>
							Description <span className='text-red-500'>*</span>
						</Label>
						<Textarea
							{...register('description')}
							id='description'
							placeholder='Describe your product in detail...'
							rows={5}
							disabled={isSubmitting}
						/>
						{errors.description && (
							<p className='text-sm text-red-600'>
								{errors.description.message}
							</p>
						)}
					</div>

					{/* Price and Category Row */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{/* Price */}
						<div className='space-y-2'>
							<Label htmlFor='price'>
								Price (৳) <span className='text-red-500'>*</span>
							</Label>
							<Input
								{...register('price', { valueAsNumber: true })}
								id='price'
								type='number'
								step='0.01'
								min='0'
								placeholder='0.00'
								disabled={isSubmitting}
							/>
							{errors.price && (
								<p className='text-sm text-red-600'>{errors.price.message}</p>
							)}
						</div>

						{/* Category */}
						<div className='space-y-2'>
							<Label htmlFor='category'>Category</Label>
							<Controller
								name='categoryId'
								control={control}
								render={({ field }) => (
									<Select
										value={field.value}
										onValueChange={field.onChange}
										disabled={isSubmitting || categoriesLoading}
									>
										<SelectTrigger className='w-full'>
											<SelectValue placeholder='Select a category' />
										</SelectTrigger>
										<SelectContent>
											{categoriesLoading ? (
												<SelectItem value='loading' disabled>
													Loading categories...
												</SelectItem>
											) : categories && categories.length > 0 ? (
												categories.map((c: Category) => (
													<SelectItem key={c.id} value={c.id}>
														{c.name}
													</SelectItem>
												))
											) : (
												<SelectItem value='no-categories' disabled>
													No categories available
												</SelectItem>
											)}
										</SelectContent>
									</Select>
								)}
							/>
							{errors.categoryId && (
								<p className='text-sm text-red-600'>
									{errors.categoryId.message}
								</p>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Product Image Card */}
			<Card>
				<CardHeader>
					<CardTitle>Product Image</CardTitle>
					<CardDescription>
						Upload a high-quality image of your product (Max 5MB)
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{/* Image Upload Area */}
						{!preview ? (
							<div
								onClick={() => fileRef.current?.click()}
								className='border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer group'
							>
								<div className='flex flex-col items-center gap-3'>
									<div className='w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors'>
										{uploading ? (
											<Loader2
												className='text-blue-600 animate-spin'
												size={32}
											/>
										) : (
											<Upload
												className='text-slate-400 group-hover:text-blue-600'
												size={32}
											/>
										)}
									</div>
									<div>
										<p className='font-medium text-slate-700'>
											{uploading ? 'Uploading...' : 'Click to upload image'}
										</p>
										<p className='text-sm text-slate-500 mt-1'>
											PNG, JPG or WEBP (Max 5MB)
										</p>
									</div>
								</div>
								<input
									ref={fileRef}
									type='file'
									accept='image/*'
									onChange={handleFileChange}
									className='hidden'
									disabled={uploading || isSubmitting}
								/>
							</div>
						) : (
							<div className='relative rounded-lg overflow-hidden border border-slate-200'>
								<Image
									width={500}
									height={300}
									src={preview}
									className='w-full h-64 object-cover'
									alt='Product preview'
								/>
								<button
									type='button'
									onClick={removeImage}
									disabled={isSubmitting}
									className='absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50 cursor-pointer'
								>
									<X size={18} />
								</button>
							</div>
						)}

						{/* Change Image Button */}
						{preview && (
							<Button
								type='button'
								variant='outline'
								onClick={() => fileRef.current?.click()}
								disabled={uploading || isSubmitting}
								className='w-full'
							>
								<ImageIcon />
								Change Image
							</Button>
						)}
						<input
							ref={fileRef}
							type='file'
							accept='image/*'
							onChange={handleFileChange}
							className='hidden'
							disabled={uploading || isSubmitting}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Form Actions */}
			<div className='flex items-center gap-3 justify-end'>
				<Button
					type='button'
					variant='outline'
					onClick={() => window.history.back()}
					disabled={isSubmitting || uploading}
				>
					Cancel
				</Button>
				<Button type='submit' disabled={isSubmitting || uploading}>
					{isSubmitting ? (
						<>
							<Loader2 className='animate-spin' />
							Saving...
						</>
					) : uploading ? (
						<>
							<Loader2 className='animate-spin' />
							Uploading...
						</>
					) : (
						submitLabel
					)}
				</Button>
			</div>
		</form>
	);
}
