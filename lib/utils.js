const chalk = require('chalk');
class Utils {
  getNumbers(input) {
    var m = input.match(/[0-9]+/g);
    m = m.join('.');
    return m;
  }

  getPrefix(input) {
    var m = input.match(/[a-zA-Z]+/g);
    return m !== null ? m : '';
  }
  exitCLI() {
    console.log(chalk.white.bgGreen(` Good bye! `));
    process.exit(0);
  }
}

module.exports = Utils;
