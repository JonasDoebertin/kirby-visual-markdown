CodeMirror.defineMode('kirbytext', function(config, modeConfig) {

    var states = {

        start: [
            // Match a Kirbytext tags opening bracket
            {
                regex: /\((?=[a-z0-9]+:)/i,
                token: 'kirbytext-open',
                next: 'inside'
            }
        ],

        inside: [
            // Match a Kirbytext tags attributes
            {
                regex: /[a-z0-9]+: ?/i,
                token: 'kirbytext-attribute',
            },
            // Match a Kirbytext tags attribute value
            {
                regex: /[^\):]+(?= ([a-z0-9]+:)|\))/i,
                token: 'kirbytext-value',
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
