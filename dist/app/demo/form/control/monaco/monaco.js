"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.methods = exports.computed = exports.data = void 0;
const clickgo = require("clickgo");
exports.data = {
    'path': '/index.html',
    'file': '',
    'files': {
        '/index.html': `<html>
    <head>
        <title>Monaco</title>
    </head>
    <body>
        Hello Monaco Editor!
    </body>
</html>`,
        '/index.ts': 'export' + ` let props = {
};\n\nexport` + ` let methods = {
    hehe: function(): string {
        return str() + ', en.';
    },
    incl: function(): string {
        return str2() + ', o.';
    }
};\n`,
        '/index.css': `.red {
    color: red;
}`,
        '/index.scss': `.red {
    color: red;
    span {
        color: blue;
    }
}`
    },
    'list': [
        {
            'label': 'HTML',
            'value': '/index.html'
        },
        {
            'label': 'TypeScript',
            'value': '/index.ts'
        },
        {
            'label': 'CSS',
            'value': '/index.css'
        },
        {
            'label': 'SCSS',
            'value': '/index.scss'
        }
    ],
    'theme': 'vs',
    'themes': ['vs', 'vs-dark', 'hc-black'],
    'language': undefined,
    'globali': false,
    'newi': false,
    'readonly': false,
    'disabled': false,
    'size': '12px',
    'family': false,
    'initMonaco': false
};
exports.computed = {
    'filesName': function () {
        const names = [];
        for (const name in this.files) {
            if (!name.includes('.d.ts')) {
                continue;
            }
            names.push(name);
        }
        return names;
    }
};
exports.methods = {
    globalInclude: function () {
        if (this.globali) {
            delete this.files['/global.d.ts'];
        }
        else {
            this.files['/global.d.ts'] = 'declare function str(): string;';
        }
        this.globali = !this.globali;
    },
    newInclude: function () {
        if (this.newi) {
            delete this.files['/new.d.ts'];
        }
        else {
            this.files['/new.d.ts'] = 'declare function str2(): string;';
        }
        this.newi = !this.newi;
    },
    jump: function (input) {
        clickgo.form.dialog({
            'content': `<block>Path: ${input.resource.path}</block><block>Line: ${input.options.selection.startLineNumber}</block>`,
            'direction': 'v'
        }).catch((e) => { throw e; });
    },
    pathLebel: function (label) {
        this.language = label.toLowerCase();
    }
};
const mounted = function () {
    clickgo.core.initModules('monaco').then(() => {
        this.initMonaco = true;
    }).catch(() => {
        this.initMonaco = true;
    });
};
exports.mounted = mounted;
