// import { Button } from 'react-bootstrap'; // TODO: COMMENT IN FOR AUTH
import Link from 'next/link';
import { signOut } from '../utils/auth'; // TODO: COMMENT IN FOR AUTH
// import { useAuth } from '../utils/context/authContext'; // TODO: COMMENT IN FOR AUTH

function Home() {
  // const { user } = useAuth(); // TODO: COMMENT IN FOR AUTH

  // const user = { displayName: 'Dr. T' }; // TODO: COMMENT OUT FOR AUTH
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
          <Link passHref href="/host/game">
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
