"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.data = exports.props = void 0;
exports.props = {
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': 0
    },
    'top': {
        'default': 0
    },
    'zIndex': {
        'default': 0
    },
    'flex': {
        'default': ''
    }
};
exports.data = {
    'notInit': false
};
exports.mounted = function () {
    let monaco = clickgo.core.getModule('monaco');
    if (monaco) {
        const monacoInstance = monaco[0].editor.create(this.$refs.wrap, {
            'value': `<html>
    <head>
    <title>Monaco</title>
    </head>
    <body>
    Hello Monaco Editor!
    </body>
    </html>`,
            'language': 'html'
        });
        console.log('[2]', monacoInstance);
    }
    else {
        this.notInit = true;
    }
};
