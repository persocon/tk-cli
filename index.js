#!/usr/bin/env node --harmony
const program = require('commander');
const Publish = require("./lib/publish.js");
program
  .option('publish', 'Start publishing process')
  .parse(process.argv)

if (program.publish) {
  const publish = new Publish();
  publish.init();
}
