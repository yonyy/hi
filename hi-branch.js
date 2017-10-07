#!/usr/bin/env node
'use strict';

const program = require('commander');
const colors = require('colors');
const pkg = require('./package.json');
const git = require('./git');
const hi = require('./hi');

colors.setTheme({
    error: 'red'
});

program
    .version(pkg.version)
    .option('-r, --remote', 'List the remote-tracking branches')
    .parse(process.argv);

git.getBranches(program.remote)
    .then(branches => {
        hi.describe(branches);
    })
    .catch((err) => {
        console.log('%s %s', colors.error('Error:'), err.message);
    });
