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
exports.revokeObjectURL = exports.read = exports.clickgoControlPkgs = void 0;
exports.clickgoControlPkgs = {};
function read(blob) {
    return __awaiter(this, void 0, void 0, function* () {
        const zip = yield clickgo.zip.get(blob);
        if (!zip) {
            return false;
        }
        const controlPkg = {};
        const controls = zip.readDir();
        for (const control of controls) {
            if (control.isFile) {
                continue;
            }
            const configContent = yield zip.getContent('/' + control.name + '/config.json');
            if (!configContent) {
                continue;
            }
            const config = JSON.parse(configContent);
            const objectURLs = {};
            const files = {};
            for (const file of config.files) {
                const mime = clickgo.tool.getMimeByPath(file);
                if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
                    const fab = yield zip.getContent('/' + control.name + file, 'string');
                    if (!fab) {
                        continue;
                    }
                    files[file] = fab.replace(/^\ufeff/, '');
                }
                else {
                    const fab = yield zip.getContent('/' + control.name + file, 'arraybuffer');
                    if (!fab) {
                        continue;
                    }
                    files[file] = new Blob([fab], {
                        'type': mime.mime
                    });
                    objectURLs[file] = clickgo.tool.createObjectURL(files[file]);
                }
            }
            controlPkg[control.name] = {
                'type': 'control',
                'config': config,
                'files': files,
                'objectURLs': objectURLs
            };
        }
        return controlPkg;
    });
}
exports.read = read;
function revokeObjectURL(pkg) {
    for (const name in pkg) {
        for (const path in pkg[name].objectURLs) {
            clickgo.tool.revokeObjectURL(pkg[name].objectURLs[path]);
        }
    }
}
exports.revokeObjectURL = revokeObjectURL;
