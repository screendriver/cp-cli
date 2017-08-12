#!/usr/bin/env node

import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as yargs from 'yargs';

const argv = yargs
  .usage('Usage: $0 [-L] source target')
  .demand(2, 2)
  .boolean('d')
  .alias('d', 'dereference')
  .describe('d', 'Dereference symlinks')
  .help('h')
  .alias('h', 'help').argv;

const source = argv._[0];
let target = argv._[1];
const options: fse.CopyOptions = {
  dereference: argv.dereference,
  overwrite: true,
};

if (fse.pathExistsSync(target) && fs.lstatSync(target).isDirectory()) {
  target = path.join(target, source);
}

fse.copy(source, target, options).catch((error: Error) => {
  if (error) {
    // tslint:disable-next-line
    console.error(error);
  }
});
