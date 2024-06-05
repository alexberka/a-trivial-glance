import Link from 'next/link';
import { signOut } from '../utils/auth';

function Home() {
  return (
    <>
      <div className="welcome-buttons">
        <div>
          <Link passHref href="/game">
            <button type="button">JOIN</button>
          </Link>
          <p>Enter As Player</p>
        </div>
        <div>
          <Link passHref href="/host/games">
            <button type="button">HOST</button>
          </Link>
          <p>Enter As Host</p>
        </div>
      </div>
      <button type="button" onClick={signOut} className="welcome-signout">Sign Out</button>
      <div className="welcome-title">
        <h3>A</h3>
        <h1>TRIVIAL</h1>
        <h2>GLANCE</h2>
      </div>
    </>
  );
}

export default Home;
