const chalk = require('chalk');
const inquirer = require('inquirer');
class Questions {
  constructor() {

  }
  bumpVersion(previousTag) {
    const questions = [
      {
        type: 'list',
        name: 'bump',
        message: `What version to bump? (Previous Tag: ${chalk.green(previousTag)})`,
        choices: [ 'Major', 'Minor', 'Bugfix', 'Type TAG' ],
        default: 'Bugfix'
      }
    ];

    return inquirer.prompt(questions); //.then((answers) => callback.call(this, answers));
  }
  typeTheTag(callback){
    function fnTag(tag) {
      let done = this.async();
      const regex = /[0-9]+.[0-9]+.[0-9]+/g;
      if (regex.exec(tag)) {
        done(null, true);
      } else {
        done(chalk.white.bgRed.bold(' Tag must be "[0-9].[0-9].[0-9]", no need for prefix. '));
      }
    }
    var questions = [
      {
        type: 'input',
        name: 'tag',
        message: 'Type the next version tag',
        validate: fnTag,
      }
    ];

    return inquirer.prompt(questions);//.then(callback);
  }
  commit() {
    var questions = [
      {
        type: 'input',
        name: 'commit',
        message: 'Message for the commit:',
      }
    ];

    return inquirer.prompt(questions);//callback.call(this, answers));
  }
  publishToNPM() {
    var questions = [
      {
        type: 'confirm',
        name: 'publish',
        message: 'Publish to NPM?',
      }
    ];

    return inquirer.prompt(questions);//.then(callback);
  }
}
module.exports = Questions;
