#!/usr/bin/env node
'use strict';

const program = require('commander');
<<<<<<< HEAD
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
=======
const colors = require('colors');
const pkg = require('./package.json');
const auth = require('./auth');
const git = require('./git');
const hi = require('./hi');

colors.setTheme({
    error: 'red'
});

program
    .version(pkg.version)
    .command('branch', 'List or delete (if used with -d) the remote-tracking branches')
    .command('auth', 'Provide credentials to be able to use the API. Options are to provide username w/ password or current the session\'s cookie. If a cookie is provided, the user may need to periodically update it. The program will fallback to the cookie if no authorizations are provided')
    .parse(process.argv);
>>>>>>> Authorization almost done
