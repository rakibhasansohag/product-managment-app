/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useGetCategoriesQuery } from '@/redux/features/productApi';
import toast from 'react-hot-toast';
import type { Category } from '@/types/product';
import Image from 'next/image';

const schema = z.object({
	name: z.string().min(1, 'Name required'),
	description: z.string().min(1, 'Description required'),
	price: z.number().gt(0, 'Price must be greater than 0'),
	categoryId: z.string().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

export default function ProductForm({
	defaultValues,
	onSubmit,
	submitLabel = 'Save',
}: {
	defaultValues?: Partial<FormValues & { images?: string[] }>;
	onSubmit: (payload: any) => Promise<void>;
	submitLabel?: string;
}) {
	const { data: categories } = useGetCategoriesQuery({});
	const fileRef = useRef<HTMLInputElement | null>(null);
	const [preview, setPreview] = useState<string | null>(
		defaultValues?.images?.[0] ?? null,
	);
	const [uploading, setUploading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: defaultValues?.name ?? '',
			description: defaultValues?.description ?? '',
			price: defaultValues?.price ?? 0,
			categoryId: defaultValues?.categoryId ?? '',
		},
	});

	const handleFileUpload = async (file?: File) => {
		if (!file) return null;
		setUploading(true);
		try {
			const url = await uploadToCloudinary(file);
			setPreview(url);
			setUploading(false);
			return url;
		} catch (err) {
			setUploading(false);
			toast.error('Upload failed');
			return null;
		}
	};

	const submit = handleSubmit(async (values) => {
		const files = fileRef.current?.files;
		let imageUrl = preview;
		if (files && files.length > 0) {
			const uploaded = await handleFileUpload(files[0]);
			if (uploaded) imageUrl = uploaded;
		}

		const payload = {
			name: values.name,
			description: values.description,
			price: Number(values.price),
			images: imageUrl ? [imageUrl] : defaultValues?.images ?? [],
			categoryId: values.categoryId || undefined,
		};

		await onSubmit(payload);
	});

	return (
		<form onSubmit={submit} className='space-y-4'>
			<div>
				<label className='block text-sm'>Name</label>
				<input
					{...register('name')}
					className='w-full border rounded px-3 py-2'
				/>
				{errors.name && (
					<p className='text-red-500 text-sm'>{errors.name.message}</p>
				)}
			</div>

			<div>
				<label className='block text-sm'>Description</label>
				<textarea
					{...register('description')}
					rows={4}
					className='w-full border rounded px-3 py-2'
				/>
				{errors.description && (
					<p className='text-red-500 text-sm'>{errors.description.message}</p>
				)}
			</div>

			<div>
				<label className='block text-sm'>Price</label>
				<input
					type='number'
					{...register('price', { valueAsNumber: true })}
					className='w-full border rounded px-3 py-2'
				/>
				{errors.price && (
					<p className='text-red-500 text-sm'>{errors.price.message as any}</p>
				)}
			</div>

			<div>
				<label className='block text-sm'>Category</label>
				<select
					{...register('categoryId')}
					className='w-full border rounded px-3 py-2'
				>
					<option value=''>Select</option>
					{categories?.map((c: Category) => (
						<option key={c.id} value={c.id}>
							{c.name}
						</option>
					))}
				</select>
			</div>

			<div>
				<label className='block text-sm'>Image</label>
				<input
					ref={fileRef}
					id='imageFile'
					type='file'
					accept='image/*'
					className='mt-1'
				/>
				{preview && (
					<Image
						width={500}
						height={500}
						src={preview}
						className='mt-2 w-40 h-24 object-cover rounded'
						alt='preview'
					/>
				)}
			</div>

			<div className='flex items-center gap-2'>
				<button
					type='submit'
					className='px-4 py-2 rounded bg-blue-600 text-white'
				>
					{uploading ? 'Uploading...' : submitLabel}
				</button>
			</div>
		</form>
	);
}
