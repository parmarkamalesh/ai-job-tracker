import { Link } from 'react-router-dom';
import type { Job } from '../../types';
import { StatusBadge } from '../jobs/StatusBadge';

export function RecentApplications({ jobs }: { jobs: Job[] }) {
  const recent = [...jobs].slice(0, 5);

  return (
    <div className="card">
      <div className="row-between">
        <h2 style={{ margin: 0 }}>Recent applications</h2>
        <Link to="/jobs">View all</Link>
      </div>
      {recent.length === 0 ? (
        <p className="muted">Nothing here yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0' }}>
          {recent.map((j) => (
            <li key={j.id} className="row-between" style={{ padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <strong>{j.title}</strong>
                <span className="muted"> · {j.company}</span>
              </div>
              <StatusBadge status={j.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
