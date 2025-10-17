import { api } from './apiSlice';
import type { Product, Category } from '@/types/product';

export const productApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getProducts: builder.query<
			Product[],
			{ offset?: number; limit?: number; categoryId?: string } | void
		>({
			query: (params) => {
				// params can be void
				const offset = params?.offset ?? 0;
				const limit = params?.limit ?? 10;
				const categoryId = params?.categoryId;

				const qp = new URLSearchParams();
				qp.set('offset', String(offset));
				qp.set('limit', String(limit));
				if (categoryId) qp.set('categoryId', categoryId);
				const qs = qp.toString();
				return `products${qs ? `?${qs}` : ''}`;
			},
			providesTags: (result) =>
				result
					? [
							...result.map((p) => ({ type: 'Product' as const, id: p.id })),
							{ type: 'Product', id: 'LIST' },
					  ]
					: [{ type: 'Product', id: 'LIST' }],
		}),

		searchProducts: builder.query<Product[], string>({
			query: (text) =>
				`products/search?searchedText=${encodeURIComponent(text)}`,
		}),

		getProductById: builder.query<Product, string>({
			query: (id) => `products/${id}`,
			providesTags: (result, error, id) => [{ type: 'Product', id }],
		}),

		getProductBySlug: builder.query<Product, string>({
			query: (slug) => `products/${slug}`,
		}),

		createProduct: builder.mutation<
			Product,
			Partial<Product & { categoryId?: string }>
		>({
			query: (body) => ({ url: 'products', method: 'POST', body }),
			invalidatesTags: [{ type: 'Product', id: 'LIST' }],
		}),

		updateProduct: builder.mutation<Product, Partial<Product> & { id: string }>(
			{
				query: ({ id, ...patch }) => ({
					url: `products/${id}`,
					method: 'PUT',
					body: patch,
				}),
				invalidatesTags: (res, err, { id }) => [
					{ type: 'Product', id },
					{ type: 'Product', id: 'LIST' },
				],
			},
		),

		deleteProduct: builder.mutation<{ id: string }, string>({
			query: (id) => ({ url: `products/${id}`, method: 'DELETE' }),
			invalidatesTags: (res, err, id) => [
				{ type: 'Product', id },
				{ type: 'Product', id: 'LIST' },
			],
		}),

		getCategories: builder.query<
			Category[],
			{ offset?: number; limit?: number } | void
		>({
			query: (params) => {
				const offset = params?.offset ?? 0;
				const limit = params?.limit ?? 20;
				return `categories?offset=${offset}&limit=${limit}`;
			},
			providesTags: ['Category'],
		}),
	}),
	overrideExisting: false,
});

export const {
	useGetProductsQuery,
	useSearchProductsQuery,
	useGetProductByIdQuery,
	useGetProductBySlugQuery,
	useCreateProductMutation,
	useUpdateProductMutation,
	useDeleteProductMutation,
	useGetCategoriesQuery,
} = productApi;
