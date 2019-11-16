import React from 'react';
import IsAuthorized from './IsAuthorized';
export default function IsAuthorizedUser(props) {
  return (
    <IsAuthorized
     {...props}
     roles={['ROLE_USER', 'ROLE_ADMIN']}/>
  );
}
