/**
 * Visual Markdown Editor Field for Kirby 2
 *
 * @version   1.1.0
 * @author    Jonas Döbertin <hello@jd-powered.net>
 * @copyright Jonas Döbertin <hello@jd-powered.net>
 * @link      https://github.com/JonasDoebertin/kirby-visual-markdown
 * @license   GNU GPL v3.0 <http://opensource.org/licenses/GPL-3.0>
 */

MarkdownField = (function($, $field) {

    var self = this;

    this.$field     = $field;
    this.$draggable = $('.sidebar').find('.draggable');
    this.$wrapper   = $field.closest('.markdownfield-wrapper');
    this.$toolbar   = null;
    this.$editor    = null;

    this.mirrormark = null;
    this.codemirror = null;

    this.options = {
        toolbar: $field.data('toolbar'),
        header1: $field.data('header1'),
        header2: $field.data('header2')
    };

    /**
     * Initialize editor field
     *
     * @since 1.0.0
     */
    this.init = function() {

        /*
            Initialize MirrorMark
         */
        self.mirrormark = mirrorMark(self.$field.get(0), {
            showToolbar: this.options.toolbar
        });
        self.registerCustomTools();
        self.mirrormark.render();
        self.registerCustomKeymaps();

        /*
            Store some references to the underlying codemirror instance
            our field instance and the toolbar and editor elements
         */
        self.mirrormark.fieldInstance = self;
        self.codemirror = self.mirrormark.cm;
        self.$toolbar   = self.$field.siblings('.mirrormark-toolbar');
        self.$editor    = self.$field.siblings('.CodeMirror');

        /*
            Set up change event handler
         */
        self.codemirror.on('change', self.updateStorage);

        /*
            Set up focus and blur event handlers
         */
        self.codemirror.on('focus', self.attachFocusStyles);
        self.codemirror.on('blur', self.detachFocusStyles);

        /*
            Set up fullscreen mode change event handler
         */
        $(document).bind(screenfull.raw.fullscreenchange, self.changeFullscreenModeHandler);

        /**
         * Make the editor field accept Kirby typical
         * file/page drag and drop events.
         *
         * @since 1.0.0
         */
        self.$wrapper.droppable({
            hoverClass: 'markdownfield-wrapper-over',
            accept:     self.draggable,
            drop:       function(event, element) {
                self.mirrormark.insert(element.draggable.data('text'));
            }
        });

        /**
         * Observe when the field element is destroyed (=the user leaves the
         * current view) and deactivate MirrorMark accordingly.
         *
         * @since 1.0.0
         */
        self.$field.bind('destroyed', function() {
            self.deactivate();
        });

    };

    /**
     * Register custom actions and toolbar icons
     *
     * @since 1.0.0
     */
    this.registerCustomTools = function() {

        // Register custom (and overwritten) actions
        self.mirrormark.registerActions({
            header1: function() {
                var header = self.translateHeaderValue(this.fieldInstance.options.header1);
                this.insertBefore(header + ' ', header.length + 1);
            },
            header2: function() {
                var header = self.translateHeaderValue(this.fieldInstance.options.header2);
                this.insertBefore(header + ' ', header.length + 1);
            },
            image: function() {
                this.insertBefore('(image: filename.jpg)');
            },
            line: function() {
                this.insert('****');
            },
            fullscreen: function() {
                // TODO: Use this.fieldInstance instead of self
                self.toggleFullscreenMode(this);
            }
        });

        // Register toolbar icons
        self.mirrormark.registerTools([
            {
                name: self.options.header1,
                action: 'header1',
                className: 'markdownfield-icon-text markdownfield-icon-header1',
                showName: true,
            },
            {
                name: self.options.header2,
                action: 'header2',
                className: 'markdownfield-icon-text markdownfield-icon-header1',
                showName: true,
            },
            {
                name: "bold",
                action: "bold",
                className: "fa fa-bold"
            },
            {
                name: "italicize",
                action: "italicize",
                className: "fa fa-italic"
            },
            {
                name: "blockquote",
                action: "blockquote",
                className: "fa fa-quote-left"
            },
            {
                name: "link",
                action: "link",
                className: "fa fa-link"
            },
            {
                name: "image",
                action: "image",
                className: "fa fa-image"
            },
            {
                name: "unorderedList",
                action: "unorderedList",
                className: "fa fa-list"
            },
            {
                name: "orderedList",
                action: "orderedList",
                className: "fa fa-list-ol"
            },
            {
                name: 'line',
                action: 'line',
                className: 'fa fa-minus'
            },
            {
                name: "fullScreen",
                action: "fullscreen",
                className: "fa fa-expand"
            }
        ], true);
    };

    /**
     * Register custom keymaps
     *
     * @since 1.1.0
     */
    this.registerCustomKeymaps = function() {
        self.mirrormark.registerKeyMaps({
            "Cmd-H":     'header1',
            "Cmd-Alt-H": 'header2',
            "Cmd-B":     'bold',
            "Cmd-I":     'italicize',
            "Cmd-'":     'blockquote',
            "Cmd-Alt-L": 'orderedList',
            "Cmd-L":     'unorderedList',
            "Cmd-Alt-I": 'image',
            "Cmd-A":     'link'
        });
    };

    /**
     * Update storage input element
     *
     * @since 1.0.0
     */
    this.updateStorage = function(instance, change) {
        self.$field.text(self.codemirror.getValue());
    };

    /**
     * Deactivate plugin instance
     *
     * @since 1.0.0
     */
    this.deactivate = function(e) {
        self.updateStorage();
        self.codemirror.toTextArea();
    };

    /**
     * Handle fullscreen mode change event
     *
     * @since 1.0.1
     */
    this.changeFullscreenModeHandler = function() {
        // Remove indicator class if fullscreen mode was exited other then
        // by clicking or custom fullscreen mode icon
        if(!screenfull.isFullscreen) {
            self.$wrapper.removeClass('markdownfield-wrapper-fullscreen');
        }
    };

    /**
     * Handle a click on the toggle fullscreen mode icon
     *
     * @since 1.0.1
     */
    this.toggleFullscreenMode = function(instance) {

        var wrapper;

        // Abort if fullscreen mode isn't supported
        if(!screenfull.enabled) {
            return;
        }

        // find related wrapper element
        wrapper = jQuery(instance.cm.getWrapperElement()).closest('.markdownfield-wrapper');

        // Enable fullscreen mode
        if(!screenfull.isFullscreen) {
            self.attachFullscreenStyles(wrapper);
            screenfull.request(wrapper.get(0));

        // Disable fullscreen mode
        } else {
            screenfull.exit();
            self.detachFullscreenStyles(wrapper);
        }
    };

    /**
     * Add focus style classes to the editor wrapper
     *
     * @since 1.0.0
     */
    this.attachFocusStyles = function(instance) {
        self.$wrapper.addClass('markdownfield-wrapper-focused');
    };

    /**
     * Remove focus style classes from the editor wrapper
     *
     * @since 1.0.0
     */
    this.detachFocusStyles = function(instance) {
        self.$wrapper.removeClass('markdownfield-wrapper-focused');
    };

    /**
     * Add fullscreen style classes to the editor wrapper
     *
     * @since 1.0.1
     */
    this.attachFullscreenStyles = function(wrapper) {
        wrapper.addClass('markdownfield-wrapper-fullscreen');
    };

    /**
     * Remove fullscreen style classes from the editor wrapper
     *
     * @since 1.0.1
     */
    this.detachFullscreenStyles = function(wrapper) {
        wrapper.removeClass('markdownfield-wrapper-fullscreen');
    };

    /**
     * Translate a header value string (h1 to h6) into it's
     * markdown representation.
     *
     * @since 1.1.0
     */
    this.translateHeaderValue = function(value) {
        switch(value) {
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
            default:
                return '#';
        }
    };

    /**
     * Run initialization
     */
    return this.init();

});

(function($) {

    /**
     * Set up special "destroyed" event.
     *
     * @since 1.0.0
     */
    $.event.special.destroyed = {
        remove: function(event) {
            if(event.handler) {
                event.handler.apply(this, arguments);
            }
        }
    };

    /**
     * Tell the Panel to run our initialization.
     *
     * This callback will fire for every WYSIWYG Editor
     * Field on the current panel page.
     *
     * @see https://github.com/getkirby/panel/issues/228#issuecomment-58379016
     * @since 1.0.0
     */
    $.fn.markdownfield = function() {
            return new MarkdownField($, this);
    };

})(jQuery);
