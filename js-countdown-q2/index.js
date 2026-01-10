const countdown = require("./countdown");

const input = Number(process.argv[2]);

countdown(input)
  .then(console.log)
  .catch(console.error);