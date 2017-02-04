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
import MarkdownMode from 'codemirror/mode/markdown/markdown';
import OverlayAddon from 'codemirror/addon/mode/overlay';
import SimpleAddon from 'codemirror/addon/mode/simple';
import XmlMode from 'codemirror/mode/xml/xml';

/**
 * Kirbytext CodeMirror Syntax Mode
 *
 * @since 1.3.0
 */
CodeMirror.defineMode('kirbytext', function (config, modeConfig) {
    'use strict';

    var states = {

        start: [
            // Match a Kirbytext tags opening bracket
            {
                regex: /[^\]]\((?=[a-z0-9-]+:)/i,
                token: 'kirbytext-open',
                next: 'attribute'
            }, {
                regex: /\((?=[a-z0-9-]+:)/i,
                sol: true,
                token: 'kirbytext-open',
                next: 'attribute'
            }
        ],

        attribute: [
            // Match a Kirbytext tags attributes
            {
                regex: /[a-z0-9-]+: ?(?!\/\/)/i,
                token: 'kirbytext-attribute',
                next: 'value'
            },
            // Match a Kirbytext tags closing bracket
            {
                regex: /\)/,
                token: 'kirbytext-close',
                next: 'start'
            }
        ],

        value: [
            // Match a Kirbytext tags attribute value
            {
                regex: /[^\)]+? (?=(?:[a-z0-9]+:))/i,
                token: 'kirbytext-value',
                next: 'attribute'
            }, {
                regex: /[^\)]+?(?=\))/i,
                token: 'kirbytext-value',
                next: 'attribute'
            },
            // Match a Kirbytext tags closing bracket
            {
                regex: /\)/,
                token: 'kirbytext-close',
                next: 'start'
            }
        ],
        meta: {}

    };

    modeConfig.name = 'markdown';

    return CodeMirror.overlayMode(
        CodeMirror.getMode(config, modeConfig),
        CodeMirror.simpleMode(config, states)
    );

});
