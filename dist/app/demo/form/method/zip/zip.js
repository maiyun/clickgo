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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
const text_1 = __importDefault(require("../fs/text"));
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.ppath = '/';
        this.list = [];
        this.val = [];
        this.access = {
            'zip': undefined
        };
    }
    select() {
        this.refs.file.select();
    }
    async change(files) {
        if (!files) {
            return;
        }
        const zip = await clickgo.zip.get(files[0]);
        if (!zip) {
            await clickgo.form.dialog('File failed to open.');
            return;
        }
        this.access.zip = zip;
        this.open('/');
    }
    open(path) {
        if (!this.access.zip) {
            return;
        }
        if (!path.endsWith('/')) {
            path += '/';
        }
        this.list = [];
        const ls = this.access.zip.readDir(path);
        for (const item of ls) {
            this.list.push({
                'label': (item.isDirectory ? '[FOLD]' : '[FILE]') + ' ' + item.name + ' (' + clickgo.tool.sizeFormat(item.uncompressedSize) + ')',
                'value': path + item.name
            });
        }
        this.ppath = path;
    }
    dblclick(e) {
        clickgo.dom.bindDblClick(e, async () => {
            if (!this.access.zip) {
                return;
            }
            const r = this.access.zip.isFile(this.val[0]);
            if (r) {
                const extlio = this.val[0].lastIndexOf('.');
                if (extlio === -1) {
                    await clickgo.form.dialog('This extension is not supported.');
                    return;
                }
                const ext = this.val[0].toLowerCase().slice(extlio + 1);
                if (['xml', 'js', 'ts', 'json', 'css', 'html', 'php', 'txt'].includes(ext)) {
                    const content = await this.access.zip.getContent(this.val[0]);
                    if (!content) {
                        await clickgo.form.dialog('This file cannot be opened.');
                        return;
                    }
                    const f = await clickgo.form.create(text_1.default);
                    f.show();
                    this.send(f.formId, {
                        'title': this.val[0].slice(this.val[0].lastIndexOf('/') + 1),
                        'content': content
                    });
                    return;
                }
                await clickgo.form.dialog('This extension is not supported.');
                return;
            }
            this.open(this.val[0]);
        });
    }
    up() {
        if (this.ppath === '/') {
            return;
        }
        const path = this.ppath.slice(0, -1);
        const lif = path.lastIndexOf('/');
        const npath = path.slice(0, lif + 1);
        this.open(npath);
    }
}
exports.default = default_1;
