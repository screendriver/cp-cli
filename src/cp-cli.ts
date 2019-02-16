#!/usr/bin/env node

import fse from 'fs-extra';
import yargs from 'yargs';

const argv = yargs
  .usage('Usage: $0 [-L] source target')
  .demand(2, 2)
  .boolean('d')
  .alias('d', 'dereference')
  .describe('d', 'Dereference symlinks')
  .help('h')
  .alias('h', 'help').argv;

const source = argv._[0];
const target = argv._[1];
const options: fse.CopyOptions = {
  dereference: argv.dereference,
  overwrite: true,
};

fse.copy(source, target, options).catch((error: Error) => {
  if (error) {
    // tslint:disable-next-line
    console.error(error);
    process.exit(1);
  }
});
