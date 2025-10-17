import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import { api } from './features/apiSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		[api.reducerPath]: api.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(api.middleware),
	devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
