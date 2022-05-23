"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = void 0;
const clickgo = require("clickgo");
exports.data = {
    'path': '/',
    'list': [],
    'val': ''
};
exports.methods = {
    select: function () {
        this.$refs.file.select();
    },
    change: function (files) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!files) {
                return;
            }
            const zip = yield clickgo.zip.get(files[0]);
            if (!zip) {
                yield clickgo.form.dialog('File failed to open.');
                return;
            }
            this.zip = zip;
            this.open('/');
        });
    },
    open: function (path) {
        const zip = this.zip;
        if (!path.endsWith('/')) {
            path += '/';
        }
        this.list = [];
        const ls = zip.readDir(path);
        for (const item of ls) {
            this.list.push({
                'label': (item.isDirectory ? '[FOLD]' : '[FILE]') + ' ' + item.name,
                'value': path + item.name
            });
        }
        this.path = path;
    },
    dblclick: function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.zip) {
                return;
            }
            const zip = this.zip;
            const r = zip.isFile(this.val);
            if (r) {
                const extlio = this.val.lastIndexOf('.');
                if (extlio === -1) {
                    yield clickgo.form.dialog('This extension is not supported.');
                    return;
                }
                const ext = this.val.toLowerCase().slice(extlio + 1);
                if (['xml', 'js', 'ts', 'json', 'css', 'html', 'php'].includes(ext)) {
                    const content = yield zip.getContent(this.val);
                    if (!content) {
                        yield clickgo.form.dialog('This file cannot be opened.');
                        return;
                    }
                    const f = yield clickgo.form.create('../fs/text');
                    if (typeof f === 'number') {
                        return;
                    }
                    clickgo.form.send(f.id, {
                        'title': this.val.slice(this.val.lastIndexOf('/') + 1),
                        'content': content
                    });
                    return;
                }
                yield clickgo.form.dialog('This extension is not supported.');
                return;
            }
            this.open(this.val);
        });
    },
    up: function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.path === '/') {
                return;
            }
            const path = this.path.slice(0, -1);
            const lif = path.lastIndexOf('/');
            const npath = path.slice(0, lif + 1);
            yield this.open(npath);
        });
    }
};
