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
            'level': null,
            'update:modelValue': null
        };
        this.props = {
            'disabled': false,
            'async': false,
            'plain': false,
            'virtual': false,
            'map': {},
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
        this._fvid = {
            'level': 0,
            'value': [],
            'label': [],
            'lists': [],
            'levelData': []
        };
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
        const event = {
            'detail': {
                'list': [],
                'values': [],
                'labels': []
            }
        };
        if (this.value.length < 2) {
            this.emit('label', '');
            this.emit('level', event);
            if (this.props.modelValue === '') {
                return;
            }
            this.emit('update:modelValue', '');
            return;
        }
        this.emit('label', this.label[this.label.length - 2]);
        for (let i = 0; i < this.levelData.length - 1; ++i) {
            event.detail.list.push({
                'label': this.levelData[i].label,
                'value': this.levelData[i].value
            });
            event.detail.values.push(this.levelData[i].value);
            event.detail.labels.push(this.levelData[i].label);
        }
        this.emit('level', event);
        const newval = this.value[this.value.length - 2];
        if (this.props.modelValue === newval) {
            return;
        }
        this.emit('update:modelValue', newval);
    }
    _findValueInDataAndSelectValueCheckChildren(nextChildren_1) {
        return __awaiter(this, arguments, void 0, function* (nextChildren, autoUpdate = true, hidePop = false) {
            if (!nextChildren) {
                if (!this.propBoolean('async')) {
                    if (hidePop) {
                        clickgo.form.hidePop();
                    }
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
                    if (hidePop) {
                        clickgo.form.hidePop();
                    }
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
    findValueInData(value, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            if (!data) {
                data = this.props.data;
                this._fvid.level = 0;
                this._fvid.value = [''];
                this._fvid.label = [''];
                this._fvid.lists = [data];
                this._fvid.levelData = [{
                        'label': '',
                        'value': ''
                    }];
            }
            let nextChildren = null;
            const isArray = Array.isArray(data);
            for (const key in data) {
                const item = data[key];
                const val = (isArray ?
                    (typeof item === 'object' ? ((_b = (_a = item.value) !== null && _a !== void 0 ? _a : item.label) !== null && _b !== void 0 ? _b : '') : item) :
                    key).toString();
                if (value !== val) {
                    if (!item.children) {
                        continue;
                    }
                    this._fvid.value[this._fvid.level] = val;
                    this._fvid.label[this._fvid.level] = (_c = item.label) !== null && _c !== void 0 ? _c : val;
                    this._fvid.lists[this._fvid.level] = data;
                    this._fvid.levelData[this._fvid.level] = {
                        'value': this._fvid.value[this._fvid.level],
                        'label': this._fvid.label[this._fvid.level]
                    };
                    ++this._fvid.level;
                    if (yield this.findValueInData(value, item.children)) {
                        return true;
                    }
                    this._fvid.value.splice(-1);
                    this._fvid.label.splice(-1);
                    this._fvid.lists.splice(-1);
                    this._fvid.levelData.splice(-1);
                    --this._fvid.level;
                    continue;
                }
                nextChildren = (_d = item.children) !== null && _d !== void 0 ? _d : null;
                this.level = this._fvid.level;
                this._fvid.value[this._fvid.level] = val;
                this._fvid.label[this._fvid.level] = (_e = item.label) !== null && _e !== void 0 ? _e : val;
                this._fvid.lists[this._fvid.level] = data;
                this._fvid.levelData[this._fvid.level] = {
                    'value': this._fvid.value[this._fvid.level],
                    'label': this._fvid.label[this._fvid.level]
                };
                this.value = this._fvid.value;
                this.label = this._fvid.label;
                this.lists = this._fvid.lists;
                this.levelData = this._fvid.levelData;
                yield this._findValueInDataAndSelectValueCheckChildren(nextChildren);
                return true;
            }
            return false;
        });
    }
    blur() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.tool.sleep(350);
            this.inputValue = '';
        });
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
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
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
            yield this._findValueInDataAndSelectValueCheckChildren(nextChildren, true, true);
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
                if (!list[i]) {
                    break;
                }
                const r = yield this._selectValue(list[i]);
                yield this.nextTick();
                if (!r) {
                    break;
                }
            }
            this.updateValue();
        });
    }
    _selectValue(value) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
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
                return false;
            }
            return this._findValueInDataAndSelectValueCheckChildren(nextChildren, false);
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
            const value = this.props.modelValue.toString();
            if (value === '') {
                if (this.value.length === 1) {
                    return;
                }
                this.level = 0;
                this.value = [''];
                this.label = [''];
                this.setNowList(this.props.data);
                this.lists = [this.props.data];
                this.levelData = [{
                        'label': '',
                        'value': ''
                    }];
                this.updateValue();
                return;
            }
            if (this.value.length > 1 && (value === this.value[this.level - 1])) {
                return;
            }
            if (yield this._selectValue(value)) {
                this.updateValue();
                return;
            }
            if (yield this.findValueInData(value)) {
                return;
            }
            if (this.value.length === 1) {
                return;
            }
            this.level = 0;
            this.value = [''];
            this.label = [''];
            this.setNowList(this.props.data);
            this.lists = [this.props.data];
            this.levelData = [{
                    'label': '',
                    'value': ''
                }];
            this.updateValue();
        }));
        this.setNowList(this.props.data);
        this.lists[0] = this.props.data;
    }
}
exports.default = default_1;
