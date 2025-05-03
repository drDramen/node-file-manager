import { resolve } from 'node:path';

export const getAbsolutePath = (cwd, filePath) => {
  return resolve(cwd, filePath);
};
