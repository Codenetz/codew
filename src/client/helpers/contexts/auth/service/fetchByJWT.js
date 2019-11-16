import axios from 'axios/index';
import get from 'lodash/get';

export default async function(jwt = null) {
  const defaultResponse = null;

  if (jwt === null) {
    return defaultResponse;
  }

  try {
    const response = await axios.get('/api/v1/user', {
      headers: {
        Authorization: 'Bearer ' + jwt
      }
    });

    return get(response, 'data.data.user', defaultResponse);
  } catch (e) {
    /** TODO: Handle error */
    console.error(e);
    return defaultResponse;
  }
}
