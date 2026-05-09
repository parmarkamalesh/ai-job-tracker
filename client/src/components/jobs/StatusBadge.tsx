import type { JobStatus } from '../../types';

const LABELS: Record<JobStatus, string> = {
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  rejected: 'Rejected',
};

export function StatusBadge({ status }: { status: JobStatus }) {
  const cls =
    status === 'applied'
      ? 'badge badge-applied'
      : status === 'interviewing'
        ? 'badge badge-interviewing'
        : status === 'offer'
          ? 'badge badge-offer'
          : 'badge badge-rejected';

  return <span className={cls}>{LABELS[status]}</span>;
}
