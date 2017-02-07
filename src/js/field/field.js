/*
 * Visual Markdown Editor Field for Kirby 2.
 *
 * @version   1.5.0
 * @author    Jonas Döbertin <hello@jd-powered.net>
 * @copyright © 2017 Jonas Döbertin
 * @link      https://github.com/JonasDoebertin/kirby-visual-markdown
 * @license   GNU GPL v3.0 <http://opensource.org/licenses/GPL-3.0>
 */

import Screenfull from 'screenfull';
import VisualMarkdownEditor from './../editor/editor';

/**
 * Visual Markdown Editor Field
 *
 * @since 1.0.0
 * @since 1.6.0 Upgraded to ES6 class
 */
export default class {
    /**
     * Initialize editor field.
     *
     * @since 1.0.0
     * @since 1.6.0 Upgraded to ES6 class constructor
     *
     * @param $
     * @param $field
     */
    constructor($, $field) {
        /*
         Prepare some jQuery elements for later reference
         */
        this.$field = $field;
        this.$wrapper = $field.closest('.markdownfield-wrapper');
        this.$draggable = $('.sidebar').find('.draggable');

        /*
         Initialize state flags
         */
        this.inAction = false;
        this.isFixed = false;
        this.isFocused = false;
        this.isFullscreen = false;

        /*
         Initialize VisualMarkdownEditor
         */
        this.editor = new VisualMarkdownEditor($, this, this.$field, {
            readonly: this.$field.is('[readonly]'),
            toolbar: this.$field.data('toolbar'),
            header1: this.$field.data('header1'),
            header2: this.$field.data('header2'),
            tools: this.$field.data('tools').split(','),
            kirbytext: this.$field.data('kirbytext')
        });

        /*
         Store some references to the underlying CodeMirror instance,
         our field instance and the toolbar and editor elements
         */
        this.codemirror = this.editor.getCodeMirrorInstance();
        this.$toolbar = this.$field.siblings('.visualmarkdown-toolbar');
        this.$editor = this.$field.siblings('.CodeMirror');

        /*
         Set up change event handler
         */
        this.codemirror.on('change', this.updateStorage.bind(this));

        /*
         Set up focus and blur event handlers
         */
        this.codemirror.on('focus', this.attachFocusStyles.bind(this));
        this.codemirror.on('blur', this.detachFocusStyles.bind(this));

        /*
         Set up fullscreen mode change event handler
         */
        $(document).bind(Screenfull.raw.fullscreenchange, this.changeFullscreenModeHandler.bind(this));

        /**
         * Make the editor field accept Kirby typical
         * file/page drag and drop events.
         *
         * @since 1.0.0
         */
        this.$wrapper.droppable({
            hoverClass: 'markdownfield-wrapper-over',
            accept: this.$draggable,
            drop: function (event, element) {
                this.editor.insert(element.draggable.data('text'));
            }
        });

        /**
         * Observe page scroll events to switch to sticky toolbar
         *
         * @since 1.4.0
         */
        $('.mainbar').scroll(() => {

            /**
             * Switch to fixed toolbar, if
             * - the fullscreen mode isn't enabled
             * - the toolbar isn't fixed already
             * - the scroll position is within the fields wrapper
             * - the field is focused
             */
            if (!this.isFullscreen && !this.isFixed && this.scrollTopWithinWrapper() && this.isFocused) {
                this.enableFixedToolbar();
            }

            /**
             * Switch back to regular toolbar, if
             * - the fullscreen mode isn't enabled
             * - the toolbar is fixed
             * - the scroll position is not within the fields wrapper
             */
            else if (!this.isFullscreen && this.isFixed && !this.scrollTopWithinWrapper()) {
                this.disableFixedToolbar();
            }
        });

        /**
         * Observe when the field element is destroyed (=the user leaves the
         * current view) and deactivate MirrorMark accordingly.
         *
         * @since 1.0.0
         */
        this.$field.bind('destroyed', () => {
            this.deactivate();
        });

        /**
         * FIX: Add an indicator that this field is already initialized to
         * prevent double initialization of a Visual Markdown Editor field.
         * See: https://github.com/JonasDoebertin/kirby-visual-markdown/issues/61
         */
        this.$field.data('initialized', true);
    }

    /**
     * Update storage input element
     *
     * @since 1.0.0
     */
    updateStorage() {
        this.$field.text(this.codemirror.getValue());
    };

    /**
     * Deactivate plugin instance
     *
     * @since 1.0.0
     */
    deactivate() {
        this.updateStorage();
        this.editor.deactivate();
    };

    /**
     * Handle fullscreen mode change event
     *
     * @since 1.0.1
     */
    changeFullscreenModeHandler() {this
        // Add indication class if fullscreen mode was entered
        if (Screenfull.isFullscreen && (Screenfull.element === this.$wrapper.get(0))) {
            this.attachFullscreenStyles();
        }

        // Remove indicator class if fullscreen mode was exited
        if (!Screenfull.isFullscreen) {
            this.detachFullscreenStyles();
        }
    };

    /**
     * Add focus style classes to the editor wrapper
     *
     * @since 1.0.0
     */
    attachFocusStyles() {
        this.isFocused = true;
        this.$wrapper.addClass('markdownfield-wrapper-focused');
        if (!this.isFullscreen && this.scrollTopWithinWrapper()) {
            this.enableFixedToolbar();
        }
    };

    /**
     * Remove focus style classes from the editor wrapper
     *
     * @since 1.0.0
     */
    detachFocusStyles() {
        this.isFocused = false;
        this.$wrapper.removeClass('markdownfield-wrapper-focused');
        this.disableFixedToolbar();
    };

    /**
     * Add fullscreen style classes to the editor wrapper
     *
     * @since 1.0.1
     */
    attachFullscreenStyles() {
        this.isFullscreen = true;
        this.disableFixedToolbar();
        this.$wrapper.addClass('markdownfield-wrapper-fullscreen');
    };

    /**
     * Remove fullscreen style classes from the editor wrapper
     *
     * @since 1.0.1
     */
    detachFullscreenStyles() {
        this.isFullscreen = false;
        this.$wrapper.removeClass('markdownfield-wrapper-fullscreen');
    };

    /**
     * Chick if the documents scrollTop is within the fields wrapper element.
     *
     * @since 1.4.0
     * @return boolean
     */
    scrollTopWithinWrapper() {
        const topOffset  = this.$wrapper.offset().top + 2,
            bottomOffset = this.$wrapper.offset().top + this.$wrapper.outerHeight() - this.$toolbar.outerHeight() - 2;

        return ((topOffset <= 48) && (bottomOffset >= 48));
    };

    /**
     * Enable the fixed toolbar.
     *
     * @since 1.4.0
     */
    enableFixedToolbar() {
        this.isFixed = true;
        this.$toolbar.addClass('visualmarkdown-toolbar-fixed')
            .css('max-width', this.$wrapper.width());
        this.$wrapper.css('padding-top', this.$toolbar.outerHeight());
    };

    /**
     * Disable the fixed toolbar.
     *
     * @since 1.4.0
     */
    disableFixedToolbar() {
        if (!this.inAction) {
            this.isFixed = false;
            this.$toolbar.removeClass('visualmarkdown-toolbar-fixed')
                .css('max-width', '');
            this.$wrapper.css('padding-top', 0);
        }
    };
}
