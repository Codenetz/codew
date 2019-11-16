import React from 'react';
import PropTypes from 'prop-types';

const Form = ({
  email,
  password,
  username,
  errors,
  handleInput,
  handleSubmit
}) => (
  <form>
    <input
     type="text"
     name="email"
     placeholder="email"
     value={email}
     autoComplete="off"
     onChange={handleInput}/>
    {errors.email && (
      <div>
        <span>
          {errors.email}
        </span>
      </div>
    )}
    <input
     type="text"
     name="username"
     placeholder="username"
     value={username}
     autoComplete="off"
     onChange={handleInput}/>
    {errors.username && (
      <div>
        <span>
          {errors.username}
        </span>
      </div>
    )}
    <input
     type="password"
     name="password"
     placeholder="password"
     value={password}
     autoComplete="off"
     onChange={handleInput}/>
    {errors.password && (
      <div>
        <span>
          {errors.password}
        </span>
      </div>
    )}
    <button
     type="submit"
     onClick={handleSubmit}>
      Sign up
    </button>
  </form>
);

Form.propTypes = {
  email: PropTypes.string,
  username: PropTypes.string,
  password: PropTypes.string,
  errors: PropTypes.object,
  handleInput: PropTypes.func,
  handleSubmit: PropTypes.func
};

export default Form;
