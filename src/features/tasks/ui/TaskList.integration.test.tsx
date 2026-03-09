import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';

import { createAppStore } from '@/app/store/store';
import { hydrateSession } from '@/features/auth/model/authSlice';
import { TaskList } from '@/features/tasks/ui/TaskList';
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

describe('TaskList integration', () => {
  beforeEach(() => {
    mockedRequest.mockReset();
  });

  it('renders tasks and creates new task', async () => {
    mockedRequest
      .mockResolvedValueOnce({
        data: {
          todos: [{ completed: false, id: 1, todo: 'Initial task', userId: 1 }],
        },
      })
      .mockResolvedValueOnce({ data: { completed: false, id: 2, todo: 'Created task', userId: 1 } })
      .mockResolvedValueOnce({
        data: {
          todos: [
            { completed: false, id: 1, todo: 'Initial task', userId: 1 },
            { completed: false, id: 2, todo: 'Created task', userId: 1 },
          ],
        },
      });

    const store = createAppStore();
    store.dispatch(hydrateSession(createToken(Math.floor(Date.now() / 1000) + 60, '1')));

    render(
      <Provider store={store}>
        <TaskList />
      </Provider>,
    );

    expect(await screen.findByText('Initial task')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Created task' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Created desc' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add task' }));

    await waitFor(() => {
      expect(screen.getByText('Created task')).toBeInTheDocument();
    });
  });
});
