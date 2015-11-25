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
 * Visual Markdown Editor Field
 *
 * @since 1.0.0
 */
var VisualMarkdownField = function ($, $field) {
    'use strict';

    var self = this;

    this.$field = $field;
    this.$draggable = $('.sidebar').find('.draggable');
    this.$wrapper = $field.closest('.markdownfield-wrapper');
    this.$toolbar = null;
    this.$editor = null;

    this.editor = null;

    this.inAction = false;
    this.isFixed = false;
    this.isFocused = false;
    this.isFullscreen = false;

    this.options = {
        toolbar: $field.data('toolbar'),
        header1: $field.data('header1'),
        header2: $field.data('header2'),
        tools: $field.data('tools').split(','),
        kirbytext: $field.data('kirbytext')
    };

    /**
     * Initialize editor field
     *
     * @since 1.0.0
     */
    this.init = function () {

        /*
            Initialize VisualMarkdownEditor
         */
        self.editor = new VisualMarkdownEditor($, self, self.$field, self.options);

        /*
            Store some references to the underlying codemirror instance
            our field instance and the toolbar and editor elements
         */
        self.codemirror = self.editor.getCodeMirrorInstance();
        self.$toolbar = self.$field.siblings('.visualmarkdown-toolbar');
        self.$editor = self.$field.siblings('.CodeMirror');

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
            accept: self.draggable,
            drop: function (event, element) {
                self.editor.insert(element.draggable.data('text'));
            }
        });

        /**
         * Observe page scroll events to switch to sticky toolbar
         *
         * @since 1.4.0
         */
        $('.mainbar').scroll(function () {

            /**
             * Switch to fixed toolbar, if
             * - the fullscreen mode isn't enabled
             * - the toolbar isn't fixed already
             * - the scroll position is within the fields wrapper
             * - the field is focused
             */
            if (!self.isFullscreen && !self.isFixed && self.scrollTopWithinWrapper() && self.isFocused) {
                self.enableFixedToolbar();
            }

            /**
             * Switch back to regular toolbar, if
             * - the fullscreen mode isn't enabled
             * - the toolbar is fixed
             * - the scroll position is not within the fields wrapper
             */
            else if (!self.isFullscreen && self.isFixed && !self.scrollTopWithinWrapper()) {
                self.disableFixedToolbar();
            }

        });

        /**
         * Observe when the field element is destroyed (=the user leaves the
         * current view) and deactivate MirrorMark accordingly.
         *
         * @since 1.0.0
         */
        self.$field.bind('destroyed', function () {
            self.deactivate();
        });

        /**
         * FIX: Add an indicator that this field is already initialized to
         * prevent double initialization of a Visual MArkdown Editor field.
         * See: https://github.com/JonasDoebertin/kirby-visual-markdown/issues/61
         */
        self.$field.data('initialized', true);

    };

    /**
     * Update storage input element
     *
     * @since 1.0.0
     */
    this.updateStorage = function () {
        self.$field.text(self.codemirror.getValue());
    };

    /**
     * Deactivate plugin instance
     *
     * @since 1.0.0
     */
    this.deactivate = function () {
        self.updateStorage();
        self.editor.deactivate();
    };

    /**
     * Handle fullscreen mode change event
     *
     * @since 1.0.1
     */
    this.changeFullscreenModeHandler = function () {

        // Add indication class if fullscreen mode was entered
        if (screenfull.isFullscreen && (screenfull.element === self.$wrapper.get(0))) {
            self.attachFullscreenStyles();
        }

        // Remove indicator class if fullscreen mode was exited
        if (!screenfull.isFullscreen) {
            self.detachFullscreenStyles();
        }

    };

    /**
     * Add focus style classes to the editor wrapper
     *
     * @since 1.0.0
     */
    this.attachFocusStyles = function () {
        self.isFocused = true;
        self.$wrapper.addClass('markdownfield-wrapper-focused');
        if (!self.isFullscreen && self.scrollTopWithinWrapper()) {
            self.enableFixedToolbar();
        }
    };

    /**
     * Remove focus style classes from the editor wrapper
     *
     * @since 1.0.0
     */
    this.detachFocusStyles = function () {
        self.isFocused = false;
        self.$wrapper.removeClass('markdownfield-wrapper-focused');
        self.disableFixedToolbar();
    };

    /**
     * Add fullscreen style classes to the editor wrapper
     *
     * @since 1.0.1
     */
    this.attachFullscreenStyles = function () {
        self.isFullscreen = true;
        self.disableFixedToolbar();
        self.$wrapper.addClass('markdownfield-wrapper-fullscreen');
    };

    /**
     * Remove fullscreen style classes from the editor wrapper
     *
     * @since 1.0.1
     */
    this.detachFullscreenStyles = function () {
        self.isFullscreen = false;
        self.$wrapper.removeClass('markdownfield-wrapper-fullscreen');
    };

    /**
     * Chick if the documents scrollTop is within the fields wrapper element.
     *
     * @since 1.4.0
     * @return boolean
     */
    this.scrollTopWithinWrapper = function () {
        var topOffset    = self.$wrapper.offset().top + 2,
            bottomOffset = self.$wrapper.offset().top + self.$wrapper.outerHeight() - self.$toolbar.outerHeight() - 2;

        return ((topOffset <= 48) && (bottomOffset >= 48));
    };

    /**
     * Enable the fixed toolbar.
     *
     * @since 1.4.0
     */
    this.enableFixedToolbar = function () {
        self.isFixed = true;
        self.$toolbar.addClass('visualmarkdown-toolbar-fixed')
            .css('max-width', self.$wrapper.width());
        self.$wrapper.css('padding-top', self.$toolbar.outerHeight());
    };

    /**
     * Disable the fixed toolbar.
     *
     * @since 1.4.0
     */
    this.disableFixedToolbar = function () {
        if (!self.inAction) {
            self.isFixed = false;
            self.$toolbar.removeClass('visualmarkdown-toolbar-fixed')
                .css('max-width', '');
            self.$wrapper.css('padding-top', 0);
        }
    };

    /**
     * Run initialization
     */
    return this.init();

};

(function ($) {
    'use strict';

    /**
     * Set up special "destroyed" event.
     *
     * @since 1.0.0
     */
    $.event.special.destroyed = {
        remove: function (event) {
            if (event.handler) {
                event.handler.apply(this, arguments);
            }
        }
    };

    /**
     * Tell the Panel to run our initialization.
     *
     * This callback will fire for every Visual Markdown Field
     * on the current panel page.
     *
     * @see https://github.com/getkirby/panel/issues/228#issuecomment-58379016
     * @since 1.0.0
     */
    $.fn.markdownfield = function () {
        if (!this.data('initialized')) {
            return new VisualMarkdownField($, this);
        }
    };

})(jQuery);
