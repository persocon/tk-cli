var fs = require("fs");
const chalk = require('chalk');

class File {
  constructor() {

  }
  getPackageJSON() {
    if (fs.existsSync("package.json")) {
      const contents = fs.readFileSync("package.json");
      const jsonContent = JSON.parse(contents);
      return jsonContent;
    } else {
      console.log(chalk.white.bgRed.bold(' No package.json found '));
      process.exit(1);
    }
  }

  bumpPackageJSON(nextTag){
    let jsonContent = this.getPackageJSON();
    jsonContent.version = nextTag;
    var jsonEdited = JSON.stringify(jsonContent, null, 2);
    fs.writeFile('package.json', jsonEdited, 'utf8');
  }

}
module.exports = File;
