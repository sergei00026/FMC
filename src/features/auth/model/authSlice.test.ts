import { clearSession, hydrateSession } from '@/features/auth/model/authSlice';
import { createAppStore } from '@/app/store/store';

const createToken = (payload: Record<string, unknown>): string => {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `header.${encodedPayload}.signature`;
};

describe('authSlice', () => {
  it('hydrates valid jwt token and stores user id from sub', () => {
    const store = createAppStore();
    const token = createToken({ exp: Math.floor(Date.now() / 1000) + 60, sub: 'user-1' });

    store.dispatch(hydrateSession(token));

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.userId).toBe('user-1');
    expect(state.token).toBe(token);
  });

  it('hydrates valid jwt token and stores user id from id claim', () => {
    const store = createAppStore();
    const token = createToken({ exp: Math.floor(Date.now() / 1000) + 60, id: 15 });

    store.dispatch(hydrateSession(token));

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(true);
    expect(state.userId).toBe('15');
  });

  it('does not authenticate expired token', () => {
    const store = createAppStore();
    const token = createToken({ exp: Math.floor(Date.now() / 1000) - 60, sub: 'user-2' });

    store.dispatch(hydrateSession(token));

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.userId).toBeNull();
  });

  it('clears session', () => {
    const store = createAppStore();
    const token = createToken({ exp: Math.floor(Date.now() / 1000) + 60, sub: 'user-2' });

    store.dispatch(hydrateSession(token));
    store.dispatch(clearSession());

    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.userId).toBeNull();
  });
});
