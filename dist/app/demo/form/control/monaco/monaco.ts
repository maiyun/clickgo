export let data = {
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
    'file': '',
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

export let watch = {
    'language': {
        handler: function(this: IVForm): void {
            this.code = this.codeList[this.list.indexOf(this.language)];
        },
        'immediate': true
    }
};

export let computed = {
    'filesName': function(this: IVForm): string[] {
        let names: string[] = [];
        for (let name in this.files) {
            names.push(name);
        }
        return names;
    }
};

export let methods = {
};
