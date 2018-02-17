#!/usr/bin/env node
'use strict';

const program = require('commander');
const colors = require('colors');
const pkg = require('./package.json');
const git = require('./utils/git');
const branch = require('./utils/branch');

colors.setTheme({
    error: 'red',
    info: 'green'
});

program
    .version(pkg.version)
    .option('-r, --remote', 'List the remote-tracking branches')
    .parse(process.argv);

git.getBranchObjs(program.remote)
    .then(branch.describe)
    .catch(err => console.log('%s %s', colors.error('Error:'), err));
