import type { JobStats } from '../../types';

const LABELS: Record<string, string> = {
  applied: 'Applied',
  interviewing: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
};

export function ApplicationChart({ stats }: { stats: JobStats | null }) {
  if (!stats) {
    return (
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Applications by status</h2>
        <p className="muted">Loading chart…</p>
      </div>
    );
  }

  const keys = Object.keys(stats.byStatus);
  const max = Math.max(1, ...keys.map((k) => stats.byStatus[k] ?? 0));

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Applications by status</h2>
      <div className="chart-row">
        {keys.map((key) => {
          const count = stats.byStatus[key] ?? 0;
          const barPx = 6 + Math.round((count / max) * 110);
          return (
            <div key={key} className="chart-bar-wrap">
              <div className="chart-bar" style={{ height: `${barPx}px` }} title={`${count}`} />
              <div className="chart-label">
                {LABELS[key] ?? key}
                <br />
                <strong>{count}</strong>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
