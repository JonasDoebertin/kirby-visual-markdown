/**
 * @license MirrorMark v0.1
 * (c) 2015 Musicbed http://www.musicbed.com
 * License: MIT
 */
(function(CodeMirror) { 'use strict';
    /**
     * Bootstrap our module
     */
    (function(fn) {
        if (typeof exports == "object" && typeof module == "object") { // CommonJS
          module.exports = fn;
        } else if (typeof define == "function" && define.amd) { // AMD
          return define([], fn);
        }

        if (window)
            window.mirrorMark = fn
    })(mirrorMark);

    /**
     * Our delegate prototype used by our factory
     * @type {Object}
     */
    var mirrorMarkProto = {

        /**
         * Render the component
         */
        render: function render() {
            this.registerKeyMaps(this.keyMaps);
            this.cm = CodeMirror.fromTextArea(this.element, this.options);

            if (this.options.showToolbar) {
              this.setToolbar(this.tools);
            }
        },

        /**
         * Setup the toolbar
         */
        setToolbar: function setToolbar(tools) {

            var toolbar = document.createElement('ul');
                toolbar.className = this.options.theme + '-' + 'toolbar';

            var tools = this.generateToolList(tools);

            tools.forEach(function(tool) {
                toolbar.appendChild(tool)
            });

            var cmWrapper = this.cm.getWrapperElement();
                cmWrapper.parentNode.insertBefore(toolbar, cmWrapper);

        },

        /**
         * Register Keymaps by extending the extraKeys object
         * @param {Object} keyMaps
         */
        registerKeyMaps: function registerKeyMaps(keyMaps) {
            for (var name in keyMaps) {
                if (typeof(this.actions[keyMaps[name]]) !== 'function') throw "MirrorMark - '" + keyMaps[name] + "' is not a registered action";

                var obj = {};
                obj[name] = this.actions[keyMaps[name]].bind(this);
                _.assign(this.options.extraKeys, obj);
            }
        },


        /**
         * Register actions by extending the default actions
         * @param  {Object} actions [description]
         */
        registerActions: function registerActions(actions) {
            return _.assign(this.actions, actions);
        },


        /**
         * Register tools by extending and overwriting the default tools
         * @param  {Array} tools
         * @param  {Bool} replace - replace the default tools with the ones provided. Defaults to false.
         */
        registerTools: function registerTools(tools, replace) {
            for (var action in tools) {
                if (this.actions[tools[action].action] && typeof(this.actions[tools[action].action]) !== 'function') throw "MirrorMark - '" + tools[action].action + "' is not a registered action";
            }

            if (replace) {
                this.tools = tools;
                return;
            }

            this.tools = this.tools.concat(tools)
        },

        /**
         * A recursive function to generate and return an unordered list of tools
         * @param  {Object}
         */
        generateToolList: function generateToolList(tools) {
            return tools.map(function(tool) {
                var item = document.createElement("li"),
                    anchor = document.createElement("a");

                item.className = tool.name;

                if (tool.className) {
                    anchor.className = tool.className;
                }

                if (tool.showName) {
                    var text = document.createTextNode(tool.name);
                    anchor.appendChild(text);
                }

                if (tool.action) {
                    anchor.onclick = function(e) {
                      this.cm.focus();
                      this.actions[tool.action].call(this);
                    }.bind(this);
                }

                item.appendChild(anchor);

                if (tool.nested) {
                    item.className += " has-nested";
                    var ul = document.createElement('ul');
                        ul.className = this.options.theme + "-toolbar-list"
                    var nested = generateToolList.call(this, tool.nested);
                        nested.forEach(function(nestedItem) {
                            ul.appendChild(nestedItem);
                        });

                    item.appendChild(ul);
                }

                return item

            }.bind(this));
        },

        /**
         * Default Tools in Toolbar
         * @todo - update so it's not so tightly coupled with Font Awesome.
         */
        tools: [
          { name: "bold", action: "bold", className: "fa fa-bold" },
          { name: "italicize", action: "italicize", className: "fa fa-italic" },
          { name: "blockquote", action: "blockquote", className: "fa fa-quote-left" },
          { name: "link", action: "link", className: "fa fa-link" },
          { name: "image", action: "image", className: "fa fa-image" },
          { name: "unorderedList", action: "unorderedList", className: "fa fa-list" },
          { name: "orderedList", action: "orderedList", className: "fa fa-list-ol" },
          { name: "fullScreen", action: "fullScreen", className: "fa fa-expand" },
        ],

        /**
         * Default Keymaps
         * @type {Object}
         */
        keyMaps: {
            "Cmd-B": 'bold',
            "Cmd-I": 'italicize',
            "Cmd-'": 'blockquote',
            "Cmd-Alt-L": 'orderedList',
            "Cmd-L": 'unorderedList',
            "Cmd-Alt-I": 'image',
            "Cmd-H": 'hr',
            "Cmd-K": 'link'
        },

        /**
         * Default Actions
         * @type {Object}
         */
        actions: {
            bold: function () {
                this.insertAround('**', '**')
            },
            italicize: function () {
                this.insertAround('*', '*')
            },
            "code": function () {
                this.insertAround('```\r\n', '\r\n```')
            },
            "blockquote": function () {
                this.insertBefore('> ', 2);
            },
            "orderedList": function () {
                this.insertBefore('1. ', 3);
            },
            "unorderedList": function () {
                this.insertBefore('* ', 2);
            },
            "image": function () {
                this.insertBefore('![](http://)', 2);
            },
            "link": function () {
                this.insertAround('[', '](http://)');
            },
            "hr": function () {
                this.insert('---');
            },
            "fullScreen": function () {
              var el = this.cm.getWrapperElement();

              // https://developer.mozilla.org/en-US/docs/DOM/Using_fullscreen_mode
              var doc = document;
              var isFull = doc.fullScreen || doc.mozFullScreen || doc.webkitFullScreen;
              var request = function() {
                if (el.requestFullscreen) {
                    el.requestFullscreen();
                } else if (el.webkitRequestFullscreen) {
                    el.webkitRequestFullscreen();
                } else if (el.mozRequestFullScreen) {
                    el.mozRequestFullScreen();
                } else if (el.msRequestFullscreen) {
                    el.msRequestFullscreen();
                }
              }
              var cancel = function() {
                if (doc.cancelFullScreen) {
                  doc.cancelFullScreen();
                } else if (doc.mozCancelFullScreen) {
                  doc.mozCancelFullScreen();
                } else if (doc.webkitCancelFullScreen) {
                  doc.webkitCancelFullScreen();
                }
              };
              if (!isFull) {
                request();
              } else if (cancel) {
                cancel();
              }
            }
        },

        /**
         * Insert a string at cursor position
         * @param  {String} insertion
         */
        insert: function insert(insertion) {
            var doc = this.cm.getDoc();
            var cursor = doc.getCursor();

            doc.replaceRange(insertion, { line: cursor.line, ch: cursor.ch });
        },

        /**
         * Insert a string at the start and end of a selection
         * @param  {String} start
         * @param  {String} end
         */
        insertAround: function insertAround(start, end) {
            var doc = this.cm.getDoc();
            var cursor = doc.getCursor();

            if (doc.somethingSelected()) {
                var selection = doc.getSelection();
                doc.replaceSelection(start + selection + end);
            } else {
                // If no selection then insert start and end args and set cursor position between the two.
                doc.replaceRange(start + end, { line: cursor.line, ch: cursor.ch });
                doc.setCursor({ line: cursor.line, ch: cursor.ch + start.length })
            }
        },

        /**
         * Insert a string before a selection
         * @param  {String} insertion
         */
        insertBefore: function insertBefore(insertion, cursorOffset) {
            var doc = this.cm.getDoc();
            var cursor = doc.getCursor();

            if (doc.somethingSelected()) {
                var selections = doc.listSelections();
                selections.forEach(function(selection) {
                    var pos = [selection.head.line, selection.anchor.line].sort();

                    for (var i = pos[0]; i <= pos[1]; i++) {
                        doc.replaceRange(insertion, { line: i, ch: 0 });
                    }

                    doc.setCursor({ line: pos[0], ch: cursorOffset || 0 });
                });
            } else {
                doc.replaceRange(insertion, { line: cursor.line, ch: 0 });
                doc.setCursor({ line: cursor.line, ch: cursorOffset || 0 })
            }
        }
    }

    /**
     * Our Factory
     * @param  {Object} element
     * @param  {Object} options
     * @return {Object}
     */
    function mirrorMark(element, options) {

        // Defaults
        var defaults = {
            theme: 'visualmarkdown',
            tabSize: '2',
            indentWithTabs: true,
            lineWrapping: true,
            extraKeys: {
                "Enter": 'newlineAndIndentContinueMarkdownList',
            },
            mode: 'markdown'
        }

        // Extend our defaults with the options provided
        _.assign(defaults, options);

        return _.assign(Object.create(mirrorMarkProto), { element: element, options: defaults });
    }

})(window.CodeMirror);
