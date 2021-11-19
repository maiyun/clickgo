"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.watch = exports.data = void 0;
exports.data = {
    'code': '',
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
};\n\nexport` + ` let methods = {
    hehe: function(): string {
        return str() + ', en.';
    }
};\n`,
        `.red {
    color: red;
}`,
        `.red {
    color: red;
    span {
        color: blue;
    }
}`
    ],
    'files': {
        'global.ts': 'declare function str(): string;'
    },
    'language': 'HTML',
    'list': ['HTML', 'TypeScript', 'CSS', 'SCSS'],
    'theme': 'vs',
    'themes': ['vs', 'dark', 'reader'],
    'readonly': false,
    'disabled': false
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
