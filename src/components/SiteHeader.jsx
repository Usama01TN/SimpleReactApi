import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);
  const handleSignOut = async () => {
    await signOut();
    closeMenu();
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="brand" to="/" onClick={closeMenu} aria-label="Serein home">
          <span className="brand-mark">s<span>·</span></span>
          <span className="brand-copy">serein<small>TABLE & TASTE</small></span>
        </Link>

        <button
          className={`menu-toggle ${menuOpen ? 'is-open' : ''}`}
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span />
        </button>

        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
          <a href="/#experience" onClick={closeMenu}>Our story</a>
          <a href="/#menu" onClick={closeMenu}>The menu</a>
          {isAuthenticated && <NavLink to="/dashboard" onClick={closeMenu}>My table</NavLink>}
          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                <span className="nav-greeting">Hello, {user?.name?.split(' ')[0] || 'there'}</span>
                <button className="nav-signin" onClick={handleSignOut} type="button">Sign out</button>
                <Link className="button button-small button-dark" to="/book" onClick={closeMenu}>Book a table <span>↗</span></Link>
              </>
            ) : (
              <>
                <Link className="nav-signin" to="/login" onClick={closeMenu}>Sign in</Link>
                <Link className="button button-small button-dark" to="/signup" onClick={closeMenu}>Join us <span>↗</span></Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
