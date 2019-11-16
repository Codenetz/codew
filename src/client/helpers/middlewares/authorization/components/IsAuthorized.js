import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthConsumer } from '../../../contexts/auth';
import get from 'lodash/get';
import PropTypes from 'prop-types';

class IsAuthorized extends Component {
  redirect(url, pageReload) {
    if (pageReload === true) {
      window.location = url;
      return <div/>;
    }

    return <Redirect to={url}/>;
  }

  render = () => {
    const { onAuthorized, onUnAuthorized, roles, pageReload } = this.props;

    const userRole = get(this, 'context.user.role', null);
    const isAdmin = roles.indexOf(userRole) >= 0;

    if (onUnAuthorized && !isAdmin) {
      return this.redirect(onUnAuthorized, pageReload);
    }

    if (onAuthorized && isAdmin) {
      return this.redirect(onAuthorized, pageReload);
    }

    return this.props.children;
  };
}

IsAuthorized.contextType = AuthConsumer;

IsAuthorized.defaultProps = {
  pageReload: false
};

IsAuthorized.propTypes = {
  children: PropTypes.node,
  onAuthorized: PropTypes.string,
  onUnAuthorized: PropTypes.string,
  pageReload: PropTypes.bool,
  roles: PropTypes.array.isRequired
};

export default IsAuthorized;
