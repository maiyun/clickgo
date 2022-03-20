"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.computed = exports.watch = exports.data = void 0;
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
    },
    incl: function(): string {
        return str2() + ', o.';
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
    'file': '',
    'files': {
        'global.d.ts': 'declare function str(): string;'
    },
    'language': 'HTML',
    'list': ['HTML', 'TypeScript', 'CSS', 'SCSS'],
    'theme': 'vs',
    'themes': ['vs', 'dark', 'reader'],
    'add': false,
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
exports.computed = {
    'filesName': function () {
        let names = [];
        for (let name in this.files) {
            names.push(name);
        }
        return names;
    }
};
exports.methods = {
    addInclude: function () {
        this.add = true;
        this.files['new.d.ts'] = 'declare function str2(): string;';
    }
};
