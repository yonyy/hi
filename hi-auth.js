#!/usr/bin/env node
'use strict';

const program = require('commander');
const colors = require('colors');
const pkg = require('./package.json');
const auth = require('./utils/auth');

colors.setTheme({
	error: 'red',
	info: 'green'
});

program
	.version(pkg.version)
	.option('-d, --delete', 'Delete config file containing credentials')
	.parse(process.argv);

if (program.delete) {
	auth.deleteAuth()
		.then(msg => console.log('%s', colors.info(msg)))
		.catch(err => console.log('%s', colors.error(err)));
} else {
	auth.promptForAuth()
		.then(info => auth.updateAuth(info))
		.then(msg => console.log('%s', colors.info(msg)))
		.catch(err => console.log('%s', colors.error(err)));
}
