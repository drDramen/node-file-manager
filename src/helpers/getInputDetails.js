export const getInputDetails = (string) => {
  const firstSpaceIndex = string.indexOf(' ');
  const commandName = firstSpaceIndex !== -1 ? string.slice(0, firstSpaceIndex) : string;
  const args = firstSpaceIndex !== -1 ? string.slice(firstSpaceIndex + 1).trim() : '';

  return { commandName, args };
};
