import { isAbsolute } from 'node:path';
import { readdir } from 'node:fs/promises';
import { folderExist, getAbsolutePath } from '../../helpers/index.js';
import { stateManager } from '../state-manager/state-manager.js';

export const goToDirectory = async (args) => {
  const { platform, currentDir } = stateManager.getState();
  const [path] = args.split(' ');
  const isWin = platform === 'win32' && path.includes(':') && !isAbsolute(path);
  const targetPath = getAbsolutePath(isWin ? '/' : currentDir, path);

  await folderExist(targetPath);
  stateManager.setState({ currentDir: targetPath });
};

export const getList = async () => {
  try {
    const { currentDir } = stateManager.getState();
    const direntList = await readdir(currentDir, { withFileTypes: true });

    const formattedList = direntList
      .map((dirent) => ({
        Name: dirent.name,
        Type: dirent.isFile() ? 'file' : dirent.isDirectory() ? 'directory' : '',
      }))
      .sort((a, b) => a.Type.localeCompare(b.Type) || a.Name.localeCompare(b.Name));

    console.table(formattedList);
  } catch {
    throw new Error('Operation failed');
  }
};

export const upDirectory = () => goToDirectory('');
