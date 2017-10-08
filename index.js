#!/usr/bin/env node
'use strict';

const program = require('commander');
const pkg = require('./package.json');

program
    .version(pkg.version)
    .command('branch', 'List or delete (if used with -d) the remote-tracking branches')
    .command('auth', 'Provide credentials to be able to use the API. Options are to provide username w/ password or current the session\'s cookie. If a cookie is provided, the user may need to periodically update it. The program will fallback to the cookie if no authorizations are provided')
    .parse(process.argv);
