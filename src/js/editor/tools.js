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
        className: 'fa fa-header',
        type: 'edit'
    },
    {
        action: 'header2',
        className: 'markdownfield-icon-text markdownfield-icon-header2',
        showName: true,
        type: 'edit'
    },
    {
        type: 'divider'
    },
    {
        action: 'bold',
        className: 'fa fa-bold',
        type: 'edit'
    },
    {
        action: 'italic',
        className: 'fa fa-italic',
        type: 'edit'
    },
    {
        action: 'strikethrough',
        className: 'fa fa-strikethrough',
        type: 'edit'
    },
    {
        action: 'blockquote',
        className: 'fa fa-quote-left',
        type: 'edit'
    },
    {
        action: 'unorderedList',
        className: 'fa fa-list',
        type: 'edit'
    },
    {
        action: 'orderedList',
        className: 'fa fa-list-ol',
        type: 'edit'
    },
    {
        type: 'divider'
    },
    {
        action: 'link',
        className: 'fa fa-link',
        type: 'edit'
    },
    {
        action: 'email',
        className: 'fa fa-envelope',
        type: 'edit'
    },
    {
        action: 'image',
        className: 'fa fa-image',
        type: 'edit'
    },
    {
        action: 'line',
        className: 'fa fa-minus',
        type: 'edit'
    },
    {
        type: 'divider'
    },
    {
        action: 'help',
        className: 'fa fa-question-circle',
        type: 'help',
        nested: [
            {
                action: 'shortcutsModal',
                showName: true,
                type: 'help'
            },
            {
                action: 'markdownLink',
                showName: true,
                type: 'help'
            },
            {
                action: 'kirbytextLink',
                showName: true,
                type: 'help'
            },
            {
                type: 'divider'
            },
            {
                action: 'issuesLink',
                showName: true,
                type: 'help'
            },
            {
                action: 'licenseLink',
                showName: true,
                type: 'license'
            }
        ]
    },
    {
        action: 'fullscreen',
        className: 'fa fa-expand',
        type: 'fullscreen'
    }
];
