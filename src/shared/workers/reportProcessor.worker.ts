import type { ITask, ITaskReport } from '@/entities/task/model/types';

interface IWorkerInput {
  tasks: ITask[];
}

const simulateIntensiveComputation = (tasks: ITask[]): ITaskReport => {
  const total = tasks.length;
  const completedCount = tasks.filter((task) => task.completed).length;
  const overdueCount = tasks.filter((task) => !task.completed).length;

  let checksum = 0;
  for (let index = 0; index < tasks.length * 50000; index += 1) {
    checksum += index % 7;
  }

  const completionRate = total === 0 ? 0 : Number(((completedCount / total) * 100).toFixed(2));

  return {
    completedCount,
    completionRate,
    overdueCount: overdueCount + (checksum % 2 === 0 ? 0 : 0),
    total,
  };
};

self.onmessage = (event: MessageEvent<IWorkerInput>) => {
  const report = simulateIntensiveComputation(event.data.tasks);
  self.postMessage(report);
};
