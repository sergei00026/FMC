import type { ITaskReport } from '@/entities/task/model/types';
import { processReportInWorker } from '@/features/reports/lib/processReportInWorker';

class WorkerMock {
  public onerror: ((event: ErrorEvent) => void) | null = null;
  public onmessage: ((event: MessageEvent<ITaskReport>) => void) | null = null;

  public postMessage(): void {
    this.onmessage?.({
      data: {
        completedCount: 1,
        completionRate: 100,
        overdueCount: 0,
        total: 1,
      },
    } as MessageEvent<ITaskReport>);
  }

  public terminate(): void {}
}

describe('processReportInWorker', () => {
  it('returns report result from worker', async () => {
    Object.defineProperty(window, 'Worker', {
      writable: true,
      value: WorkerMock,
    });

    const report = await processReportInWorker([
      { id: '1', title: 'Task', description: 'Desc', completed: true, updatedAt: '', userId: '1' },
    ]);

    expect(report.total).toBe(1);
    expect(report.completedCount).toBe(1);
  });
});
