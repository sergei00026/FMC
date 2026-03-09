export interface ITask {
  completed: boolean;
  description: string;
  id: string;
  title: string;
  updatedAt: string;
  userId: string;
}

export interface ICreateTaskDto {
  description: string;
  title: string;
  userId: string;
}

export interface IUpdateTaskDto {
  completed?: boolean;
  description?: string;
  id: string;
  title?: string;
}

export interface ITaskReport {
  completedCount: number;
  completionRate: number;
  overdueCount: number;
  total: number;
}
