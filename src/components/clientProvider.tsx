'use client';

import React from 'react';

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { Toaster } from 'react-hot-toast';

function ClientProvider({ children }: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			<Toaster position='top-right' />
			{children}
		</Provider>
	);
}

export default ClientProvider;
