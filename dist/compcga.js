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
const fs = __importStar(require("fs"));
const jszip_1 = __importDefault(require("jszip"));
const terser = __importStar(require("terser"));
async function addFile(zipo, base = '', path = '') {
    const list = await fs.promises.readdir(base);
    for (const item of list) {
        try {
            const stat = await fs.promises.lstat(base + '/' + item);
            if (stat.isDirectory()) {
                await addFile(zipo, base + '/' + item, path + (path ? '/' : '') + item);
                continue;
            }
            if (item.endsWith('.ts') || item.endsWith('.scss')) {
                continue;
            }
            const buf = await fs.promises.readFile(base + '/' + item);
            if (item.endsWith('.html') || item.endsWith('.xml')) {
                zipo.file(path + (path ? '/' : '') + item, purify(buf.toString()));
            }
            else if (item.endsWith('.js')) {
                const rtn = await terser.minify(buf.toString());
                zipo.file(path + (path ? '/' : '') + item, rtn.code ?? '');
            }
            else {
                zipo.file(path + (path ? '/' : '') + item, buf);
            }
        }
        catch {
            continue;
        }
    }
}
function purify(text) {
    text = '>' + text + '<';
    text = text.replace(/<!--([\s\S]*?)-->/g, '').replace(/>([\s\S]*?)</g, function (t, t1) {
        return '>' + t1.replace(/\t|\r\n| {2}/g, '').replace(/\n|\r/g, '') + '<';
    });
    return text.slice(1, -1);
}
(async function () {
    const args = process.argv.slice(2);
    if (!args[0]) {
        console.log('DIR MUST.');
        return;
    }
    const lasts = args[0].lastIndexOf('/');
    const bpath = args[0].slice(0, lasts + 1);
    const name = args[0].slice(lasts + 1);
    const zipo = new jszip_1.default();
    await addFile(zipo, args[0], '');
    let buf = await zipo.generateAsync({
        'type': 'nodebuffer',
        'compression': 'DEFLATE',
        'compressionOptions': {
            'level': 9
        }
    });
    let iconBuf;
    if (args[1]) {
        const icon = await fs.promises.readFile(args[1]);
        if (icon) {
            const length = icon.length.toString().padStart(7, '0');
            iconBuf = Buffer.concat([Buffer.from(length), icon]);
        }
        else {
            iconBuf = Buffer.from('0000000');
        }
    }
    else {
        iconBuf = Buffer.from('0000000');
    }
    buf = Buffer.concat([Buffer.from('-CGA-'), buf.subarray(0, 16), iconBuf, buf.subarray(16)]);
    await fs.promises.writeFile(bpath + name + '.cga', buf);
})();
