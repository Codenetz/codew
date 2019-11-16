import React from 'react';
import FacebookButtonContainer from './../modules/user/components/login/FacebookButtonContainer';
import LoginContainer from '../modules/user/components/login/LoginContainer';

const LoginPage = () => {
  return (
    <div>
      <FacebookButtonContainer/>
      <LoginContainer/>
    </div>
  );
};

export default LoginPage;
