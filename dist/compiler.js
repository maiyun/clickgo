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
const mime = require("@litert/mime");
function purify(text) {
    text = '>' + text + '<';
    text = text.replace(/>([\s\S]*?)</g, function (t, t1) {
        return '>' + t1.replace(/\t|\r\n| {2}/g, '').replace(/\n|\r/g, '') + '<';
    });
    return text.slice(1, -1);
}
function getSingleControlBlob(base) {
    return __awaiter(this, void 0, void 0, function* () {
        let config = yield fs.promises.readFile(base + '/config.json', {
            'encoding': 'utf-8'
        });
        let configJson = JSON.parse(config);
        let configBuffer = Buffer.from(config);
        let m = mime.getMime('json');
        let mb = Buffer.from(m);
        let controlBufferArray = [Uint8Array.from([12]), Buffer.from('/config.json'), Uint8Array.from([mb.byteLength]), mb, Buffer.from(Uint32Array.from([configBuffer.byteLength]).buffer), configBuffer];
        for (let fpath of configJson.files) {
            let content = yield fs.promises.readFile(base + fpath);
            let nameBuffer = Buffer.from(fpath);
            let m = mime.getData(fpath);
            let mb = Buffer.from(m.mime);
            if (m.extension === 'html') {
                content = Buffer.from(purify(content.toString()));
            }
            controlBufferArray.push(Uint8Array.from([nameBuffer.byteLength]), nameBuffer, Uint8Array.from([mb.byteLength]), mb, Buffer.from(Uint32Array.from([content.byteLength]).buffer), content);
        }
        let controlBuffer = Buffer.concat(controlBufferArray);
        let nameBuffer = Buffer.from(configJson.name);
        controlBuffer = Buffer.concat([
            Uint8Array.from([nameBuffer.byteLength]),
            nameBuffer,
            Buffer.from(Uint32Array.from([controlBuffer.byteLength]).buffer),
            controlBuffer
        ]);
        return controlBuffer;
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let list = yield fs.promises.readdir('dist/sources/control/', {
            'withFileTypes': true
        });
        for (let item of list) {
            if (item.isFile()) {
                continue;
            }
            if (['greatselect-list', 'greatselect-list-item', 'greatselect-list-split', 'img', 'label', 'layout', 'menu-item', 'menu-list-item', 'menu-list-split', 'overflow', 'tab-nav', 'tab-panel'].includes(item.name)) {
                continue;
            }
            let base = 'dist/sources/control/' + item.name;
            let name = item.name;
            let controlBuffer = yield getSingleControlBlob(base);
            if (item.name === 'block') {
                name = 'common';
                controlBuffer = Buffer.concat([
                    controlBuffer,
                    yield getSingleControlBlob('dist/sources/control/img'),
                    yield getSingleControlBlob('dist/sources/control/label'),
                    yield getSingleControlBlob('dist/sources/control/layout'),
                    yield getSingleControlBlob('dist/sources/control/overflow')
                ]);
            }
            else if (item.name === 'greatselect') {
                controlBuffer = Buffer.concat([
                    controlBuffer,
                    yield getSingleControlBlob('dist/sources/control/greatselect-list'),
                    yield getSingleControlBlob('dist/sources/control/greatselect-list-item'),
                    yield getSingleControlBlob('dist/sources/control/greatselect-list-split')
                ]);
            }
            else if (item.name === 'menu') {
                controlBuffer = Buffer.concat([
                    controlBuffer,
                    yield getSingleControlBlob('dist/sources/control/menu-item'),
                ]);
            }
            else if (item.name === 'menu-list') {
                controlBuffer = Buffer.concat([
                    controlBuffer,
                    yield getSingleControlBlob('dist/sources/control/menu-list-item'),
                    yield getSingleControlBlob('dist/sources/control/menu-list-split')
                ]);
            }
            else if (item.name === 'tab') {
                controlBuffer = Buffer.concat([
                    controlBuffer,
                    yield getSingleControlBlob('dist/sources/control/tab-nav'),
                    yield getSingleControlBlob('dist/sources/control/tab-panel')
                ]);
            }
            let fileBuffer = Buffer.concat([
                Uint8Array.from([192, 1]),
                controlBuffer
            ]);
            yield fs.promises.writeFile('dist/control/' + name + '.cgc', fileBuffer);
        }
        list = yield fs.promises.readdir('dist/sources/theme/', {
            'withFileTypes': true
        });
        for (let item of list) {
            if (item.isFile()) {
                continue;
            }
            let base = 'dist/sources/theme/' + item.name;
            let config = yield fs.promises.readFile(base + '/config.json', {
                'encoding': 'utf-8'
            });
            let configJson = JSON.parse(config);
            let configBuffer = Buffer.from(config);
            let fileBufferArray = [
                Uint8Array.from([192, 2]),
                Uint8Array.from([12]),
                Buffer.from('/config.json'),
                Buffer.from(Uint32Array.from([configBuffer.byteLength]).buffer),
                configBuffer
            ];
            for (let fpath of configJson.files) {
                let content = yield fs.promises.readFile(base + fpath);
                let nameBuffer = Buffer.from(fpath);
                fileBufferArray.push(Uint8Array.from([nameBuffer.byteLength]), nameBuffer, Buffer.from(Uint32Array.from([content.byteLength]).buffer), content);
            }
            yield fs.promises.writeFile('dist/theme/' + configJson.name + '.cgt', Buffer.concat(fileBufferArray));
        }
    });
}
run().catch(function (e) {
    console.log(e);
});
