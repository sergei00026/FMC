'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { ThemeModeProvider } from '@/app/providers/ThemeModeProvider';
import { appStore } from '@/app/store/store';
import { hydrateSession } from '@/features/auth/model/authSlice';
import { getStoredToken } from '@/shared/lib/auth/tokenStorage';

interface IStoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider = ({ children }: IStoreProviderProps) => {
  useEffect(() => {
    appStore.dispatch(hydrateSession(getStoredToken()));
  }, []);

  return (
    <Provider store={appStore}>
      <ThemeModeProvider>
        {children}
        <ToastContainer position="bottom-right" />
      </ThemeModeProvider>
    </Provider>
  );
};
