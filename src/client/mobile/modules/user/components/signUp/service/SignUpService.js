import axios from 'axios';
import { SIGN_UP_URL } from '../constants';

export async function signUp(data) {
  const request = {
    method: 'POST',
    data,
    url: SIGN_UP_URL
  };
  try {
    return await axios(request);
  } catch (e) {
    console.error(e);
    return [];
  }
}
