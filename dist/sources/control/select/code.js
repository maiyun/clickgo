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
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'disabled': false,
            'editable': false,
            'multi': false,
            'remote': false,
            'remoteDelay': 500,
            'tree': false,
            'treeDefault': 0,
            'async': false,
            'icon': false,
            'iconDefault': '',
            'modelValue': [],
            'placeholder': '',
            'data': []
        };
        this.value = [];
        this.label = [];
        this.inputValue = '';
        this.loading = 0;
        this.background = '';
        this.padding = '';
        this.lastRemoteInput = 0;
    }
    get opMargin() {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
    get isMust() {
        if (this.propBoolean('editable')) {
            return false;
        }
        return this.propBoolean('multi') ? false : true;
    }
    get listValue() {
        const val = (this.propBoolean('editable') && this.propBoolean('multi')) ? [this.inputValue] : this.value;
        return val;
    }
    keydown(e) {
        if (e.key === 'Backspace') {
            if (this.propBoolean('multi')) {
                if (e.target.value === '' && this.propBoolean('multi') && this.value.length > 0) {
                    this.value.splice(-1);
                    this.label.splice(-1);
                }
            }
            return;
        }
        if ((e.key === 'ArrowDown') && (this.element.dataset.cgPopOpen === undefined)) {
            this.refs.gs.showPop();
            return;
        }
        if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && this.element.dataset.cgPopOpen !== undefined) {
            e.preventDefault();
            switch (e.key) {
                case 'ArrowUp': {
                    this.refs.list.arrowUp();
                    break;
                }
                default: {
                    this.refs.list.arrowDown();
                }
            }
            return;
        }
        if (e.key !== 'Enter') {
            return;
        }
        if (this.inputValue === '') {
            return;
        }
        this.listItemClick();
    }
    updateInputValue(value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.inputValue = value.trim();
            if (this.propBoolean('remote')) {
                if (this.inputValue !== '') {
                    if (this.loading === -1) {
                        this.loading = 0;
                    }
                    const delay = this.propInt('remoteDelay');
                    this.lastRemoteInput = Date.now();
                    yield clickgo.tool.sleep(delay);
                    if (Date.now() - this.lastRemoteInput < delay) {
                        return;
                    }
                    if (this.loading === -1) {
                        this.loading = 0;
                        return;
                    }
                    const loading = ++this.loading;
                    this.emit('remote', this.inputValue, () => {
                        if (this.loading > loading) {
                            return;
                        }
                        this.loading = 0;
                    });
                    if (this.element.dataset.cgPopOpen === undefined) {
                        this.refs.gs.showPop();
                    }
                }
                else {
                    this.loading = -1;
                    if (this.element.dataset.cgPopOpen !== undefined) {
                        clickgo.form.hidePop();
                    }
                }
            }
            if (this.propBoolean('multi')) {
                return;
            }
            if (this.inputValue === '') {
                this.value = [];
                this.label = [];
            }
            else {
                this.value = [this.inputValue];
                this.label = [this.inputValue];
            }
            this.emit('update:modelValue', this.value);
            this.emit('label', this.label);
        });
    }
    updateLabel(label) {
        if (!this.propBoolean('editable')) {
            this.label = label;
            this.emit('label', this.label);
            return;
        }
        if (!this.propBoolean('multi')) {
            if (label.length) {
                this.label = label;
                this.emit('label', this.label);
            }
            return;
        }
    }
    updateListValue(value) {
        if (!this.propBoolean('editable')) {
            this.value = value;
            this.emit('update:modelValue', value);
            return;
        }
        if (!this.propBoolean('multi')) {
            if (value === null || value === void 0 ? void 0 : value.length) {
                this.value = value;
                this.inputValue = value[0];
                this.emit('update:modelValue', value);
            }
            return;
        }
        if (this.element.dataset.cgPopOpen !== undefined) {
            if (value[0]) {
                this.inputValue = value[0];
            }
        }
    }
    listItemClick() {
        if (this.propBoolean('multi') && !this.propBoolean('editable')) {
            return;
        }
        if (this.propBoolean('editable') && this.propBoolean('multi')) {
            if (this.inputValue !== '') {
                const result = this.refs.list.findFormat(this.inputValue, false);
                if (result === null || result === void 0 ? void 0 : result[this.inputValue]) {
                    this.value.push(result[this.inputValue].value);
                    this.label.push(result[this.inputValue].label);
                }
                else {
                    this.value.push(this.inputValue);
                    this.label.push(this.inputValue);
                }
                this.emit('update:modelValue', this.value);
                this.emit('label', this.label);
                this.inputValue = '';
            }
        }
        clickgo.form.hidePop();
    }
    removeTag(index) {
        this.value.splice(index, 1);
        this.label.splice(index, 1);
        this.emit('update:modelValue', this.value);
        this.emit('label', this.label);
    }
    onLoad(value, resolve) {
        this.emit('load', value, resolve);
    }
    onMounted() {
        this.watch('modelValue', () => {
            if (this.propBoolean('editable')) {
                if (this.props.modelValue.length) {
                    if (this.propBoolean('multi')) {
                        this.inputValue = '';
                        this.label.length = 0;
                        for (const item of this.props.modelValue) {
                            const items = item.toString();
                            const result = this.refs.list.findFormat(items, false);
                            if (result === null || result === void 0 ? void 0 : result[items]) {
                                this.label.push(result[items].label);
                            }
                            else {
                                this.label.push(items);
                            }
                            this.emit('label', this.label);
                        }
                    }
                    else {
                        this.inputValue = (this.props.modelValue[0]).toString();
                    }
                }
                else {
                    this.inputValue = '';
                    this.label.length = 0;
                }
            }
            this.value = this.props.modelValue;
        }, {
            'immediate': true,
            'deep': true
        });
        this.watch('editable', () => {
            var _a;
            if (!this.propBoolean('editable')) {
                return;
            }
            if (!this.propBoolean('multi')) {
                this.inputValue = ((_a = this.value[0]) !== null && _a !== void 0 ? _a : '').toString();
            }
        }, {
            'immediate': true
        });
        this.watch('multi', () => {
            var _a;
            if (!this.propBoolean('multi')) {
                if (this.propBoolean('editable')) {
                    this.inputValue = ((_a = this.value[0]) !== null && _a !== void 0 ? _a : '').toString();
                }
                return;
            }
            if (this.propBoolean('editable')) {
                this.inputValue = '';
            }
        }, {
            'immediate': true
        });
        clickgo.dom.watchStyle(this.element, ['background', 'padding'], (n, v) => {
            switch (n) {
                case 'background': {
                    this.background = v;
                    break;
                }
                case 'padding': {
                    this.padding = v;
                    break;
                }
            }
        }, true);
    }
}
exports.default = default_1;
