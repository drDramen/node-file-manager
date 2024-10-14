import { resolve } from 'path';

export const getAbsolutePath = (cwd, filePath) => {
  return resolve(cwd, filePath);
};
