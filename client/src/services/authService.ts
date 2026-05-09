const API = import.meta.env.VITE_API_URL ?? '';

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

export async function login(email: string, password: string): Promise<{ token: string; user: import('../types').User }> {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await parseJson<{ token?: string; user?: import('../types').User; message?: string }>(res);
  if (!res.ok) throw new Error(data.message ?? 'Login failed');
  if (!data.token || !data.user) throw new Error('Invalid response');
  return { token: data.token, user: data.user };
}

export async function register(
  email: string,
  password: string,
  name: string
): Promise<{ token: string; user: import('../types').User }> {
  const res = await fetch(`${API}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  const data = await parseJson<{ token?: string; user?: import('../types').User; message?: string }>(res);
  if (!res.ok) throw new Error(data.message ?? 'Registration failed');
  if (!data.token || !data.user) throw new Error('Invalid response');
  return { token: data.token, user: data.user };
}

export async function fetchMe(token: string): Promise<{ user: import('../types').User }> {
  const res = await fetch(`${API}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await parseJson<{ user?: import('../types').User; message?: string }>(res);
  if (!res.ok) throw new Error(data.message ?? 'Failed to load profile');
  if (!data.user) throw new Error('Invalid response');
  return { user: data.user };
}
