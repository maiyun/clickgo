import * as types from '~/types/index';
import * as clickgo from 'clickgo';

export const data = {
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
    'disabled': false
};

export const computed = {
    'filesName': function(this: types.IVForm): string[] {
        const names: string[] = [];
        for (const name in this.files) {
            if (!name.includes('.d.ts')) {
                continue;
            }
            names.push(name);
        }
        return names;
    }
};

export const methods = {
    globalInclude: function(this: types.IVForm): void {
        if (this.globali) {
            delete this.files['/global.d.ts'];
        }
        else {
            this.files['/global.d.ts'] = 'declare function str(): string;';
        }
        this.globali = !this.globali;
    },
    newInclude: function(this: types.IVForm): void {
        if (this.newi) {
            delete this.files['/new.d.ts'];
        }
        else {
            this.files['/new.d.ts'] = 'declare function str2(): string;';
        }
        this.newi = !this.newi;
    },
    jump: function(this: types.IVForm, input: Record<string, any>): void {
        clickgo.form.dialog({
            'content': `<block>Path: ${input.resource.path}</block><block>Line: ${input.options.selection.startLineNumber}</block>`,
            'direction': 'v'
        }).catch((e) => { throw e; });
    },
    pathLebel: function(this: types.IVForm, label: string): void {
        this.language = label.toLowerCase();
    }
};
