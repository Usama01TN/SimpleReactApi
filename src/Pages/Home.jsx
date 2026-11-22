import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CurvedLoop from '../components/reactbits/CurvedLoop';
import Reveal from '../components/Reveal';
import restaurantImage from '../assets/images/images.jfif';

const dishes = [
  { number: '01', name: 'The garden table', note: 'Seasonal greens · citrus · toasted seeds', price: '38 TND', icon: '✳' },
  { number: '02', name: 'Slow Sunday pasta', note: 'Hand-cut ribbons · herbs · parmesan', price: '46 TND', icon: '〰' },
  { number: '03', name: 'A little sweet ending', note: 'Vanilla cream · fruit · warm crumble', price: '24 TND', icon: '❋' },
];

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  return (
    <>
      <main>
        <section className="hero-section">
          <div className="hero-ambient hero-ambient-one" />
          <div className="hero-ambient hero-ambient-two" />
          <div className="hero-inner content-width">
            <div className="hero-copy">
              <div className="eyebrow light-eyebrow"><span className="eyebrow-dot" /> A RESTAURANT FOR THE UNRUSHED</div>
              <h1>Make room for<br /><em>the good</em> things.</h1>
              <p className="hero-description">Thoughtful plates, honest ingredients and the kind of evenings that make you forget to check the time.</p>
              <div className="hero-actions">
                <Link to={isAuthenticated ? '/book' : '/signup'} className="button button-light">Find your table <span>↗</span></Link>
                <a href="#experience" className="text-link text-link-light">Get to know us <span>↓</span></a>
              </div>
              <div className="hero-proof"><div className="proof-avatars"><span>✦</span><span>✿</span><span>◌</span></div><span><strong>4.9 / 5</strong> · loved by our guests</span></div>
            </div>
            <div className="hero-visual">
              <div className="hero-photo-wrap">
                <img src={restaurantImage} alt="Warm, intimate restaurant dining room" className="hero-photo" />
                <div className="photo-grain" />
              </div>
              <div className="hero-stamp"><span>GOOD FOOD</span><b>GOOD<br />COMPANY</b><span>SINCE ALWAYS · TUNIS</span></div>
              <div className="hero-caption"><span>01 / 03</span><span>THE ART OF TAKING IT SLOW</span></div>
            </div>
          </div>
          <div className="hero-bottom content-width"><span>SCROLL TO EXPLORE</span><span className="scroll-line" /><span>36°48' N&nbsp;&nbsp; 10°10' E</span></div>
        </section>

        <section className="intro-section section-pad" id="experience">
          <div className="content-width intro-grid">
            <Reveal className="section-kicker"><span>01 — THE SEREIN FEELING</span></Reveal>
            <Reveal className="intro-copy" delay={80}>
              <p className="eyebrow">A PLACE TO LAND</p>
              <h2>Come as you are.<br /><em>Stay a little longer.</em></h2>
              <p className="body-copy">We believe the best meals are never just about what is on the plate. They are the conversations that wander, the second glass, the familiar faces and the new stories shared across the table.</p>
              <a href="#menu" className="underlined-link">A taste of what we do <span>↗</span></a>
            </Reveal>
            <Reveal className="intro-note" delay={160}>
              <span className="note-symbol">✳</span>
              <p>“The best ingredient<br />is always <em>togetherness.</em>”</p>
              <span className="note-signature">THE SEREIN WAY</span>
            </Reveal>
          </div>
        </section>

        <div className="loop-band" aria-label="Fresh plates, slow moments, good people">
          <CurvedLoop marqueeText="FRESH PLATES · SLOW MOMENTS · GOOD PEOPLE · " speed={1.25} curveAmount={30} className="loop-type" />
        </div>

        <section className="menu-section section-pad" id="menu">
          <div className="content-width">
            <Reveal className="menu-heading">
              <div><p className="eyebrow">02 — FROM OUR KITCHEN</p><h2>Simple things,<br /><em>done beautifully.</em></h2></div>
              <p className="body-copy menu-intro">Our menu follows the seasons and the people who grow them. A few favourites, made with care and a little curiosity.</p>
            </Reveal>
            <div className="dish-grid">
              {dishes.map((dish, index) => (
                <Reveal key={dish.number} className={`dish-card dish-card-${index + 1}`} delay={index * 90}>
                  <div className="dish-art"><span className="dish-number">{dish.number}</span><span className="dish-symbol">{dish.icon}</span><span className="dish-art-caption">MADE FRESH, ALWAYS</span></div>
                  <div className="dish-meta"><div><h3>{dish.name}</h3><p>{dish.note}</p></div><strong>{dish.price}</strong></div>
                </Reveal>
              ))}
            </div>
            <div className="menu-footnote"><span>THE MENU CHANGES WITH THE SEASONS</span><span>GOOD THINGS TAKE TIME ↗</span></div>
          </div>
        </section>

        <section className="reservation-callout section-pad">
          <div className="callout-orbit orbit-one" /><div className="callout-orbit orbit-two" />
          <Reveal className="callout-content">
            <p className="eyebrow light-eyebrow">03 — YOUR PLACE IS WAITING</p>
            <h2>Some moments<br />deserve <em>a table.</em></h2>
            <p>Make a little plan. We will take care of the rest.</p>
            <Link to={isAuthenticated ? '/book' : '/signup'} className="button button-light">Reserve your moment <span>↗</span></Link>
          </Reveal>
          <div className="callout-side-note">TUNIS · EVERY DAY<br />12:00 — 23:00</div>
        </section>

        <section className="visit-section section-pad">
          <div className="content-width visit-grid">
            <Reveal><p className="eyebrow">A LITTLE MORE PRACTICAL</p><h2>Find us.<br /><em>We’ll save you a seat.</em></h2></Reveal>
            <Reveal className="visit-card" delay={100}>
              <div><span className="visit-label">COME ON IN</span><strong>Les Berges du Lac,<br />Tunis, Tunisia</strong><span>Open daily · 12 PM – 11 PM</span></div>
              <div className="visit-arrow">↗</div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
