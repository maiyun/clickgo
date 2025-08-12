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
const fs = __importStar(require("fs"));
const files = [];
async function readDir(path) {
    const list = await fs.promises.readdir(path, {
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
            if (item.name === '.DS_Store') {
                continue;
            }
            if ((path + item.name).startsWith('dist/build.')) {
                continue;
            }
            if ((path + item.name).startsWith('dist/compiler.')) {
                continue;
            }
            if ((path + item.name).startsWith('dist/compcga.')) {
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
            await readDir(path + item.name + '/');
        }
    }
}
async function run() {
    await readDir('dist/');
    const lists = JSON.stringify(files).replace(/"/g, '\'').replace(/,/g, ', ');
    const fcontent = await fs.promises.readFile('dist/lib/fs.ts', 'utf8');
    await fs.promises.writeFile('dist/lib/fs.ts', fcontent.replace(/clickgoFiles = \[([\s\S]+?)\]/, 'clickgoFiles = [' + lists.slice(1, -1) + ']'));
}
run().catch(function (e) {
    console.log(e);
});
