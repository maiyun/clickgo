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
    async onGesture(dir) {
        await clickgo.form.dialog('onGesture: ' + dir);
    }
}
exports.default = default_1;
