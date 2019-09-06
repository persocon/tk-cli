# 🚨DEPRECATED 🚨

# tk-cli
[![npm](https://img.shields.io/npm/v/tk-cli.svg)](https://www.npmjs.com/package/tk-cli)

what is **tk-cli**? it's a simple solution to bump your project tag and publish it to npmjs.com

![How does it works](http://i.imgur.com/MYvI7uQ.gif)

### Install
`npm install -g tk-cli`

### Run
`tk-cli publish`


#### TO-DO
- [x] read package.json and bump version there;
- [x] ask user to log in to npm adduser if not logged in. (does not ask, it breaks if not logged but tell the user how to fix);
- [ ] add .tk-clirc;
- [ ] option to just add tag;
- [ ] option to never publish to npm;
- [ ] option to never try to find an package.json.
