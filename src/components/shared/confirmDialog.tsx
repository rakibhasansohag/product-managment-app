'use client';
import React from 'react';

export default function ConfirmDialog({
	open,
	title,
	message,
	onCancel,
	onConfirm,
}: {
	open: boolean;
	title?: string;
	message?: string;
	onCancel: () => void;
	onConfirm: () => void;
}) {
	if (!open) return null;
	return (
		<div className='fixed inset-0 z-40 flex items-center justify-center bg-black/40'>
			<div className='bg-white p-6 rounded shadow max-w-md w-full'>
				<h3 className='font-semibold text-lg'>{title ?? 'Confirm'}</h3>
				<p className='mt-2 text-sm text-gray-600'>
					{message ?? 'Are you sure?'}
				</p>
				<div className='mt-4 flex justify-end gap-2'>
					<button onClick={onCancel} className='px-4 py-2 rounded border'>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className='px-4 py-2 rounded bg-red-600 text-white'
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
}
