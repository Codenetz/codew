import React, { Component } from 'react';
import Context from './context';
import fetchByJWT from './service/fetchByJWT';
import { setToken, getValidToken, removeToken } from './service/token';
import auth from './service/auth';
import PropTypes from 'prop-types';

class AuthProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: null
    };
  }

  componentDidMount = async () => {
    const user = await fetchByJWT(getValidToken());
    this.setState({ user, loading: false });
  };

  setUser = user => {
    this.setState({ user });
  };

  isAuthenticated = () => {
    return this.state.user !== null;
  };

  authenticate = async (email, password, updateState = false) => {
    const authResponse = await auth(email, password);
    const { token, user } = authResponse;

    if (user !== null) {
      if (updateState) {
        this.setUser(user);
      }
      setToken(token);
      return authResponse;
    }

    return authResponse;
  };

  render() {
    const { user, loading } = this.state;

    if (loading === true) {
      return <div/>;
    }

    return (
      <Context.Provider
       value={{
         user,
         authenticate: this.authenticate,
         setUser: this.setUser,
         isAuthenticated: this.isAuthenticated,
         getToken: getValidToken,
         setToken: setToken,
         logout: removeToken
       }}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

AuthProvider.propTypes = {
  children: PropTypes.node
};

export default AuthProvider;
