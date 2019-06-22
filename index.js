#!/usr/bin/env node
'use strict';

const program = require('commander');
const pkg = require('./package.json');

program
  .version(pkg.version)
  .command(
    'branch',
    'List or delete (if used with -d) the remote-tracking branches'
  )
  .command('auth', 'Provide BT1 credentials')
  .parse(process.argv);
