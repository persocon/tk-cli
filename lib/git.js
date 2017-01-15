const chalk = require('chalk');
const sh = require('child_process');
const Utils = require('./utils.js');
const Questions = require('./questions.js');

class Git {
  constructor() {
    this.version = {
      tagWithPrefix: '',
      tag: '',
      prefix: '',
      bumpVersion: '',
      commit: '',
    }
  }
  getLatestTag() {
    const allTags = sh.spawnSync('git', ['fetch', '--all', '--tags']);
    if(allTags.stderr.toString() !== '') {
      console.log(chalk.white.bgRed.bold(' Cannot fetch all tags. '));
      console.log(chalk.white.bgRed.bold(' More details: '));
      console.log(chalk.white.bgRed(allTags.stderr.toString().split('\n'))); process.exit(1);
    }

    const questions = new Questions();
    // move those spawnSync and checks to it's own functions
    const getVersionHash = sh.spawnSync('git', ['rev-list', '--tags', '--max-count=1']);
    let isNew = false;
    let v = '';
    if(getVersionHash.stderr.toString()) {
      console.log(chalk.white.bgRed.bold(' Cannot get latest tag hash. '));
      console.log(chalk.white.bgRed.bold(' Will use 0.0.0 for the tag. '));
      isNew = true;
      // console.log(chalk.white.bgRed(getVersionHash.stderr.toString().split('\n'))); process.exit(1);
    }
    if(!isNew) {
      const getVersion = sh.spawnSync('git', ['describe', getVersionHash.stdout.toString().split('\n')[0]]);
      if(getVersion.stderr.toString()) {
        console.log(chalk.white.bgRed.bold(' Cannot get latest tag. '));
        console.log(chalk.white.bgRed.bold(' More details: '));
        console.log(chalk.white.bgRed(getVersion.stderr.toString().split('\n'))); process.exit(1);
      }
      v = getVersion.stdout.toString().split('\n')[0];
    }

    const localVersion = isNew ? '0.0.0' : v;
    this.version.tagWithPrefix = localVersion === '' ? '0.0.0' : localVersion; //redundant test needed
    const utils = new Utils();
    this.version.tag = utils.getNumbers(this.version.tagWithPrefix);
    this.version.prefix = utils.getPrefix(this.version.tagWithPrefix);
    questions.bumpVersion(this.version.tagWithPrefix)
      .then((a) => this.bumpCallback.call(this, a));
  }
  bumpCallback(answers) {
    const questions = new Questions();
    if (answers.bump === 'Type TAG') {
      questions.typeTheTag().then((res) => {
        // check if it's valid
        this.version.bumpVersion = `${this.version.prefix}${res.tag}`;
        this.askCommit();
      });
    } else {
      this.version.bumpVersion = `${this.version.prefix}${this.bumpVersion(answers.bump)}`;
      this.askCommit();
    }
  }
  askCommit() {
    const questions = new Questions();
    questions.commit().then((res) => {
      this.version.commit = res.commit;
      console.log(this)
      // this.executeTag();
    });
  }
  bumpVersion(bump) {
    switch(bump) {
      case 'Major': {
        let split = this.version.tag.split('.');
        split[0] = parseInt(split[0]) + 1;
        split[1] = 0;
        split[2] = 0;
        const result = split.join('.');
        return result;
      }
      case 'Minor': {
        let split = this.version.tag.split('.');
        split[1] = parseInt(split[1]) + 1;
        split[2] = 0;
        const result = split.join('.');
        return result;
      }
      case 'Bugfix': {
        let split = this.version.tag.split('.');
        split[2] = parseInt(split[2]) + 1;
        const result = split.join('.');
        return result;
      }
      default: {
        console.log(chalk.red.bold(' You must provide an option '))
        break;
      }
    }
  }
  executeTag(nextTag, commit) {
    // bumpPackageJSON(nextTag)
    // break all this into each of it's own spanSync
    // move package.json git thing to it's own function
    // do all error checks
    // be happy :)
    exec.quiet([
      `git add package.json`,
      `git commit -m "${commit}"`,
      `git push origin master`,
      `git tag -a ${nextTag} -m "${commit}"`,
      `git push --tags`
    ]).then(function(res){
      console.log(chalk.white.bgBlue(`${nextTag} - Tag Created and pushed!`));
      // getPublishToNPM(publishingToNPM)
    });
  }
}
module.exports = Git;
