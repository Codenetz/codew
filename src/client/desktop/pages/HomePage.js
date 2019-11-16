import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <Link to={'/login'}>
Login
      </Link>
      <Link to={'/sign-up'}>
Sign up
      </Link>
      <Link to={'/logout'}>
Logout
      </Link>
    </div>
  );
};

HomePage.propTypes = {};
export default HomePage;
