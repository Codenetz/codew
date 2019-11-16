import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { authenticate } from './service/FacebookButtonService';
import { AuthConsumer } from '../../../../../helpers/contexts/auth';

class FacebookButtonContainer extends Component {
  handleResponse = e => {
    e.preventDefault();
    // eslint-disable-next-line no-undef
    FB.login(
      async facebookResponse => {
        if (
          facebookResponse.status === 'connected' &&
          facebookResponse.authResponse &&
          facebookResponse.authResponse.accessToken
        ) {
          const response = await authenticate(
            facebookResponse.authResponse.accessToken,
            facebookResponse.authResponse.userID
          );

          let data = response.data.data;
          this.context.setToken(data.jwt);
          this.context.setUser(data.user);
        }
      },
      { scope: 'public_profile,email' }
    );
  };

  render() {
    return (
      <Link
       to="#"
       onClick={this.handleResponse}>
        Connect with facebook
      </Link>
    );
  }
}

FacebookButtonContainer.contextType = AuthConsumer;

export default FacebookButtonContainer;
