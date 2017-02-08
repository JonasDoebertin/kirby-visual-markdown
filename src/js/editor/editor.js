/*
 * Visual Markdown Editor Field for Kirby 2.
 *
 * @version   1.5.0
 * @author    Jonas Döbertin <hello@jd-powered.net>
 * @copyright © 2017 Jonas Döbertin
 * @link      https://github.com/JonasDoebertin/kirby-visual-markdown
 * @license   GNU GPL v3.0 <http://opensource.org/licenses/GPL-3.0>
 */

import CodeMirror from 'codemirror';
import ContinueListAddon from 'codemirror/addon/edit/continuelist';
import Screenfull from 'screenfull';
import Keymaps from './keymaps';
import KirbyTagsMode from './kirbytags-mode';
import Tools from './tools';

/**
 * Visual Markdown Editor CodeMirror Wrapper
 *
 * @since 1.2.0
 */
export default class {
    /**
     * Initialization
     *
     * @since 1.2.0
     */
    constructor($, field, $element, options) {
        // Store references to jQuery global, the field handler
        // instance and the fields main element.
        this.$ = $;
        this.field = field;
        this.$element = $element;

        // Prepare options
        this.options = $.extend({}, this.defaults, options);
        if (this.options.readonly) {
            this.options.codemirror.readOnly = 'nocursor';
        }

        // Initialize CodeMirror and save a reference to its wrapper element
        this.codemirror = CodeMirror.fromTextArea(this.$element.get(0), this.options.codemirror);
        this.codemirror.on('renderLine', this.renderLine.bind(this));
        this.$wrapper = $(this.codemirror.getWrapperElement());

        // Register key bindings
        this.registerKeyMaps(Keymaps);

        // Initialize toolbar
        if (this.options.toolbar) {
            if (!this.isSafari()) {
                Tools.push({
                    name: 'fullscreen',
                    action: 'fullscreen',
                    className: 'fa fa-expand'
                });
            }
            this.initToolbar();
        }

        // Initialize modals
        this.modals = {
            $shortcuts: $('[data-visualmarkdown-modal=shortcuts]')
        };
        Object.keys(this.modals).forEach(key => {
            this.modals[key].on('click', this.hideModals.bind(this));
        });

        // Refresh CodeMirror DOM
        this.codemirror.refresh();
    }

