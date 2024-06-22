import Link from 'next/link';
import { Image } from 'react-bootstrap';
import { signOut } from '../utils/auth';
import { useAuth } from '../utils/context/authContext';

function Home() {
  const { user } = useAuth();

  return (
    <>
      <div className="welcome-buttons">
        <div>
          <Link passHref href="/games">
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
      <div className="welcome-signout">
        <button type="button" onClick={signOut}>
          Sign Out
          {user.photoURL && (<Image className="signout-user-image" src={user.photoURL} />)}
        </button>
        <p className="signout-username">{`(Logged in as ${user.displayName})`}</p>
      </div>
      <div className="welcome-title logo">
        <h3>A</h3>
        <h1>TRIVIAL</h1>
        <h2>GLANCE</h2>
      </div>
    </>
  );
}

export default Home;
