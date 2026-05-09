import type { Job, JobStats } from '../types';

const API = import.meta.env.VITE_API_URL ?? '';

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

export async function listJobs(token: string): Promise<Job[]> {
  const res = await fetch(`${API}/api/jobs`, { headers: authHeaders(token) });
  const data = await parseJson<{ jobs?: Job[]; message?: string }>(res);
  if (!res.ok) throw new Error(data.message ?? 'Failed to load jobs');
  return data.jobs ?? [];
}

export async function getJob(token: string, id: number): Promise<Job> {
  const res = await fetch(`${API}/api/jobs/${id}`, { headers: authHeaders(token) });
  const data = await parseJson<{ job?: Job; message?: string }>(res);
  if (!res.ok) throw new Error(data.message ?? 'Failed to load job');
  if (!data.job) throw new Error('Invalid response');
  return data.job;
}

export async function createJob(token: string, payload: Partial<Job>): Promise<Job> {
  const res = await fetch(`${API}/api/jobs`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await parseJson<{ job?: Job; message?: string }>(res);
  if (!res.ok) throw new Error(data.message ?? 'Failed to create job');
  if (!data.job) throw new Error('Invalid response');
  return data.job;
}

export async function updateJob(token: string, id: number, payload: Partial<Job>): Promise<Job> {
  const res = await fetch(`${API}/api/jobs/${id}`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await parseJson<{ job?: Job; message?: string }>(res);
  if (!res.ok) throw new Error(data.message ?? 'Failed to update job');
  if (!data.job) throw new Error('Invalid response');
  return data.job;
}

export async function deleteJob(token: string, id: number): Promise<void> {
  const res = await fetch(`${API}/api/jobs/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await parseJson<{ message?: string }>(res);
    throw new Error(data.message ?? 'Failed to delete job');
  }
}

export async function fetchStats(token: string): Promise<JobStats> {
  const res = await fetch(`${API}/api/jobs/stats`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await parseJson<JobStats & { message?: string }>(res);
  if (!res.ok) throw new Error(data.message ?? 'Failed to load stats');
  return { total: data.total, byStatus: data.byStatus };
}
