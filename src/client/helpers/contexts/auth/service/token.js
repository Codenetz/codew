import { TOKEN_KEY } from '../constants';

export function removeToken() {
  return localStorage.removeItem(TOKEN_KEY);
}

export function setToken(token) {
  return localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isTokenValid(token) {
  return token === token;
}

export function getValidToken() {
  const token = getToken();
  if (token !== null && !isTokenValid(token)) {
    setToken(null);
    return null;
  }

  return token;
}
