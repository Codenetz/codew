import React, { Component } from 'react';
import { AuthConsumer } from '../../helpers/contexts/auth';

class LogoutPage extends Component {
  componentDidMount() {
    this.context.logout();

    /** Only for UI animation */
    window.setTimeout(() => {
      window.location = '/';
    }, 1000);
  }

  render() {
    return (
      <span>
Loading...
      </span>
    );
  }
}

LogoutPage.contextType = AuthConsumer;
export default LogoutPage;
