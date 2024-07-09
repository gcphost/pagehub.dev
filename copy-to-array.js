const { exit } = require("process");

const input = `min-w-0	min-width: 0px;
min-w-full	min-width: 100%;
min-w-min	min-width: min-content;
min-w-max	min-width: max-content;
min-w-fit	min-width: fit-content;


`;

const output = input
  .split("\n")
  .map((_) => _.split("\t")[0])
  .filter((_) => _);

console.log(output);

exit;
