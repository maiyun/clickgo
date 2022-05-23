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
const fs = require("fs");
const files = [];
function readDir(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const list = yield fs.promises.readdir(path, {
            'withFileTypes': true
        });
        for (const item of list) {
            if (item.name === '.' || item.name === '..') {
                continue;
            }
            if (item.isFile()) {
                if (item.name.endsWith('.ts')) {
                    if (path.startsWith('dist/app/')) {
                        continue;
                    }
                }
                if (item.name.endsWith('.scss')) {
                    continue;
                }
                if ((path + item.name).startsWith('dist/build.')) {
                    continue;
                }
                if ((path + item.name).startsWith('dist/compiler.')) {
                    continue;
                }
                files.push(path.slice(4) + item.name);
            }
            else {
                if (path + item.name === 'dist/sources') {
                    continue;
                }
                if (path + item.name === 'dist/test') {
                    continue;
                }
                files.push(path.slice(4) + item.name + '/');
                yield readDir(path + item.name + '/');
            }
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        yield readDir('dist/');
        const lists = JSON.stringify(files).replace(/"/g, '\'').replace(/,/g, ', ');
        const fcontent = yield fs.promises.readFile('dist/lib/fs.ts', 'utf8');
        yield fs.promises.writeFile('dist/lib/fs.ts', fcontent.replace(/clickgoFiles = \[([\s\S]+?)\]/, 'clickgoFiles = [' + lists.slice(1, -1) + ']'));
    });
}
run().catch(function (e) {
    console.log(e);
});
