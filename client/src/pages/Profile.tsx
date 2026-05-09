import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearJobs } from '../store/slices/jobSlice';
import { logout } from '../store/slices/authSlice';
import { ResumeScorer } from '../components/ai/ResumeScorer';
import { SkillSuggestions } from '../components/ai/SkillSuggestions';

export function Profile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  if (!user) {
    return <p className="muted">Loading profile…</p>;
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Profile</h1>
      <div className="card">
        <p>
          <strong>{user.name}</strong>
        </p>
        <p className="muted" style={{ margin: 0 }}>
          {user.email}
        </p>
        <button
          className="btn btn-secondary"
          type="button"
          style={{ marginTop: '1rem' }}
          onClick={() => {
            dispatch(clearJobs());
            dispatch(logout());
          }}
        >
          Sign out
        </button>
      </div>
      <ResumeScorer />
      <SkillSuggestions />
    </div>
  );
}
