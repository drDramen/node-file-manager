import { getInputDetails, checkInput, getCurrentDirMessage, parseArgs } from '../helpers/index.js';
import { stateManager } from './state-manager/state-manager.js';
import { createRepl } from './repl/repl.js';
import { osInfo } from './os/os.js';
import { getList, goToDirectory, upDirectory } from './nwd/nwd.js';
import { compress, decompress } from './zip/zip.js';
import { hash } from './hash/hash.js';
import { readFile, createFile, copyFile, renameFile, removeFile, moveFile } from './files/files.js'

const commands = {
  up: upDirectory,
  cd: goToDirectory,
  ls: getList,
  os: osInfo,
  compress,
  decompress,
  hash,
  cat: readFile,
  add: createFile,
  cp: copyFile,
  rn: renameFile,
  mv: moveFile,
  rm: removeFile
};

const inputHandler = async (input) => {
  const validInput = input.trim();

  if (!validInput) {
    return;
  }

  const { commandName, args } = getInputDetails(validInput);
  const command = commands[commandName];
  try {
    checkInput(command);

    await command(args);
  } catch (error) {
    console.error(error.message);
  }

  const currentDir = stateManager.getState('currentDir');
  console.log(getCurrentDirMessage(currentDir));
};

export const app = () => {
  const args = parseArgs();
  const username = args['username'] ?? 'Username';

  stateManager.setState({ username });
  createRepl(inputHandler);
};
