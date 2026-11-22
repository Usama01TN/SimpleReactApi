import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import Reveal from '../components/Reveal';

function getLocalDateValue(date) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

const timeSlots = ['12:00', '12:30', '13:00', '13:30', '14:00', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

export default function BookReservation() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const today = useMemo(() => getLocalDateValue(new Date()), []);
  const [form, setForm] = useState({ date: today, time: '19:00', guests: '2', table: '', request: '' });
  const [tables, setTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadTables() {
      setTablesLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/tables/capacity/${form.guests}`);
        if (!active) return;
        const suitable = (Array.isArray(data) ? data : []).filter((table) => table.isAvailable !== false && Number(table.capacity) >= Number(form.guests));
        setTables(suitable);
        setForm((current) => ({ ...current, table: suitable.some((table) => table._id === current.table) ? current.table : (suitable[0]?._id || '') }));
      } catch (requestError) {
        if (active) setError(getErrorMessage(requestError, 'We could not load the available tables.'));
      } finally {
        if (active) setTablesLoading(false);
      }
    }
    loadTables();
    return () => { active = false; };
  }, [form.guests]);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    const reservationDate = new Date(`${form.date}T${form.time}:00`);
    if (Number.isNaN(reservationDate.getTime()) || reservationDate <= new Date()) return setError('Please choose a date and time in the future.');
    if (!form.table) return setError('There are no suitable tables available right now. Please contact us to arrange a visit.');

    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('/reservations', {
        table: form.table,
        reservationDate: reservationDate.toISOString(),
        guestCount: Number(form.guests),
        specialRequest: form.request.trim(),
      });
      navigate('/dashboard', { state: { notice: `Your reservation request has been sent for ${reservationDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}.`, reservationId: data._id } });
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'We could not complete your reservation. Please try another time.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="booking-page section-pad">
      <div className="content-width booking-layout">
        <div className="booking-intro">
          <p className="eyebrow">A GOOD EVENING STARTS HERE</p>
          <h1>Let’s save<br /><em>you a seat.</em></h1>
          <p className="body-copy">Tell us when you’re coming and who’s joining. We’ll take care of the little details.</p>
          <div className="booking-progress"><span className="active">01</span><i /><span className="">02</span><i /><span className="">03</span><small>YOUR RESERVATION</small></div>
          <div className="booking-side-note"><span>✳</span><p>Plans changed? You can manage or cancel your request from your personal table page.</p></div>
        </div>

        <Reveal className="booking-card">
          <div className="booking-card-head"><div><span className="eyebrow">SEREIN · TUNIS</span><h2>Make it a date.</h2></div><span className="booking-card-icon">✳</span></div>
          <form onSubmit={submit} className="booking-form">
            <div className="booking-form-row">
              <div><label className="field-label" htmlFor="booking-date">Date</label><input className="auth-input" id="booking-date" name="date" type="date" min={today} value={form.date} onChange={update} required /></div>
              <div><label className="field-label" htmlFor="booking-time">Time</label><select className="auth-input" id="booking-time" name="time" value={form.time} onChange={update}>{timeSlots.map((time) => <option key={time} value={time}>{time}</option>)}</select></div>
            </div>
            <label className="field-label" htmlFor="booking-guests">How many people?</label>
            <div className="guest-selector" role="group" aria-label="Number of guests">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => <button key={count} className={Number(form.guests) === count ? 'selected' : ''} onClick={() => setForm((current) => ({ ...current, guests: String(count) }))} type="button">{count}</button>)}
            </div>
            <label className="field-label" htmlFor="booking-table">Choose your table</label>
            {tablesLoading ? <div className="table-loading"><span className="button-spinner" /> Finding a comfortable spot…</div> : tables.length ? (
              <div className="table-options">
                {tables.map((table) => (
                  <label className={`table-option ${form.table === table._id ? 'selected' : ''}`} key={table._id}>
                    <input type="radio" name="table" value={table._id} checked={form.table === table._id} onChange={(event) => setForm((current) => ({ ...current, table: event.target.value }))} />
                    <span className="table-option-icon">◯</span><span><strong>{table.name || 'Serein table'}</strong><small>Seats up to {table.capacity}</small></span><span className="table-option-check">✓</span>
                  </label>
                ))}
              </div>
            ) : <div className="availability-empty">No table for this group size is available at the moment. Try a smaller group or get in touch and we’ll help.</div>}
            <label className="field-label" htmlFor="booking-request">Anything we should know? <span className="optional-label">OPTIONAL</span></label>
            <textarea className="auth-input booking-textarea" id="booking-request" name="request" rows="3" maxLength="400" placeholder="A birthday, a favourite spot, dietary notes…" value={form.request} onChange={update} />
            <div className="booking-summary"><span>YOUR DETAILS</span><strong>{user?.name || 'Your reservation'} <small>· {form.guests} {Number(form.guests) === 1 ? 'guest' : 'guests'}</small></strong></div>
            {error && <p className="form-alert" role="alert">{error}</p>}
            <button className="button button-dark auth-submit" type="submit" disabled={submitting || tablesLoading || !tables.length}>{submitting ? <><span className="button-spinner" /> Sending request…</> : <>Request my table <span>↗</span></>}</button>
            <p className="booking-disclaimer">Your request will be saved to your account. The restaurant may contact you to confirm the details.</p>
          </form>
        </Reveal>
      </div>
    </main>
  );
}
