#!/usr/bin/env node
'use strict';

const program = require('commander');
const colors = require('colors/safe');
const pkg = require('./package.json');
const git = require('./git');
const hi = require('./hi');

program
    .version(pkg.version)
    .option('-r, --remote', 'List or delete (if used with -d) the remote-tracking branches')
    .parse(process.argv);

colors.setTheme({
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

const branches = git.getBranches(program.remote)
                .catch((err) => {
                    console.log(colors.error('Error'), err.message);
                });

Promise.all([branches]).then(values => {
    let [branches] = values;
    return hi.describe(branches);
});
