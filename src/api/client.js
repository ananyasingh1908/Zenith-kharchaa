const BASE_URL = import.meta.env.VITE_API_URL || '';

export const isRealBackend = Boolean(BASE_URL);

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('kharcha_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed with status ${res.status}`);
  }

  return res.json();
}
