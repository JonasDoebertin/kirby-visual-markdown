# Visual Markdown Editor for Kirby CMS 2

*Based on MirrorMark and CodeMirror.*

[![Release](https://img.shields.io/github/release/jonasdoebertin/kirby-mirrormark.svg)](https://github.com/jonasdoebertin/kirby-mirrormark/releases)  [![Issues](https://img.shields.io/github/issues/jonasdoebertin/kirby-mirrormark.svg)](https://github.com/jonasdoebertin/kirby-mirrormark/issues) [![License](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://raw.githubusercontent.com/jonasdoebertin/kirby-mirrormark/master/LICENSE)

This additional panel field for [Kirby 2](http://getkirby.com) allows you to use an intuitive alternative file selection field in your blueprints.

## Installation

### Copy & Pasting

If not already existing, add a new `fields` folder to your `site` directory. Then copy or link this repositories whole content in a new `mirrormark` folder there. Afterwards, your directory structure should look like this:

```
site/
	fields/
		mirrormark/
			assets/
			mirrormark.php
			template.php
```

### Git Submodule

If you are an advanced user and know your way around Git and you already use Git to manage you project, you can make updating this field extension to newer releases a breeze by adding it as a Git submodule.

```bash
$ cd your/project/root
$ git submodule add git@github.com:jonasdoebertin/kirby-mirrormark.git site/fields/mirrormark
```

Updating all your Git submodules (eg. the Kirby core modules and any extensions added as submodules) to their latest version, all you need to do is to run these two Git commands.

```bash
$ cd your/project/root
$ git submodule foreach --recursive git checkout master
$ git submodule foreach --recursive git pull
```

## Usage

## Options
