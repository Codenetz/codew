import React from 'react';
import SignUpContainer from '../modules/user/components/signUp/SignUpContainer';
import FacebookButtonContainer from '../modules/user/components/login/FacebookButtonContainer';

const SignUpPage = () => {
  return (
    <div>
      <FacebookButtonContainer/>
      <SignUpContainer/>
    </div>
  );
};

export default SignUpPage;
