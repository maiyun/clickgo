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
        let zip = yield clickgo.zip.getZip(blob);
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
            let filesRead = {};
            for (let file of config.files) {
                let fab = yield zip.getContent('/' + control.name + file, 'arraybuffer');
                if (!fab) {
                    continue;
                }
                let mimeo = clickgo.tool.getMimeByPath(file);
                filesRead[file] = new Blob([fab], {
                    'type': mimeo.mime
                });
                if (!['xml', 'css', 'js'].includes(mimeo.ext)) {
                    objectURLs[file] = clickgo.tool.createObjectURL(filesRead[file]);
                }
            }
            controlPkg[control.name] = {
                'type': 'control',
                'config': config,
                'files': filesRead,
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
