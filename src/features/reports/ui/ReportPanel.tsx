'use client';

import { Alert, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useAppSelector } from '@/app/store/hooks';
import type { ITask, ITaskReport } from '@/entities/task/model/types';
import { processReportInWorker } from '@/features/reports/lib/processReportInWorker';
import { useGetTasksQuery, useRequestReportMutation } from '@/shared/api/taskManagerApi';
import { getSocketClient } from '@/shared/lib/socket/socketClient';
import { Button } from '@/shared/ui/Button';

interface IReportReadyPayload {
  requestId: string;
  tasks: ITask[];
}

export const ReportPanel = () => {
  const token = useAppSelector((state) => state.auth.token);
  const { data: tasks = [] } = useGetTasksQuery();
  const [requestId, setRequestId] = useState<string | null>(null);
  const [report, setReport] = useState<ITaskReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [requestReport, { isLoading }] = useRequestReportMutation();

  useEffect(() => {
    if (!token) {
      return;
    }

    const socket = getSocketClient(token);

    if (!socket) {
      return;
    }

    const handleReportReady = async (payload: IReportReadyPayload): Promise<void> => {
      if (requestId && payload.requestId !== requestId) {
        return;
      }

      try {
        const nextReport = await processReportInWorker(payload.tasks);
        setReport(nextReport);
        setErrorMessage(null);
        toast.success('Отчёт готов');
      } catch {
        setErrorMessage('Не удалось обработать отчёт в worker');
      }
    };

    const handleConnectError = (): void => {
      setErrorMessage('WebSocket недоступен. Используется локальная обработка отчёта.');
    };

    socket.on('report:ready', handleReportReady);
    socket.on('connect_error', handleConnectError);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('report:ready', handleReportReady);
      socket.off('connect_error', handleConnectError);
    };
  }, [requestId, token]);

  const handleGenerateReport = async (): Promise<void> => {
    setErrorMessage(null);

    try {
      const response = await requestReport().unwrap();
      setRequestId(response.requestId);

      const socket = getSocketClient(token ?? undefined);

      if (!socket) {
        const localReport = await processReportInWorker(tasks);
        setReport(localReport);
        toast.info('Отчёт сформирован локально (без WebSocket)');
        return;
      }

      toast.info('Запрос на отчёт отправлен. Ожидание websocket-события...');
    } catch {
      setErrorMessage('Не удалось запросить генерацию отчёта');
      toast.error('Ошибка запроса отчёта');
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Генерация отчёта</Typography>
        <Button variant="outlined" onClick={handleGenerateReport} disabled={isLoading}>
          {isLoading ? 'Запрос...' : 'Сформировать отчёт'}
        </Button>

        {requestId ? <Typography>Request id: {requestId}</Typography> : null}
        {errorMessage ? <Alert severity="warning">{errorMessage}</Alert> : null}

        {report ? (
          <Stack spacing={1}>
            <Typography>Total: {report.total}</Typography>
            <Typography>Completed: {report.completedCount}</Typography>
            <Typography>Overdue: {report.overdueCount}</Typography>
            <Typography>Completion rate: {report.completionRate}%</Typography>
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
};
