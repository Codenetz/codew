import React from 'react';
import PropTypes from 'prop-types';

const Form = ({ username, password, errors, handleInput, handleSubmit }) => {
  return (
    <form>
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
      {errors.combined && (
        <div>
          <span>
            {errors.combined}
          </span>
        </div>
      )}
      <button
       type="submit"
       onClick={handleSubmit}>
        Login
      </button>
    </form>
  );
};

Form.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string,
  errors: PropTypes.object,
  handleInput: PropTypes.func,
  handleSubmit: PropTypes.func
};

export default Form;
