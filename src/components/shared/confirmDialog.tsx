'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';
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
					<Dialog.Overlay className='fixed inset-0 bg-foreground/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' />

					<Dialog.Content className='z-60 relative w-full max-w-lg bg-card rounded-lg shadow-xl mx-4 md:mx-0 p-6 border border-border data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'>
						{/* Icon */}
						<div className='mb-4'>
							{intent === 'danger' ? (
								<div className='w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center'>
									<AlertTriangle className='text-destructive' size={24} />
								</div>
							) : (
								<div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
									<CheckCircle className='text-primary' size={24} />
								</div>
							)}
						</div>

						{/* Title and Description */}
						<Dialog.Title className='text-lg font-semibold text-foreground mb-2'>
							{title}
						</Dialog.Title>
						<Dialog.Description className='text-sm text-muted-foreground'>
							{description}
						</Dialog.Description>

						{/* Close button */}
						<button
							aria-label='Close'
							onClick={() => {
								onOpenChange(false);
								onCancel?.();
							}}
							className='absolute right-4 top-4 p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground'
							type='button'
						>
							<X size={18} />
						</button>

						{/* Actions */}
						<div className='mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3'>
							<Button
								variant='outline'
								onClick={() => {
									onOpenChange(false);
									onCancel?.();
								}}
								disabled={loading}
								className='w-full sm:w-auto hover:text-white hover:bg-black'
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
								variant={intent === 'danger' ? 'destructive' : 'default'}
								className='w-full sm:w-auto'
							>
								{loading ? (
									<>
										<div className='w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin mr-2'></div>
										Processing...
									</>
								) : (
									confirmLabel
								)}
							</Button>
						</div>
					</Dialog.Content>
				</div>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
