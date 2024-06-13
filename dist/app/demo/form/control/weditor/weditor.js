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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
const img_1 = __importDefault(require("../arteditor/img"));
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.theme = ['light'];
        this.themes = ['light', 'dark'];
        this.disabled = false;
        this.readonly = false;
        this.size = ['12px'];
        this.family = false;
        this.visual = false;
        this.text = '';
        this.html = '<p align="center">123</p>';
    }
    videoselect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('Sorry, video can not be upload.');
        });
    }
    imgselect(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            const frm = yield clickgo.form.create(img_1.default);
            const path = yield frm.showDialog();
            if (!path) {
                return;
            }
            cb('https://cdn.jsdelivr.net/npm/clickgo@3.7.0/dist/app/demo/' + path);
        });
    }
}
exports.default = default_1;
