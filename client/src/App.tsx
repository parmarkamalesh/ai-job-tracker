import { useEffect } from 'react';
import { BrowserRouter, Link, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { fetchMe } from './services/authService';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { logout, setUser } from './store/slices/authSlice';
import { Dashboard } from './pages/Dashboard';
import { JobDetail } from './pages/JobDetail';
import { Jobs } from './pages/Jobs';
import { Profile } from './pages/Profile';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';

function ShellLayout() {
  const user = useAppSelector((s) => s.auth.user);

  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-brand">AI Job Tracker</div>
        <nav className="shell-nav">
          <Link to="/">Dashboard</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/profile">Profile</Link>
          {user && <span className="muted">Hi, {user.name}</span>}
        </nav>
      </header>
      <main className="shell-main">
        <Outlet />
      </main>
    </div>
  );
}

function ProtectedLayout() {
  const token = useAppSelector((s) => s.auth.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <ShellLayout />;
}

function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    if (!token || user) return;
    void (async () => {
      try {
        const { user: u } = await fetchMe(token);
        dispatch(setUser(u));
      } catch {
        dispatch(logout());
      }
    })();
  }, [token, user, dispatch]);

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthBootstrap>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthBootstrap>
  );
}
