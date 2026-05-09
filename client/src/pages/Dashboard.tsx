import { useEffect } from 'react';
import { ApplicationChart } from '../components/dashboard/ApplicationChart';
import { RecentApplications } from '../components/dashboard/RecentApplications';
import { StatsCard } from '../components/dashboard/StatsCard';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchJobs, fetchStats } from '../store/slices/jobSlice';

export function Dashboard() {
  const dispatch = useAppDispatch();
  const { items, stats, loading, error } = useAppSelector((s) => s.jobs);

  useEffect(() => {
    void dispatch(fetchJobs());
    void dispatch(fetchStats());
  }, [dispatch]);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      {loading && <p className="muted">Loading…</p>}
      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
      <div className="grid-2">
        <StatsCard title="Total applications" value={stats?.total ?? items.length} />
        <StatsCard title="In interview" value={stats?.byStatus?.interviewing ?? 0} />
        <StatsCard title="Offers" value={stats?.byStatus?.offer ?? 0} hint="Great work — keep momentum." />
      </div>
      <ApplicationChart stats={stats} />
      <RecentApplications jobs={items} />
    </div>
  );
}
