import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

function getCookieServerSafe() {
	if (typeof document !== 'undefined') {
		const match = document.cookie.match(
			new RegExp('(^| )' + 'token' + '=([^;]+)'),
		);
		return match ? decodeURIComponent(match[2]) : null;
	}
	return null;
}

export const api = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl:
			process.env.NEXT_PUBLIC_API_URL ??
			'https://68f24e96b36f9750deec2e73.mockapi.io/api/v1',
		prepareHeaders: (headers, { getState }) => {
			const tokenFromState = (getState() as RootState).auth.token;
			const token = tokenFromState ?? getCookieServerSafe();
			if (token) headers.set('Authorization', `Bearer ${token}`);
			headers.set('Content-Type', 'application/json');
			return headers;
		},
	}),
	tagTypes: ['Product', 'Category'],
	endpoints: () => ({}),
});
