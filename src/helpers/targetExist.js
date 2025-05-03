import { access } from 'node:fs/promises';
import { InputException } from './inputException.js';

export const targetExistsException = async (target) => {
  try {
    await access(target);
  } catch {
    throw new InputException();
  }
};

export const targetExists = async (target) => {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
};
