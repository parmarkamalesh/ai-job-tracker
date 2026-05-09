import { FormEvent, useState } from 'react';
import { skillSuggestions } from '../../services/aiService';
import { useAppSelector } from '../../store/hooks';

export function SkillSuggestions() {
  const token = useAppSelector((s) => s.auth.token);
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError(null);
    setBusy(true);
    try {
      const data = await skillSuggestions(token, resumeText, targetRole);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
      setResult(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Skill suggestions</h2>
      <form onSubmit={onSubmit}>
        <div className="form-field">
          <label htmlFor="resumeText2">Resume text</label>
          <textarea id="resumeText2" value={resumeText} onChange={(e) => setResumeText(e.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="targetRole">Target role</label>
          <input id="targetRole" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="e.g. Senior React Native Engineer" />
        </div>
        <button className="btn" type="submit" disabled={busy || !token}>
          {busy ? 'Thinking…' : 'Get suggestions'}
        </button>
      </form>
      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
      {result !== null && (
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f1f5f9', padding: '0.75rem', borderRadius: 8 }}>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
