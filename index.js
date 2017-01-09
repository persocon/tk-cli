#!/usr/bin/env node --harmony
var chalk = require('chalk');
var program = require('commander');
var inquirer = require('inquirer');
var exec = require('executive');
var VERSIONTAGWITHPREFIX;
var VERSIONPREFIX;
var VERSIONTAG;
var BUMPVERSION;
var COMMIT;

function getNumbers(input) {
    var m = input.match(/[0-9]+/g);
    m = m.join('.');
    return m;
}
function getPrefix(input) {
    var m = input.match(/[a-zA-Z]+/g);
    return m !== null ? m : '';
}


function getLatestTag() {
  exec.quiet('git tag | tail -1').then(function (item) {
    VERSIONTAGWITHPREFIX = item.stdout.split('\n')[0];
    VERSIONTAG = getNumbers(VERSIONTAGWITHPREFIX);
    VERSIONPREFIX = getPrefix(VERSIONTAGWITHPREFIX);
    getPublishQuestions(handleQuestionCallback);
  });

}

function getPublishQuestions(callback) {
  var questions = [
    {
      type: 'list',
      name: 'bump',
      message: `What version to bump? (Previous Tag: ${chalk.green(VERSIONTAGWITHPREFIX)})`,
      choices: [ 'Major', 'Minor', 'Bugfix', 'Type TAG' ],
      default: 'Bugfix'
    }
  ];

  inquirer.prompt(questions).then(callback);
}

function getTag(callback){
  var questions = [
    {
      type: 'input',
      name: 'tag',
      message: 'Type the next version tag',
    }
  ];

  inquirer.prompt(questions).then(callback);
}

function getCommit(callback) {
  var questions = [
    {
      type: 'input',
      name: 'commit',
      message: 'Message for the commit',
    }
  ];

  inquirer.prompt(questions).then(callback);
}

function handleQuestionCallback(answers) {
  if (answers.bump === 'Type TAG') {
    getTag(function(tag) {
      BUMPVERSION = `${VERSIONPREFIX}${tag.tag}`;
    });
  } else {
    BUMPVERSION = `${VERSIONPREFIX}${handleBumpVersion(answers.bump)}`;
  }
  getCommit(function(com) {
    COMMIT = com.commit;
    executeTag(BUMPVERSION, COMMIT);
  });
}

function handleBumpVersion(bump) {
  switch(bump) {
    case 'Major':
      var split = VERSIONTAG.split('.');
      split[0] = parseInt(split[0]) + 1;
      split[1] = 0;
      split[2] = 0;
      var resultMajor = split.join('.');
      return resultMajor;
      break;
    case 'Minor':
      var split = VERSIONTAG.split('.');
      split[1] = parseInt(split[1]) + 1;
      split[2] = 0;
      var resultMinor = split.join('.');
      return resultMinor;
      break;
    case 'Bugfix':
      var split = VERSIONTAG.split('.');
      split[2] = parseInt(split[2]) + 1;
      var resultBugfix = split.join('.');
      return resultBugfix;
      break;
    default:
      console.log(chalk.red('You must provide an option'))
      break;
  }
}

function executeTag(nextTag, commit) {

  exec.quiet([`git tag -a ${nextTag} -m "${commit}"`, `git push --tags`]).then(function(res){
    console.log(chalk.white.bgBlue(`${nextTag} - Tag Created and pushed!`));
  });
}


program
  .version('0.0.1')
  .option('publish', 'Start publishing process')
  .parse(process.argv)

if (program.publish) {
  getLatestTag();
}
