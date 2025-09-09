import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.npath = ['/index.html'];
        this.file = '';
        this.files = {
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
        };
        this.list = [
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
        ];
        this.theme = ['vs'];
        this.themes = ['vs', 'vs-dark', 'hc-black'];
        this.language = '';
        this.globali = false;
        this.newi = false;
        this.readonly = false;
        this.disabled = false;
        this.size = ['12px'];
        this.family = false;
    }
    get filesName() {
        const names = [];
        for (const name in this.files) {
            if (!name.includes('.d.ts')) {
                continue;
            }
            names.push(name);
        }
        return names;
    }
    globalInclude() {
        if (this.globali) {
            delete this.files['/global.d.ts'];
        }
        else {
            this.files['/global.d.ts'] = 'declare function str(): string;';
        }
        this.globali = !this.globali;
    }
    newInclude() {
        if (this.newi) {
            delete this.files['/new.d.ts'];
        }
        else {
            this.files['/new.d.ts'] = 'declare function str2(): string;';
        }
        this.newi = !this.newi;
    }
    jump(input) {
        clickgo.form.dialog(this, {
            'content': `<block>Path: ${input.resource.path}</block><block>Line: ${input.options.selection.startLineNumber}</block>`,
            'direction': 'v'
        }).catch((e) => { throw e; });
    }
    pathLebel(label) {
        this.language = label[0].toLowerCase();
    }
}
