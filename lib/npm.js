const chalk = require('chalk');
const Questions = require("./questions.js");
const Utils = require("./utils.js");
const sh = require('child_process');

class Npm {
  constructor() {
  }
  testLogin() {
    const tl = sh.spawnSync('npm', ['whoami']);
    if(tl.stderr.toString() !== '') {
      console.log(chalk.white.bgRed.bold(' Not logged in. '));
      console.log(chalk.white.bgRed.bold(' Try npm adduser then npm publish to publish again '));
      return false;
    }
    return true
  }
  publish() {
    const questions = new Questions();
    const utils = new Utils();
    questions.publishToNPM().then((answer) => {
      if (answer.publish) {
        if(this.testLogin()) {
          const p = sh.spawnSync('npm', ['publish']);
          if(p.stderr.toString() !== '') {
            console.log(chalk.white.bgRed.bold(' Cannot publish. '));
            console.log(chalk.white.bgRed.bold(' More details: '));
            console.log(chalk.white.bgRed(` ${p.stderr.toString().split('\n')} `)); process.exit(1);
          }
          console.log(chalk.white.bgBlue(` Publishing! `));
        }
      } else {
        utils.exitCLI();
      }
    });
  }
}
module.exports = Npm;
