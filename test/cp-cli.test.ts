import fse from 'fs-extra';
import { platform } from 'os';
import shell from 'shelljs';
import test, { Test, TestCase } from 'tape';

function withAfterEach(cb: (t: Test) => void): TestCase {
  return async t => {
    cb(t);
    await Promise.all([fse.remove('out'), fse.remove('test/assets/bar.txt')]);
  };
}

test(
  'print a help text when no arguments given',
  withAfterEach(t => {
    t.plan(1);
    const { stderr } = shell.exec('node bin/cp-cli');
    t.notEqual(stderr, '');
  }),
);

test(
  'print a help text when only one argument was given',
  withAfterEach(t => {
    t.plan(1);
    const { stderr } = shell.exec('node bin/cp-cli foo');
    t.notEqual(stderr, '');
  }),
);

test(
  'copy a source file to target dir',
  withAfterEach(t => {
    const { stderr } = shell.exec(
      'node bin/cp-cli test/assets/foo.txt out/foo.txt',
    );
    t.equal(stderr, '');
    fse.stat('out/foo.txt', (err, stats) => {
      t.equal(err, null);
      t.true(stats.isFile());
      t.end();
    });
  }),
);

if (platform() !== 'win32') {
  test(
    'dereference symlinks',
    withAfterEach(async t => {
      t.plan(4);
      shell.cd('test/assets');
      shell.ln('-s', 'foo.txt', 'bar.txt');
      shell.cd('../..');
      const { stderr } = shell.exec('node bin/cp-cli -d test/assets out');
      t.equal(stderr, '');
      let stats = await fse.stat('out/foo.txt');
      t.true(stats.isFile());
      stats = await fse.stat('out/bar.txt');
      t.true(stats.isFile());
      t.false(stats.isSymbolicLink());
    }),
  );
}

test(
  'copy directory content',
  withAfterEach(t => {
    const { stderr } = shell.exec('node bin/cp-cli test/assets out');
    t.equal(stderr, '');
    fse.stat('out/foo.txt', (err, stats) => {
      t.equal(err, null);
      t.true(stats.isFile());
      t.end();
    });
  }),
);

test(
  'copy directory content when target directory does not exist',
  withAfterEach(async t => {
    await fse.ensureDir('out');
    const { stderr } = shell.exec('node bin/cp-cli test/assets out');
    t.equal(stderr, '');
    fse.stat('out/foo.txt', (err, stats) => {
      t.equal(err, null);
      t.true(stats.isFile());
      t.end();
    });
  }),
);
