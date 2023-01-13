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
            'modelValue': '',
            'show': false
        };
        this.showData = false;
        this.selected = '';
        this.layer = false;
    }
    select(label) {
        this.selected = label;
        this.emit('update:modelValue', label);
        if (this.showData) {
            this.showData = false;
            this.emit('update:show', this.showData);
        }
    }
    menuwrapClick(e) {
        if (!this.layer) {
            return;
        }
        if (e.currentTarget !== e.target) {
            return;
        }
        if (!this.showData) {
            return;
        }
        this.showData = false;
        this.emit('update:show', this.showData);
    }
    onMounted() {
        clickgo.dom.watchSize(this.element, () => {
            if (this.element.offsetWidth < 500) {
                if (!this.layer) {
                    this.layer = true;
                    this.emit('layer', this.layer);
                }
            }
            else {
                if (this.layer) {
                    this.layer = false;
                    this.emit('layer', this.layer);
                }
            }
        }, true);
        this.watch('show', () => {
            this.showData = this.propBoolean('show');
        }, {
            'immediate': true
        });
        this.watch('modelValue', () => {
            this.select(this.props.modelValue);
        }, {
            'immediate': true
        });
    }
}
exports.default = default_1;
