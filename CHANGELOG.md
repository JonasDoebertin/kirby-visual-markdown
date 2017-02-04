# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

### Added

### Changed

* Updated to CodeMirror 5.23
* Updated translations
  * Dutch (thanks to [@icod](https://github.com/icod))
  * French (thanks to [@Thiousi](https://github.com/Thiousi))
* Improved documentation (also thanks to [@malvese](https://github.com/malvese))
* Improved plugin structure & assets build process

### Fixed

* Fixed XSS vulnerability (thanks to [@inacho](https://github.com/inacho))
* Fixed incorrect shortcuts in help modal (thanks to [@malvese](https://github.com/malvese))

## [1.5.1] - 2016-03-14

### Added

* Add compatibility for Kirby CLI

## [1.5.0] - 2015-11-26

### Added

* Smarter header toggling
* Smarter list toggling

### Changed

* Drop support for Kirby 2.1 and below
* Drop support for PHP 5.3 and below
* Only enable fixed toolbar if field is focused
* Updated to CodeMirror 5.8

### Fixed

* More compatible way of getting the current panel language

## [1.4.0] - 2015-08-14

### Added

* Sticky toolbar

## [1.3.4] - 2015-08-06

### Changed

* Updated Swedish language (thanks to [@andreasnymark](https://github.com/andreasnymark))
* Updated to CodeMirror 5.5
* Added a list of all contributors

## [1.3.3] - 2015-06-17

### Added

* Added Norwegian, Swedish & Danish languages (thanks to [@tnViking](https://github.com/tnViking))
* Added Dutch language (thanks to [@TECHMAUS](https://github.com/TECHMAUS))
* Added "Email Link" toolbar item

### Changed

- Updated French language (thanks to [@malvese](https://github.com/malvese))

### Fixed

- Added tooltip for "Italic" toolbar item
- `Required: true` blueprint setting works as expected

## [1.3.2] - 2015-05-26

### Added

* New keyboard shortcuts modal
* Added support for strike-through text

### Changed

* Better keyboard shortcuts
* Updated to CodeMirror 5.3

### Fixed

* Better space character matching inside KirbyTags


## [1.3.1] - 2015-05-21

### Added

* Respect the new (Kirby 2.1) strict markdown mode (thanks to [@shoesforindustry](https://github.com/shoesforindustry) for bringing this to attention)

## [1.3.0] - 2015-04-30

### Added

* Added Kirbytext highlighting
* Added option to turn off individual toolbar icons

### Changed

* Updated to CodeMirror 5.2
* Switched to compressed CodeMirror resources

### Fixed

* Fixed some potentially unsafe javascript code

## [1.2.0] - 2015-04-21

### Added

* Enhanced syntax styling
  * Align headline formatting outside the content
  * Added hanging quotes
  * Added styles for task lists
* Added inline HTML support
* Added "Help" toolbar section with relevant links
* Added tooltips to toolbar icons
* Added translation support
* Included language files:
  * English
  * German
  * French (Thanks to @malvese)

### Changed

* Changed header button icons
* Header buttons toggle formatting instead of applying it multiple times
* Drop MirrorMark dependency
* Drop lodash.js dependency

### Fixed

* Don't treat underscores in words as formatting (#11)
* Make toolbar buttons work with multiple selections
* Enable panel "Save" hotkey
* Hide fullscreen icon in Safari
* A lot more little fixes

## [1.1.0] - 2015-04-10

### Added

* Headline toolbar icons & actions
* Option to specify the headline levels
* Option to hide the toolbar

### Changed

* Updated to MirrorMark 1.0.1

### Fixed

* Show correct fullscreen mode editor for pages with multiple editor fields
* Allow scrolling in fullscreen mode

## [1.0.1] - 2015-03-31

### Added

* Reimplement fullscreen mode logic
* Show toolbar in fullscreen mode

### Fixed

* Limited fullscreen mode content width
* Minor additional style fixes for fullscreen mode

## [1.0.0] - 2016-03-31

* Initial Release
