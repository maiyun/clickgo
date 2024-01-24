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
        this.emits = {
            'label': null,
            'load': null,
            'loaded': null,
            'level': null
        };
        this.props = {
            'disabled': false,
            'async': false,
            'modelValue': '',
            'placeholder': '',
            'data': []
        };
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
        this.value = [];
        this.label = [];
        this.inputValue = '';
        this.listValue = [];
        this.listLabel = [];
        this.oploading = false;
        this.loading = false;
        this.lists = [
            []
        ];
        this.nowlist = [];
        this.levelData = [
            {
                'label': '',
                'value': ''
            }
        ];
        this.background = '';
        this.padding = '';
    }
    get opMargin() {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
    get nowlistComp() {
        var _a, _b;
        if (this.inputValue === '') {
            return this.nowlist;
        }
        const inputValue = this.inputValue.toLowerCase();
        const isArray = Array.isArray(this.nowlist);
        const searchData = isArray ? [] : {};
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
                searchData.push(item);
            }
            else {
                searchData[key] = item;
            }
        }
        return searchData;
    }
    updateValue() {
        if (this.value.length < 2) {
            this.emit('label', '');
            this.emit('level', []);
            if (this.props.modelValue === '') {
                return;
            }
            this.emit('update:modelValue', '');
            return;
        }
        this.emit('label', this.label[this.label.length - 2]);
        this.emit('level', this.levelData.slice(0, -1));
        const newval = this.value[this.value.length - 2];
        if (this.props.modelValue === newval) {
            return;
        }
        this.emit('update:modelValue', newval);
    }
    blur() {
        this.inputValue = '';
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
            if (e.key !== 'Enter') {
                return;
            }
            if (!this.listValue[0]) {
                return;
            }
            e.stopPropagation();
            yield this.listItemClicked();
        });
    }
    updateInputValue(value) {
        this.inputValue = value.trim();
        this.listValue = [this.inputValue];
        if ((this.inputValue !== '') && (this.element.dataset.cgPopOpen === undefined)) {
            this.refs.gs.showPop();
            return;
        }
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
    listItemClicked() {
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
                if (this.listValue[0] !== val) {
                    continue;
                }
                nextChildren = (_c = item.children) !== null && _c !== void 0 ? _c : null;
                isSelected = true;
                this.value[this.level] = this.listValue[0];
                this.label[this.level] = this.listLabel[0];
                this.levelData[this.level] = {
                    'label': this.label[this.level],
                    'value': this.value[this.level]
                };
            }
            if (!isSelected) {
                return;
            }
            if (!nextChildren) {
                if (!this.propBoolean('async')) {
                    clickgo.form.hidePop();
                    ++this.level;
                    this.listValue = [];
                    this.nowlist = [];
                    this.value[this.level] = '';
                    this.label[this.level] = '';
                    this.lists[this.level] = [];
                    this.levelData[this.level] = {
                        'label': '',
                        'value': ''
                    };
                    this.updateValue();
                    return;
                }
                this.loading = true;
                const children = yield new Promise((resolve) => {
                    this.emit('load', this.value[this.level], (children) => {
                        resolve(children);
                        this.emit('loaded');
                    });
                });
                this.loading = false;
                if (!(children === null || children === void 0 ? void 0 : children.length)) {
                    clickgo.form.hidePop();
                    ++this.level;
                    this.listValue = [];
                    this.nowlist = [];
                    this.value[this.level] = '';
                    this.label[this.level] = '';
                    this.lists[this.level] = [];
                    this.levelData[this.level] = {
                        'label': '',
                        'value': ''
                    };
                    this.updateValue();
                    return;
                }
                nextChildren = children;
            }
            ++this.level;
            this.listValue = [];
            this.setNowList(nextChildren);
            this.value[this.level] = '';
            this.label[this.level] = '';
            this.lists[this.level] = nextChildren;
            this.levelData[this.level] = {
                'label': '',
                'value': ''
            };
            this.updateValue();
        });
    }
    back() {
        this.value.splice(-1);
        this.label.splice(-1);
        this.lists.splice(-1);
        this.levelData.splice(this.level);
        --this.level;
        this.listValue = [];
        this.value[this.level] = '';
        this.label[this.level] = '';
        this.levelData[this.level] = {
            'label': '',
            'value': ''
        };
        this.setNowList(this.lists[this.level]);
        this.updateValue();
    }
    selectLevelValue(list) {
        return __awaiter(this, void 0, void 0, function* () {
            this.level = 0;
            this.listValue = [];
            this.value = [''];
            this.label = [''];
            this.setNowList(this.props.data);
            this.lists = [this.props.data];
            this.levelData = [{
                    'label': '',
                    'value': ''
                }];
            for (let i = 0; i < list.length; ++i) {
                this.level = i;
                const r = yield this._selectValue(list[i], false);
                yield this.nextTick();
                if (!r) {
                    break;
                }
            }
            this.updateValue();
        });
    }
    _selectValue(value, autoUpdate = true) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            if (value === '') {
                return false;
            }
            if (this.value.length > 1 && (value === this.value[this.level - 1])) {
                return false;
            }
            let nextChildren = null;
            let isSelected = false;
            const isArray = Array.isArray(this.lists[this.level]);
            for (const key in this.lists[this.level]) {
                const item = this.lists[this.level][key];
                const val = (isArray ?
                    (typeof item === 'object' ? ((_b = (_a = item.value) !== null && _a !== void 0 ? _a : item.label) !== null && _b !== void 0 ? _b : '') : item) :
                    key).toString();
                if (value !== val) {
                    continue;
                }
                nextChildren = (_c = item.children) !== null && _c !== void 0 ? _c : null;
                isSelected = true;
                this.value[this.level] = val;
                this.label[this.level] = (_d = item.label) !== null && _d !== void 0 ? _d : val;
                this.levelData[this.level] = {
                    'value': this.value[this.level],
                    'label': this.label[this.level]
                };
            }
            if (!isSelected) {
                if (autoUpdate) {
                    this.emit('update:modelValue', '');
                }
                return false;
            }
            if (!nextChildren) {
                if (!this.propBoolean('async')) {
                    ++this.level;
                    this.listValue = [];
                    this.nowlist = [];
                    this.value[this.level] = '';
                    this.label[this.level] = '';
                    this.lists[this.level] = [];
                    this.levelData[this.level] = {
                        'label': '',
                        'value': ''
                    };
                    if (autoUpdate) {
                        this.updateValue();
                    }
                    return false;
                }
                this.loading = true;
                const children = yield new Promise((resolve) => {
                    this.emit('load', this.value[this.level], (children) => {
                        resolve(children);
                        this.emit('loaded');
                    });
                });
                this.loading = false;
                if (!(children === null || children === void 0 ? void 0 : children.length)) {
                    ++this.level;
                    this.listValue = [];
                    this.nowlist = [];
                    this.value[this.level] = '';
                    this.label[this.level] = '';
                    this.lists[this.level] = [];
                    this.levelData[this.level] = {
                        'label': '',
                        'value': ''
                    };
                    if (autoUpdate) {
                        this.updateValue();
                    }
                    return false;
                }
                nextChildren = children;
            }
            ++this.level;
            this.listValue = [];
            this.setNowList(nextChildren);
            this.value[this.level] = '';
            this.label[this.level] = '';
            this.lists[this.level] = nextChildren;
            this.levelData[this.level] = {
                'label': '',
                'value': ''
            };
            if (autoUpdate) {
                this.updateValue();
            }
            return true;
        });
    }
    onMounted() {
        this.watch('data', () => {
            this.level = 0;
            this.listValue = [];
            this.value = [''];
            this.label = [''];
            this.setNowList(this.props.data);
            this.lists = [this.props.data];
            this.levelData = [{
                    'label': '',
                    'value': ''
                }];
            this.updateValue();
        }, {
            'deep': true
        });
        this.watch('modelValue', () => __awaiter(this, void 0, void 0, function* () {
            yield this._selectValue(this.props.modelValue.toString());
        }));
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
        this.setNowList(this.props.data);
        this.lists[0] = this.props.data;
    }
}
exports.default = default_1;
