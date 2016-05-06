import dirtyChai from 'dirty-chai';
import fse from 'fs-extra';
import shell from 'shelljs';
import chai, { expect } from 'chai';

chai.use(dirtyChai);

describe('cp-cli', () => {
  after(() => {
    const deletions = [
      new Promise(res => fse.remove('out', res)),
      new Promise(res => fse.remove('test/assets/bar.txt', res)),
    ];
    return Promise.all(deletions);
  });

  it('should print a help text when no arguments given', () => {
    const { stderr } = shell.exec('node bin/cp-cli');
    expect(stderr).to.not.be.empty();
  });

  it('should print a help text when only one argument was given', () => {
    const { stderr } = shell.exec('node bin/cp-cli foo');
    expect(stderr).to.not.be.empty();
  });

  it('should copy a source file to target dir', callback => {
    const { stderr } = shell.exec('node bin/cp-cli test/assets/foo.txt out/foo.txt');
    expect(stderr).to.be.empty();
    fse.stat('out/foo.txt', (err, stats) => {
      expect(err).to.be.null();
      expect(stats.isFile()).to.be.true();
      callback();
    });
  });

  it('should dereference symlinks', () => {
    shell.cd('test/assets');
    shell.ln('-s', 'foo.txt', 'bar.txt');
    shell.cd('../..');
    const { stderr } = shell.exec('node bin/cp-cli -d test/assets out');
    expect(stderr).to.be.empty();
    const promises = [];
    let promise = new Promise((resolve, reject) => {
      fse.stat('out/foo.txt', (err, stats) => {
        if (err) {
          reject(err);
        } else {
          expect(stats.isFile()).to.be.true();
          resolve();
        }
      });
    });
    promises.push(promise);
    promise = new Promise((resolve, reject) => {
      fse.stat('out/bar.txt', (err, stats) => {
        if (err) {
          reject(err);
        } else {
          expect(stats.isFile()).to.be.true();
          expect(stats.isSymbolicLink()).to.be.false();
          resolve();
        }
      });
    });
    promises.push(promise);
    return Promise.all(promises);
  });
});
