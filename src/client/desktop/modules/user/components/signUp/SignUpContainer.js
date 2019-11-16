import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Form from './components/Form';
import { AuthConsumer } from '../../../../../helpers/contexts/auth';
import { signUp } from './service/SignUpService';

class SignUpContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      username: '',
      errors: {
        password: null,
        username: null,
        email: null
      }
    };
  }

  handleInput = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();

    /** Checks if form is valid */
    const errors = this.validateForm(this.state);
    const isValid = Object.values(errors).filter(Boolean).length <= 0;

    if (!isValid) {
      this.setState({ errors });
      return;
    }

    this.setErrors(null, null, null);

    const { email, username, password } = this.state;
    signUp({ email, username, password })
      .then(response => {
        let data = response.data.data;
        this.context.setToken(data.jwt);
        this.context.setUser(data.user);
      })
      .catch(e => console.error(e));
  };

  setErrors = (email = null, password = null, username = null) => {
    this.setState({
      errors: {
        password,
        email,
        username
      }
    });
  };

  validateForm = formData => {
    let errors = {};

    if (formData.email.length < 1) {
      errors.email = 'email address required';
    }

    if (formData.password.length < 1) {
      errors.password = 'password required';
    }

    if (formData.username.length < 1) {
      errors.username = 'username required';
    }

    return errors;
  };

  render() {
    const { email, password, username, errors } = this.state;

    return (
      <div>
        <Form
         email={email}
         username={username}
         password={password}
         errors={errors}
         handleInput={this.handleInput}
         handleSubmit={this.handleSubmit}/>
      </div>
    );
  }
}

SignUpContainer.contextType = AuthConsumer;
SignUpContainer.propTypes = {
  history: PropTypes.object
};
export default withRouter(SignUpContainer);
