import type { Job } from '../../types';
import { JobCard } from './JobCard';

export function JobList({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return <p className="muted">No applications yet. Add your first job on the Jobs page.</p>;
  }

  return (
    <div className="stack-sm">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
