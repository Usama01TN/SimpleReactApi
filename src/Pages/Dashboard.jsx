import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api, { getErrorMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import Reveal from '../components/Reveal';

function formatDate(date) {
  return new Date(date).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(location.state?.notice || '');
  const [canceling, setCanceling] = useState('');

  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/reservations');
      setReservations(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'We could not load your reservations.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadReservations(); }, [loadReservations]);

  const cancelReservation = async (id) => {
    if (!window.confirm('Cancel this reservation request?')) return;
    setCanceling(id);
    setError('');
    try {
      await api.patch(`/reservations/${id}/cancel`);
      setNotice('Your reservation has been cancelled.');
      await loadReservations();
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'We could not cancel this reservation.'));
    } finally {
      setCanceling('');
    }
  };

  const upcoming = reservations.filter((item) => item.status !== 'cancelled' && new Date(item.reservationDate) >= new Date()).length;
  const nextReservation = reservations
    .filter((item) => item.status !== 'cancelled' && new Date(item.reservationDate) >= new Date())
    .sort((a, b) => new Date(a.reservationDate) - new Date(b.reservationDate))[0];

  return (
    <main className="dashboard-page section-pad">
      <div className="content-width">
        <div className="dashboard-welcome">
          <div><p className="eyebrow">YOUR SEREIN SPACE</p><h1>Good to see you,<br /><em>{user?.name?.split(' ')[0] || 'friend'}.</em></h1><p className="body-copy">Your plans, all in one place. What shall we look forward to?</p></div>
          <Link to="/book" className="button button-dark">Make a reservation <span>↗</span></Link>
        </div>

        {notice && <div className="form-success dashboard-alert" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification">×</button></div>}
        {error && <p className="form-alert dashboard-alert" role="alert">{error}</p>}

        <div className="dashboard-stats">
          <Reveal className="stat-card"><span>UPCOMING PLANS</span><strong>{upcoming.toString().padStart(2, '0')}</strong><small>little moments to look forward to</small></Reveal>
          <Reveal className="stat-card" delay={80}><span>ALL RESERVATIONS</span><strong>{reservations.length.toString().padStart(2, '0')}</strong><small>every visit starts somewhere</small></Reveal>
          <Reveal className="stat-card stat-card-dark" delay={160}><span>NEXT UP</span><strong>{nextReservation ? new Date(nextReservation.reservationDate).toLocaleDateString([], { day: '2-digit', month: 'short' }) : '—'}</strong><small>{nextReservation ? formatDate(nextReservation.reservationDate) : 'Your next favourite evening is waiting'}</small></Reveal>
        </div>

        <section className="reservation-list-section">
          <div className="reservation-list-heading"><div><p className="eyebrow">YOUR CALENDAR</p><h2>Your <em>reservations.</em></h2></div><span>{reservations.length} {reservations.length === 1 ? 'BOOKING' : 'BOOKINGS'}</span></div>
          {loading ? <div className="dashboard-loading"><span className="button-spinner" /> Gathering your plans…</div> : reservations.length ? (
            <div className="reservation-list">
              {reservations.slice().sort((a, b) => new Date(b.reservationDate) - new Date(a.reservationDate)).map((reservation, index) => (
                <article className="reservation-row" key={reservation._id}>
                  <div className="reservation-date-tile"><strong>{new Date(reservation.reservationDate).getDate().toString().padStart(2, '0')}</strong><span>{new Date(reservation.reservationDate).toLocaleDateString([], { month: 'short' }).toUpperCase()}</span></div>
                  <div className="reservation-details"><span className="reservation-index">VISIT {String(reservations.length - index).padStart(2, '0')}</span><h3>{reservation.table?.name || 'Your Serein table'}</h3><p>{formatDate(reservation.reservationDate)} · {reservation.guestCount || '—'} guests</p>{reservation.specialRequest && <small>“{reservation.specialRequest}”</small>}</div>
                  <span className={`reservation-status status-${reservation.status || 'pending'}`}>{reservation.status || 'pending'}</span>
                  {reservation.status !== 'cancelled' && new Date(reservation.reservationDate) > new Date() && <button className="cancel-reservation" type="button" disabled={canceling === reservation._id} onClick={() => cancelReservation(reservation._id)}>{canceling === reservation._id ? 'CANCELLING…' : 'CANCEL'}</button>}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-reservations"><span className="empty-icon">✳</span><h3>No plans on the calendar. <em>Yet.</em></h3><p>Your next great evening is waiting to happen. Let’s find you a table.</p><Link to="/book" className="button button-dark">Book your first table <span>↗</span></Link></div>
          )}
        </section>
      </div>
    </main>
  );
}
