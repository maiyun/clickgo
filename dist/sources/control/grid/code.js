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
            'direction': 'h',
            'gutter': 0,
            'itemGutter': 0,
            'alignH': undefined,
            'alignV': undefined,
            'sizeM': 0,
            'sizeL': 0,
        };
        this.width = 0;
        this.size = 's';
    }
    get columns() {
        if (this.width >= 1000) {
            this.size = 'l';
            return this.propInt('sizeL') || 4;
        }
        if (this.width >= 600) {
            this.size = 'm';
            return this.propInt('sizeM') || 2;
        }
        this.size = 's';
        return 1;
    }
    onMounted() {
        clickgo.dom.watchSize(this.element, () => {
            this.width = this.element.offsetWidth;
        }, true);
    }
}
exports.default = default_1;
