import React, { Component } from 'react';
import Form from './components/Form';
import { AuthConsumer } from '../../../../../helpers/contexts/auth';

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errors: {
        password: null,
        username: null,
        combined: null
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

    this.setErrors(null, null);

    const { user } = await this.context.authenticate(
      this.state.username,
      this.state.password
    );

    if (user === null) {
      this.setErrors(null, null, 'wrong email or password');
      return;
    }

    window.location = '/';
  };

  setErrors = (username = null, password = null, combined = null) => {
    this.setState({
      errors: {
        password,
        username,
        combined
      }
    });
  };

  validateForm = formData => {
    let errors = {};

    if (formData.username.length < 1) {
      errors.username = 'username required';
    }

    if (formData.password.length < 1) {
      errors.password = 'password required';
    }

    return errors;
  };

  render() {
    const { username, password, errors } = this.state;

    return (
      <div>
        <Form
         username={username}
         password={password}
         errors={errors}
         handleInput={this.handleInput}
         handleSubmit={this.handleSubmit}/>
      </div>
    );
  }
}

LoginContainer.contextType = AuthConsumer;
export default LoginContainer;
