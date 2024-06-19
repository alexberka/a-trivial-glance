import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useAuth } from './context/authContext';
import Loading from '../components/Loading';
import Signin from '../components/Signin';
import NavBarAuth from '../components/NavBarAuth';

const ViewDirectorBasedOnUserAuthStatus = ({ component: Component, pageProps }) => {
  const { user, userLoading } = useAuth();
  const router = useRouter();

  // if user state is null, then show loader
  if (userLoading) {
    return <Loading />;
  }

  // what the user should see if they are logged in
  if (user) {
    return (
      <>
        <div className="bg-positive-top" />
        <div className="bg-negative-top" />
        <div className="bg-positive-bottom" />
        <div className="bg-negative-bottom" />
        {router.pathname !== '/' && (<NavBarAuth />)}
        <div className="container">
          <Component {...pageProps} />
        </div>
        {router.pathname !== '/' && (
          <div className="welcome-title title-watermark">
            <h3>A</h3>
            <h1>TRIVIAL</h1>
            <h2>GLANCE</h2>
          </div>
        )}
      </>
    );
  }

  return <Signin />;
};

export default ViewDirectorBasedOnUserAuthStatus;

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  component: PropTypes.func.isRequired,
  pageProps: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
