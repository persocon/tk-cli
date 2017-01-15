#!/usr/bin/env node --harmony
// var chalk = require('chalk');
const program = require('commander');
// var inquirer = require('inquirer');
// var exec = require('executive');
// var fs = require("fs");
const Publish = require("./lib/publish.js");


// function getLatestTag() {
//   exec.quiet('git describe $(git rev-list --tags --max-count=1)').then(function (item) {
//     if(item['stderr']) { console.log(chalk.white.bgRed(item['stderr'].split('\n'))); process.exit(1)}
//     VERSIONTAGWITHPREFIX = item['stdout'] === '' ? '0.0.0' : item.stdout.split('\n')[0];
//     VERSIONTAG = getNumbers(VERSIONTAGWITHPREFIX);
//     VERSIONPREFIX = getPrefix(VERSIONTAGWITHPREFIX);
//     getPublishQuestions(handleQuestionCallback);
//   });
// }
//
// function getPublishQuestions(callback) {
//   var questions = [
//     {
//       type: 'list',
//       name: 'bump',
//       message: `What version to bump? (Previous Tag: ${chalk.green(VERSIONTAGWITHPREFIX)})`,
//       choices: [ 'Major', 'Minor', 'Bugfix', 'Type TAG' ],
//       default: 'Bugfix'
//     }
//   ];
//
//   inquirer.prompt(questions).then(callback);
// }
//
// function getTag(callback){
//   var questions = [
//     {
//       type: 'input',
//       name: 'tag',
//       message: 'Type the next version tag',
//     }
//   ];
//
//   inquirer.prompt(questions).then(callback);
// }
//
// function getCommit(callback) {
//   var questions = [
//     {
//       type: 'input',
//       name: 'commit',
//       message: 'Message for the commit',
//     }
//   ];
//
//   inquirer.prompt(questions).then(callback);
// }
//
// function getPublishToNPM(callback) {
//   var questions = [
//     {
//       type: 'confirm',
//       name: 'publish',
//       message: 'Publish to NPM?',
//     }
//   ];
//
//   inquirer.prompt(questions).then(callback);
// }
//
// function handleQuestionCallback(answers) {
//   if (answers.bump === 'Type TAG') {
//     getTag(function(tag) {
//       BUMPVERSION = `${VERSIONPREFIX}${tag.tag}`;
//     });
//   } else {
//     BUMPVERSION = `${VERSIONPREFIX}${handleBumpVersion(answers.bump)}`;
//   }
//   getCommit(function(com) {
//     COMMIT = com.commit;
//     executeTag(BUMPVERSION, COMMIT);
//   });
// }
//
// function handleBumpVersion(bump) {
//   switch(bump) {
//     case 'Major':
//       var split = VERSIONTAG.split('.');
//       split[0] = parseInt(split[0]) + 1;
//       split[1] = 0;
//       split[2] = 0;
//       var resultMajor = split.join('.');
//       return resultMajor;
//       break;
//     case 'Minor':
//       var split = VERSIONTAG.split('.');
//       split[1] = parseInt(split[1]) + 1;
//       split[2] = 0;
//       var resultMinor = split.join('.');
//       return resultMinor;
//       break;
//     case 'Bugfix':
//       var split = VERSIONTAG.split('.');
//       split[2] = parseInt(split[2]) + 1;
//       var resultBugfix = split.join('.');
//       return resultBugfix;
//       break;
//     default:
//       console.log(chalk.red('You must provide an option'))
//       break;
//   }
// }
//
// function exitCLIWithGoodBye(c) {
//   if(c['stderr']) {
//     console.log(c['stderr']);
//   }
//   console.log(chalk.white.bgGreen(`Good bye!`));
//   process.exit(0);
// }
//
// function publishingToNPM(b) {
//   if (b.publish) {
//     console.log(chalk.white.bgBlue(`Publishing!`));
//     exec.quiet('npm publish').then(exitCLIWithGoodBye);
//   } else {
//     exitCLIWithGoodBye();
//   }
// }
//
// function getPackageJSON() {
//   if (fs.existsSync("package.json")) {
//     var contents = fs.readFileSync("package.json");
//     var jsonContent = JSON.parse(contents);
//     return jsonContent;
//   } else {
//     console.log(chalk.white.bgRed('No package.json found'));
//     process.exit(1);
//   }
// }
//
// function bumpPackageJSON(nextTag){
//   var jsonContent = getPackageJSON();
//   jsonContent.version = nextTag;
//   var jsonEdited = JSON.stringify(jsonContent, null, 2);
//   fs.writeFile('package.json', jsonEdited, 'utf8');
// }
//
// function executeTag(nextTag, commit) {
//   bumpPackageJSON(nextTag)
//   exec.quiet([
//     `git add package.json`,
//     `git commit -m "${commit}"`,
//     `git push origin master`,
//     `git tag -a ${nextTag} -m "${commit}"`,
//     `git push --tags`
//   ]).then(function(res){
//     console.log(chalk.white.bgBlue(`${nextTag} - Tag Created and pushed!`));
//     getPublishToNPM(publishingToNPM)
//   });
// }

program
  .option('publish', 'Start publishing process')
  .parse(process.argv)

if (program.publish) {
  const publish = new Publish();
  publish.init();
}
