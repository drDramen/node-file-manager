import { EOL } from 'node:os';
import { stdin as input, stdout as output, exit } from 'node:process';
import { createInterface } from 'node:readline';
import { getCurrentDirMessage } from '../../helpers/index.js';
import { stateManager } from '../state-manager/state-manager.js';

export const createRepl = (inputHandler) => {
  const rl = createInterface({ input, output, prompt: '> ' });
  const { username, currentDir } = stateManager.getState();

  rl.on('close', () => {
    console.log(`${EOL}Thank you for using File Manager, ${username}, goodbye!`);
    exit();
  }).on('line', async (line) => {
    if (line.trim() === '.exit') {
      rl.close();
    }

    await inputHandler(line);
    rl.prompt();
  });

  console.log(`${EOL}Welcome to the File Manager, ${username}!`);
  console.log(getCurrentDirMessage(currentDir));
  rl.prompt();
};
