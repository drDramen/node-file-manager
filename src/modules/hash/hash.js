import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { getAbsolutePath, InputException, targetExistsException } from '../../helpers/index.js';
import { stateManager } from '../state-manager/state-manager.js';

export const hash = async (args) => {
  try {
    const { currentDir } = stateManager.getState();
    const hash = createHash('sha256');
    const [pathToFile] = args.split(' ');
    const filePath = getAbsolutePath(currentDir, pathToFile);

    await targetExistsException(filePath);

    const data = await readFile(filePath, { encoding: 'utf8' });
    console.log(hash.update(data).digest('hex'));
  } catch (error) {
    const message = error instanceof InputException ? error.message : 'Operation failed';

    throw new Error(message);
  }
};
