import { createSlice, PayloadAction } from '@reduxjs/toolkit';

function getCookie(name: string) {
	if (typeof document === 'undefined') return null;
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	return match ? decodeURIComponent(match[2]) : null;
}

interface AuthState {
	token: string | null;
}

const initialState: AuthState = {
	token: typeof window !== 'undefined' ? getCookie('token') : null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setToken: (state, action: PayloadAction<string>) => {
			state.token = action.payload;
			if (typeof document !== 'undefined') {
				document.cookie = `token=${action.payload}; path=/; max-age=${
					60 * 60 * 24 * 7
				}; samesite=lax`;
			}
		},
		logout: (state) => {
			state.token = null;
			if (typeof document !== 'undefined') {
				document.cookie = `token=; path=/; max-age=0; samesite=lax`;
			}
		},
	},
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
