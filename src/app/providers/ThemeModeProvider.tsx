'use client';

import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme, type PaletteMode } from '@mui/material/styles';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface IThemeModeProviderProps {
  children: React.ReactNode;
}

interface IThemeModeContextValue {
  mode: PaletteMode;
  toggleMode: () => void;
}

const THEME_MODE_STORAGE_KEY = 'task_manager_theme_mode';

const ThemeModeContext = createContext<IThemeModeContextValue | null>(null);

export const ThemeModeProvider = ({ children }: IThemeModeProviderProps) => {
  const [mode, setMode] = useState<PaletteMode>('light');

  useEffect(() => {
    const applyMode = (nextMode: PaletteMode): void => {
      window.setTimeout(() => {
        setMode(nextMode);
      }, 0);
    };

    const storedMode = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);

    if (storedMode === 'light' || storedMode === 'dark') {
      applyMode(storedMode);
      return;
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyMode('dark');
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
  }, [mode]);

  const toggleMode = (): void => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
      },
    });
  }, [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = (): IThemeModeContextValue => {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }

  return context;
};
