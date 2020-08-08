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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var mime = require("@litert/mime");
function purify(text) {
    text = ">" + text + "<";
    text = text.replace(/>([\s\S]*?)</g, function (t, t1) {
        return ">" + t1.replace(/\t|\r\n| {2}/g, "").replace(/\n|\r/g, "") + "<";
    });
    return text.slice(1, -1);
}
function getSingleControlBlob(base) {
    return __awaiter(this, void 0, void 0, function () {
        var config, configJson, configBuffer, m, mb, controlBufferArray, _i, _a, fpath, content, nameBuffer_1, m_1, mb_1, controlBuffer, nameBuffer;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4, fs.promises.readFile(base + "/config.json", {
                        "encoding": "utf-8"
                    })];
                case 1:
                    config = _b.sent();
                    configJson = JSON.parse(config);
                    configBuffer = Buffer.from(config);
                    m = mime.getMime("json");
                    mb = Buffer.from(m);
                    controlBufferArray = [Uint8Array.from([12]), Buffer.from("/config.json"), Uint8Array.from([mb.byteLength]), mb, Buffer.from(Uint32Array.from([configBuffer.byteLength]).buffer), configBuffer];
                    _i = 0, _a = configJson.files;
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3, 5];
                    fpath = _a[_i];
                    return [4, fs.promises.readFile(base + fpath)];
                case 3:
                    content = _b.sent();
                    nameBuffer_1 = Buffer.from(fpath);
                    m_1 = mime.getData(fpath);
                    mb_1 = Buffer.from(m_1.mime);
                    if (m_1.extension === "html") {
                        content = Buffer.from(purify(content.toString()));
                    }
                    controlBufferArray.push(Uint8Array.from([nameBuffer_1.byteLength]), nameBuffer_1, Uint8Array.from([mb_1.byteLength]), mb_1, Buffer.from(Uint32Array.from([content.byteLength]).buffer), content);
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3, 2];
                case 5:
                    controlBuffer = Buffer.concat(controlBufferArray);
                    nameBuffer = Buffer.from(configJson.name);
                    controlBuffer = Buffer.concat([
                        Uint8Array.from([nameBuffer.byteLength]),
                        nameBuffer,
                        Buffer.from(Uint32Array.from([controlBuffer.byteLength]).buffer),
                        controlBuffer
                    ]);
                    return [2, controlBuffer];
            }
        });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var list, _i, list_1, item, base, name_1, controlBuffer, _a, _b, _c, _d, _e, _f, fileBuffer, _g, list_2, item, base, config, configJson, configBuffer, fileBufferArray, _h, _j, fpath, content, nameBuffer;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4, fs.promises.readdir("dist/sources/control/", {
                        "withFileTypes": true
                    })];
                case 1:
                    list = _k.sent();
                    _i = 0, list_1 = list;
                    _k.label = 2;
                case 2:
                    if (!(_i < list_1.length)) return [3, 29];
                    item = list_1[_i];
                    if (item.isFile()) {
                        return [3, 28];
                    }
                    if (["button", "form", "greatselect", "greatselect-pop", "greatselect-pop-item", "greatselect-pop-split", "greatview", "img", "label", "layout", "menu", "menu-item", "menu-pop", "menu-pop-item", "menu-pop-split", "overflow", "scroll", "select", "tab-nav", "tab-panel", "view"].includes(item.name)) {
                        return [3, 28];
                    }
                    base = "dist/sources/control/" + item.name;
                    name_1 = item.name;
                    return [4, getSingleControlBlob(base)];
                case 3:
                    controlBuffer = _k.sent();
                    if (!(item.name === "block")) return [3, 23];
                    name_1 = "common";
                    _b = (_a = Buffer).concat;
                    _c = [controlBuffer];
                    return [4, getSingleControlBlob("dist/sources/control/button")];
                case 4:
                    _c = _c.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/form")];
                case 5:
                    _c = _c.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/greatselect")];
                case 6:
                    _c = _c.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/greatselect-pop")];
                case 7:
                    _c = _c.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/greatselect-pop-item")];
                case 8:
                    _c = _c.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/greatselect-pop-split")];
                case 9:
                    _c = _c.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/greatview")];
                case 10:
                    _c = _c.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/img")];
                case 11:
                    _c = _c.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/label")];
                case 12:
                    _c = _c.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/layout")];
                case 13:
                    _c = _c.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/menu")];
                case 14:
                    _c = _c.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/menu-item")];
                case 15:
                    _c = _c.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/menu-pop")];
                case 16:
                    _c = _c.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/menu-pop-item")];
                case 17:
                    _c = _c.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/menu-pop-split")];
                case 18:
                    _c = _c.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/overflow")];
                case 19:
                    _c = _c.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/scroll")];
                case 20:
                    _c = _c.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/select")];
                case 21:
                    _c = _c.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/view")];
                case 22:
                    controlBuffer = _b.apply(_a, [_c.concat([
                            _k.sent()
                        ])]);
                    return [3, 26];
                case 23:
                    if (!(item.name === "tab")) return [3, 26];
                    _e = (_d = Buffer).concat;
                    _f = [controlBuffer];
                    return [4, getSingleControlBlob("dist/sources/control/tab-nav")];
                case 24:
                    _f = _f.concat([
                        _k.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/tab-panel")];
                case 25:
                    controlBuffer = _e.apply(_d, [_f.concat([
                            _k.sent()
                        ])]);
                    _k.label = 26;
                case 26:
                    fileBuffer = Buffer.concat([
                        Uint8Array.from([192, 1]),
                        controlBuffer
                    ]);
                    return [4, fs.promises.writeFile("dist/control/" + name_1 + ".cgc", fileBuffer)];
                case 27:
                    _k.sent();
                    _k.label = 28;
                case 28:
                    _i++;
                    return [3, 2];
                case 29: return [4, fs.promises.readdir("dist/sources/theme/", {
                        "withFileTypes": true
                    })];
                case 30:
                    list = _k.sent();
                    _g = 0, list_2 = list;
                    _k.label = 31;
                case 31:
                    if (!(_g < list_2.length)) return [3, 39];
                    item = list_2[_g];
                    if (item.isFile()) {
                        return [3, 38];
                    }
                    base = "dist/sources/theme/" + item.name;
                    return [4, fs.promises.readFile(base + "/config.json", {
                            "encoding": "utf-8"
                        })];
                case 32:
                    config = _k.sent();
                    configJson = JSON.parse(config);
                    configBuffer = Buffer.from(config);
                    fileBufferArray = [
                        Uint8Array.from([192, 2]),
                        Uint8Array.from([12]),
                        Buffer.from("/config.json"),
                        Buffer.from(Uint32Array.from([configBuffer.byteLength]).buffer),
                        configBuffer
                    ];
                    _h = 0, _j = configJson.files;
                    _k.label = 33;
                case 33:
                    if (!(_h < _j.length)) return [3, 36];
                    fpath = _j[_h];
                    return [4, fs.promises.readFile(base + fpath)];
                case 34:
                    content = _k.sent();
                    nameBuffer = Buffer.from(fpath);
                    fileBufferArray.push(Uint8Array.from([nameBuffer.byteLength]), nameBuffer, Buffer.from(Uint32Array.from([content.byteLength]).buffer), content);
                    _k.label = 35;
                case 35:
                    _h++;
                    return [3, 33];
                case 36: return [4, fs.promises.writeFile("dist/theme/" + configJson.name + ".cgt", Buffer.concat(fileBufferArray))];
                case 37:
                    _k.sent();
                    _k.label = 38;
                case 38:
                    _g++;
                    return [3, 31];
                case 39: return [2];
            }
        });
    });
}
run().catch(function (e) {
    console.log(e);
});
