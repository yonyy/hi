#!/usr/bin/env node
'use strict';

const program = require('commander');
const colors = require('colors');
const pkg = require('./package.json');
const auth = require('./auth');

colors.setTheme({
    error: 'red',
    info: 'green'
});

program
    .version(pkg.version)
    .option('-u --username', 'The program will prompt the user for their username and password for Hi. This takes higher precendence over the cookie.')
    .option('-c, --cookie', 'The program will prompt the user for the current session\'s cookie. If a cookie is provided, the user may need to periodically update it. The program will fallback to the cookie if no authorizations are provided')
    .parse(process.argv);


var choice = null;
if (program.username) {
    auth.promptForPW()
        .then(info => auth.updateAuth(info))
        .then(msg => console.log('%s', colors.info(msg)))
        .catch(err => console.log('%s', colors.error(err)));
} else if (program.cookie) {
    auth.promptForCookie()
        .then(info => auth.updateAuth(info))
        .then(msg => console.log('%s', colors.info(msg)))
        .catch(err => console.log('%s', colors.error(err)));
} else {
    auth.promptForAuth()
        .then(answer => (answer === 'cookie') ? auth.promptForCookie() : auth.promptForPW())
        .then(info => auth.updateAuth(info))
        .then(msg => console.log('%s', colors.info(msg)))
        .catch(err => console.log('%s', colors.error(err)));
}
