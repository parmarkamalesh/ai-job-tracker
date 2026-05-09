import { FormEvent, useState } from 'react';
import type { Job, JobStatus } from '../../types';

const STATUSES: JobStatus[] = ['applied', 'interviewing', 'offer', 'rejected'];

type Mode = 'create' | 'edit';

export function JobForm({
  mode,
  initial,
  onSubmit,
  onCancel,
}: {
  mode: Mode;
  initial?: Partial<Job>;
  onSubmit: (payload: Partial<Job>) => Promise<void>;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [company, setCompany] = useState(initial?.company ?? '');
  const [status, setStatus] = useState<JobStatus>(initial?.status ?? 'applied');
  const [appliedDate, setAppliedDate] = useState(initial?.appliedDate ?? '');
  const [salary, setSalary] = useState(initial?.salary ?? '');
  const [url, setUrl] = useState(initial?.url ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await onSubmit({
        title,
        company,
        status,
        appliedDate: appliedDate || null,
        salary: salary || null,
        url: url || null,
        notes: notes || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2 style={{ marginTop: 0 }}>{mode === 'create' ? 'New application' : 'Edit application'}</h2>
      <div className="form-field">
        <label htmlFor="title">Title</label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="form-field">
        <label htmlFor="company">Company</label>
        <input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required />
      </div>
      <div className="form-field">
        <label htmlFor="status">Status</label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value as JobStatus)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="appliedDate">Applied date</label>
        <input id="appliedDate" type="date" value={appliedDate ?? ''} onChange={(e) => setAppliedDate(e.target.value)} />
      </div>
      <div className="form-field">
        <label htmlFor="salary">Salary (optional)</label>
        <input id="salary" value={salary ?? ''} onChange={(e) => setSalary(e.target.value)} />
      </div>
      <div className="form-field">
        <label htmlFor="url">Job URL (optional)</label>
        <input id="url" type="url" value={url ?? ''} onChange={(e) => setUrl(e.target.value)} />
      </div>
      <div className="form-field">
        <label htmlFor="notes">Notes</label>
        <textarea id="notes" value={notes ?? ''} onChange={(e) => setNotes(e.target.value)} />
      </div>
      {error && <p className="muted" style={{ color: '#b91c1c' }}>{error}</p>}
      <div className="row-between">
        <button className="btn" type="submit" disabled={busy}>
          {busy ? 'Saving…' : mode === 'create' ? 'Add job' : 'Save changes'}
        </button>
        {onCancel && (
          <button className="btn btn-secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
