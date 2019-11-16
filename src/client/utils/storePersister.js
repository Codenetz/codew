export const setPersistStore = (state, name) => {
  window.localStorage.setItem(name, JSON.stringify(state));
  return state;
};

export const getPersistStore = (default_state, name) => {
  let state = window.localStorage.getItem(name);

  if(state) {
    return JSON.parse(state);
  }

  return default_state;
};