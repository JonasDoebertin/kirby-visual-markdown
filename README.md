# Visual Markdown Editor for Kirby CMS 2

[![Release](https://img.shields.io/github/release/jonasdoebertin/kirby-visual-markdown.svg)](https://github.com/jonasdoebertin/kirby-mirrormark/releases)  [![Issues](https://img.shields.io/github/issues/jonasdoebertin/kirby-visual-markdown.svg)](https://github.com/jonasdoebertin/kirby-mirrormark/issues) [![License](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://raw.githubusercontent.com/jonasdoebertin/kirby-mirrormark/master/LICENSE)
[![PayPal](https://img.shields.io/badge/donate-paypal-009cde.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=A5K53LA5YBNW4)
[![Gratipay](https://img.shields.io/gratipay/DieserJonas.svg)](https://gratipay.com/DieserJonas)

**Based on [MirrorMark](https://github.com/themusicbed/MirrorMark) and [CodeMirror](https://github.com/codemirror/CodeMirror).**

This Panel field plugin for [Kirby 2](http://getkirby.com) enables you to use an intuitive and visual markdown editor without any hazzle. Just drop in the plugin and you're good to go!

![Screenshot](https://raw.githubusercontent.com/JonasDoebertin/kirby-visual-markdown/master/screenshot.png)

## Installation

### Copy & Pasting

If not already existing, add a new `fields` folder to your `site` directory. Then copy or link this repositories whole content in a new `markdown` folder there. Afterwards, your directory structure should look similar to this:

```
site/
	fields/
		markdown/
			assets/
			markdown.php
```

### Git Submodule

If you are an advanced user and know your way around Git and you already use Git to manage you project, you can make updating this field extension to newer releases a breeze by adding it as a Git submodule.

```bash
$ cd your/project/root
$ git submodule add git@github.com:jonasdoebertin/kirby-visual-markdown.git site/fields/markdown
```

Updating all your Git submodules (eg. the Kirby core modules and any extensions added as submodules) to their latest version, all you need to do is to run these two Git commands.

```bash
$ cd your/project/root
$ git submodule foreach --recursive git checkout master
$ git submodule foreach --recursive git pull
```

## Usage

### Within your blueprints

Using the field in your blueprint couldn't be easier. After installing the plugin like explained above, all you need to do is change the `type` of your text fields to `markdown`.

```
fields:
    title:
        label: Post Title
        type:  text
    text:
        label: Text
        type:  markdown
```

*Fields related part of the blueprint for the setup shown in the screenshot.*

### Within your templates

You don't have to change your templates in order to support this field. Just use content created with this field like any regular `textarea` field:

```html
<article>
	<h1>
		<?php echo $page->title()->html() ?>
	</h1>
	<?php echo $page->text()->kirbytext() ?>
</article>
```

## Options

There are no further configuration options, just yet. However, it is planned to allow configuring (hide/show, limit icons, etc.) the editors toolbar from your blueprints. If you have any suggestions for further configuration options, [please let me know](https://github.com/JonasDoebertin/kirby-visual-markdown/issues/new).
