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
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.alayout = null;
        this.props = {
            'span': 1,
            'alignH': '',
            'alignV': ''
        };
    }
    get colWidth() {
        var _a, _b, _c, _d;
        const pcw = (_b = (_a = this.alayout) === null || _a === void 0 ? void 0 : _a.colWidth) !== null && _b !== void 0 ? _b : 100;
        let cw = pcw * this.propInt('span');
        if (cw > 100) {
            cw = 100;
        }
        const gutter = ((_c = this.alayout) === null || _c === void 0 ? void 0 : _c.propNumber) === undefined ? 0 : (_d = this.alayout) === null || _d === void 0 ? void 0 : _d.propNumber('gutter');
        if (!gutter) {
            return cw.toString() + '%';
        }
        return 'calc(' + cw.toString() + '% - ' + gutter.toString() + 'px)';
    }
    get gutter() {
        var _a, _b;
        const gutter = ((_a = this.alayout) === null || _a === void 0 ? void 0 : _a.propNumber) === undefined ? 0 : (_b = this.alayout) === null || _b === void 0 ? void 0 : _b.propNumber('itemGutter');
        return gutter.toString() + 'px';
    }
    get direction() {
        var _a, _b;
        return ((_b = (_a = this.alayout) === null || _a === void 0 ? void 0 : _a.props) === null || _b === void 0 ? void 0 : _b.direction) ? this.alayout.props.direction : 'h';
    }
    onMounted() {
        this.alayout = this.parentByName('alayout');
    }
}
exports.default = default_1;
