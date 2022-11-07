import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public npath = '/index.html';

    public file = '';

    public files: Record<string, string> = {
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

    public list = [
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

    public theme = 'vs';

    public themes = ['vs', 'vs-dark', 'hc-black'];

    public language = '';

    public globali = false;

    public newi = false;

    public readonly = false;

    public disabled = false;

    public size = '12px';

    public family = false;

    public initMonaco = false;

    public get filesName(): string[] {
        const names: string[] = [];
        for (const name in this.files) {
            if (!name.includes('.d.ts')) {
                continue;
            }
            names.push(name);
        }
        return names;
    }

    public globalInclude(): void {
        if (this.globali) {
            delete this.files['/global.d.ts'];
        }
        else {
            this.files['/global.d.ts'] = 'declare function str(): string;';
        }
        this.globali = !this.globali;
    }

    public newInclude(): void {
        if (this.newi) {
            delete this.files['/new.d.ts'];
        }
        else {
            this.files['/new.d.ts'] = 'declare function str2(): string;';
        }
        this.newi = !this.newi;
    }

    public jump(input: Record<string, any>): void {
        clickgo.form.dialog({
            'content': `<block>Path: ${input.resource.path}</block><block>Line: ${input.options.selection.startLineNumber}</block>`,
            'direction': 'v'
        }).catch((e) => { throw e; });
    }

    public pathLebel(label: string): void {
        this.language = label.toLowerCase();
    }

    public onMounted(): void {
        clickgo.core.initModules('monaco').then(() => {
            this.initMonaco = true;
        }).catch(() => {
            this.initMonaco = true;
        });
    }

}
