/*!
 * Visual Markdown Editor Field for Kirby 2.
 *
 * @version   1.5.0
 * @author    Jonas Döbertin <hello@jd-powered.net>
 * @copyright © 2017 Jonas Döbertin
 * @link      https://github.com/JonasDoebertin/kirby-visual-markdown
 * @license   GNU GPL v3.0 <http://opensource.org/licenses/GPL-3.0>
 */

import VisualMarkdownField from './field/field';

/**
 * Set up special "destroyed" event.
 *
 * @since 1.0.0
 */
jQuery.event.special.destroyed = {
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
jQuery.fn.markdownfield = function () {
    if (!this.data('initialized')) {
        return new VisualMarkdownField(jQuery, this);
    }
};
