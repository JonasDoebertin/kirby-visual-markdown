/**
 * Visual Markdown Editor Field for Kirby 2
 *
 * @version   1.5.0
 * @author    Jonas Döbertin <hello@jd-powered.net>
 * @copyright Jonas Döbertin <hello@jd-powered.net>
 * @link      https://github.com/JonasDoebertin/kirby-visual-markdown
 * @license   GNU GPL v3.0 <http://opensource.org/licenses/GPL-3.0>
 */

/**
 * Visual Markdown Editor CodeMirror Wrapper
 *
 * @since 1.2.0
 */
var VisualMarkdownEditor = function ($, field, $element, options) {
    'use strict';

    var self = this;

    /**
     * Field handler object
     */
    this.field = field;

    /**
     * Main field element
     */
    this.$element = $element;

    /**
     * Editor wrapper element
     */
    this.$wrapper = null;

    /**
     * All available modals
     */
    this.modals = {
        shortcuts: $('[data-visualmarkdown-modal=shortcuts]')
    };

    /**
     * CodeMirror instance
     */
    this.codemirror = null;

    /**
     * Translation object including all translated strings
     */
    this.translation = VisualMarkdownTranslation;

    /**
     * Current options
     */
    this.options = {};

    /**
     * Default options
     */
    this.defaults = {
        toolbar: true,
        header1: 'h1',
        header2: 'h2',
        kirbytext: true,
        codemirror: {
            theme: 'visualmarkdown',
            tabSize: 4,
            indentWithTabs: false,
            lineWrapping: true,
            extraKeys: {
                'Enter': 'newlineAndIndentContinueMarkdownList',
                'Alt-Enter': function () {
                    self.savePanelForm();
                },
                'Cmd-Enter': function () {
                    self.savePanelForm();
                }
            },
            mode: {
                name: 'kirbytext',
                highlightFormatting: true,
                underscoresBreakWords: false,
                maxBlockquoteDepth: 0,
                fencedCodeBlocks: true,
                taskLists: true,
                strikethrough: true
            },
        }
    };

    /**
     * Will be `true` when we're on a Safari browser
     */
    this.isSafari = new RegExp('(Version)/(\\d+)\\.(\\d+)(?:\\.(\\d+))?.*Safari/').test(navigator.userAgent);

    /**
     * Actions
     *
     * @since 1.2.0
     */
    this.actions = {
        header1: function () {
            var header = self.translateHeaderValue(self.options.header1);
            self.toggleBefore(header, false);
        },
        header2: function () {
            var header = self.translateHeaderValue(self.options.header2);
            self.toggleBefore(header, false);
        },
        bold: function () {
            self.toggleAround('**', '**');
        },
        italic: function () {
            self.toggleAround('*', '*');
        },
        strikethrough: function () {
            self.toggleAround('~~', '~~');
        },
        blockquote: function () {
            self.toggleBefore('>', false);
        },
        orderedList: function () {
            self.insertBefore('1. ', 3);
        },
        unorderedList: function () {
            self.toggleBefore('*', true);
        },
        link: function () {
            if (self.options.kirbytext) {
                self.insertAround('(link: http:// text: ', ')');
            }
            else {
                self.insertAround('[', '](http://)');
            }
        },
        email: function () {
            if (self.options.kirbytext) {
                self.insertAround('(email: user@example.com text: ', ')');
            }
            else {
                self.insert('<user@example.com>');
            }
        },
        image: function () {
            if (self.options.kirbytext) {
                self.insert('(image: filename.jpg)');
            }
            else {
                self.insert('![alt text](http://)');
            }
        },
        line: function () {
            self.insert('****');
        },
        code: function () {
            self.insertAround('```\r\n', '\r\n```');
        },
        shortcutsModal: function () {
            self.showShortcutsModal();
        },
        markdownLink: function () {
            window.open('http://daringfireball.net/projects/markdown/syntax');
        },
        kirbytextLink: function () {
            window.open('http://getkirby.com/docs/content/text');
        },
        issuesLink: function () {
            window.open('https://github.com/JonasDoebertin/kirby-visual-markdown/issues');
        },
        licenseLink: function () {
            window.open('https://gumroad.com/l/visualmarkdown');
        },
        help: function () {},
        fullscreen: function () {
            self.toggleFullscreenMode();
        }
    };

    /**
     * Toolbar Icons
     *
     * @since 1.2.0
     */
    this.tools = [{
        action: 'header1',
        className: 'fa fa-header',
    }, {
        action: 'header2',
        className: 'markdownfield-icon-text markdownfield-icon-header2',
        showName: true,
    }, {
        action: 'divider'
    }, {
        action: 'bold',
        className: 'fa fa-bold'
    }, {
        action: 'italic',
        className: 'fa fa-italic'
    }, {
        action: 'strikethrough',
        className: 'fa fa-strikethrough'
    }, {
        action: 'blockquote',
        className: 'fa fa-quote-left'
    }, {
        action: 'unorderedList',
        className: 'fa fa-list'
    }, {
        action: 'orderedList',
        className: 'fa fa-list-ol'
    }, {
        action: 'divider'
    }, {
        action: 'link',
        className: 'fa fa-link'
    }, {
        action: 'email',
        className: 'fa fa-envelope'
    }, {
        action: 'image',
        className: 'fa fa-image'
    }, {
        action: 'line',
        className: 'fa fa-minus'
    }, {
        action: 'divider'
    }, {
        action: 'help',
        className: 'fa fa-question-circle',
        nested: [{
            action: 'shortcutsModal',
            showName: true
        }, {
            action: 'markdownLink',
            showName: true
        }, {
            action: 'kirbytextLink',
            showName: true
        }, {
            action: 'divider'
        }, {
            action: 'issuesLink',
            showName: true
        }, {
            action: 'licenseLink',
            showName: true
        }]
    }];

    /**
     * Keymaps
     *
     * @since 1.2.0
     */
    this.keyMaps = {
        'Cmd-H': 'header1',
        'Ctrl-H': 'header1',
        'Cmd-Alt-H': 'header2',
        'Ctrl-Alt-H': 'header2',
        'Cmd-B': 'bold',
        'Ctrl-B': 'bold',
        'Cmd-I': 'italic',
        'Ctrl-I': 'italic',
        'Ctrl-Alt-U': 'strikethrough',
        'Ctrl-Q': 'blockquote',
        'Ctrl-L': 'unorderedList',
        'Ctrl-Alt-L': 'orderedList',
        'Ctrl-Alt-I': 'image',
        'Cmd-K': 'link',
        'Ctrl-K': 'link',
        'Cmd-E': 'email',
        'Ctrl-E': 'email',
    };

    /**
     * Initialization
     *
     * @since 1.2.0
     */
    this.init = function (options) {
        // Merge defaults with options
        self.options = $.extend({}, self.defaults, options);

        // Register key bindings
        self.registerKeyMaps(self.keyMaps);

        // Initialize CodeMirror
        self.codemirror = CodeMirror.fromTextArea(self.$element.get(0), self.options.codemirror);
        self.$wrapper = $(self.codemirror.getWrapperElement());

        // Initialize toolbar
        if (!self.isSafari) {
            self.tools.push({
                name: 'fullscreen',
                action: 'fullscreen',
                className: 'fa fa-expand'
            });
        }
        if (self.options.toolbar) {
            self.initToolbar();
        }

        // Bind change handler
        self.codemirror.on('renderLine', self.renderLine);

        // Bind modal close handlers
        $.each(self.modals, function (index, modal) {
            modal.on('click', self.hideModals);
        });

        // Refresh CodeMirror DOM
        self.codemirror.refresh();
    };

    /**
     * Deactivate and destroy
     *
     * @since 1.2.0
     */
    this.deactivate = function () {
        self.codemirror.toTextArea();
    };

    /**
     * Initialize the toolbar
     *
     * @since 1.2.0
     */
    this.initToolbar = function () {
        var toolbar = $('<ul>').addClass('visualmarkdown-toolbar'),
            tools = self.generateToolbarItems(self.tools),
            wrapper = self.codemirror.getWrapperElement();

        tools.forEach(function (tool) {
            toolbar.append(tool);
        });

        $(wrapper).parent().prepend(toolbar);
    };

    /**
     * Register keymaps by extending the extraKeys object
     *
     * @since 1.2.0
     */
    this.registerKeyMaps = function () {
        var name, obj;

        for (name in self.keyMaps) {
            if (self.keyMaps.hasOwnProperty(name)) {
                // Abort if action doesn't have a callback
                if (typeof (self.actions[self.keyMaps[name]]) !== 'function') {
                    throw 'VisualMarkdownEditor: \"' + self.keyMaps[name] + '\" is not a registered action';
                }

                obj = {};
                obj[name] = self.actions[self.keyMaps[name]].bind(self);
                $.extend(self.options.codemirror.extraKeys, obj);
            }
        }
    };

    /**
     * Generate a list of <li> tags for the available tools
     *
     * @since 1.2.0
     */
    this.generateToolbarItems = function (tools) {
        var alwaysVisibleItems = ['help', 'fullscreen'];

        return tools.map(function (tool) {

            // Define variables
            var $item, $anchor, $subItems;

            // Generate elements
            $item = $('<li>').addClass('visualmarkdown-action-' + tool.action);
            $anchor = $('<a>').attr('href', '#');

            if (($.inArray(tool.action, self.options.tools) === -1) && ($.inArray(tool.action, alwaysVisibleItems) === -1)) {
                $item.addClass('visualmarkdown-action-hidden');
            }

            // Don't do anything with divider elements.
            // They are just an empty <li> tag with a "divider" class.
            if (tool.action === 'divider') {
                return $item;
            }

            // Add the tools name as anchor class.
            if (tool.className) {
                $anchor.addClass(tool.className);
            }

            // Add the tooltip if available
            if (self.translation['action.tooltip.' + tool.action]) {
                $anchor.attr('title', self.translation['action.tooltip.' + tool.action]);
            }

            // Add the tools name as text, if necessary and available.
            if (tool.showName && self.translation['action.name.' + tool.action]) {
                $anchor.text(self.translation['action.name.' + tool.action]);
            }

            // Bind the action callback to the anchors "click" event.
            if (tool.action) {
                $anchor.on('mousedown', function () {
                    self.field.inAction = true;
                });
                $anchor.on('click', function (event) {
                    self.codemirror.focus();
                    self.actions[tool.action].call(self);
                    self.field.inAction = false;
                    event.preventDefault();
                });
            }

            // Join the list item and the anchor.
            $item.append($anchor);

            // Generate nested items
            if (tool.nested) {
                $subItems = $('<ul>').append(self.generateToolbarItems(tool.nested));
                $item.addClass('visualmarkdown-action-with-subactions');
                $item.append($subItems);
            }

            return $item;
        });
    };

    /**
     * Handle a click on the toggle fullscreen mode icon
     *
     * @since 1.2.0
     */
    this.toggleFullscreenMode = function () {
        var wrapper;

        // Abort if fullscreen mode isn't supported
        if (!screenfull.enabled) {
            return;
        }

        // Find related wrapper element
        wrapper = $(self.codemirror.getWrapperElement()).closest('.markdownfield-wrapper');

        // Enable fullscreen mode
        if (!screenfull.isFullscreen) {
            screenfull.request(wrapper.get(0));

            // Disable fullscreen mode
        }
        else {
            screenfull.exit();
        }
    };

    /**
     * Insert a string at cursor position
     *
     * @since 1.2.0
     */
    this.insert = function (insertion) {
        var doc = self.codemirror.getDoc(),
            cursor = doc.getCursor();

        doc.replaceRange(insertion, {
            line: cursor.line,
            ch: cursor.ch
        });
    };

    /**
     * Insert a string at the start and end of a selection
     *
     * @since 1.2.0
     */
    this.insertAround = function (start, end) {
        var doc = self.codemirror.getDoc(),
            cursor = doc.getCursor(),
            selection;

        if (doc.somethingSelected()) {

            selection = doc.getSelection();
            doc.replaceSelection(start + selection + end);

        }
        else {

            // If no selection then insert start and end args and set cursor position between the two.
            doc.replaceRange(start + end, {
                line: cursor.line,
                ch: cursor.ch
            });
            doc.setCursor({
                line: cursor.line,
                ch: cursor.ch + start.length
            });

        }
    };

    /**
     * Insert a string before a selection
     *
     * @since 1.2.0
     */
    this.insertBefore = function (insertion, cursorOffset) {
        var doc = self.codemirror.getDoc(),
            cursor = doc.getCursor(),
            selections, pos, i;

        if (doc.somethingSelected()) {

            selections = doc.listSelections();
            selections.forEach(function (selection) {
                pos = [selection.head.line, selection.anchor.line].sort();

                for (i = pos[0]; i <= pos[1]; i++) {
                    doc.replaceRange(insertion, {
                        line: i,
                        ch: 0
                    });
                }

                doc.setCursor({
                    line: pos[0],
                    ch: cursorOffset || 0
                });
            });

        }
        else {
            doc.replaceRange(insertion, {
                line: cursor.line,
                ch: 0
            });
            doc.setCursor({
                line: cursor.line,
                ch: cursorOffset || 0
            });
        }
    };

    /**
     * Find the starting position of a selection
     *
     * @since 1.2.0
     */
    this.getSelectionStart = function (selection) {
        var swap = ((selection.anchor.line < selection.head.line) || ((selection.anchor.line === selection.head.line) && selection.anchor.ch <= selection.head.ch));
        return (swap) ? selection.anchor : selection.head;
    };

    /**
     * Find the end position of a selection
     *
     * @since 1.2.0
     */
    this.getSelectionEnd = function (selection) {
        var swap = ((selection.anchor.line < selection.head.line) || ((selection.anchor.line === selection.head.line) && selection.anchor.ch <= selection.head.ch));
        return (swap) ? selection.head : selection.anchor;
    };

    /**
     * Add/remove formatting before multiple selections
     *
     * @since 1.2.0
     */
    this.toggleBefore = function (formatting, multiline) {

        var doc = self.codemirror.getDoc(),
            selections = doc.listSelections(),
            processedLines = [],
            start, end, line;

        // Initialize multiline parameter
        if (multiline === undefined) {
            multiline = false;
        }

        // Delegate to function handling all selections independently
        selections.forEach(function (selection) {

            // For cases were we need to toggle every line
            // (lists, etc.) we'll call the handling function
            // for every line of the current selection
            if (multiline) {
                start = self.getSelectionStart(selection).line;
                end = self.getSelectionEnd(selection).line;
                for (var i = start; i <= end; i++) {
                    if (processedLines.indexOf(i) === -1) {
                        self.toggleBeforeLine(formatting, i);
                        processedLines.push(i);
                    }
                }
            }
            // Otherwise we'll just use the selection start line
            else {
                line = self.getSelectionStart(selection).line;
                if (processedLines.indexOf(line) === -1) {
                    self.toggleBeforeLine(formatting, line);
                    processedLines.push(line);
                }
            }

        });

    };

    /**
     * Add/remove formatting before a single selection
     *
     * @since 1.2.0
     */
    this.toggleBeforeLine = function (formatting, index) {

        var doc = self.codemirror.getDoc(),
            line = doc.getLine(index);

        // Add space character to formatting
        formatting = formatting + ' ';

        /*
            SPECIAL CASE: In case we're toggling header formatting and the line
            already starts with header formatting, we'll remove the current
            header formatting before appling the new one.

            Exception: The lines current header level is the same as the new
            formattings header level. In this case we'll only remove the current header formatting.
         */
        if (self.isHeader(line) && self.isHeader(formatting) && (self.getHeaderLevel(line) !== self.getHeaderLevel(formatting))) {
            // Remove header formatting
            var level = self.getHeaderLevel(line);
            doc.replaceRange('', {
                line: index,
                ch: 0
            }, {
                line: index,
                ch: level
            });
            // Remove leading space if present
            if (doc.getLine(index).indexOf(' ') === 0) {
                doc.replaceRange('', {
                    line: index,
                    ch: 0
                }, {
                    line: index,
                    ch: 1
                });
            }
            // Add new header formatting
            doc.replaceRange(formatting, {
                line: index,
                ch: 0
            });
        }
        // Remove existing formatting
        else if (line.indexOf(formatting) === 0) {
            // Remove formatting
            doc.replaceRange('', {
                line: index,
                ch: 0
            }, {
                line: index,
                ch: formatting.length
            });
        }
        // Add new formatting
        else {
            doc.replaceRange(formatting, {
                line: index,
                ch: 0
            });
        }
    };

    /**
     * Add/remove formatting around multiple selections
     *
     * @since 1.2.0
     */
    this.toggleAround = function (before, after) {

        var doc = self.codemirror.getDoc(),
            selections = doc.listSelections(),
            offsets = [],
            line;

        // Delegate to function handling all selections independently
        selections.forEach(function (selection) {

            // Get selection start line and initialize offsets array value
            line = self.getSelectionStart(selection).line;
            if (typeof offsets[line] === 'undefined') {
                offsets[line] = 0;
            }

            // Delegate to single selection toggle function
            offsets[line] += self.toggleAroundSelection(before, after, selection, offsets[line]);
        });

    };

    /**
     * Add/remove formatting before a single selection
     *
     * @since 1.2.0
     */
    this.toggleAroundSelection = function (before, after, selection, offset) {

        var doc = self.codemirror.getDoc(),
            from, to, content, selectionTo;

        // Get from and to positions from selection
        from = self.getSelectionStart(selection);
        to = self.getSelectionEnd(selection);

        // Apply offset
        from.ch += offset;
        to.ch += offset;

        // Get selection content
        content = doc.getRange(from, to);

        // Check for existing formatting
        if ((content.indexOf(before) === 0) && (content.lastIndexOf(after) === content.length - after.length)) {

            // Remove formatting
            doc.replaceRange(
                content.substr(
                    before.length,
                    content.length - before.length - after.length
                ),
                from,
                to
            );

            // Reset selection
            selectionTo = {
                line: to.line,
                ch: ((from.line === to.line) ? to.ch - before.length - after.length : to.ch - after.length)
            };
            doc.addSelection(from, selectionTo);

            // Return offset
            return -(before.length + after.length);

        }
        else {

            // Add formatting
            doc.replaceRange(before + content + after, from, to);

            // Reset selection
            selectionTo = {
                line: to.line,
                ch: ((from.line === to.line) ? to.ch + before.length + after.length : to.ch + after.length)
            };
            doc.addSelection(from, selectionTo);

            // Return offset
            return (before.length + after.length);
        }
    };

    /**
     * Apply special styles when a line gets rendered
     *
     * @since 1.2.0
     */
    this.renderLine = function (instance, line, element) {

        var $line = $(element).children('span');

        // Style hanging quote indents
        self.maybeApplyHangingQuoteStyles(element, $line);

        // Style header indents
        self.maybeApplyHeaderStyles(element, $line);
    };

    /**
     * Maybe apply hanging quote styles to a line
     *
     * @since 1.2.0
     */
    this.maybeApplyHangingQuoteStyles = function (element, $line) {

        var $parts = $line.children('span'),
            level = 0,
            padding = 0,
            $part;

        // Abort if the line doesn't start with quote formatting
        if (!$parts.first().hasClass('cm-formatting-quote')) {
            return false;
        }

        // Calculate quote level and required padding
        $part = $parts.first();
        while ($part.hasClass('cm-formatting-quote')) {
            level++;
            padding += self.getActualFormattingWidth($part);
            $part = $part.next();
        }
        padding += level * 3;

        // Apply padding and text-indent styles
        element.style.textIndent = '-' + padding + 'px';
        element.style.paddingLeft = (padding + 4) + 'px';

        // Apply class indicating that this line is a quote line
        element.classList.add('has-quote');
        element.classList.add('has-quote-' + level);

        return true;
    };

    /**
     * Maybe apply hanging quote styles to a line
     *
     * @since 1.2.0
     */
    this.maybeApplyHeaderStyles = function (element, $line) {

        var $formatting = $line.children('span').first(),
            padding = 0,
            regex, classes, level;

        // Abort if the line doesn't start with header formatting
        if (!$formatting.hasClass('cm-formatting-header')) {
            return false;
        }

        // Calculate required padding
        padding = self.getActualFormattingWidth($formatting);

        // Apply text-indent styles
        element.style.textIndent = '-' + padding + 'px';

        // Apply class indicating that this line is a header line
        regex = new RegExp('cm-formatting-header-([1-6])');
        classes = $formatting.attr('class');
        level = regex.exec(classes)[1];
        element.classList.add('has-header');
        element.classList.add('has-header-' + level);

        return true;
    };

    /**
     * Show "Keyboard Shortcuts" modal
     *
     * @since 1.4.2
     */
    this.showShortcutsModal = function () {
        self.modals.shortcuts.show();
    };

    /**
     * Hide all (possibly) open modals
     *
     * @since 1.4.2
     */
    this.hideModals = function (e) {
        if (e.target === this) {
            $.each(self.modals, function (index, modal) {
                modal.hide();
            });
        }
    };

    /**
     * Return the underlying CodeMirror instance
     *
     * @since 1.2.0
     */
    this.getCodeMirrorInstance = function () {
        return self.codemirror;
    };

    /**
     * Translate a header value string (h1 to h6) into it's
     * markdown representation.
     *
     * @since 1.2.0
     */
    this.translateHeaderValue = function (value) {
        switch (value) {
        case 'h6':
            return '######';
        case 'h5':
            return '#####';
        case 'h4':
            return '####';
        case 'h3':
            return '###';
        case 'h2':
            return '##';
        case 'h1':
            return '#';
        default:
            return '#';
        }
    };

    /**
     * Check if the string includes header formatting.
     *
     * @since 1.5.0
     * @param string str
     * @return boolean
     */
    this.isHeader = function (str) {
        return (str.indexOf('#') === 0);
    };

    /**
     * Returns the strings header level.
     *
     * @since 1.5.0
     * @param string str
     * @return boolean|integer
     */
    this.getHeaderLevel = function (str) {
        var min = 1,
            max = 6,
            needle;

        for (var i = max; i >= min; i--) {
            needle = new Array(i + 1).join('#');
            if (str.indexOf(needle) === 0) {
                return i;
            }
        }

        return false;
    };

    /**
     * Fetch the actual with of a DOM element
     *
     * @since 1.2.0
     */
    this.getActualFormattingWidth = function ($target) {

        var styles = 'position: absolute !important; top: -1000px !important;',
            width;

        $target = $target.clone().attr('style', styles).appendTo(self.$wrapper);
        width = $target.outerWidth();
        $target.remove();
        return width;
    };

    /**
     * Trigger the panel "save" event
     *
     * @since 1.2.0
     */
    this.savePanelForm = function () {
        self.$wrapper.closest('.form').trigger('submit');
    };

    /**
     * Run initialization
     */
    return this.init(options);

};
