import React from 'react';
import IsAuthorized from './IsAuthorized';
export default function IsAuthorizedAdmin(props) {
  return (
    <IsAuthorized
     {...props}
     roles={['ROLE_ADMIN']}/>
  );
}
