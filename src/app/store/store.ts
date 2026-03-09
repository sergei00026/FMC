import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '@/features/auth/model/authSlice';
import { taskManagerApi } from '@/shared/api/taskManagerApi';

export const createAppStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [taskManagerApi.reducerPath]: taskManagerApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(taskManagerApi.middleware);
    },
  });
};

export const appStore = createAppStore();

export type AppDispatch = typeof appStore.dispatch;
export type RootState = ReturnType<typeof appStore.getState>;
