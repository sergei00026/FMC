'use client';

import { Box, Stack, Typography } from '@mui/material';

import { useThemeMode } from '@/app/providers';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { clearSession } from '@/features/auth/model/authSlice';
import { LoginForm } from '@/features/auth/ui';
import { ReportPanel } from '@/features/reports/ui';
import { TaskList } from '@/features/tasks/ui';
import { Button } from '@/shared/ui/Button';
import { PageContainer } from '@/shared/ui/PageContainer';

export const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { mode, toggleMode } = useThemeMode();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <PageContainer sx={{ py: 6 }}>
        <Stack spacing={2}>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="outlined" onClick={toggleMode}>
              Тема: {mode === 'light' ? 'Светлая' : 'Тёмная'}
            </Button>
          </Box>
          <LoginForm />
        </Stack>
      </PageContainer>
    );
  }

  return (
    <PageContainer sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
          <Typography variant="h4">Task Manager</Typography>
          <Box display="flex" gap={1}>
            <Button variant="outlined" onClick={toggleMode}>
              Тема: {mode === 'light' ? 'Светлая' : 'Тёмная'}
            </Button>
            <Button variant="text" onClick={() => dispatch(clearSession())}>
              Sign out
            </Button>
          </Box>
        </Box>
        <TaskList />
        <ReportPanel />
      </Stack>
    </PageContainer>
  );
};
