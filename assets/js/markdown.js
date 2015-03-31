/**
 * Visual Markdown Editor Field for Kirby 2
 *
 * @version   1.0.0
 * @author    Jonas Döbertin <hello@jd-powered.net>
 * @copyright Jonas Döbertin <hello@jd-powered.net>
 * @link      https://github.com/JonasDoebertin/kirby-visual-markdown
 * @license   GNU GPL v3.0 <http://opensource.org/licenses/GPL-3.0>
 */

MarkdownField = (function($, $field) {

    var self = this;

    this.$field     = $field;
    this.$draggable = $('.sidebar').find('.draggable');
    this.$wrapper   = $field.parent();
    this.$toolbar   = null;
    this.$editor    = null;

    this.mirrormark = null;
    this.codemirror = null;

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
            showToolbar: true
        });
        self.registerCustomTools();
        self.mirrormark.render();

        /*
            Store some references to the underlying codemirror instance
            and the toolbar and editor elements
         */
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
            line: function() {
                this.insert('****');
            },
            image: function() {
                this.insertBefore('(image: filename.jpg)');
            },
            fullScreen: function() {
                self.toggleFullscreenMode();
            }
        });

        // Register toolbar icons
        self.mirrormark.registerTools([
            {
                name: 'line',
                action: 'line',
                className: 'fa fa-minus'
            }
        ]);
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
    this.toggleFullscreenMode = function() {

        // Abort if fullscreen mode isn't supported
        if(!screenfull.enabled) {
            return;
        }

        // Enable fullscreen mode
        if(!screenfull.isFullscreen) {
            self.attachFullscreenStyles();
            screenfull.request(self.$wrapper.get(0));

        // Disable fullscreen mode
        } else {
            screenfull.exit();
            self.detachFullscreenStyles();
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
    this.attachFullscreenStyles = function(instance) {
        self.$wrapper.addClass('markdownfield-wrapper-fullscreen');
    };

    /**
     * Remove fullscreen style classes from the editor wrapper
     *
     * @since 1.0.1
     */
    this.detachFullscreenStyles = function(instance) {
        self.$wrapper.removeClass('markdownfield-wrapper-fullscreen');
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
