"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.form.AbstractForm {
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
        clickgo.form.dialog({
            'content': `<block>Path: ${input.resource.path}</block><block>Line: ${input.options.selection.startLineNumber}</block>`,
            'direction': 'v'
        }).catch((e) => { throw e; });
    }
    pathLebel(label) {
        this.language = label[0].toLowerCase();
    }
}
exports.default = default_1;
