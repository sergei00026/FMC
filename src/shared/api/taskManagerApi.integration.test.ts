import { createAppStore } from '@/app/store/store';
import { hydrateSession } from '@/features/auth/model/authSlice';
import { taskManagerApi } from '@/shared/api/taskManagerApi';
import { axiosClient } from '@/shared/api/axiosClient';

jest.mock('@/shared/api/axiosClient', () => ({
  axiosClient: {
    request: jest.fn(),
  },
  parseApiErrorMessage: (error: Error) => error.message,
}));

const mockedRequest = axiosClient.request as jest.Mock;

const createToken = (exp: number, sub: string): string => {
  const payload = Buffer.from(JSON.stringify({ exp, sub })).toString('base64url');
  return `header.${payload}.signature`;
};

describe('taskManagerApi caching and invalidation', () => {
  beforeEach(() => {
    mockedRequest.mockReset();
  });

  it('caches GET tasks and avoids duplicate requests while cache is valid', async () => {
    const store = createAppStore();
    store.dispatch(hydrateSession(createToken(Math.floor(Date.now() / 1000) + 60, '1')));

    mockedRequest.mockResolvedValue({
      data: {
        todos: [{ completed: false, id: 1, todo: 'A', userId: 1 }],
      },
    });

    const firstResult = await store.dispatch(taskManagerApi.endpoints.getTasks.initiate()).unwrap();
    const secondResult = await store.dispatch(taskManagerApi.endpoints.getTasks.initiate()).unwrap();

    expect(firstResult).toHaveLength(1);
    expect(secondResult).toHaveLength(1);
    expect(mockedRequest).toHaveBeenCalledTimes(1);
  });

  it('invalidates tasks cache after update mutation and refetches list', async () => {
    const store = createAppStore();
    store.dispatch(hydrateSession(createToken(Math.floor(Date.now() / 1000) + 60, '1')));

    mockedRequest
      .mockResolvedValueOnce({
        data: {
          todos: [{ completed: false, id: 1, todo: 'Initial', userId: 1 }],
        },
      })
      .mockResolvedValueOnce({ data: { completed: true, id: 1, todo: 'Initial', userId: 1 } })
      .mockResolvedValueOnce({
        data: {
          todos: [{ completed: true, id: 1, todo: 'Initial', userId: 1 }],
        },
      });

    const activeSubscription = store.dispatch(taskManagerApi.endpoints.getTasks.initiate());
    await activeSubscription.unwrap();

    await store.dispatch(taskManagerApi.endpoints.updateTask.initiate({ id: '1', completed: true })).unwrap();

    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    expect(mockedRequest).toHaveBeenCalledTimes(3);

    activeSubscription.unsubscribe();
  });
});
