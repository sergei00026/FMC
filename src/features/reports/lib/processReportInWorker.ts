import type { ITask, ITaskReport } from '@/entities/task/model/types';

export const processReportInWorker = (tasks: ITask[]): Promise<ITaskReport> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../../../shared/workers/reportProcessor.worker.ts', import.meta.url));

    worker.onmessage = (event: MessageEvent<ITaskReport>) => {
      resolve(event.data);
      worker.terminate();
    };

    worker.onerror = (error) => {
      reject(error);
      worker.terminate();
    };

    worker.postMessage({ tasks });
  });
};
