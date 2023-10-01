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
            'async': false,
            'modelValue': [],
            'placeholder': '',
            'data': []
        };
        this.inputValue = '';
        this.oploading = false;
        this.loading = false;
        this.localeData = {
            'en': {
                'back': 'Back'
            },
            'sc': {
                'back': '返回'
            },
            'tc': {
                'back': '返回'
            },
            'ja': {
                'back': '戻る'
            },
            'ko': {
                'back': '뒤로'
            },
            'th': {
                'back': 'ย้อนกลับ'
            },
            'es': {
                'back': 'Volver'
            },
            'de': {
                'back': 'Zurück'
            },
            'fr': {
                'back': 'Retour'
            },
            'pt': {
                'back': 'Voltar'
            },
            'ru': {
                'back': 'Назад'
            },
            'vi': {
                'back': 'Quay lại'
            }
        };
        this.level = 0;
        this.vals = [];
        this.labs = [];
        this.lists = [];
        this.nowlist = [];
        this.background = '';
        this.padding = '';
        this.lastRemoteInput = 0;
    }
    get opMargin() {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
    get listValue() {
        return this.vals[this.level] ? [this.vals[this.level]] : [];
    }
    get nowlistComp() {
        var _a, _b;
        if (this.inputValue === '') {
            return this.nowlist;
        }
        const inputValue = this.inputValue.toLowerCase();
        const isArray = Array.isArray(this.nowlist);
        const newlist = isArray ? [] : {};
        for (const key in this.nowlist) {
            const item = this.nowlist[key];
            const val = (isArray ?
                (typeof item === 'object' ? (_a = item.value) !== null && _a !== void 0 ? _a : '' : item) :
                key).toString().toLowerCase();
            const lab = (isArray ?
                (typeof item === 'object' ? (_b = item.label) !== null && _b !== void 0 ? _b : '' : '') : '').toLowerCase();
            let include = true;
            for (const char of inputValue) {
                if (val.includes(char) || lab.includes(char)) {
                    continue;
                }
                include = false;
                break;
            }
            if (!include) {
                continue;
            }
            if (isArray) {
                newlist.push(item);
            }
            else {
                newlist[key] = item;
            }
        }
        return newlist;
    }
    keydown(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (e.key === 'Backspace') {
                if (this.level > 0) {
                    if (e.target.value === '') {
                        this.back();
                    }
                }
                return;
            }
            if ((e.key === 'ArrowDown') && (this.element.dataset.cgPopOpen === undefined)) {
                this.refs.gs.showPop();
                return;
            }
            if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && (this.element.dataset.cgPopOpen !== undefined)) {
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
            if (e.key === 'Enter') {
                yield this.listItemClick();
                return;
            }
        });
    }
    updateInputValue(value) {
        this.inputValue = value.trim();
        if ((this.inputValue !== '') && (this.element.dataset.cgPopOpen === undefined)) {
            this.refs.gs.showPop();
            return;
        }
    }
    updateLabel(label) {
        if (!label[0]) {
            return;
        }
        this.labs[this.level] = label[0];
        this.emit('label', this.propBoolean('multi') ? clickgo.tool.clone(this.labs) : [this.labs[this.level]]);
    }
    updateListValue(value) {
        if (!value[0]) {
            return;
        }
        this.vals[this.level] = value[0];
        this.emit('update:modelValue', this.propBoolean('multi') ? clickgo.tool.clone(this.vals) : [this.vals[this.level]]);
    }
    emitModelValueAndLabel() {
        let newval = [];
        let newlabel = [];
        if (this.propBoolean('multi')) {
            newval = this.vals;
            newlabel = this.labs;
        }
        else {
            newval = this.vals.length ? [this.vals[this.vals.length - 1]] : [];
            newlabel = this.labs.length ? [this.labs[this.labs.length - 1]] : [];
        }
        this.emit('label', clickgo.tool.clone(newlabel));
        if (JSON.stringify(this.props.modelValue) === JSON.stringify(newval)) {
            return;
        }
        this.emit('update:modelValue', clickgo.tool.clone(newval));
    }
    setNowList(list) {
        this.nowlist = clickgo.tool.clone(list);
        for (const key in this.nowlist) {
            if (this.nowlist[key].children === undefined) {
                continue;
            }
            delete this.nowlist[key].children;
        }
    }
    listItemClick() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            this.inputValue = '';
            let nextChildren = null;
            let isSelected = false;
            const isArray = Array.isArray(this.lists[this.level]);
            for (const key in this.lists[this.level]) {
                const item = this.lists[this.level][key];
                const val = (isArray ?
                    (typeof item === 'object' ? ((_b = (_a = item.value) !== null && _a !== void 0 ? _a : item.label) !== null && _b !== void 0 ? _b : '') : item) :
                    key).toString();
                if (this.vals[this.level] !== val) {
                    continue;
                }
                nextChildren = (_c = item.children) !== null && _c !== void 0 ? _c : null;
                isSelected = true;
            }
            if (isSelected) {
                if (!nextChildren) {
                    if (!this.propBoolean('async')) {
                        clickgo.form.hidePop();
                        return;
                    }
                    this.loading = true;
                    const children = yield new Promise((resolve) => {
                        this.emit('load', this.vals[this.level], (children) => {
                            resolve(children);
                            this.emit('loaded');
                        });
                    });
                    this.loading = false;
                    if (!(children === null || children === void 0 ? void 0 : children.length)) {
                        clickgo.form.hidePop();
                        return;
                    }
                    nextChildren = children;
                }
                this.setNowList(nextChildren);
                ++this.level;
                this.lists[this.level] = nextChildren;
                return;
            }
            clickgo.form.hidePop();
        });
    }
    back() {
        this.vals.splice(this.level);
        this.labs.splice(this.level);
        this.lists.splice(this.level);
        --this.level;
        this.emitModelValueAndLabel();
        this.setNowList(this.lists[this.level]);
        if (this.propBoolean('async')) {
            this.emit('loaded');
        }
    }
    onMounted() {
        this.watch('data', () => {
            var _a, _b, _c;
            let leveldata = this.props.data;
            for (let level = 0; level <= this.level; ++level) {
                let nextChildren = null;
                let isSelected = false;
                const isArray = Array.isArray(leveldata);
                for (const key in leveldata) {
                    const item = leveldata[key];
                    const val = (isArray ?
                        (typeof item === 'object' ? ((_b = (_a = item.value) !== null && _a !== void 0 ? _a : item.label) !== null && _b !== void 0 ? _b : '') : item) :
                        key).toString();
                    if (this.vals[level] !== val) {
                        continue;
                    }
                    nextChildren = (_c = item.children) !== null && _c !== void 0 ? _c : null;
                    isSelected = true;
                }
                this.lists[level] = leveldata;
                if (isSelected) {
                    if (nextChildren) {
                        leveldata = nextChildren;
                        continue;
                    }
                    this.level = level;
                    this.vals.splice(level + 1);
                    this.labs.splice(level + 1);
                    this.lists.splice(level + 1);
                    this.emitModelValueAndLabel();
                    this.setNowList(leveldata);
                    break;
                }
                this.level = level;
                this.vals.splice(level);
                this.labs.splice(level);
                this.lists.splice(level + 1);
                this.emitModelValueAndLabel();
                this.setNowList(leveldata);
                break;
            }
        }, {
            'deep': true,
            'immediate': true
        });
        this.watch('modelValue', () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const nowval = this.propBoolean('multi') ? this.vals : (this.vals.length ? [this.vals[this.vals.length - 1]] : []);
            if (JSON.stringify(this.props.modelValue) === JSON.stringify(nowval)) {
                return;
            }
            if (!this.propBoolean('multi')) {
                if (!this.props.modelValue.length) {
                    this.vals.length = 0;
                    this.labs.length = 0;
                    this.lists.splice(1);
                    this.emitModelValueAndLabel();
                    return;
                }
                const lval = this.props.modelValue[0].toString();
                let nextChildren = null;
                let isSelected = false;
                const isArray = Array.isArray(this.lists[this.level]);
                for (const key in this.lists[this.level]) {
                    const item = this.lists[this.level][key];
                    const val = (isArray ?
                        (typeof item === 'object' ? ((_b = (_a = item.value) !== null && _a !== void 0 ? _a : item.label) !== null && _b !== void 0 ? _b : '') : item) :
                        key).toString();
                    if (lval !== val) {
                        continue;
                    }
                    nextChildren = (_c = item.children) !== null && _c !== void 0 ? _c : null;
                    isSelected = true;
                    this.vals[this.level] = val;
                    this.labs[this.level] = (_d = item.label) !== null && _d !== void 0 ? _d : val;
                    this.emitModelValueAndLabel();
                }
                if (!isSelected) {
                    this.vals.splice(this.level);
                    this.labs.splice(this.level);
                    this.lists.splice(this.level + 1);
                    this.emitModelValueAndLabel();
                    return;
                }
                if (!nextChildren) {
                    if (!this.propBoolean('async')) {
                        return;
                    }
                    this.loading = true;
                    const children = yield new Promise((resolve) => {
                        this.emit('load', this.vals[this.level], (children) => {
                            resolve(children);
                        });
                    });
                    this.loading = false;
                    if (!(children === null || children === void 0 ? void 0 : children.length)) {
                        return;
                    }
                    nextChildren = children;
                }
                ++this.level;
                this.lists[this.level] = nextChildren;
                this.setNowList(this.lists[this.level]);
                return;
            }
            this.vals.length = 0;
            this.labs.length = 0;
            if (!this.props.modelValue.length) {
                this.lists.splice(1);
                this.emitModelValueAndLabel();
                this.level = 0;
                this.setNowList(this.lists[0]);
                if (this.propBoolean('async')) {
                    this.emit('loaded');
                }
                return;
            }
            for (let i = 0; i < this.props.modelValue.length; ++i) {
                const lval = this.props.modelValue[i].toString();
                let nextChildren = null;
                let isSelected = false;
                const isArray = Array.isArray(this.lists[i]);
                for (const key in this.lists[i]) {
                    const item = this.lists[i][key];
                    const val = (isArray ?
                        (typeof item === 'object' ? ((_f = (_e = item.value) !== null && _e !== void 0 ? _e : item.label) !== null && _f !== void 0 ? _f : '') : item) :
                        key).toString();
                    if (lval !== val) {
                        continue;
                    }
                    nextChildren = (_g = item.children) !== null && _g !== void 0 ? _g : null;
                    isSelected = true;
                    this.vals.push(val);
                    this.labs.push((_h = item.label) !== null && _h !== void 0 ? _h : val);
                }
                if (!isSelected) {
                    this.lists.splice(i + 1);
                    this.emitModelValueAndLabel();
                    this.level = i;
                    this.setNowList(this.lists[i]);
                    if (this.propBoolean('async')) {
                        this.emit('loaded');
                    }
                    return;
                }
                if (!nextChildren) {
                    if (!this.propBoolean('async')) {
                        this.lists.splice(i + 1);
                        this.emitModelValueAndLabel();
                        this.level = i;
                        this.setNowList(this.lists[i]);
                        return;
                    }
                    const children = yield new Promise((resolve) => {
                        this.emit('load', this.vals[i], (children) => {
                            resolve(children);
                        });
                    });
                    if (!(children === null || children === void 0 ? void 0 : children.length)) {
                        this.lists.splice(i + 1);
                        this.emitModelValueAndLabel();
                        this.level = i;
                        this.setNowList(this.lists[i]);
                        this.emit('loaded');
                        return;
                    }
                    nextChildren = children;
                }
                this.lists[i + 1] = nextChildren;
            }
        }), {
            'immediate': true,
            'deep': true
        });
        this.watch('editable', () => {
            if (!this.propBoolean('editable')) {
                return;
            }
            this.inputValue = '';
        }, {
            'immediate': true
        });
        this.watch('multi', () => {
            if (this.propBoolean('multi')) {
                this.emit('update:modelValue', clickgo.tool.clone(this.vals));
                return;
            }
            if (!this.vals.length) {
                return;
            }
            this.emit('update:modelValue', [this.vals[this.vals.length - 1]]);
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
