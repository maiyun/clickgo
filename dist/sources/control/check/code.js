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
        this.value = false;
        this.indeterminateData = false;
        this.isSpaceDown = false;
        this.props = {
            'disabled': false,
            'modelValue': false,
            'indeterminate': false
        };
    }
    click() {
        if (this.indeterminateData) {
            this.indeterminateData = false;
            this.emit('update:indeterminate', this.indeterminateData);
        }
        else {
            this.value = !this.value;
            this.emit('update:modelValue', this.value);
        }
    }
    keydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.click();
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isSpaceDown = true;
        }
    }
    keyup() {
        if (!this.isSpaceDown) {
            return;
        }
        this.isSpaceDown = false;
        this.click();
    }
    onMounted() {
        this.watch('modelValue', () => {
            if (this.props.modelValue !== undefined) {
                this.value = this.propBoolean('modelValue');
            }
            if (this.indeterminateData && !this.value) {
                this.indeterminateData = false;
                this.emit('update:indeterminate', this.indeterminateData);
            }
        }, {
            'immediate': true
        });
        this.watch('indeterminate', () => {
            if (this.props.indeterminate !== undefined) {
                this.indeterminateData = this.propBoolean('indeterminate');
            }
            if (!this.value && this.indeterminateData) {
                this.value = true;
                this.emit('update:modelValue', this.value);
            }
        }, {
            'immediate': true
        });
    }
}
exports.default = default_1;
