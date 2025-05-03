import { stat } from 'node:fs/promises';
import { InputException } from './inputException.js';

export const folderExist = async (target) => {
  try {
    const stats = await stat(target);

    if (!stats.isDirectory()) {
      throw new Error();
    }
  } catch (error) {
    throw new InputException();
  }
};
