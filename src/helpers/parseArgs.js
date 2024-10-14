import { argv } from 'node:process';

const PREFIX = '--';

export const parseArgs = () => {
  console.log(argv)

  const cliArguments = argv.slice(2);
  return cliArguments.reduce((acc, arg) => {
    if (!arg.startsWith(PREFIX)) {
      return acc;
    }
    return Object.assign(acc, Object.fromEntries([arg.slice(2).split('=')]));
  }, {});
};
