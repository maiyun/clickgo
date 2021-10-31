"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.watch = exports.data = void 0;
exports.data = {
    'code': '',
    'language': 'HTML',
    'codeList': [
        `<html>
    <head>
        <title>Monaco</title>
    </head>
    <body>
        Hello Monaco Editor!
    </body>
</html>`,
        'export' + ` let props = {
}`,
        `.red {
    color: red;
}`
    ],
    'list': ['HTML', 'TypeScript', 'CSS'],
    'readonly': false
};
exports.watch = {
    'language': {
        handler: function () {
            this.code = this.codeList[this.list.indexOf(this.language)];
        },
        'immediate': true
    }
};
exports.methods = {};
