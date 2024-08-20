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
        this.emits = {
            'changed': null,
            'update:modelValue': null,
        };
        this.props = {
            'disabled': false,
            'modelValue': '',
        };
        this.paletteChanged = {
            'detail': {
                'value': '',
                'hsl': undefined,
                'rgb': undefined
            }
        };
        this.color = '';
        this.value = '';
    }
    ok() {
        if (this.value === this.color) {
            return;
        }
        this.value = this.color;
        this.emit('update:modelValue', this.value);
        this.emit('changed', this.paletteChanged);
        clickgo.form.hidePop(this.element);
    }
    down(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.element.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.element);
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'v');
    }
    changed(e) {
        this.paletteChanged = e;
    }
    onMounted() {
        this.watch('modelValue', () => {
            if (this.props.modelValue === this.value) {
                return;
            }
            this.value = this.props.modelValue;
            this.color = this.props.modelValue;
        }, {
            'immediate': true
        });
    }
}
exports.default = default_1;