    /**
     * Get default options.
     *
     * @since 1.6.0
     * @returns {*}
     */
    get defaults() {
        return {
            readonly: false,
            toolbar: true,
            header1: 'h1',
            header2: 'h2',
            kirbytext: true,
            codemirror: {
                theme: 'visualmarkdown',
                tabSize: 4,
                indentWithTabs: false,
                lineWrapping: true,
                readOnly: false,
                extraKeys: {
                    Enter: 'newlineAndIndentContinueMarkdownList',
                    'Alt-Enter': function () {
                        this.savePanelForm();
                    },
                    'Cmd-Enter': function () {
                        this.savePanelForm();
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
                }
            }
        };
    }

    /**
     * Get available actions.
     *
     * @since 1.6.0
     */
    get actions() {
        return {
            header1: {
                optional: true,
                type: 'editor',
                callback() {
                    let header = this.translateHeaderValue(this.options.header1);
                    this.toggleBefore(header, false);
                }
            },
            header2: {
                optional: true,
                type: 'editor',
                callback() {
                    var header = this.translateHeaderValue(this.options.header2);
                    this.toggleBefore(header, false);
                }
            },
            bold: {
                optional: true,
                type: 'editor',
                callback() {
                    this.toggleAround('**', '**');
                }
            },
            italic: {
                optional: true,
                type: 'editor',
                callback() {
                    this.toggleAround('*', '*');
                }
            },
            strikethrough: {
                optional: true,
                type: 'editor',
                callback() {
                    this.toggleAround('~~', '~~');
                }
            },
            blockquote: {
                optional: true,
                type: 'editor',
                callback() {
                    this.toggleBefore('>', false);
                }
            },
            orderedList: {
                optional: true,
                type: 'editor',
                callback() {
                    this.insertBefore('1. ', 3);
                }
            },
            unorderedList: {
                optional: true,
                type: 'editor',
                callback() {
                    this.toggleBefore('*', true);
                }
            },
            link: {
                optional: true,
                type: 'editor',
                callback() {
                    if (this.options.kirbytext) {
                        this.insertAround('(link: http:// text: ', ')');
                    } else {
                        this.insertAround('[', '](http://)');
                    }
                }
            },
            email: {
                optional: true,
                type: 'editor',
                callback() {
                    if (this.options.kirbytext) {
                        this.insertAround('(email: user@example.com text: ', ')');
                    } else {
                        this.insert('<user@example.com>');
                    }
                }
            },
            image: {
                optional: true,
                type: 'editor',
                callback() {
                    if (this.options.kirbytext) {
                        this.insert('(image: filename.jpg)');
                    } else {
                        this.insert('![alt text](http://)');
                    }
                }
            },
            line: {
                optional: true,
                type: 'editor',
                callback() {
                    this.insert('****');
                }
            },
            code: {
                optional: true,
                type: 'editor',
                callback() {
                    this.insertAround('```\r\n', '\r\n```');
                }
            },
            shortcutsModal: {
                optional: false,
                type: 'help',
                callback() {
                    this.showShortcutsModal();
                }
            },
            markdownLink: {
                optional: true,
                type: 'help',
                callback() {
                    window.open('http://daringfireball.net/projects/markdown/syntax');
                }
            },
            kirbytextLink: {
                optional: true,
                type: 'help',
                callback() {
                    window.open('http://getkirby.com/docs/content/text');
                }
            },
            issuesLink: {
                optional: true,
                type: 'help',
                callback() {
                    window.open('https://github.com/JonasDoebertin/kirby-visual-markdown/issues');
                }
            },
            licenseLink: {
                optional: true,
                type: 'help',
                callback() {
                    window.open('https://gumroad.com/l/visualmarkdown');
                }
            },
            help: {
                optional: true,
                type: 'help',
                callback() {}
            },
            fullscreen: {
                optional: false,
                type: 'display',
                callback() {
                    this.toggleFullscreenMode();
                }
            }
        };
    }

    /**
     * Check if we're running in Safari.
     *
     * @since 1.6.0
     * @returns {boolean}
     */
    isSafari() {
        return new RegExp('(Version)/(\\d+)\\.(\\d+)(?:\\.(\\d+))?.*Safari/').test(navigator.userAgent);
    }

    /**
     * Deactivate and destroy
     *
     * @since 1.2.0
     */
    deactivate() {
        this.codemirror.toTextArea();
    }

    /**
     * Initialize the toolbar
     *
     * @since 1.2.0
     */
    initToolbar() {
        let toolbar = this.$('<ul>').addClass('visualmarkdown-toolbar');
        let tools = this.generateToolbarItems(Tools);
        let wrapper = this.codemirror.getWrapperElement();

        tools.forEach(function (tool) {
            toolbar.append(tool);
        });

        this.$(wrapper).parent().prepend(toolbar);
    }

    /**
     * Register keymaps by extending the extraKeys object
     *
     * @since 1.2.0
     */
    registerKeyMaps() {
        let name;
        let obj;

        for (name in Keymaps) {
            if (Object.prototype.hasOwnProperty.call(Keymaps, name)) {
                // Abort if action doesn't have a callback
                if (typeof (this.actions[Keymaps[name]]) !== 'object') {
                    throw 'VisualMarkdownEditor: "' + Keymaps[name] + '" is not a registered action';
                }

                obj = {};
                obj[name] = this.actions[Keymaps[name]].callback.bind(this);
                this.$.extend(this.options.codemirror.extraKeys, obj);
            }
        }
    }

    /**
     * Generate a list of <li> tags for the available tools
     *
     * @since 1.2.0
     */
    generateToolbarItems(tools) {
        let alwaysVisibleItems = ['help', 'fullscreen'];

        return tools.map(tool => {
            let $item;
            let $anchor;
            let $subItems;

            // Generate elements
            $item = this.$('<li>').addClass('visualmarkdown-action-' + tool.action);
            $anchor = this.$('<a>').attr('href', '#').attr('tabindex', '-1');

            if ((this.$.inArray(tool.action, this.options.tools) === -1) && (this.$.inArray(tool.action, alwaysVisibleItems) === -1)) {
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
            if (VisualMarkdownTranslation['action.tooltip.' + tool.action]) {
                $anchor.attr('title', VisualMarkdownTranslation['action.tooltip.' + tool.action]);
            }

            // Add the tools name as text, if necessary and available.
            if (tool.showName && VisualMarkdownTranslation['action.name.' + tool.action]) {
                $anchor.text(VisualMarkdownTranslation['action.name.' + tool.action]);
            }

            // Bind the action callback to the anchors "click" event.
            if (tool.action) {
                $anchor.on('mousedown', () => {
                    this.field.inAction = true;
                });
                $anchor.on('click', event => {
                    if (!this.options.readonly) {
                        this.codemirror.focus();
                        this.actions[tool.action].callback.call(this);
                    }
                    this.field.inAction = false;
                    event.preventDefault();
                });
            }

            // Join the list item and the anchor.
            $item.append($anchor);

            // Generate nested items
            if (tool.nested) {
                $subItems = this.$('<ul>').append(this.generateToolbarItems(tool.nested));
                $item.addClass('visualmarkdown-action-with-subactions');
                $item.append($subItems);
            }

            return $item;
        });
    }

    /**
     * Handle a click on the toggle fullscreen mode icon
     *
     * @since 1.2.0
     */
    toggleFullscreenMode() {
        let wrapper;

        // Abort if fullscreen mode isn't supported
        if (!Screenfull.enabled) {
            return;
        }

        // Find related wrapper element
        wrapper = this.$(this.codemirror.getWrapperElement()).closest('.markdownfield-wrapper');

        // Enable/Disable fullscreen mode
        if (Screenfull.isFullscreen) {
            Screenfull.exit();
        } else {
            Screenfull.request(wrapper.get(0));
        }
    }

    /**
     * Insert a string at cursor position
     *
     * @since 1.2.0
     */
    insert(insertion) {
        let doc = this.codemirror.getDoc();
        let cursor = doc.getCursor();

        doc.replaceRange(insertion, {
            line: cursor.line,
            ch: cursor.ch
        });
    }

    /**
     * Insert a string at the start and end of a selection
     *
     * @since 1.2.0
     */
    insertAround(start, end) {
        let doc = this.codemirror.getDoc();
        let cursor = doc.getCursor();
        let selection;

        if (doc.somethingSelected()) {
            selection = doc.getSelection();
            doc.replaceSelection(start + selection + end);
        } else {
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
    }

    /**
     * Insert a string before a selection
     *
     * @since 1.2.0
     */
    insertBefore(insertion, cursorOffset) {
        let doc = this.codemirror.getDoc();
        let cursor = doc.getCursor();
        let selections;
        let pos;
        let i;

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
        } else {
            doc.replaceRange(insertion, {
                line: cursor.line,
                ch: 0
            });
            doc.setCursor({
                line: cursor.line,
                ch: cursorOffset || 0
            });
        }
    }

    /**
     * Find the starting position of a selection
     *
     * @since 1.2.0
     */
    getSelectionStart(selection) {
        let swap = ((selection.anchor.line < selection.head.line) || ((selection.anchor.line === selection.head.line) && selection.anchor.ch <= selection.head.ch));

        return (swap) ? selection.anchor : selection.head;
    }

    /**
     * Find the end position of a selection
     *
     * @since 1.2.0
     */
    getSelectionEnd(selection) {
        let swap = ((selection.anchor.line < selection.head.line) || ((selection.anchor.line === selection.head.line) && selection.anchor.ch <= selection.head.ch));

        return (swap) ? selection.head : selection.anchor;
    }

    /**
     * Add/remove formatting before multiple selections
     *
     * @since 1.2.0
     */
    toggleBefore(formatting, multiline = false) {
        let doc = this.codemirror.getDoc();
        let selections = doc.listSelections();
        let processedLines = [];

        // Delegate to function handling all selections independently
        selections.forEach(selection => {
            // For cases were we need to toggle every line
            // (lists, etc.) we'll call the handling function
            // for every line of the current selection
            if (multiline) {
                let start = this.getSelectionStart(selection).line;
                let end = this.getSelectionEnd(selection).line;
                for (let i = start; i <= end; i++) {
                    if (processedLines.indexOf(i) === -1) {
                        this.toggleBeforeLine(formatting, i);
                        processedLines.push(i);
                    }
                }
            // Otherwise we'll just use the selection start line
            } else {
                let line = this.getSelectionStart(selection).line;
                if (processedLines.indexOf(line) === -1) {
                    this.toggleBeforeLine(formatting, line);
                    processedLines.push(line);
                }
            }
        });
    }

    /**
     * Add/remove formatting before a single selection
     *
     * @since 1.2.0
     */
    toggleBeforeLine(formatting, index) {
        let doc = this.codemirror.getDoc();
        let line = doc.getLine(index);

        // Add space character to formatting
        formatting += ' ';

        /*
         SPECIAL CASE: In case we're toggling header formatting and the line
         already starts with header formatting, we'll remove the current
         header formatting before appling the new one.

         Exception: The lines current header level is the same as the new
         formattings header level. In this case we'll only remove the current header formatting.
         */
        if (this.isHeader(line) && this.isHeader(formatting) && (this.getHeaderLevel(line) !== this.getHeaderLevel(formatting))) {
            // Remove header formatting
            let level = this.getHeaderLevel(line);
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
        // Add new formatting
        } else {
            doc.replaceRange(formatting, {
                line: index,
                ch: 0
            });
        }
    }

    /**
     * Add/remove formatting around multiple selections
     *
     * @since 1.2.0
     */
    toggleAround(before, after) {
        let doc = this.codemirror.getDoc();
        let selections = doc.listSelections();
        let offsets = [];
        let line;

        // Delegate to function handling all selections independently
        selections.forEach(selection => {
            // Get selection start line and initialize offsets array value
            line = this.getSelectionStart(selection).line;
            if (typeof offsets[line] === 'undefined') {
                offsets[line] = 0;
            }

            // Delegate to single selection toggle function
            offsets[line] += this.toggleAroundSelection(before, after, selection, offsets[line]);
        });
    }

    /**
     * Add/remove formatting before a single selection
     *
     * @since 1.2.0
     */
    toggleAroundSelection(before, after, selection, offset) {
        let doc = this.codemirror.getDoc();

        // Get from and to positions from selection
        let from = this.getSelectionStart(selection);
        let to = this.getSelectionEnd(selection);

        // Apply offset
        from.ch += offset;
        to.ch += offset;

        // Get selection content
        let content = doc.getRange(from, to);

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
            let selectionTo = {
                line: to.line,
                ch: ((from.line === to.line) ? to.ch - before.length - after.length : to.ch - after.length)
            };
            doc.addSelection(from, selectionTo);

            // Return offset
            return -(before.length + after.length);
        } else {
            // Add formatting
            doc.replaceRange(before + content + after, from, to);

            // Reset selection
            let selectionTo = {
                line: to.line,
                ch: ((from.line === to.line) ? to.ch + before.length + after.length : to.ch + after.length)
            };
            doc.addSelection(from, selectionTo);

            // Return offset
            return (before.length + after.length);
        }
    }

    /**
     * Apply special styles when a line gets rendered
     *
     * @since 1.2.0
     */
    renderLine(instance, line, element) {
        let $line = this.$(element).children('span');

        // Style hanging quote indents
        this.maybeApplyHangingQuoteStyles(element, $line);

        // Style header indents
        this.maybeApplyHeaderStyles(element, $line);
    }

    /**
     * Maybe apply hanging quote styles to a line
     *
     * @since 1.2.0
     */
    maybeApplyHangingQuoteStyles(element, $line) {
        let $parts = $line.children('span');
        let level = 0;
        let padding = 0;
        let $part;

        // Abort if the line doesn't start with quote formatting
        if (!$parts.first().hasClass('cm-formatting-quote')) {
            return false;
        }

        // Calculate quote level and required padding
        $part = $parts.first();
        while ($part.hasClass('cm-formatting-quote')) {
            level++;
            padding += this.getActualFormattingWidth($part);
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
    }

    /**
     * Maybe apply hanging quote styles to a line
     *
     * @since 1.2.0
     */
    maybeApplyHeaderStyles(element, $line) {
        let $formatting = $line.children('span').first();

        // Abort if the line doesn't start with header formatting
        if (!$formatting.hasClass('cm-formatting-header')) {
            return false;
        }

        // Calculate required padding
        let padding = this.getActualFormattingWidth($formatting);

        // Apply text-indent styles
        element.style.textIndent = '-' + padding + 'px';

        // Apply class indicating that this line is a header line
        let regex = new RegExp('cm-formatting-header-([1-6])');
        let classes = $formatting.attr('class');
        let level = regex.exec(classes)[1];
        element.classList.add('has-header');
        element.classList.add('has-header-' + level);

        return true;
    }

    /**
     * Show "Keyboard Shortcuts" modal
     *
     * @since 1.4.2
     */
    showShortcutsModal() {
        this.modals.$shortcuts.show();
    }

    /**
     * Hide all (possibly) open modals
     *
     * @since 1.4.2
     */
    hideModals(e) {
        if (e.target === this) {
            this.$.each(this.modals, function (index, modal) {
                modal.hide();
            });
        }
    }

    /**
     * Return the underlying CodeMirror instance
     *
     * @since 1.2.0
     */
    getCodeMirrorInstance() {
        return this.codemirror;
    }

    /**
     * Translate a header value string (h1 to h6) into it's
     * markdown representation.
     *
     * @since 1.2.0
     */
    translateHeaderValue(value) {
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
            default:
                return '#';
        }
    }

    /**
     * Check if the string includes header formatting.
     *
     * @since 1.5.0
     * @param string str
     * @return boolean
     */
    isHeader(str) {
        return (str.indexOf('#') === 0);
    }

    /**
     * Returns the strings header level.
     *
     * @since 1.5.0
     * @param string str
     * @return boolean|integer
     */
    getHeaderLevel(str) {
        let min = 1;
        let max = 6;
        let needle;

        for (let i = max; i >= min; i--) {
            needle = new Array(i + 1).join('#');
            if (str.indexOf(needle) === 0) {
                return i;
            }
        }

        return false;
    }

    /**
     * Fetch the actual with of a DOM element
     *
     * @since 1.2.0
     */
    getActualFormattingWidth($target) {
        let styles = 'position: absolute !important; top: -1000px !important;';
        let width;

        $target = $target.clone().attr('style', styles).appendTo(this.$wrapper);
        width = $target.outerWidth();
        $target.remove();

        return width;
    }

    /**
     * Trigger the panel "save" event
     *
     * @since 1.2.0
     */
    savePanelForm() {
        this.$wrapper.closest('.form').trigger('submit');
    }
}
