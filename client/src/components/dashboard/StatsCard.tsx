export function StatsCard({ title, value, hint }: { title: string; value: string | number; hint?: string }) {
  return (
    <div className="card">
      <p className="muted" style={{ margin: '0 0 0.35rem' }}>
        {title}
      </p>
      <p style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{value}</p>
      {hint && (
        <p className="muted" style={{ margin: '0.35rem 0 0' }}>
          {hint}
        </p>
      )}
    </div>
  );
}
