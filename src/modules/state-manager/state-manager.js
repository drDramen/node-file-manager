import { homedir } from 'node:os';

const INITIAL_STATE = {
  platform: process.platform,
  currentDir: homedir(),
};

const createState = (initialState = INITIAL_STATE) => {
  let state = initialState;

  return {
    getState(key) {
      return key ? state[key] : state;
    },

    setState(newState) {
      state = { ...state, ...newState };
    },
  };
};

export const stateManager = createState();
