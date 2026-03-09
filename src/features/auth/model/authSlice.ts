import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

import { clearStoredToken, setStoredToken } from '@/shared/lib/auth/tokenStorage';

interface IJwtPayload {
  exp?: number;
  id?: number | string;
  sub?: string;
}

interface IAuthState {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
}

const createStateFromToken = (token: string | null): IAuthState => {
  if (!token) {
    return {
      isAuthenticated: false,
      token: null,
      userId: null,
    };
  }

  try {
    const payload = jwtDecode<IJwtPayload>(token);
    const nowSeconds = Date.now() / 1000;

    if (payload.exp && payload.exp < nowSeconds) {
      return {
        isAuthenticated: false,
        token: null,
        userId: null,
      };
    }

    return {
      isAuthenticated: true,
      token,
      userId: payload.sub ?? (payload.id ? String(payload.id) : null),
    };
  } catch {
    return {
      isAuthenticated: false,
      token: null,
      userId: null,
    };
  }
};

const initialState: IAuthState = {
  isAuthenticated: false,
  token: null,
  userId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearSession: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userId = null;
      clearStoredToken();
    },
    hydrateSession: (state, action: PayloadAction<string | null>) => {
      const nextState = createStateFromToken(action.payload);
      state.isAuthenticated = nextState.isAuthenticated;
      state.token = nextState.token;
      state.userId = nextState.userId;

      if (nextState.token) {
        setStoredToken(nextState.token);
      } else {
        clearStoredToken();
      }
    },
  },
});

export const { clearSession, hydrateSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
export type { IAuthState };
