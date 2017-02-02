let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for your application, as well as bundling up your JS files.
 |
 */

mix.webpackConfig({ externals: { jquery: "jQuery" } });

mix.setPublicPath('field/assets');

mix.js('src/js/visualmarkdown.js', 'js')
   .sass('src/sass/visualmarkdown.scss', 'css')
   .copy('node_modules/codemirror/lib/codemirror.css', 'field/assets/css');
