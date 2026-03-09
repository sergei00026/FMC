import { axiosBaseQuery } from '@/shared/api/axiosBaseQuery';
import { axiosClient } from '@/shared/api/axiosClient';

jest.mock('@/shared/api/axiosClient', () => ({
  axiosClient: {
    request: jest.fn(),
  },
  parseApiErrorMessage: (error: { message: string }) => error.message,
}));

const mockedRequest = axiosClient.request as jest.Mock;

describe('axiosBaseQuery', () => {
  beforeEach(() => {
    mockedRequest.mockReset();
  });

  it('adds bearer token to request headers', async () => {
    mockedRequest.mockResolvedValue({ data: [{ id: '1' }] });

    const baseQuery = axiosBaseQuery();
    const result = await baseQuery(
      { method: 'GET', url: '/tasks' },
      {
        getState: () => ({ auth: { token: 'jwt-token' } }),
      } as never,
      {} as never,
    );

    expect(result).toEqual({ data: [{ id: '1' }] });
    expect(mockedRequest).toHaveBeenCalledWith(
      expect.objectContaining({ headers: { Authorization: 'Bearer jwt-token' } }),
    );
  });

  it('returns normalized error for failed request', async () => {
    mockedRequest.mockRejectedValue({ message: 'network error', response: { status: 500 } });

    const baseQuery = axiosBaseQuery();
    const result = await baseQuery(
      { method: 'GET', url: '/tasks' },
      {
        getState: () => ({ auth: { token: null } }),
      } as never,
      {} as never,
    );

    expect(result).toEqual({
      error: {
        data: { message: 'network error' },
        status: 500,
      },
    });
  });
});
