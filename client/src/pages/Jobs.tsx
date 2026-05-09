import { useEffect, useState } from 'react';
import { JobForm } from '../components/jobs/JobForm';
import { JobList } from '../components/jobs/JobList';
import * as jobService from '../services/jobService';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchJobs, upsertJob } from '../store/slices/jobSlice';

export function Jobs() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const { items, loading, error } = useAppSelector((s) => s.jobs);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    void dispatch(fetchJobs());
  }, [dispatch]);

  if (!token) {
    return null;
  }

  return (
    <div>
      <div className="row-between">
        <h1 style={{ marginTop: 0 }}>Applications</h1>
        <button className="btn" type="button" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Close form' : 'Add application'}
        </button>
      </div>
      {loading && <p className="muted">Loading…</p>}
      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
      {showForm && (
        <JobForm
          mode="create"
          onSubmit={async (payload) => {
            const job = await jobService.createJob(token, payload);
            dispatch(upsertJob(job));
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
      <JobList jobs={items} />
    </div>
  );
}
