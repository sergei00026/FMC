import axios, { type AxiosError } from 'axios';

import { API_BASE_URL } from '@/shared/config/env';

export interface IApiErrorResponse {
  message?: string;
}

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const parseApiErrorMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<IApiErrorResponse>;
  return axiosError.response?.data?.message ?? axiosError.message ?? 'Unexpected error';
};
