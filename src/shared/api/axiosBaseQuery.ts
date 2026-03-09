import type { AxiosRequestConfig, Method } from 'axios';
import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';

import { axiosClient, parseApiErrorMessage } from '@/shared/api/axiosClient';
import type { RootState } from '@/app/store/store';

interface IAxiosBaseQueryArgs {
  data?: unknown;
  method: Method;
  params?: Record<string, unknown>;
  url: string;
}

interface IAxiosBaseQueryError {
  status?: number;
  data: {
    message: string;
  };
}

export const axiosBaseQuery = (): BaseQueryFn<IAxiosBaseQueryArgs, unknown, IAxiosBaseQueryError> => {
  return async (args, api) => {
    const state = api.getState() as RootState;
    const token = state.auth.token;

    const config: AxiosRequestConfig = {
      data: args.data,
      method: args.method,
      params: args.params,
      url: args.url,
    };

    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const result = await axiosClient.request(config);
      return { data: result.data };
    } catch (error: unknown) {
      const message = parseApiErrorMessage(error);
      const status = (error as { response?: { status?: number } }).response?.status;

      return {
        error: {
          data: { message },
          status,
        },
      };
    }
  };
};
