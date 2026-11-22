import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/api';
import restaurantImage from '../assets/images/images.jfif';

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', image: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordChecks = useMemo(() => ({
    length: form.password.length >= 8,
    allowed: /^[A-Za-z\d@$!%*?&]*$/.test(form.password),
    match: form.confirmPassword.length > 0 && form.password === form.confirmPassword,
  }), [form.password, form.confirmPassword]);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
  };

  const uploadImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Please choose an image file.');
    if (file.size > 5 * 1024 * 1024) return setError('Your profile image must be smaller than 5 MB.');
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, image: String(reader.result) }));
    reader.onerror = () => setError('We could not read that image. Please try another one.');
    reader.readAsDataURL(file);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (form.name.trim().length < 3) return setError('Your name must be at least 3 characters long.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return setError('Enter a valid email address.');
    if (!/^\+?\d[\d\s().-]{7,18}$/.test(form.phone)) return setError('Enter a valid phone number, including your country code.');
    if (!passwordChecks.length || !passwordChecks.allowed) return setError('Your password must be at least 8 characters and use only letters, numbers or @$!%*?&.');
    if (form.password !== form.confirmPassword) return setError('Your passwords do not match.');
    if (!accepted) return setError('Please agree to the terms to continue.');

    setLoading(true);
    setError('');
    try {
      await signUp({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone,
        password: form.password,
        ...(form.image ? { image: form.image } : {}),
      });
      navigate('/login', { replace: true, state: { notice: 'Your account is ready. Sign in to reserve your first table.' } });
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'We could not create your account. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <img src={restaurantImage} alt="Serein's inviting dining room" />
        <div className="auth-visual-shade" />
        <Link to="/" className="auth-back">← Back to Serein</Link>
        <div className="auth-visual-copy">
          <span className="eyebrow light-eyebrow">A SEAT AT OUR TABLE</span>
          <h1>Good things<br />are better <em>shared.</em></h1>
          <p>Create an account. Save your details. Make more room for the moments that matter.</p>
          <div className="auth-visual-foot"><span>01</span><span>YOUR NEXT FAVOURITE PLACE</span></div>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-wrap signup-form-wrap">
          <div className="auth-mobile-brand"><span className="brand-mark">s<span>·</span></span><span className="brand-copy">serein<small>TABLE & TASTE</small></span></div>
          <div className="auth-heading">
            <span className="eyebrow">YOUR SEREIN ACCOUNT</span>
            <h2>Let’s make it <em>official.</em></h2>
            <p>Join us for a little more good in your day.</p>
          </div>

          <form className="auth-form" onSubmit={submit} noValidate>
            <div className="profile-upload-row">
              <label className="profile-upload" htmlFor="profile-image">
                {form.image ? <img src={form.image} alt="Selected profile" /> : <span>+</span>}
              </label>
              <div><strong>Add a profile photo</strong><span>Optional · JPG or PNG · up to 5 MB</span></div>
              <input id="profile-image" type="file" accept="image/*" onChange={uploadImage} hidden />
            </div>

            <label className="field-label" htmlFor="signup-name">Full name</label>
            <input className="auth-input" id="signup-name" name="name" type="text" autoComplete="name" placeholder="Your name" value={form.name} onChange={update} minLength={3} required />

            <div className="form-two-col">
              <div><label className="field-label" htmlFor="signup-email">Email address</label><input className="auth-input" id="signup-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={update} required /></div>
              <div><label className="field-label" htmlFor="signup-phone">Phone number</label><input className="auth-input" id="signup-phone" name="phone" type="tel" autoComplete="tel" placeholder="+216 00 000 000" value={form.phone} onChange={update} required /></div>
            </div>

            <label className="field-label" htmlFor="signup-password">Password</label>
            <div className="password-field"><input className="auth-input" id="signup-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="At least 8 characters" value={form.password} onChange={update} required /><button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'HIDE' : 'SHOW'}</button></div>
            <div className="password-hints"><span className={passwordChecks.length ? 'hint-valid' : ''}><i />8+ characters</span><span className={passwordChecks.allowed ? 'hint-valid' : ''}><i />Allowed characters</span></div>

            <label className="field-label" htmlFor="signup-confirm">Confirm password</label>
            <div className="password-field"><input className="auth-input" id="signup-confirm" name="confirmPassword" type={showConfirm ? 'text' : 'password'} autoComplete="new-password" placeholder="Enter it one more time" value={form.confirmPassword} onChange={update} required /><button type="button" className="password-toggle" onClick={() => setShowConfirm((value) => !value)}>{showConfirm ? 'HIDE' : 'SHOW'}</button></div>
            {form.confirmPassword && <p className={`match-message ${passwordChecks.match ? 'match-good' : 'match-bad'}`}>{passwordChecks.match ? 'Passwords match' : 'Passwords do not match yet'}</p>}

            <label className="terms-check"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} /><span>I agree to the terms and privacy policy.</span></label>
            {error && <p className="form-alert" role="alert">{error}</p>}
            <button type="submit" className="button button-dark auth-submit" disabled={loading}>{loading ? <><span className="button-spinner" /> Creating account…</> : <>Create my account <span>↗</span></>}</button>
          </form>
          <p className="auth-switch">Already saved us a spot? <Link to="/login">Sign in</Link></p>
          <span className="auth-legal">By joining, you’ll be able to manage your bookings in one place.</span>
        </div>
      </section>
    </main>
  );
}
