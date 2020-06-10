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
                    m_1 = mime.getMime(fpath);
                    mb_1 = Buffer.from(m_1);
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
        var list, _i, list_1, item, base, controlBuffer, _a, _b, _c, fileBuffer, _d, list_2, item, base, config, configJson, configBuffer, fileBufferArray, _e, _f, fpath, content, nameBuffer;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4, fs.promises.readdir("dist/sources/control/", {
                        "withFileTypes": true
                    })];
                case 1:
                    list = _g.sent();
                    _i = 0, list_1 = list;
                    _g.label = 2;
                case 2:
                    if (!(_i < list_1.length)) return [3, 12];
                    item = list_1[_i];
                    if (item.isFile()) {
                        return [3, 11];
                    }
                    if (["menu-item", "menu-pop", "menu-pop-item", "menu-pop-split", "select-pop"].includes(item.name)) {
                        return [3, 11];
                    }
                    base = "dist/sources/control/" + item.name;
                    return [4, getSingleControlBlob(base)];
                case 3:
                    controlBuffer = _g.sent();
                    if (!(item.name === "menu")) return [3, 8];
                    _b = (_a = Buffer).concat;
                    _c = [controlBuffer];
                    return [4, getSingleControlBlob("dist/sources/control/menu-item")];
                case 4:
                    _c = _c.concat([
                        _g.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/menu-pop")];
                case 5:
                    _c = _c.concat([
                        _g.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/menu-pop-item")];
                case 6:
                    _c = _c.concat([
                        _g.sent()
                    ]);
                    return [4, getSingleControlBlob("dist/sources/control/menu-pop-split")];
                case 7:
                    controlBuffer = _b.apply(_a, [_c.concat([
                            _g.sent()
                        ])]);
                    return [3, 9];
                case 8:
                    if (item.name === "select") {
                    }
                    _g.label = 9;
                case 9:
                    fileBuffer = Buffer.concat([
                        Uint8Array.from([192, 1]),
                        controlBuffer
                    ]);
                    return [4, fs.promises.writeFile("dist/control/" + item.name + ".cgc", fileBuffer)];
                case 10:
                    _g.sent();
                    _g.label = 11;
                case 11:
                    _i++;
                    return [3, 2];
                case 12: return [4, fs.promises.readdir("dist/sources/theme/", {
                        "withFileTypes": true
                    })];
                case 13:
                    list = _g.sent();
                    _d = 0, list_2 = list;
                    _g.label = 14;
                case 14:
                    if (!(_d < list_2.length)) return [3, 22];
                    item = list_2[_d];
                    if (item.isFile()) {
                        return [3, 21];
                    }
                    base = "dist/sources/theme/" + item.name;
                    return [4, fs.promises.readFile(base + "/config.json", {
                            "encoding": "utf-8"
                        })];
                case 15:
                    config = _g.sent();
                    configJson = JSON.parse(config);
                    configBuffer = Buffer.from(config);
                    fileBufferArray = [
                        Uint8Array.from([192, 2]),
                        Uint8Array.from([12]),
                        Buffer.from("/config.json"),
                        Buffer.from(Uint32Array.from([configBuffer.byteLength]).buffer),
                        configBuffer
                    ];
                    _e = 0, _f = configJson.files;
                    _g.label = 16;
                case 16:
                    if (!(_e < _f.length)) return [3, 19];
                    fpath = _f[_e];
                    return [4, fs.promises.readFile(base + fpath)];
                case 17:
                    content = _g.sent();
                    nameBuffer = Buffer.from(fpath);
                    fileBufferArray.push(Uint8Array.from([nameBuffer.byteLength]), nameBuffer, Buffer.from(Uint32Array.from([content.byteLength]).buffer), content);
                    _g.label = 18;
                case 18:
                    _e++;
                    return [3, 16];
                case 19: return [4, fs.promises.writeFile("dist/theme/" + configJson.name + ".cgt", Buffer.concat(fileBufferArray))];
                case 20:
                    _g.sent();
                    _g.label = 21;
                case 21:
                    _d++;
                    return [3, 14];
                case 22: return [2];
            }
        });
    });
}
run().catch(function (e) {
    console.log(e);
});
