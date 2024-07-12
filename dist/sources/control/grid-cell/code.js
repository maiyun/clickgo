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
        this.props = {
            'direction': undefined,
            'gutter': 0,
            'alignH': undefined,
            'alignV': undefined,
            'span': 0,
            'sizeM': 0,
            'sizeL': 0,
        };
        this.grid = null;
    }
    get directionComp() {
        var _a, _b, _c;
        return (_c = (_a = this.props.direction) !== null && _a !== void 0 ? _a : (_b = this.grid) === null || _b === void 0 ? void 0 : _b.direction) !== null && _c !== void 0 ? _c : 'h';
    }
    get gutterComp() {
        var _a, _b;
        if (this.propNumber('gutter')) {
            return this.propNumber('gutter');
        }
        return this.propNumber('gutter') ? this.propNumber('gutter') : ((_b = (_a = this.grid) === null || _a === void 0 ? void 0 : _a.propNumber('itemGutter')) !== null && _b !== void 0 ? _b : 0);
    }
    get alignHComp2() {
        var _a, _b;
        return (_a = this.alignHComp) !== null && _a !== void 0 ? _a : (_b = this.grid) === null || _b === void 0 ? void 0 : _b.alignHComp;
    }
    get alignVComp2() {
        var _a, _b;
        return (_a = this.alignVComp) !== null && _a !== void 0 ? _a : (_b = this.grid) === null || _b === void 0 ? void 0 : _b.alignVComp;
    }
    get spanNum() {
        var _a, _b;
        const size = (_b = (_a = this.grid) === null || _a === void 0 ? void 0 : _a.size) !== null && _b !== void 0 ? _b : 's';
        if (size === 's') {
            return 1;
        }
        if (size === 'm') {
            return this.propInt('sizeM') === -1 ? 1 : (this.propInt('sizeM') || this.propInt('span') || 1);
        }
        return this.propInt('sizeL') === -1 ? 1 : (this.propInt('sizeL') || this.propInt('span') || 1);
    }
    get spanComp() {
        return this.spanNum > 1 ? 'span ' + this.spanNum.toString() : undefined;
    }
    onMounted() {
        this.grid = this.parentByName('grid');
    }
}
exports.default = default_1;
