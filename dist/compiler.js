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
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var list, _i, list_1, item, base, config, configJson, configBuffer, controlBufferArray, _a, _b, fpath, content, nameBuffer_1, controlBuffer, nameBuffer, fileBuffer, _c, list_2, item, base, config, configJson, configBuffer, fileBufferArray, _d, _e, fpath, content, nameBuffer;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4, fs.promises.readdir("dist/sources/control/", {
                        "withFileTypes": true
                    })];
                case 1:
                    list = _f.sent();
                    _i = 0, list_1 = list;
                    _f.label = 2;
                case 2:
                    if (!(_i < list_1.length)) return [3, 10];
                    item = list_1[_i];
                    if (item.isFile()) {
                        return [3, 9];
                    }
                    base = "dist/sources/control/" + item.name;
                    return [4, fs.promises.readFile(base + "/config.json", {
                            "encoding": "utf-8"
                        })];
                case 3:
                    config = _f.sent();
                    configJson = JSON.parse(config);
                    configBuffer = Buffer.from(config);
                    controlBufferArray = [Uint8Array.from([12]), Buffer.from("/config.json"), Buffer.from(Uint32Array.from([configBuffer.byteLength]).buffer), configBuffer];
                    _a = 0, _b = configJson.files;
                    _f.label = 4;
                case 4:
                    if (!(_a < _b.length)) return [3, 7];
                    fpath = _b[_a];
                    return [4, fs.promises.readFile(base + fpath)];
                case 5:
                    content = _f.sent();
                    nameBuffer_1 = Buffer.from(fpath);
                    controlBufferArray.push(Uint8Array.from([nameBuffer_1.byteLength]), nameBuffer_1, Buffer.from(Uint32Array.from([content.byteLength]).buffer), content);
                    _f.label = 6;
                case 6:
                    _a++;
                    return [3, 4];
                case 7:
                    controlBuffer = Buffer.concat(controlBufferArray);
                    nameBuffer = Buffer.from(configJson.name);
                    fileBuffer = Buffer.concat([
                        Uint8Array.from([192, 1]),
                        Uint8Array.from([nameBuffer.byteLength]),
                        nameBuffer,
                        Buffer.from(Uint32Array.from([controlBuffer.byteLength]).buffer),
                        controlBuffer
                    ]);
                    return [4, fs.promises.writeFile("dist/control/" + configJson.name + ".cgc", fileBuffer)];
                case 8:
                    _f.sent();
                    _f.label = 9;
                case 9:
                    _i++;
                    return [3, 2];
                case 10: return [4, fs.promises.readdir("dist/sources/theme/", {
                        "withFileTypes": true
                    })];
                case 11:
                    list = _f.sent();
                    _c = 0, list_2 = list;
                    _f.label = 12;
                case 12:
                    if (!(_c < list_2.length)) return [3, 20];
                    item = list_2[_c];
                    if (item.isFile()) {
                        return [3, 19];
                    }
                    base = "dist/sources/theme/" + item.name;
                    return [4, fs.promises.readFile(base + "/config.json", {
                            "encoding": "utf-8"
                        })];
                case 13:
                    config = _f.sent();
                    configJson = JSON.parse(config);
                    configBuffer = Buffer.from(config);
                    fileBufferArray = [
                        Uint8Array.from([192, 2]),
                        Uint8Array.from([12]),
                        Buffer.from("/config.json"),
                        Buffer.from(Uint32Array.from([configBuffer.byteLength]).buffer),
                        configBuffer
                    ];
                    _d = 0, _e = configJson.files;
                    _f.label = 14;
                case 14:
                    if (!(_d < _e.length)) return [3, 17];
                    fpath = _e[_d];
                    return [4, fs.promises.readFile(base + fpath)];
                case 15:
                    content = _f.sent();
                    nameBuffer = Buffer.from(fpath);
                    fileBufferArray.push(Uint8Array.from([nameBuffer.byteLength]), nameBuffer, Buffer.from(Uint32Array.from([content.byteLength]).buffer), content);
                    _f.label = 16;
                case 16:
                    _d++;
                    return [3, 14];
                case 17: return [4, fs.promises.writeFile("dist/theme/" + configJson.name + ".cgt", Buffer.concat(fileBufferArray))];
                case 18:
                    _f.sent();
                    _f.label = 19;
                case 19:
                    _c++;
                    return [3, 12];
                case 20: return [2];
            }
        });
    });
}
run().catch(function (e) {
    console.log(e);
});
