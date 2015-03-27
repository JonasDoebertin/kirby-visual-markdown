/**
 * Visual Markdown Editor Field for Kirby 2
 *
 * @version   1.0.0
 * @author    Jonas Döbertin <hello@jd-powered.net>
 * @copyright Jonas Döbertin <hello@jd-powered.net>
 * @link      https://github.com/jonasdoebertin/kirby-mirrormark
 * @license   GNU GPL v3.0 <http://opensource.org/licenses/GPL-3.0>
 */

MarkdownField = (function($, $field) {

    var self = this;

    this.$field     = $field;
    this.$draggable = $('.sidebar').find('.draggable');
    this.$toolbar   = null;
    this.$editor   = null;

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
        self.mirrormark.render();

        /*
            Store a reference to the underlying codemirror instance
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

        // /**
        //  * Make the editor field accept Kirby typical
        //  * file/page drag and drop events.
        //  *
        //  * @since 1.0.0
        //  */
        // self.$editor.droppable({
        //     hoverClass: 'over',
        //     accept:     self.draggable,
        //     drop:       function(event, element) {
        //         self.insertAtCaret(element.draggable.data('text'));
        //     }
        // });

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

    this.updateStorage = function(instance, change) {
        self.$field.text(self.codemirror.getValue());
    };

    this.attachFocusStyles = function(instance) {
        self.$toolbar.addClass('markdown-focused');
        self.$editor.addClass('markdown-focused');
    };

    this.detachFocusStyles = function(instance) {
        self.$toolbar.removeClass('markdown-focused');
        self.$editor.removeClass('markdown-focused');
    };

    this.deactivate = function(e) {
        self.updateStorage();
        self.codemirror.toTextArea();
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
