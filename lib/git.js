const chalk = require('chalk');
const sh = require('child_process');
const Utils = require('./utils.js');
const Questions = require('./questions.js');
const File = require('./file.js');
const Npm = require('./npm.js');

class Git {
  constructor() {
    this.version = {
      tagWithPrefix: '',
      tag: '',
      prefix: '',
      bumpVersion: '',
      commit: '',
      hash: '',
    }
  }
  fetchAllTags() {
    const allTags = sh.spawnSync('git', ['fetch', '--all', '--tags']);
    if(allTags.stderr.toString() !== '') {
      console.log(chalk.white.bgRed.bold(' Cannot fetch all tags. '));
      console.log(chalk.white.bgRed.bold(' More details: '));
      console.log(chalk.white.bgRed(` ${allTags.stderr.toString().split('\n')} `)); process.exit(1);
    }
  }
  getHashTag() {
    let isNew = false;
    const getVersionHash = sh.spawnSync('git', ['rev-list', '--tags', '--max-count=1']);
    if(getVersionHash.stderr.toString()) {
      console.log(chalk.white.bgRed.bold(' Cannot get latest tag hash. '));
      console.log(chalk.white.bgRed.bold(' Will use 0.0.0 for the tag. '));
      isNew = '0.0.0';
    } else {
      this.version.hash = getVersionHash.stdout.toString().split('\n')[0];
    }
    return isNew;
  }
  getTagVersion() {
    const getVersion = sh.spawnSync('git', ['describe', this.version.hash]);
    if(getVersion.stderr.toString()) {
      console.log(chalk.white.bgRed.bold(' Cannot get latest tag. '));
      console.log(chalk.white.bgRed.bold(' More details: '));
      console.log(chalk.white.bgRed(` ${getVersion.stderr.toString().split('\n')} `)); process.exit(1);
    }
    return getVersion.stdout.toString().split('\n')[0];
  }
  getLatestTag() {
    const questions = new Questions();
    this.fetchAllTags();
    let v = this.getHashTag();
    if(!v) {
      v = this.getTagVersion();
    }

    this.version.tagWithPrefix = v ? v : '0.0.0';

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
      this.executeTag();
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
  addPackageJson() {
    const pkg = sh.spawnSync('git', ['add', 'package.json']);
    if(pkg.stderr.toString()) {
      console.log(chalk.white.bgRed.bold(' Cannot add package.json. '));
      console.log(chalk.white.bgRed.bold(' More details: '));
      console.log(chalk.white.bgRed(` ${pkg.stderr.toString().split('\n')} `)); process.exit(1);
    }
  }
  addCommitForVersion(){
    const cmt = sh.spawnSync('git', ['commit', '-m', `"${this.version.commit}"`]);
    if(cmt.stderr.toString()) {
      console.log(chalk.white.bgRed.bold(' Cannot commit. '));
      console.log(chalk.white.bgRed.bold(' More details: '));
      console.log(chalk.white.bgRed(` ${cmt.stderr.toString().split('\n')} `)); process.exit(1);
    }
  }
  pushToMaster() {
    const p = sh.spawnSync('git', ['push', 'origin', 'master']);
    if(p.stderr.toString()) {
      console.log(chalk.white.bgRed.bold(' Cannot push origin to master. '));
      console.log(chalk.white.bgRed.bold(' More details: '));
      console.log(chalk.white.bgRed(` ${p.stderr.toString().split('\n')} `)); process.exit(1);
    }
  }
  addTag() {
    const t = sh.spawnSync('git', ['tag', '-a', `${this.version.bumpVersion}`, '-m', `${this.version.commit}`]);
    if(t.stderr.toString()) {
      console.log(chalk.white.bgRed.bold(` Cannot add tag ${this.version.bumpVersion}. `));
      console.log(chalk.white.bgRed.bold(' More details: '));
      console.log(chalk.white.bgRed(` ${t.stderr.toString().split('\n')} `)); process.exit(1);
    }
  }
  pushTag() {
    const pTag = sh.spawnSync('git', ['push', '--tags']);
    if(pTag.stderr.toString()) {
      console.log(chalk.white.bgRed.bold(' Cannot push the tag. '));
      console.log(chalk.white.bgRed.bold(' More details: '));
      console.log(chalk.white.bgRed(` ${pTag.stderr.toString().split('\n')} `)); process.exit(1);
    }
  }
  executeTag() {
    const file = new File();
    file.bumpPackageJSON(this.version.bumpVersion);
    this.addPackageJson();
    this.addCommitForVersion();
    this.pushToMaster();
    this.addTag();
    this.pushTag();
    const npm = new Npm();
    console.log(chalk.white.bgBlue(` ${this.version.bumpVersion} - Tag Created and pushed! `));
    npm.publish();
  }
}
module.exports = Git;
