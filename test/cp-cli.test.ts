import * as fse from 'fs-extra';
import { platform } from 'os';
import * as shell from 'shelljs';

describe('cp-cli', () => {
  afterEach(async () => {
    await Promise.all([fse.remove('out'), fse.remove('test/assets/bar.txt')]);
  });

  it('should print a help text when no arguments given', () => {
    const { stderr } = shell.exec('node bin/cp-cli');
    expect(stderr).not.toEqual('');
  });

  it('should print a help text when only one argument was given', () => {
    const { stderr } = shell.exec('node bin/cp-cli foo');
    expect(stderr).not.toEqual('');
  });

  it('should copy a source file to target dir', done => {
    const { stderr } = shell.exec(
      'node bin/cp-cli test/assets/foo.txt out/foo.txt',
    );
    expect(stderr).toEqual('');
    fse.stat('out/foo.txt', (err, stats) => {
      expect(err).toBeNull();
      expect(stats.isFile()).toEqual(true);
      done();
    });
  });

  if (platform() !== 'win32') {
    it('should dereference symlinks', async () => {
      shell.cd('test/assets');
      shell.ln('-s', 'foo.txt', 'bar.txt');
      shell.cd('../..');
      const { stderr } = shell.exec('node bin/cp-cli -d test/assets out');
      expect(stderr).toEqual('');
      let stats = await fse.stat('out/foo.txt');
      expect(stats.isFile()).toEqual(true);
      stats = await fse.stat('out/bar.txt');
      expect(stats.isFile()).toEqual(true);
      expect(stats.isSymbolicLink()).toEqual(false);
    });
  }

  it('should copy directory content', done => {
    const { stderr } = shell.exec('node bin/cp-cli test/assets out');
    expect(stderr).toEqual('');
    fse.stat('out/foo.txt', (err, stats) => {
      expect(err).toBeNull();
      expect(stats.isFile()).toEqual(true);
      done();
    });
  });

  it('should copy directory content when target directory does not exist', async done => {
    await fse.ensureDir('out');
    const { stderr } = shell.exec('node bin/cp-cli test/assets out');
    expect(stderr).toEqual('');
    fse.stat('out/foo.txt', (err, stats) => {
      expect(err).toBeNull();
      expect(stats.isFile()).toEqual(true);
      done();
    });
  });
});
