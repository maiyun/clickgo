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
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.ntab = '';
        this.lineValue = [10];
        this.lineCount = 2;
        this.sLeft1 = 0;
        this.sTop1 = 0;
        this.sWidth1 = 0;
        this.sHeight1 = 0;
        this.cWidth1 = 0;
        this.cHeight1 = 0;
        this.sLeft2 = 0;
        this.sTop2 = 0;
        this.sWidth2 = 0;
        this.sHeight2 = 0;
        this.cWidth2 = 0;
        this.cHeight2 = 0;
        this.sLeft3 = 0;
        this.sTop3 = 0;
        this.sWidth3 = 0;
        this.sHeight3 = 0;
        this.cWidth3 = 0;
        this.cHeight3 = 0;
        this.sLeft4 = 0;
        this.sTop4 = 0;
        this.sWidth4 = 0;
        this.sHeight4 = 0;
        this.cWidth4 = 0;
        this.cHeight4 = 0;
        this.direction = false;
        this.dir5 = 'v';
        this.sLeft5 = 0;
        this.sTop5 = 0;
        this.sWidth5 = 0;
        this.sHeight5 = 0;
        this.cWidth5 = 0;
        this.cHeight5 = 0;
        this.line5 = 10;
        this.gesture = false;
        this.style = false;
        this.selection = false;
        this.sub = false;
        this.area = {};
    }
    onGesture(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('onGesture: ' + dir);
        });
    }
}
exports.default = default_1;
