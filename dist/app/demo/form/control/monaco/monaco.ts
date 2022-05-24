import * as types from '~/types/index';

export const data = {
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
    'themes': ['vs', 'vs-dark', 'hc-black'],

    'add': false,
    'readonly': false,
    'disabled': false
};

export const watch = {
    'language': {
        handler: function(this: types.IVForm): void {
            this.code = this.codeList[this.list.indexOf(this.language)];
        },
        'immediate': true
    }
};

export const computed = {
    'filesName': function(this: types.IVForm): string[] {
        const names: string[] = [];
        for (const name in this.files) {
            names.push(name);
        }
        return names;
    }
};

export const methods = {
    addInclude: function(this: types.IVForm): void {
        this.add = true;
        this.files['new.d.ts'] = 'declare function str2(): string;';
    }
};
