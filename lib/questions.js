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
    var questions = [
      {
        type: 'input',
        name: 'tag',
        message: 'Type the next version tag',
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
  publishToNPM(callback) {
    var questions = [
      {
        type: 'confirm',
        name: 'publish',
        message: 'Publish to NPM?',
      }
    ];

    inquirer.prompt(questions).then(callback);
  }
}
module.exports = Questions;
