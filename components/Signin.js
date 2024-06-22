import React from 'react';
import { useRouter } from 'next/router';
import { signIn } from '../utils/auth';

function Signin() {
  const router = useRouter();

  const signInGoHome = () => {
    signIn();
    router.push('/');
  };

  return (
    <>
      <div className="bg-positive-top" />
      <div className="bg-negative-top" />
      <div className="bg-positive-bottom" />
      <div className="bg-negative-bottom" />
      <div
        className="text-center d-flex flex-column justify-content-center align-content-center"
        style={{
          height: '90vh',
          padding: '30px',
          maxWidth: '400px',
          margin: '0 auto',
        }}
      >
        <button type="button" className="signin-btn std-btn" onClick={signInGoHome}>
          SIGN IN
        </button>
      </div>
      <div className="welcome-title logo">
        <h3>A</h3>
        <h1>TRIVIAL</h1>
        <h2>GLANCE</h2>
      </div>
    </>
  );
}

export default Signin;
