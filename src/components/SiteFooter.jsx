import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <Link className="brand brand-footer" to="/">
            <span className="brand-mark">s<span>·</span></span>
            <span className="brand-copy">serein<small>TABLE & TASTE</small></span>
          </Link>
          <p>A little pause from the everyday.<br />A table worth gathering around.</p>
        </div>
        <div className="footer-links">
          <div><span className="footer-label">EXPLORE</span><a href="/#experience">Our story</a><a href="/#menu">The menu</a><Link to="/book">Reservations</Link></div>
          <div><span className="footer-label">SAY HELLO</span><a href="mailto:hello@serein.example">hello@serein.example</a><span>+216 70 000 000</span><span>Tunis, Tunisia</span></div>
        </div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Serein. Made for good company.</span><span>Fresh plates · Slow moments · Good people</span></div>
    </footer>
  );
}
