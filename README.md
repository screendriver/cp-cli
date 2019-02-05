# cp-cli

[![Build Status](https://dev.azure.com/screendriver/cp-cli/_apis/build/status/screendriver.cp-cli?branchName=master)](https://dev.azure.com/screendriver/cp-cli/_build/latest?definitionId=8&branchName=master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)

The [UNIX command](<https://en.wikipedia.org/wiki/Cp_(Unix)>) `cp` for Node.js
which is useful for cross platform support.

Just install it with

```sh
$ npm install -g cp-cli
```

After that you can use `cp-cli` from your command prompt

```sh
$ cp-cli
Usage: cp-cli [-d] source target

Options:
  -d, --dereference  Dereference symlinks  [boolean]
```

You can copy files directly

```sh
$ cp-cli foo.txt bar.txt
```

or copy a file into an existing directory

```sh
$ cp-cli foo.text dest/
```
