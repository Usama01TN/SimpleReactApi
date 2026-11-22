import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/api';
import restaurantImage from '../assets/images/images.jfif';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn({ email: email.trim().toLowerCase(), password });
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'We could not sign you in. Please check your details.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <img src={restaurantImage} alt="A warmly lit restaurant ready for dinner" />
        <div className="auth-visual-shade" />
        <Link to="/" className="auth-back">← Back to Serein</Link>
        <div className="auth-visual-copy">
          <span className="eyebrow light-eyebrow">WELCOME BACK</span>
          <h1>Your table<br />is never <em>far away.</em></h1>
          <p>Your next good evening is just a few little details away.</p>
          <div className="auth-visual-foot"><span>02</span><span>GOOD TO HAVE YOU BACK</span></div>
        </div>
      </section>
      <section className="auth-form-side">
        <div className="auth-form-wrap login-form-wrap">
          <div className="auth-mobile-brand"><span className="brand-mark">s<span>·</span></span><span className="brand-copy">serein<small>TABLE & TASTE</small></span></div>
          <div className="auth-heading">
            <span className="eyebrow">YOUR PLACE AT SEREIN</span>
            <h2>Welcome <em>back.</em></h2>
            <p>Sign in to find your favourite spot.</p>
          </div>
          {location.state?.notice && <p className="form-success" role="status">{location.state.notice}</p>}
          <form className="auth-form" onSubmit={submit}>
            <label className="field-label" htmlFor="login-email">Email address</label>
            <input className="auth-input" id="login-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <label className="field-label" htmlFor="login-password">Password</label>
            <div className="password-field"><input className="auth-input" id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Your password" value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'HIDE' : 'SHOW'}</button></div>
            {error && <p className="form-alert" role="alert">{error}</p>}
            <button type="submit" className="button button-dark auth-submit" disabled={loading}>{loading ? <><span className="button-spinner" /> Signing in…</> : <>Sign in to Serein <span>↗</span></>}</button>
          </form>
          <p className="auth-switch">New around here? <Link to="/signup">Create an account</Link></p>
          <span className="auth-legal">Your next table, your plans, all in one place.</span>
        </div>
      </section>
    </main>
  );
}
