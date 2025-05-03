import { arch, EOL, userInfo, cpus, homedir } from 'node:os';

const eolInfo = () => {
  console.log(`Default system End-Of-Line: ${JSON.stringify(EOL)}`);
};

const cpusInfo = () => {
  const cpuList = cpus().map(({ model, speed }) => ({
    Model: model.trim(),
    'Clock rate (GHz)': speed / 1000,
  }));
  console.log(`Overall amount of CPUS: ${cpuList.length}`);
  console.table(cpuList);
};

const homedirInfo = () => {
  console.log(`Home directory: ${homedir()}`);
};

const usernameInfo = () => {
  console.log(`Current system User Name: ${userInfo().username}`);
};

const architectureInfo = () => {
  console.log(`CPU architecture: ${arch()}`);
};

const osArgumentCommand = {
  '--EOL': eolInfo,
  '--cpus': cpusInfo,
  '--homedir': homedirInfo,
  '--username': usernameInfo,
  '--architecture': architectureInfo,
};

export const osInfo = (args) => {
  const validArguments = args.match(/--\S+/g);

  validArguments.forEach((arg) => {
    const command = osArgumentCommand[arg];

    command?.();
  });
};
