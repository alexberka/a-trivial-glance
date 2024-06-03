/* eslint-disable no-else-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Image } from 'react-bootstrap';
import { signOut } from '../utils/auth';
import { useAuth } from '../utils/context/authContext';

export default function NavBarAuth() {
  const [navigate, setNavigate] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const openNav = () => {
    setNavigate(true);
  };

  const closeNav = () => {
    setNavigate(false);
  };

  if (navigate) {
    return (
      <div className="nav-expanded" onMouseLeave={closeNav}>
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
            <Link passHref href="/game">
              <button type="button">Switch to Player View</button>
            </Link>
            <hr />
            {router.pathname !== '/host/questions' && (
              <Link passHref href="/host/questions">
                <button type="button">All Questions</button>
              </Link>
            )}
            {router.pathname !== '/host/question/new' && (
              <Link passHref href="/host/question/new">
                <button type="button">New Question</button>
              </Link>
            )}
          </>
        ) : (
          <>
            <Link passHref href="/host/questions">
              <button type="button">Switch to Host View</button>
            </Link>
            {router.pathname !== '/game' && (
              <>
                <hr />
                <Link passHref href="/game">
                  <button type="button">Return to Game</button>
                </Link>
              </>
            )}
          </>
        )}
        <hr />
        <button type="button" onClick={signOut}>
          Sign Out
          {user.photoURL && (<Image className="nav-user-image" src={user.photoURL} />)}
        </button>
        <p className="nav-username">{`(Logged in as ${user.displayName})`}</p>
      </div>
    );
  } else {
    return (
      <div className="nav-collapsed" onMouseEnter={openNav}>
        <div className="nav-line" />
        <div className="nav-line" />
        <div className="nav-line" />
      </div>
    );
  }
}
