import { useEffect } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import BookReservation from './Pages/BookReservation';
import Dashboard from './Pages/Dashboard';
import NotFound from './Pages/NotFound';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffectOnPath(pathname);
  return null;
}

function useEffectOnPath(pathname) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}

function SiteLayout() {
  return <><SiteHeader /><Outlet /><SiteFooter /></>;
}

function ProtectedRoute() {
  const { isAuthenticated, authReady } = useAuth();
  const location = useLocation();
  if (!authReady) return <div className="app-loader"><span className="loader-mark">s<span>·</span></span><span>Setting the table…</span></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}

function AppRoutes() {
  const { authReady } = useAuth();
  if (!authReady) return <div className="app-loader"><span className="loader-mark">s<span>·</span></span><span>Setting the table…</span></div>;
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/book" element={<BookReservation />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-reservations" element={<Navigate to="/dashboard" replace />} />
          </Route>
          <Route path="/menu" element={<Navigate to="/#menu" replace />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>;
}
