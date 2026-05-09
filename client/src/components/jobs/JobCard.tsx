import { Link } from 'react-router-dom';
import type { Job } from '../../types';
import { StatusBadge } from './StatusBadge';

export function JobCard({ job }: { job: Job }) {
  return (
    <div className="card">
      <div className="row-between">
        <div>
          <p className="job-card-title">{job.title}</p>
          <p className="muted" style={{ margin: 0 }}>
            {job.company}
            {job.appliedDate ? ` · Applied ${job.appliedDate}` : ''}
          </p>
        </div>
        <StatusBadge status={job.status} />
      </div>
      <p style={{ margin: '0.75rem 0 0' }}>
        <Link to={`/jobs/${job.id}`}>View details</Link>
      </p>
    </div>
  );
}
