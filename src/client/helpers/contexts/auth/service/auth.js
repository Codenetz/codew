import axios from 'axios/index';
import get from 'lodash/get';

export default async function(email, password) {
  const defaultResponse = {
    user: null,
    token: null
  };

  try {
    const response = await axios.post('/api/v1/authenticate', {
      username: email,
      password
    });

    const user = get(response, 'data.data.user', defaultResponse.user);
    const token = get(response, 'data.data.jwt', defaultResponse.token);

    return {
      user,
      token
    };
  } catch (e) {
    /** TODO: Handle error */
    console.error(e);
    return defaultResponse;
  }
}
