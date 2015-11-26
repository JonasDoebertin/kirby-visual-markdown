<?php
/**
 * Visual Markdown Editor Field for Kirby 2.
 *
 * @version   1.5.0
 * @author    Jonas Döbertin <hello@jd-powered.net>
 * @copyright Jonas Döbertin <hello@jd-powered.net>
 * @link      https://github.com/JonasDoebertin/kirby-visual-markdown
 * @license   GNU GPL v3.0 <http://opensource.org/licenses/GPL-3.0>
 */

/**
 * Visual Markdown Editor Field.
 *
 * @since 1.0.0
 */
class MarkdownField extends InputField
{
    /**
     * Language files directory.
     *
     * @since 1.2.0
     */
    const LANG_DIR = 'languages';

    /**
     * Define frontend assets.
     *
     * @var array
     * @since 1.0.0
     */
    public static $assets = [
        'js' => [
            'screenfull-2.0.0.min.js',
            'codemirror-compressed-5.8.0.min.js',
            'kirbytags-mode.js',
            'visualmarkdownfield.js',
            'visualmarkdowneditor.js',
        ],
        'css' => [
            'codemirror-5.8.0.css',
            'visualmarkdown.css',
        ],
    ];

    /**
     * Option: Show/Hide toolbar.
     *
     * @since 1.1.0
     * @var bool
     */
    protected $toolbar = true;

    /**
     * Option: Header 1.
     *
     * @since 1.1.0
     * @var string
     */
    protected $header1 = 'h1';

    /**
     * Option: Header 2.
     *
     * @since 1.1.0
     * @var string
     */
    protected $header2 = 'h2';

    /**
     * Option: Available Tools.
     *
     * @since 1.3.0
     * @var string
     */
    protected $tools = [
        'header1',
        'header2',
        'bold',
        'italic',
        'strikethrough',
        'blockquote',
        'unorderedList',
        'orderedList',
        'link',
        'email',
        'image',
        'line',
    ];

    /**
     * Translated strings.
     *
     * @since 1.2.0
     * @var array
     */
    protected $translation;

    /**
     * Valid header1/header2 option values.
     *
     * @since 1.2.0
     * @var array
     */
    protected $validHeaderValues = [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
    ];

    /**
     * Default option values.
     *
     * @since 1.2.0
     * @var array
     */
    protected $defaultValues = [
        'header1' => 'h1',
        'header2' => 'h2',
        'tools'   => [
            'header1',
            'header2',
            'bold',
            'italic',
            'blockquote',
            'unorderedList',
            'orderedList',
            'link',
            'image',
            'line',
        ],
    ];

    /**************************************************************************\
    *                          GENERAL FIELD METHODS                           *
    \**************************************************************************/

    /**
     * Field setup.
     *
     * @since 1.2.0
     */
    public function __construct()
    {
        // Build translation file path
        $baseDir = __DIR__ . DS . self::LANG_DIR . DS;

        // Get panel language
        if (version_compare(panel()->version(), '2.2', '>=')) {
            $lang = panel()->translation()->code();
        } else {
            $lang = panel()->language();
        }

        // Load language files
        if (file_exists($baseDir . $lang . '.php')) {
            $this->translation = include $baseDir . $lang . '.php';
        } else {
            $this->translation = include $baseDir . 'en.php';
        }
    }

    /**
     * Magic setter.
     *
     * Set a fields property and apply default value if required.
     *
     * @since 1.1.0
     * @param string $option
     * @param mixed  $value
     */
    public function __set($option, $value)
    {
        /* Set given value */
        $this->$option = $value;

        /* Check if value is valid */
        switch ($option) {
            case 'toolbar':
                $this->validateToolbarOption($value);
                break;

            case 'header1':
            case 'header2':
                $this->validateHeaderOption($option, $value);
                break;

            case 'tools':
                $this->validateToolsOption($value);
                break;
        }
    }

    /**
     * Validate "toolbar" option.
     *
     * @since 1.3.0
     * @param mixed $value
     */
    protected function validateToolbarOption($value)
    {
        $this->toolbar = !in_array($value, ['false', 'hide', 'no', false]);
    }

    /**
     * Validate "headerX" option.
     *
     * @since 1.3.0
     * @param string $header
     * @param array  $value
     */
    protected function validateHeaderOption($header, $value)
    {
        if (!in_array($value, $this->validHeaderValues)) {
            $this->$header = $this->defaultValues[$header];
        }
    }

    /**
     * Validate "tools" option.
     *
     * @since 1.3.0
     * @param array $value
     */
    protected function validateToolsOption($value)
    {
        if (!is_array($value) or empty($value)) {
            $this->tools = $this->defaultValues['tools'];
        }
    }

    /**
     * Convert result to markdown.
     *
     * @since 1.0.0
     * @return string
     */
    public function result()
    {
        return str_replace(["\r\n", "\r"], "\n", parent::result());
    }

    /**************************************************************************\
    *                            PANEL FIELD MARKUP                            *
    \**************************************************************************/

    /**
     * Create input element.
     *
     * @since 1.0.0
     * @return \Brick
     */
    public function input()
    {
        // Set up modals
        $modals = tpl::load(__DIR__ . DS . 'partials' . DS . 'modals.php', ['field' => $this]);

        // Set up translation
        $translation = tpl::load(__DIR__ . DS . 'partials' . DS . 'translation.php', ['translations' => $this->translation]);

        // Set up textarea
        $input = parent::input();
        $input->tag('textarea');
        $input->removeAttr('type');
        $input->removeAttr('value');
        $input->html($this->value() ?: false);
        $input->data([
            'field'         => 'markdownfield',
            'toolbar'       => ($this->toolbar) ? 'true' : 'false',
            'tools'         => implode(',', $this->tools),
            'header1'       => $this->header1,
            'header2'       => $this->header2,
            'kirbytext'     => (c::get('panel.kirbytext', true)) ? 'true' : 'false',
        ]);

        /*
            FIX: Prevent Google Chrome from trying to validate the underlying
            invisible textarea. the Panel will handle this instead.

            See: https://github.com/JonasDoebertin/kirby-visual-markdown/issues/42
         */
        $input->removeAttr('required');

        // Set up wrapping element
        $wrapper = new Brick('div', false);
        $wrapper->addClass('markdownfield-wrapper');
        $wrapper->addClass('markdownfield-field-' . $this->name);

        return $wrapper
            ->append($modals)
            ->append($translation)
            ->append($input);
    }

    /**
     * Create outer field element.
     *
     * @since 1.0.0
     * @return \Brick
     */
    public function element()
    {
        $element = parent::element();
        $element->addClass('field-with-visualmarkdown');

        return $element;
    }

    /**************************************************************************\
    *                                 HELPERS                                  *
    \**************************************************************************/

    /**
     * Return a translation from the internal translation storage.
     *
     * @since 1.3.2
     * @param  string $key
     * @param  string $default
     * @return string
     */
    public function lang($key, $default = '')
    {
        return (isset($this->translation[$key]) ? $this->translation[$key] : $default);
    }
}
