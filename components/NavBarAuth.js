/* eslint-disable no-else-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signOut } from '../utils/auth';

export default function NavBarAuth() {
  const [navigate, setNavigate] = useState(false);
  const router = useRouter();

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
          <button type="button">Home</button>
        </Link>
        <hr />
        {router.pathname.includes('host') ? (
          <>
            <Link passHref href="/game">
              <button type="button">Switch to Player View</button>
            </Link>
            <Link passHref href="/host/question/new">
              <button type="button">New Question</button>
            </Link>
          </>
        ) : (
          <Link passHref href="/host/game">
            <button type="button">Switch to Host View</button>
          </Link>
        )}
        <hr />
        <button type="button" onClick={signOut}>Sign Out</button>
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
