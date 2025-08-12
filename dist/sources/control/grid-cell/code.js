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
        return this.props.direction ?? this.grid?.direction ?? 'h';
    }
    get gutterComp() {
        if (this.propNumber('gutter')) {
            return this.propNumber('gutter');
        }
        return this.propNumber('gutter') ? this.propNumber('gutter') : (this.grid?.propNumber('itemGutter') ?? 0);
    }
    get alignHComp2() {
        return this.alignHComp ?? this.grid?.alignHComp;
    }
    get alignVComp2() {
        return this.alignVComp ?? this.grid?.alignVComp;
    }
    get spanNum() {
        const size = this.grid?.size ?? 's';
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
