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
function read(blob, salf) {
    return __awaiter(this, void 0, void 0, function* () {
        let zip = yield clickgo.zip.get(blob);
        if (!zip) {
            return false;
        }
        let controlPkg = {};
        let controls = zip.readDir();
        for (let control of controls) {
            if (control.isFile) {
                continue;
            }
            let configContent = yield zip.getContent('/' + control.name + '/config.json');
            if (!configContent) {
                continue;
            }
            let config = JSON.parse(configContent);
            let objectURLs = {};
            let files = {};
            for (let file of config.files) {
                let mime = clickgo.tool.getMimeByPath(file);
                if (['txt', 'json', 'js', 'css', 'xml', 'html'].includes(mime.ext)) {
                    let fab = yield zip.getContent('/' + control.name + file, 'string');
                    if (!fab) {
                        continue;
                    }
                    files[file] = fab;
                }
                else {
                    let fab = yield zip.getContent('/' + control.name + file, 'arraybuffer');
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
                'safe': salf,
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
    for (let name in pkg) {
        for (let path in pkg[name].objectURLs) {
            clickgo.tool.revokeObjectURL(pkg[name].objectURLs[path]);
        }
    }
}
exports.revokeObjectURL = revokeObjectURL;
