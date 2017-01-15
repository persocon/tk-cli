const Git = require("./git.js");
class Publish {
  constructor() {

  }
  init() {
    const git = new Git();
    git.getLatestTag();
  }
}
module.exports = Publish;
