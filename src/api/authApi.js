import { request, isRealBackend } from './client';
import { mockStore, getInitialUser } from './mockStore';

export async function login({ email, password }) {
  if (isRealBackend) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) mockStore.setToken(data.token);
    return data;
  }

  await new Promise(r => setTimeout(r, 200));
  const user = {
    id: 'user-demo',
    name: email.split('@')[0] || 'Ananya',
    email,
    avatarUrl: '',
    role: 'Mindful Spender',
  };
  mockStore.setUser(user);
  mockStore.setToken('mock-auth-token-' + Date.now());
  return { user, token: mockStore.getToken() };
}

export async function signup({ name, email, password }) {
  if (isRealBackend) {
    const data = await request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (data.token) mockStore.setToken(data.token);
    return data;
  }

  await new Promise(r => setTimeout(r, 200));
  const user = {
    id: 'user-' + Date.now(),
    name: name || 'Mindful Spender',
    email,
    avatarUrl: '',
    role: 'Mindful Spender',
  };
  mockStore.setUser(user);
  mockStore.setToken('mock-auth-token-' + Date.now());
  const currentSettings = mockStore.getSettings();
  mockStore.setSettings({ ...currentSettings, onboarded: false });
  return { user, token: mockStore.getToken() };
}

export async function getMe() {
  if (isRealBackend) {
    return request('/me');
  }

  await new Promise(r => setTimeout(r, 100));
  const user = mockStore.getUser();
  return { user: user || getInitialUser() };
}

export async function logout() {
  mockStore.setToken(null);
  return { success: true };
}
