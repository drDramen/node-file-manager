import { InputException } from './inputException.js';

export const checkInput = (data) => {
  if (!data) throw new InputException('Invalid input');
};
