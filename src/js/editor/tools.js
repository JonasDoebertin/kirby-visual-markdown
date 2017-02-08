/*
 * Visual Markdown Editor Field for Kirby 2.
 *
 * @version   1.5.0
 * @author    Jonas Döbertin <hello@jd-powered.net>
 * @copyright © 2017 Jonas Döbertin
 * @link      https://github.com/JonasDoebertin/kirby-visual-markdown
 * @license   GNU GPL v3.0 <http://opensource.org/licenses/GPL-3.0>
 */

/**
 * Toolbar Icons
 *
 * @since 1.2.0
 */
export default [
    {
        action: 'header1',
        className: 'fa fa-header'
    },
    {
        action: 'header2',
        className: 'markdownfield-icon-text markdownfield-icon-header2',
        showName: true
    },
    {
        action: 'divider'
    },
    {
        action: 'bold',
        className: 'fa fa-bold'
    },
    {
        action: 'italic',
        className: 'fa fa-italic'
    },
    {
        action: 'strikethrough',
        className: 'fa fa-strikethrough'
    },
    {
        action: 'blockquote',
        className: 'fa fa-quote-left'
    },
    {
        action: 'unorderedList',
        className: 'fa fa-list'
    },
    {
        action: 'orderedList',
        className: 'fa fa-list-ol'
    },
    {
        action: 'divider'
    },
    {
        action: 'link',
        className: 'fa fa-link'
    },
    {
        action: 'email',
        className: 'fa fa-envelope'
    },
    {
        action: 'image',
        className: 'fa fa-image'
    },
    {
        action: 'line',
        className: 'fa fa-minus'
    },
    {
        action: 'divider'
    },
    {
        action: 'help',
        className: 'fa fa-question-circle',
        nested: [
            {
                action: 'shortcutsModal',
                showName: true
            },
            {
                action: 'markdownLink',
                showName: true
            },
            {
                action: 'kirbytextLink',
                showName: true
            },
            {
                action: 'divider'
            },
            {
                action: 'issuesLink',
                showName: true
            },
            {
                action: 'licenseLink',
                showName: true
            }
        ]
    }
];
