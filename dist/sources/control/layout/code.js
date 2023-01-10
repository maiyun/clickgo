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
            'directionWidth': 0,
            'gutter': '',
            'alignH': '',
            'alignV': ''
        };
        this.directionData = 'h';
    }
    onMounted() {
        this.watch('directionWidth', (n, o) => {
            if (n && o) {
                return;
            }
            const w = this.propNumber('directionWidth');
            if (w) {
                clickgo.dom.watchSize(this.element, () => {
                    if (this.element.offsetWidth >= w) {
                        if (this.directionData === 'h') {
                            return;
                        }
                        this.directionData = 'h';
                    }
                    else {
                        if (this.directionData === 'v') {
                            return;
                        }
                        this.directionData = 'v';
                    }
                    if (this.directionData === this.props.direction) {
                        return;
                    }
                    this.emit('update:direction', this.directionData);
                });
            }
            else {
                clickgo.dom.unwatchSize(this.element);
            }
        }, {
            'immediate': true
        });
        this.watch('direction', () => {
            if (!this.propNumber('directionWidth')) {
                this.directionData = this.props.direction;
                return;
            }
            if (this.directionData === this.props.direction) {
                return;
            }
            this.emit('update:direction', this.directionData);
        });
        this.directionData = this.props.direction;
    }
}
exports.default = default_1;
