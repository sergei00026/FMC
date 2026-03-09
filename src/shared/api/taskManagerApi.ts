import { createApi } from '@reduxjs/toolkit/query/react';

import type { ICreateTaskDto, ITask, IUpdateTaskDto } from '@/entities/task/model/types';
import { TASKS_CACHE_TTL_SECONDS } from '@/shared/config/env';
import { axiosBaseQuery } from '@/shared/api/axiosBaseQuery';
import type { RootState } from '@/app/store/store';

interface ILoginRequest {
  password: string;
  username: string;
}

interface ILoginResponse {
  accessToken: string;
  email: string;
  firstName: string;
  id: number;
  image: string;
  lastName: string;
  refreshToken?: string;
  username: string;
}

interface IRegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  username: string;
}

interface IRegisterResponse {
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  username: string;
}

interface IDummyTodo {
  completed: boolean;
  id: number;
  todo: string;
  userId: number;
}

interface IDummyTodosResponse {
  todos: IDummyTodo[];
}

interface IRequestReportResponse {
  requestId: string;
  status: 'pending';
}

const mapTodoToTask = (todo: IDummyTodo): ITask => {
  return {
    completed: todo.completed,
    description: '',
    id: String(todo.id),
    title: todo.todo,
    updatedAt: new Date().toISOString(),
    userId: String(todo.userId),
  };
};

export const taskManagerApi = createApi({
  baseQuery: axiosBaseQuery(),
  keepUnusedDataFor: TASKS_CACHE_TTL_SECONDS,
  reducerPath: 'taskManagerApi',
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    createTask: builder.mutation<ITask, ICreateTaskDto>({
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
      query: (payload) => ({
        data: {
          completed: false,
          todo: payload.title,
          userId: Number(payload.userId),
        },
        method: 'POST',
        url: '/todos/add',
      }),
      transformResponse: (response: IDummyTodo) => mapTodoToTask(response),
    }),
    deleteTask: builder.mutation<{ success: boolean }, string>({
      invalidatesTags: (_result, _error, taskId) => [
        { type: 'Task', id: 'LIST' },
        { type: 'Task', id: taskId },
      ],
      query: (taskId) => ({
        method: 'DELETE',
        url: `/todos/${taskId}`,
      }),
      transformResponse: () => ({ success: true }),
    }),
    getTasks: builder.query<ITask[], void>({
      providesTags: (result) => {
        if (!result) {
          return [{ type: 'Task', id: 'LIST' }];
        }

        return [
          ...result.map((task) => ({ type: 'Task' as const, id: task.id })),
          { type: 'Task' as const, id: 'LIST' },
        ];
      },
      queryFn: async (_arg, api, _extraOptions, baseQuery) => {
        const state = api.getState() as RootState;
        const userId = state.auth.userId;

        if (!userId) {
          return { data: [] as ITask[] };
        }

        const result = await baseQuery({
          method: 'GET',
          url: `/todos/user/${userId}`,
        });

        if (result.error) {
          return {
            error: result.error,
          };
        }

        const payload = result.data as IDummyTodosResponse;
        return {
          data: payload.todos.map((todo) => mapTodoToTask(todo)),
        };
      },
    }),
    login: builder.mutation<ILoginResponse, ILoginRequest>({
      query: (payload) => ({
        data: {
          ...payload,
          expiresInMins: 60,
        },
        method: 'POST',
        url: '/auth/login',
      }),
    }),
    register: builder.mutation<IRegisterResponse, IRegisterRequest>({
      query: (payload) => ({
        data: payload,
        method: 'POST',
        url: '/users/add',
      }),
    }),
    requestReport: builder.mutation<IRequestReportResponse, void>({
      queryFn: async () => {
        return {
          data: {
            requestId: `dummy-${Date.now()}`,
            status: 'pending',
          },
        };
      },
    }),
    updateTask: builder.mutation<ITask, IUpdateTaskDto>({
      invalidatesTags: (_result, _error, payload) => [
        { type: 'Task', id: payload.id },
        { type: 'Task', id: 'LIST' },
      ],
      query: ({ id, ...patch }) => ({
        data: {
          completed: patch.completed,
          todo: patch.title,
        },
        method: 'PUT',
        url: `/todos/${id}`,
      }),
      transformResponse: (response: IDummyTodo) => mapTodoToTask(response),
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useLoginMutation,
  useRegisterMutation,
  useRequestReportMutation,
  useUpdateTaskMutation,
} = taskManagerApi;

export type { ILoginRequest, ILoginResponse, IRegisterRequest, IRegisterResponse, IRequestReportResponse };
