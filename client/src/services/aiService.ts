const API = import.meta.env.VITE_API_URL ?? '';

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

export async function scoreResume(
  token: string,
  resumeText: string,
  jobDescription: string
): Promise<unknown> {
  const res = await fetch(`${API}/api/ai/resume-score`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText, jobDescription }),
  });
  const data = await parseJson<{ message?: string } & Record<string, unknown>>(res);
  if (!res.ok) throw new Error(data.message ?? 'Resume scoring failed');
  return data;
}

export async function skillSuggestions(token: string, resumeText: string, targetRole: string): Promise<unknown> {
  const res = await fetch(`${API}/api/ai/skill-suggestions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText, targetRole }),
  });
  const data = await parseJson<{ message?: string } & Record<string, unknown>>(res);
  if (!res.ok) throw new Error(data.message ?? 'Skill suggestions failed');
  return data;
}
