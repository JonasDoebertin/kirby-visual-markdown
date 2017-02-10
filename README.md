[![Visual Markdown Editor for Kirby](https://raw.githubusercontent.com/JonasDoebertin/kirby-visual-markdown/master/logo.gif)](https://github.com/JonasDoebertin/kirby-visual-markdown/)

[![Release](https://img.shields.io/github/release/jonasdoebertin/kirby-visual-markdown.svg)](https://github.com/jonasdoebertin/kirby-mirrormark/releases)
[![License](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://raw.githubusercontent.com/jonasdoebertin/kirby-mirrormark/master/LICENSE)
[![Moral License](https://img.shields.io/badge/buy-moral_license-8dae28.svg)](https://gumroad.com/l/visualmarkdown)

**Based on [CodeMirror](https://github.com/codemirror/CodeMirror). Inspired by [MirrorMark](https://github.com/musicbed/MirrorMark).**

This plugin for [Kirby 2](http://getkirby.com/) provides you with an additional Panel field that enables you to use an intuitive and visual markdown editor without any hazzle. Just drop in the plugin and you’re ready to go!

![Screenshot](https://raw.githubusercontent.com/JonasDoebertin/kirby-visual-markdown/master/screenshot.png)

## Important Note (Please Read)

Generally, this extension is free to use on both personal and commercial Kirby powered sites. You don't *have* to pay for it. However, please always keep in mind that developing this extension took place in my spare time (and maybe a little bit of the time I should have spend on other work related stuff) and up until now, quite some hours have been spent on it..

If you like what I’m doing for the community and you want to support further development of this and future extensions & plugins for Kirby CMS, please consider [purchasing a moral license](https://gumroad.com/l/visualmarkdown).

**This is especially appreciated whenever you use one of the extensions in a project that you get payed for.**

*Cheers, Jonas*

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Requirements](#requirements)
- [Installation](#installation)
  - [Kirby CLI](#kirby-cli)
  - [Copy & Pasting](#copy--pasting)
- [Usage](#usage)
  - [Within your blueprints](#within-your-blueprints)
  - [Within your templates](#within-your-templates)
- [Global Configuration](#global-configuration)
- [Options](#options)
  - [Toolbar](#toolbar)
  - [Tools](#tools)
  - [Headings](#headings)
- [Known Bugs & Limitations](#known-bugs--limitations)
- [Support](#support)
- [Credits](#credits)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Requirements

In order to function correctly, the following system requirements need to be matched:

* **Kirby 2.2 or above**
* **PHP 5.4 or above**

## Installation

### Kirby CLI

If you’re using the Kirby CLI, you need to `cd` into the root directory of your Kirby project and run the following command:

```bash
kirby plugin:install JonasDoebertin/kirby-visual-markdown
```

This will download and install Visual Markdown Editor into the `site/plugins/visualmarkdown` directory.

### Copy & Pasting

If not already existing, add a new `fields` folder to your `site` directory. Then copy or link this repositories whole content in a new `visualmarkdown` folder there. Afterwards, your directory structure should look similar to this:

```
site/
	fields/
		visualmarkdown/
			visualmarkdown.php
```

## Usage

### Within your blueprints

Setting up the Panel for using Visual Markdown Editor couldn’t be easier. After installing the plugin like explained above, all you need to do is change the `type` attribute of your text fields from `textarea` to `visualmarkdown`.

```yaml
fields:
    title:
        label: Post Title
        type: text
    text:
        label: Post Content
        type: visualmarkdown
```

*Fields related part of the blueprint for the setup shown in the above screenshot.*

### Within your templates

You don’t have to change your templates in order to use this plugin. Just use content created with Visual Markdown Editor like as you would with any regular `textarea` field:

```html
<article>
	<h1>
		<?php echo $page->title()->html() ?>
	</h1>
	<?php echo $page->text()->kirbytext() ?>
```

## Global Configuration

For simplicities sake Visual Markdown Editor includes toolbar buttons for adding primary and secondary headings to your text content.

The actual heading levels this produces may vary from site to site, so these are configurable easily. You may either configure this on a global or on a per-field level.

To specify the default header levels (`h1` to `h6`) to be used with the *H* (primary header) and *h* (secondary header) toolbar buttons globally in your sites `config.php` file:

```php
c::set('plugin.visualmarkdown.header1', 'h2');
c::set('plugin.visualmarkdown.header2', 'h3');
```

Please note that redefining the header levels on a per-field level (means in your blueprints, see below) will always take precedence over these default values.

## Options

### Toolbar

Visual Markdown Editor comes with a convenient toolbar that allows you to add common text markup elements without actually being a markdown pro which is enabled by default. If you don't want to use it though, you may hide it with a simple setting in your field definition. Just set the `toolbar` open to `hide`:

```yaml
fields:
    text:
        label: Post Content
        type: visualmarkdown
		toolbar: hide
```

### Tools

With this option you may select which individual tools you want to show up in the toolbar. Specify a list of all tools you want to be able to use. Possible values are: * `header1`, `header2`, `bold`, `italic`, `strikethrough`, `blockquote`, `unorderedList`, `orderedList`, `link`, `email`, `image` and `line`.

```yaml
fields:
    text:
        label: Text
        type: visualmarkdown
        tools:
            - bold
            - italic
            - orderedList
            - unorderedList
```

### Headings

For simplicities sake Visual Markdown Editor includes toolbar buttons for adding primary and secondary headings to your text content.

The actual heading levels this produces may vary from the contents position in your templates, so these are configurable easily.

To specify the header levels to be used with the *H* (primary header) and *h* (secondary header) toolbar buttons set the `header1` and `header2` settings to any combination of `h1` through `h6`.

```yaml
fields:
    text:
        label: Post Content
        type: visualmarkdown
        header1: h2
        header2: h3
```

*If you have any suggestions for further configuration options, [please let me know](https://github.com/JonasDoebertin/kirby-visual-markdown/issues/new).*

## Known Bugs & Limitations

**Safari**: Full-screen editing is currently not supported in Safari due to browser limitations.

## Support

Technical support is provided on GitHub. If you’re facing any problems with running or setting up Kirby Visual Markdown, please [create a new issue](https://github.com/JonasDoebertin/kirby-visual-markdown/issues/new) in this GitHub repository. No representations or guarantees are made regarding the response time in which support questions are answered. If you're making use of this offering please consider [purchasing a moral license](https://gumroad.com/l/visualmarkdown).

## Credits

Kirby Visual Markdown is developed and maintained by [Jonas Döbertin](http://jd-powered.net/), a web developer from Germany.

The plugin makes use of the following third-party components:

* [CodeMirror](https://codemirror.net/) by [Marijn Haverbeke](http://marijnhaverbeke.nl/), licensed under the MIT License (MIT).
* [screenfull.js](https://github.com/sindresorhus/screenfull.js) by [Sindre Sorhus](https://sindresorhus.com/), licensed under the MIT License (MIT).
