import { dirname, basename } from 'node:path';
import { rename, rm, stat } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import {
  getAbsolutePath,
  InputException,
  targetExists,
  targetExistsException,
} from '../../helpers/index.js';
import { stateManager } from '../state-manager/state-manager.js';

export const readFile = (args) => {
  return new Promise((res, rej) => {
    const { currentDir } = stateManager.getState();
    const [pathToFile] = args.split(' ');
    const filePath = getAbsolutePath(currentDir, pathToFile);

    targetExistsException(filePath).catch(rej);

    const readStream = createReadStream(filePath, {
      encoding: 'utf-8',
    });

    readStream
      .on('data', (chunk) => {
        console.log(chunk);
      })
      .on('error', () => rej(new Error('Operation failed')))
      .on('end', res);
  });
};

export const createFile = async (args) => {
  const { currentDir } = stateManager.getState();
  const [fileName] = args.split(' ');
  const filePath = getAbsolutePath(currentDir, fileName);

  const isFileExist = await targetExists(filePath);

  if (isFileExist) {
    throw new InputException();
  }

  try {
    await writeFile(filePath, '', 'utf8');
  } catch {
    throw new Error('Operation failed');
  }
};

export const renameFile = async (args) => {
  try {
    const { currentDir } = stateManager.getState();
    const [pathToFile, newFileName] = args.split(' ');
    const filePath = getAbsolutePath(currentDir.cwd, pathToFile);
    const fileStats = await stat(filePath);
    const newFilePath = getAbsolutePath(dirname(filePath), newFileName);

    if (!fileStats.isFile()) {
      throw new InputException();
    }

    await rename(filePath, newFilePath);
  } catch (error) {
    const message = error instanceof InputException ? error.message : 'Operation failed';

    throw new Error(message);
  }
};

export const copyFile = async (args) => {
  try {
    const { currentDir } = stateManager.getState();
    const [pathToFile, pathToDestination] = args.split(' ');
    const filePath = getAbsolutePath(currentDir, pathToFile);
    const destinationPath = getAbsolutePath(currentDir, pathToDestination);
    const fileStats = await stat(filePath);
    const destinationStats = await stat(destinationPath);
    const destinationFilePath = getAbsolutePath(destinationPath, basename(filePath));

    const isFileExist = await targetExists(destinationFilePath);

    if (isFileExist || !(fileStats.isFile() && destinationStats.isDirectory())) {
      throw new InputException();
    }

    const readStream = createReadStream(filePath);
    const writeStream = createWriteStream(destinationFilePath, { flags: 'wx' });

    readStream.pipe(writeStream);
  } catch (error) {
    const message = error instanceof InputException ? error.message : 'Operation failed';

    throw new Error(message);
  }
};

export const removeFile = async (args) => {
  const { currentDir } = stateManager.getState();
  const [pathToFile] = args.split(' ');
  const filePath = getAbsolutePath(currentDir, pathToFile);

  await targetExistsException(filePath);

  try {
    await rm(filePath);
  } catch {
    throw new Error('Operation failed');
  }
};

export const moveFile = async (args) => {
  try {
    await copyFile(args);
    await removeFile(args);
  } catch {
    throw new Error('Operation failed');
  }
};
