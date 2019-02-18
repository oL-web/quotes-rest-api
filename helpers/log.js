const chalk = require("chalk");
const nodeEnv = require("../helpers/nodeEnv");

module.exports = text => {
  if (!nodeEnv.isTest) {
    if (typeof text === "object") console.dir(text, { colors: true });
    else console.log(chalk.black.bgWhiteBright(text));
  }
};
