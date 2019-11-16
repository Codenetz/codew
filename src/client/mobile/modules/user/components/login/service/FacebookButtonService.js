import axios from 'axios';
import { FACEBOOK_AUTH_URL } from '../constants';

export async function authenticate(accessToken, userId) {
  const data = { accessToken, userId };
  const request = {
    method: 'POST',
    data,
    url: FACEBOOK_AUTH_URL
  };
  try {
    return await axios(request);
  } catch (e) {
    console.error(e);
    return [];
  }
}
