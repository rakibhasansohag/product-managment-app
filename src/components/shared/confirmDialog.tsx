'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

type ConfirmDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: React.ReactNode;
	description?: React.ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	intent?: 'danger' | 'default';
	loading?: boolean;
	onConfirm: () => Promise<void> | void;
	onCancel?: () => void;
};

export default function ConfirmDialog({
	open,
	onOpenChange,
	title = 'Confirm',
	description = 'Are you sure?',
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	intent = 'danger',
	loading = false,
	onConfirm,
	onCancel,
}: ConfirmDialogProps) {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<div className='fixed inset-0 z-50 flex items-end md:items-center justify-center'>
					<Dialog.Overlay className='fixed inset-0 bg-black/40 backdrop-blur-sm' />

					<Dialog.Content className='z-60 relative w-full max-w-lg bg-white rounded-lg shadow-xl mx-4 md:mx-0 p-6'>
						{/* make title and description direct children of Dialog.Content */}
						<Dialog.Title className='text-lg font-medium text-slate-900'>
							{title}
						</Dialog.Title>
						<Dialog.Description className='text-sm text-slate-600 mt-1'>
							{description}
						</Dialog.Description>

						{/* close button */}
						<button
							aria-label='Close'
							onClick={() => {
								onOpenChange(false);
								onCancel?.();
							}}
							className='absolute right-3 top-3 p-1 rounded hover:bg-gray-100'
							type='button'
						>
							<X size={16} />
						</button>

						{/* actions */}
						<div className='mt-6 flex justify-end gap-3'>
							<Button
								variant='ghost'
								onClick={() => {
									onOpenChange(false);
									onCancel?.();
								}}
								disabled={loading}
							>
								{cancelLabel}
							</Button>

							<Button
								onClick={async () => {
									try {
										await onConfirm();
									} finally {
										onOpenChange(false);
									}
								}}
								disabled={loading}
								className={
									intent === 'danger'
										? 'bg-red-600 hover:bg-red-700 text-white'
										: ''
								}
							>
								{loading ? 'Processing...' : confirmLabel}
							</Button>
						</div>
					</Dialog.Content>
				</div>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
