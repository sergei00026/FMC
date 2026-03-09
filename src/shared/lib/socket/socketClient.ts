import { io, type Socket } from 'socket.io-client';

import { SOCKET_URL } from '@/shared/config/env';

let socketClient: Socket | null = null;

export const getSocketClient = (token?: string): Socket | null => {
  if (!SOCKET_URL) {
    return null;
  }

  if (!socketClient) {
    socketClient = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket'],
    });
  }

  if (token) {
    socketClient.auth = { token };
  }

  return socketClient;
};

export const closeSocketClient = (): void => {
  if (!socketClient) {
    return;
  }

  socketClient.disconnect();
  socketClient = null;
};
