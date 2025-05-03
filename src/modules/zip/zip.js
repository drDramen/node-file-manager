import * as path from 'node:path';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import {
  folderExist,
  getAbsolutePath,
  InputException,
  targetExistsException,
} from '../../helpers/index.js';
import { stateManager } from '../state-manager/state-manager.js';

const brotliAction = {
  compress: createBrotliCompress,
  decompress: createBrotliDecompress,
};

const getBrotliAction = (actionName) => {
  const action = brotliAction[actionName];

  if (!action) {
    throw new Error();
  }

  return action;
};

const zip = (actionName) => async (args) => {
  try {
    const { currentDir } = stateManager.getState();
    const [sourcePath, destinationPath] = args.split(' ');
    const absoluteSourcePath = getAbsolutePath(currentDir, sourcePath);
    const absoluteDestinationPath = getAbsolutePath(currentDir, destinationPath);

    await targetExistsException(absoluteSourcePath);
    await folderExist(path.dirname(absoluteDestinationPath));

    const brotliAction = getBrotliAction(actionName);
    const brotli = brotliAction();
    const readStream = createReadStream(absoluteSourcePath);
    const writeStream = createWriteStream(absoluteDestinationPath, { flags: 'wx' });

    await pipeline(readStream, brotli, writeStream);
  } catch (error) {
    const message = error instanceof InputException ? error.message : 'Operation failed';

    throw new Error(message);
  }
};

export const compress = zip('compress');
export const decompress = zip('decompress');
