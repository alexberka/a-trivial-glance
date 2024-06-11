/* eslint-disable no-else-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Image } from 'react-bootstrap';
import { signOut } from '../utils/auth';
import { useAuth } from '../utils/context/authContext';

export default function NavBarAuth() {
  // 'navigate' indicates whether the navigation dropdown is visible
  const [navigate, setNavigate] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // Links that appear/disappear dynamically based on path are defined and organized in 'dynamicLinks'
  const dynamicLinks = {
    host: [
      { path: '/host/games', text: 'Games' },
      { path: '/host/game/new', text: 'New Game' },
      { path: '/host/questions', text: 'Questions' },
      { path: '/host/question/new', text: 'New Question' },
    ],
    player: [
      { path: '/games', text: 'Select A Game' },
    ],
  };

  // Used to open the navigation dropdown
  const openNav = () => {
    setNavigate(true);
  };

  // Used to close the navigation dropdown
  const closeNav = () => {
    setNavigate(false);
  };

  // Display navigation menu when 'navigate' is true
  if (navigate) {
    return (
    // Close navigation menu when mouse leaves dropdown
      <div className="nav-menu">
        <div className="nav-expanded" onMouseLeave={closeNav}>
          {/* Construction of logo, directs to welcome page */}
          <Link passHref href="/">
            <button type="button" className="nav-logo">
              <p className="nav-logo-a">A</p>
              <p className="nav-logo-b">TRIVIAL</p>
              <p className="nav-logo-c">GLANCE</p>
            </button>
          </Link>
          <hr />
          {router.pathname.includes('host') ? (
            <>
              {/* When in host view, show option to use site as player */}
              <Link
                passHref
                href={router.pathname.includes('/host/game/[id]') ? `/game/${router.query.id}` : '/games'}
              >
                <button type="button">Switch to Player View</button>
              </Link>
              {/* Map through and display dynamic host links other than ones that direct to current path, if any */}
              {dynamicLinks.host.filter((link) => link.path !== router.pathname).length > 0 && (
              <>
                <hr />
                {dynamicLinks.host
                  .filter((link) => link.path !== router.pathname)
                  .map((link) => (
                    <Link passHref href={link.path} key={link.path}>
                      {/* Close nav menu if a dynamic link is clicked */}
                      <button type="button" onClick={closeNav}>{link.text}</button>
                    </Link>
                  ))}
              </>
              )}
            </>
          ) : (
            <>
              {/* When in player view, show option to use site as host */}
              <Link
                passHref
                href={router.pathname.includes('/game/[id]') ? `/host/game/${router.query.id}` : '/host/games'}
              >
                <button type="button">Switch to Host View</button>
              </Link>
              {/* Map through and display dynamic player links other than ones that direct to current path, if any */}
              {dynamicLinks.player.filter((link) => link.path !== router.pathname).length > 0 && (
              <>
                <hr />
                {dynamicLinks.player
                  .filter((link) => link.path !== router.pathname)
                  .map((link) => (
                    <Link passHref href={link.path} key={link.path}>
                      {/* Close nav menu if a dynamic link is clicked */}
                      <button type="button" onClick={closeNav}>{link.text}</button>
                    </Link>
                  ))}
              </>
              )}
              <Link
                passHref
                href={router.pathname.includes('/game/[id]') ? `/host/game/${router.query.id}` : '/host/games'}
              >
                <button type="button">Switch to Host View</button>
              </Link>
            </>
          )}
          <hr />
          {/* Display user's profile photo and username from useAuth user object (from Google auth) */}
          <button type="button" onClick={signOut}>
            Sign Out
            {user.photoURL && (<Image className="nav-user-image" src={user.photoURL} />)}
          </button>
          <p className="nav-username">{`(Logged in as ${user.displayName})`}</p>
        </div>
        {router.pathname.includes('host') && (<div className="host-tag">HOST</div>)}
      </div>
    );
  // Otherwise show menu icon
  } else {
    return (
    // Open navigation menu when mouse hovers over icon
      <div className="nav-menu">
        <div className="nav-collapsed" onMouseEnter={openNav}>
          <div className="nav-line" />
          <div className="nav-line" />
          <div className="nav-line" />
        </div>
        {router.pathname.includes('host') && (<div className="host-tag">HOST</div>)}
      </div>
    );
  }
}
