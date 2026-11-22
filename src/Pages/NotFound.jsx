import { Link } from 'react-router-dom';
export default function NotFound() {
  return <main className="not-found"><span>404</span><h1>Looks like this<br /><em>table is taken.</em></h1><p>We can’t find the page you were looking for.</p><Link className="button button-dark" to="/">Back to Serein <span>↗</span></Link></main>;
}
