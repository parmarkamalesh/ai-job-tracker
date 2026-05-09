import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { JobForm } from '../components/jobs/JobForm';
import { StatusBadge } from '../components/jobs/StatusBadge';
import * as jobService from '../services/jobService';
import type { Job } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { removeJob, upsertJob } from '../store/slices/jobSlice';

export function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const [job, setJob] = useState<Job | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    const n = Number(id);
    if (!Number.isFinite(n)) {
      setError('Invalid job id');
      return;
    }
    setError(null);
    void (async () => {
      try {
        const j = await jobService.getJob(token, n);
        setJob(j);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load');
        setJob(null);
      }
    })();
  }, [token, id]);

  if (!token) {
    return null;
  }

  if (error) {
    return (
      <div className="card">
        <p style={{ color: '#b91c1c' }}>{error}</p>
        <Link to="/jobs">Back to jobs</Link>
      </div>
    );
  }

  if (!job) {
    return <p className="muted">Loading…</p>;
  }

  if (editing) {
    return (
      <div>
        <h1 style={{ marginTop: 0 }}>Edit job</h1>
        <JobForm
          mode="edit"
          initial={job}
          onSubmit={async (payload) => {
            const updated = await jobService.updateJob(token, job.id, payload);
            setJob(updated);
            dispatch(upsertJob(updated));
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div>
      <p className="muted" style={{ marginTop: 0 }}>
        <Link to="/jobs">← Applications</Link>
      </p>
      <div className="card">
        <div className="row-between">
          <div>
            <h1 style={{ margin: '0 0 0.35rem' }}>{job.title}</h1>
            <p className="muted" style={{ margin: 0 }}>
              {job.company}
            </p>
          </div>
          <StatusBadge status={job.status} />
        </div>
        <dl style={{ display: 'grid', gap: '0.5rem' }}>
          {job.appliedDate && (
            <>
              <dt className="muted" style={{ margin: 0 }}>
                Applied
              </dt>
              <dd style={{ margin: 0 }}>{job.appliedDate}</dd>
            </>
          )}
          {job.salary && (
            <>
              <dt className="muted" style={{ margin: 0 }}>
                Salary
              </dt>
              <dd style={{ margin: 0 }}>{job.salary}</dd>
            </>
          )}
          {job.url && (
            <>
              <dt className="muted" style={{ margin: 0 }}>
                Link
              </dt>
              <dd style={{ margin: 0 }}>
                <a href={job.url} target="_blank" rel="noreferrer">
                  {job.url}
                </a>
              </dd>
            </>
          )}
          {job.notes && (
            <>
              <dt className="muted" style={{ margin: 0 }}>
                Notes
              </dt>
              <dd style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{job.notes}</dd>
            </>
          )}
        </dl>
        <div className="row-between" style={{ marginTop: '1rem' }}>
          <button className="btn" type="button" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={async () => {
              if (!confirm('Delete this application?')) return;
              await jobService.deleteJob(token, job.id);
              dispatch(removeJob(job.id));
              navigate('/jobs');
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
