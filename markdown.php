<?php
/**
 * Visual Markdown Editor Field for Kirby 2
 *
 * @version   1.1.0
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
class MarkdownField extends InputField {

    /**
     * Define frontend assets
     *
     * @var array
     * @since 1.0.0
     */
    public static $assets = array(
        'js' => array(
            'mirrormark.package.min.js',
            'screenfull.min.js',
            'markdown.js',
        ),
        'css' => array(
            'mirrormark.package.min.css',
            'markdown.css',
        ),
    );

    /**
     * Option: Show/Hide toolbar
     *
     * @since 1.1.0
     *
     * @var string
     */
    protected $toolbar = true;

    /**
     * Option: Header 1
     *
     * @since 1.1.0
     *
     * @var string
     */
    protected $header1 = '#';

    /**
     * Option: Header 2
     *
     * @since 1.1.0
     *
     * @var string
     */
    protected $header2 = '##';

    /**************************************************************************\
    *                          GENERAL FIELD METHODS                           *
    \**************************************************************************/

    /**
     * Magic setter
     *
     * Set a fields property and apply default value if required.
     *
     * @since 1.1.0
     *
     * @param string $option
     * @param mixed  $value
     */
    public function __set($option, $value)
    {
        /* Set given value */
        $this->$option = $value;

        /* Check if value is valid */
        switch($option)
        {
            case 'toolbar':
                if(in_array($value, array(false, 'hide')))
                {
                    $this->toolbar = false;
                }
                else
                {
                    $this->toolbar = true;
                }
                break;
            case 'header1':
                $this->header1 = $this->translateHeaderValue($value, '#');
                break;
            case 'header2':
                $this->header2 = $this->translateHeaderValue($value, '##');
                break;
        }

    }

    /**
     * Convert result to markdown
     *
     * @since 1.0.0
     *
     * @return string
     */
    public function result()
    {
        return str_replace(array("\r\n", "\r"), "\n", parent::result());
    }

    /**************************************************************************\
    *                            PANEL FIELD MARKUP                            *
    \**************************************************************************/

    /**
     * Create input element
     *
     * @since 1.0.0
     *
     * @return \Brick
     */
    public function input()
    {
        // Set up textarea
        $input = parent::input();
        $input->tag('textarea');
        $input->removeAttr('type');
        $input->removeAttr('value');
        $input->html($this->value() ?: false);
        $input->data(array(
            'field'   => 'markdownfield',
            'toolbar' => ($this->toolbar) ? 'true' : 'false',
            'header1' => $this->header1,
            'header2' => $this->header2,
        ));

        // Set up wrapping element
        $wrapper = new Brick('div', false);
        $wrapper->addClass('markdownfield-wrapper');
        $wrapper->addClass('markdownfield-field-' . $this->name);

        return $wrapper->append($input);
    }

    /**
     * Create outer field element
     *
     * @since 1.0.0
     *
     * @return \Brick
     */
    public function element()
    {
        $element = parent::element();
        $element->addClass('field-with-markdown');
        return $element;
    }

    /**************************************************************************\
    *                                 HELPERS                                  *
    \**************************************************************************/

    /**
     * Translate a header value string (h1 to h6) into it's
     * markdown representation.
     *
     * @since 1.1.0
     *
     * @param  string $value
     * @param  string $default
     * @return string
     */
    protected function translateHeaderValue($value, $default = '#')
    {
        switch($value)
        {
            case 'h1':
                return '#';
            case 'h2':
                return '##';
            case 'h3':
                return '###';
            case 'h4':
                return '####';
            case 'h5':
                return '#####';
            case 'h6':
                return '######';
            default:
                return $default;
        }
    }

}
