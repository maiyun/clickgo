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
            'add': null,
            'added': null,
            'remove': null,
            'removed': null,
            'change': null,
            'changed': null,
            'tagclick': null,
            'itemclicked': null,
            'remote': null,
            'load': null,
            'label': null,
            'update:modelValue': null
        };
        this.props = {
            'disabled': false,
            'editable': false,
            'multi': false,
            'plain': false,
            'virtual': false,
            'search': false,
            'remote': false,
            'remoteDelay': 500,
            'tree': false,
            'treeDefault': 0,
            'async': false,
            'icon': false,
            'iconDefault': '',
            'map': {},
            'padding': undefined,
            'leftlabel': true,
            'modelValue': [],
            'placeholder': '',
            'data': [],
            'disabledList': [],
            'unavailableList': []
        };
        this.localeData = {
            'en': {
                'search': 'Search'
            },
            'sc': {
                'search': '搜索'
            },
            'tc': {
                'search': '搜尋'
            },
            'ja': {
                'search': '検索'
            },
            'ko': {
                'search': '검색'
            },
            'th': {
                'search': 'ค้นหา'
            },
            'es': {
                'search': 'buscar'
            },
            'de': {
                'search': 'suchen'
            },
            'fr': {
                'search': 'rechercher'
            },
            'pt': {
                'search': 'pesquisar'
            },
            'ru': {
                'search': 'поиск'
            },
            'vi': {
                'search': 'tìm kiếm'
            }
        };
        this.value = [];
        this.label = [];
        this.inputValue = '';
        this.searchValue = '';
        this.searchData = [];
        this.listValue = [];
        this.listLabel = [];
        this.listItem = [];
        this.loading = 0;
        this._needSearch = 0;
        this.searching = 0;
    }
    get isMust() {
        if (this.propBoolean('editable')) {
            return false;
        }
        if (this.propBoolean('search')) {
            return false;
        }
        if (this.propBoolean('multi')) {
            return false;
        }
        return true;
    }
    get listMulti() {
        if (this.propBoolean('editable')) {
            return false;
        }
        if (this.propBoolean('search')) {
            return false;
        }
        return this.propBoolean('multi');
    }
    get labelMode() {
        return !this.propBoolean('multi') && !this.propBoolean('editable');
    }
    get dataComp() {
        if (!this.propBoolean('search')) {
            return this.props.data;
        }
        const searchValue = (this.propBoolean('editable') ? this.inputValue : this.searchValue).trim();
        return searchValue ? this.searchData : this.props.data;
    }
    updateValue(opt = {}) {
        this.emit('update:modelValue', clickgo.tool.clone(this.value));
        this.emit('label', clickgo.tool.clone(this.label));
        if (opt.clearList) {
            this.listValue.length = 0;
            this.listLabel.length = 0;
        }
        if (opt.clearInput) {
            this.inputValue = '';
            this.searchValue = '';
        }
    }
    blur() {
        var _a, _b, _c, _d, _e, _f;
        if (!this.propBoolean('multi')) {
            if (this.inputValue === this.listValue[0]) {
                return;
            }
            if (Array.isArray(this.dataComp)) {
                for (const item of this.dataComp) {
                    let label = '';
                    let value = '';
                    if (typeof item === 'string') {
                        label = item;
                        value = item;
                    }
                    else {
                        label = (_b = (_a = item.label) !== null && _a !== void 0 ? _a : item.value) !== null && _b !== void 0 ? _b : '';
                        value = (_d = (_c = item.value) !== null && _c !== void 0 ? _c : item.label) !== null && _d !== void 0 ? _d : '';
                    }
                    if ((value.toLowerCase() === this.inputValue.toLowerCase()) ||
                        (label.toLowerCase() === this.inputValue.toLowerCase())) {
                        this.inputValue = value;
                        this.value = [value];
                        this.label = [label];
                        this.listValue = [this.inputValue];
                        this.updateValue();
                        return;
                    }
                }
            }
            else {
                for (const key in this.dataComp) {
                    const label = typeof this.dataComp[key] === 'string' ? this.dataComp[key] :
                        ((_f = (_e = this.dataComp[key].label) !== null && _e !== void 0 ? _e : key) !== null && _f !== void 0 ? _f : '');
                    const value = key;
                    if ((value.toLowerCase() === this.inputValue.toLowerCase()) ||
                        (label.toLowerCase() === this.inputValue.toLowerCase())) {
                        this.inputValue = value;
                        this.value = [value];
                        this.label = [label];
                        this.listValue = [this.inputValue];
                        this.updateValue();
                        return;
                    }
                }
            }
            return;
        }
        this.inputValue = '';
    }
    keydown(e) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (e.key === 'Backspace') {
                if (this.propBoolean('multi')) {
                    if (e.target.value === '' && this.propBoolean('multi') && this.value.length > 0) {
                        const index = this.value.length - 1;
                        const value = this.value[index];
                        const event = {
                            'go': true,
                            preventDefault: function () {
                                this.go = false;
                            },
                            'detail': {
                                'index': index,
                                'value': value,
                                'mode': 'backspace'
                            }
                        };
                        this.emit('remove', event);
                        if (event.go) {
                            this.value.splice(-1);
                            this.label.splice(-1);
                            this.updateValue();
                            this.emit('removed', {
                                'detail': {
                                    'index': index,
                                    'value': value,
                                    'mode': 'backspace'
                                }
                            });
                        }
                    }
                }
                return;
            }
            if ((e.key === 'Enter') && (this.element.dataset.cgPopOpen === undefined) && (this.propBoolean('multi'))) {
                e.stopPropagation();
                if (!this.inputValue) {
                    this.refs.gs.showPop();
                    return;
                }
                if (this.value.includes(this.inputValue)) {
                    this.inputValue = '';
                    this.refs.gs.hidePop();
                    return;
                }
                const addIndex = this.value.length;
                const event = {
                    'go': true,
                    preventDefault: function () {
                        this.go = false;
                    },
                    'detail': {
                        'index': addIndex,
                        'value': this.inputValue
                    }
                };
                this.emit('add', event);
                if (event.go) {
                    this.value.push(this.inputValue);
                    this.label.push((_a = this.listLabel[0]) !== null && _a !== void 0 ? _a : this.inputValue);
                    this.updateValue({
                        'clearInput': true,
                        'clearList': true
                    });
                    this.emit('added', {
                        'detail': {
                            'index': addIndex,
                            'value': this.inputValue
                        }
                    });
                    if (this.propBoolean('search')) {
                        yield this._search();
                    }
                }
                return;
            }
            if ((e.key === 'ArrowDown' || e.key === 'Enter') && (this.element.dataset.cgPopOpen === undefined)) {
                e.stopPropagation();
                this.refs.gs.showPop();
                return;
            }
            yield this.textKeyDown(e);
        });
    }
    textKeyDown(e) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            e.stopPropagation();
            if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && this.element.dataset.cgPopOpen !== undefined) {
                e.preventDefault();
                switch (e.key) {
                    case 'ArrowUp': {
                        this.refs.list.arrowUp();
                        this.inputValue = (_a = this.listValue[0]) !== null && _a !== void 0 ? _a : '';
                        this.searchValue = (_b = this.listValue[0]) !== null && _b !== void 0 ? _b : '';
                        break;
                    }
                    default: {
                        this.refs.list.arrowDown();
                        this.inputValue = (_c = this.listValue[0]) !== null && _c !== void 0 ? _c : '';
                        this.searchValue = (_d = this.listValue[0]) !== null && _d !== void 0 ? _d : '';
                    }
                }
                yield this.updateInputValue(this.propBoolean('editable') ? this.inputValue : this.searchValue);
                return;
            }
            if (e.key !== 'Enter') {
                return;
            }
            const value = this.searchValue || this.inputValue;
            if (this.propBoolean('editable')) {
                if (this.propBoolean('multi')) {
                    if (!value) {
                        this.refs.gs.hidePop();
                        return;
                    }
                    if (this.value.includes(value)) {
                        this.inputValue = '';
                        this.refs.gs.hidePop();
                        return;
                    }
                    const addIndex = this.value.length;
                    const event = {
                        'go': true,
                        preventDefault: function () {
                            this.go = false;
                        },
                        'detail': {
                            'index': addIndex,
                            'value': value
                        }
                    };
                    this.emit('add', event);
                    if (event.go) {
                        this.value.push(value);
                        this.label.push((_e = this.listLabel[0]) !== null && _e !== void 0 ? _e : value);
                        this.updateValue({
                            'clearInput': true,
                            'clearList': true
                        });
                        this.emit('added', {
                            'detail': {
                                'index': addIndex,
                                'value': value
                            }
                        });
                        this.refs.gs.hidePop();
                        if (this.propBoolean('search')) {
                            yield this._search();
                        }
                    }
                }
                else {
                    if (!value) {
                        this.refs.gs.hidePop();
                        return;
                    }
                    this.value = [value];
                    this.listValue = [value];
                    yield this.nextTick();
                    this.label = [(_f = this.listLabel[0]) !== null && _f !== void 0 ? _f : value];
                    this.updateValue();
                    this.refs.gs.hidePop();
                }
            }
            else {
                if (this.propBoolean('multi')) {
                    if (!value) {
                        return;
                    }
                    if (this.value.includes(value)) {
                        this.searchValue = '';
                        this.refs.gs.hidePop();
                        yield this._search();
                        return;
                    }
                    if (!this.listValue[0]) {
                        this.searchValue = '';
                        this.refs.gs.hidePop();
                        yield this._search();
                        return;
                    }
                    const addIndex = this.value.length;
                    const event = {
                        'go': true,
                        preventDefault: function () {
                            this.go = false;
                        },
                        'detail': {
                            'index': addIndex,
                            'value': value
                        }
                    };
                    this.emit('add', event);
                    if (event.go) {
                        this.value.push(value);
                        this.label.push((_g = this.listLabel[0]) !== null && _g !== void 0 ? _g : '');
                        this.searchValue = '';
                        this.updateValue();
                        this.emit('added', {
                            'detail': {
                                'index': addIndex,
                                'value': value
                            }
                        });
                        this.refs.gs.hidePop();
                        yield this._search();
                    }
                }
                else {
                    if (!this.listValue[0]) {
                        this.searchValue = '';
                        this.refs.gs.hidePop();
                        yield this._search();
                        return;
                    }
                    this.value = [(_h = this.listValue[0]) !== null && _h !== void 0 ? _h : ''];
                    this.label = [(_j = this.listLabel[0]) !== null && _j !== void 0 ? _j : ''];
                    this.searchValue = '';
                    this.updateValue();
                    this.refs.gs.hidePop();
                    yield this._search();
                }
            }
        });
    }
    _search(success) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const searchValue = (this.propBoolean('editable') ? this.inputValue : this.searchValue).trim();
            if (this.propBoolean('remote')) {
                const delay = this.propInt('remoteDelay');
                ++this._needSearch;
                yield clickgo.tool.sleep(delay);
                if (this._needSearch > 1) {
                    --this._needSearch;
                    return;
                }
                if (this._needSearch === 0) {
                    return;
                }
                --this._needSearch;
                if (searchValue === '') {
                    this.searchData = [];
                    yield this.nextTick();
                    yield (success === null || success === void 0 ? void 0 : success());
                    return;
                }
                ++this.searching;
                const event = {
                    'detail': {
                        'value': searchValue,
                        'callback': (data) => __awaiter(this, void 0, void 0, function* () {
                            --this.searching;
                            this.searchData = data ? clickgo.tool.clone(data) : [];
                            yield this.nextTick();
                            yield (success === null || success === void 0 ? void 0 : success());
                        })
                    }
                };
                this.emit('remote', event);
            }
            else {
                yield this.nextTick();
                if (this._needSearch > 1) {
                    --this._needSearch;
                    return;
                }
                --this._needSearch;
                if (searchValue === '') {
                    this.searchData = [];
                    yield this.nextTick();
                    yield (success === null || success === void 0 ? void 0 : success());
                    return;
                }
                if (Array.isArray(this.props.data)) {
                    this.searchData = [];
                    for (const item of this.props.data) {
                        const val = (typeof item === 'object' ? (_a = item.value) !== null && _a !== void 0 ? _a : '' : item).toString().toLowerCase();
                        const lab = (typeof item === 'object' ? (_b = item.label) !== null && _b !== void 0 ? _b : '' : '').toLowerCase();
                        let include = true;
                        for (const char of searchValue) {
                            const c = char.toLowerCase();
                            if (val.includes(c) || lab.includes(c)) {
                                continue;
                            }
                            include = false;
                            break;
                        }
                        if (!include) {
                            continue;
                        }
                        this.searchData.push(item);
                    }
                }
                else {
                    this.searchData = {};
                    for (const key in this.props.data) {
                        const item = this.props.data[key];
                        const val = key.toLowerCase();
                        const lab = '';
                        let include = true;
                        for (const char of searchValue) {
                            const c = char.toLowerCase();
                            if (val.includes(c) || lab.includes(c)) {
                                continue;
                            }
                            include = false;
                            break;
                        }
                        if (!include) {
                            continue;
                        }
                        this.searchData[key] = item;
                    }
                }
                yield (success === null || success === void 0 ? void 0 : success());
            }
        });
    }
    updateSearchValue(value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.searchValue = value.trim();
            yield this._search(() => {
                this.listValue = [this.searchValue];
            });
        });
    }
    updateInputValue(value) {
        return __awaiter(this, void 0, void 0, function* () {
            value = value.trim();
            if (this.propBoolean('editable') && !this.propBoolean('multi')) {
                const event = {
                    'go': true,
                    preventDefault: function () {
                        this.go = false;
                    },
                    'detail': {
                        'value': [value]
                    },
                };
                this.emit('change', event);
                if (!event.go) {
                    return;
                }
            }
            this.inputValue = value;
            if (this.propBoolean('search')) {
                if (this.element.dataset.cgPopOpen === undefined) {
                    this.refs.gs.showPop();
                }
                yield this._search(() => {
                    this.listValue = [this.inputValue];
                });
            }
            if (this.propBoolean('multi')) {
                if (!this.propBoolean('search')) {
                    this.listValue = [this.inputValue];
                }
                return;
            }
            const before = clickgo.tool.clone(this.value);
            if (this.inputValue === '') {
                this.value = [];
                this.label = [];
                this.listValue = [];
            }
            else {
                this.value = [this.inputValue];
                this.label = [this.inputValue];
                this.listValue = [this.inputValue];
                yield this.nextTick();
                if (this.listLabel[0]) {
                    this.label = clickgo.tool.clone(this.listLabel);
                }
            }
            this.updateValue();
            if (this.propBoolean('editable') && !this.propBoolean('multi')) {
                const event = {
                    'detail': {
                        'before': before,
                        'value': [value]
                    }
                };
                this.emit('changed', event);
            }
        });
    }
    listItemClicked(e) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            const event = {
                'detail': {
                    'event': e.detail.event,
                    'value': e.detail.value,
                    'arrow': e.detail.arrow
                }
            };
            this.emit('itemclicked', event);
            if (this.propBoolean('editable')) {
                const v = (_a = this.listValue[0]) !== null && _a !== void 0 ? _a : '';
                if (this.propBoolean('multi')) {
                    if (this.value.includes(v)) {
                        this.refs.gs.hidePop();
                        return;
                    }
                    const addIndex = this.value.length;
                    const event = {
                        'go': true,
                        preventDefault: function () {
                            this.go = false;
                        },
                        'detail': {
                            'index': addIndex,
                            'value': v
                        }
                    };
                    this.emit('add', event);
                    if (event.go) {
                        this.value.push(v);
                        this.label.push((_b = this.listLabel[0]) !== null && _b !== void 0 ? _b : '');
                        this.updateValue({
                            'clearInput': true,
                            'clearList': true
                        });
                        this.emit('added', {
                            'detail': {
                                'index': addIndex,
                                'value': this.inputValue
                            }
                        });
                        if (this.propBoolean('search')) {
                            this.refs.gs.hidePop();
                            yield this._search();
                        }
                        else {
                            this.refs.gs.hidePop();
                        }
                    }
                }
                else {
                    if (this.inputValue !== v) {
                        const event = {
                            'go': true,
                            preventDefault: function () {
                                this.go = false;
                            },
                            'detail': {
                                'value': [v]
                            }
                        };
                        this.emit('change', event);
                        if (event.go) {
                            this.inputValue = v;
                            const before = clickgo.tool.clone(this.value);
                            this.value = [v];
                            this.label = [(_c = this.listLabel[0]) !== null && _c !== void 0 ? _c : ''];
                            this.updateValue();
                            if (this.propBoolean('search')) {
                                yield this._search();
                            }
                            const event = {
                                'detail': {
                                    'before': before,
                                    'value': [v]
                                }
                            };
                            this.emit('changed', event);
                        }
                    }
                    this.refs.gs.hidePop();
                }
            }
            else {
                if (this.propBoolean('multi')) {
                    if (this.propBoolean('search')) {
                        if (this.value.includes((_d = this.listValue[0]) !== null && _d !== void 0 ? _d : '')) {
                            this.refs.gs.hidePop();
                            this.searchValue = '';
                            yield this._search();
                            return;
                        }
                        const addIndex = this.value.length;
                        const event = {
                            'go': true,
                            preventDefault: function () {
                                this.go = false;
                            },
                            'detail': {
                                'index': addIndex,
                                'value': (_e = this.listValue[0]) !== null && _e !== void 0 ? _e : ''
                            }
                        };
                        this.emit('add', event);
                        if (event.go) {
                            this.value.push((_f = this.listValue[0]) !== null && _f !== void 0 ? _f : '');
                            this.label.push((_g = this.listLabel[0]) !== null && _g !== void 0 ? _g : '');
                            this.updateValue({
                                'clearInput': true,
                                'clearList': true
                            });
                            this.emit('added', {
                                'detail': {
                                    'index': addIndex,
                                    'value': this.inputValue
                                }
                            });
                            this.refs.gs.hidePop();
                            yield this._search();
                        }
                    }
                    else {
                    }
                }
                else {
                    const before = clickgo.tool.clone(this.value);
                    this.value = [(_h = this.listValue[0]) !== null && _h !== void 0 ? _h : ''];
                    this.label = [(_j = this.listLabel[0]) !== null && _j !== void 0 ? _j : ''];
                    if (this.propBoolean('search')) {
                        this.updateValue({
                            'clearInput': true
                        });
                        this.refs.gs.hidePop();
                        yield this._search();
                    }
                    else {
                        this.updateValue();
                        this.refs.gs.hidePop();
                    }
                    const event = {
                        'detail': {
                            'before': before,
                            'value': this.value
                        }
                    };
                    this.emit('changed', event);
                }
            }
        });
    }
    onAdd(e) {
        var _a;
        if (!this.propBoolean('multi')) {
            return;
        }
        if (this.propBoolean('search')) {
            return;
        }
        const addIndex = this.value.length;
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'index': addIndex,
                'value': e.detail.value
            }
        };
        this.emit('add', event);
        if (!event.go) {
            e.preventDefault();
            return;
        }
        this.value.push(e.detail.value);
        const result = this.refs.list.findFormat(e.detail.value, false);
        this.label.push((_a = result === null || result === void 0 ? void 0 : result[e.detail.value].label) !== null && _a !== void 0 ? _a : 'error');
        this.updateValue();
        this.emit('added', event);
    }
    onRemove(e) {
        if (!this.propBoolean('multi')) {
            return;
        }
        if (this.propBoolean('search')) {
            return;
        }
        const removeIndex = e.detail.index;
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'index': removeIndex,
                'value': e.detail.value,
                'mode': 'list'
            }
        };
        this.emit('remove', event);
        if (!event.go) {
            e.preventDefault();
            return;
        }
        this.value.splice(e.detail.index, 1);
        this.label.splice(e.detail.index, 1);
        this.updateValue();
        this.emit('removed', {
            'detail': {
                'index': removeIndex,
                'value': e.detail.value,
                'mode': 'list'
            }
        });
    }
    onChange(e) {
        if (this.propBoolean('multi')) {
            return;
        }
        if (this.propBoolean('search')) {
            return;
        }
        if (this.propBoolean('editable')) {
            return;
        }
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'value': e.detail.value
            }
        };
        this.emit('change', event);
        if (!event.go) {
            e.preventDefault();
        }
    }
    tagClick(index) {
        const value = this.value[index];
        const event = {
            'detail': {
                'index': index,
                'value': value
            }
        };
        this.emit('tagclick', event);
    }
    removeTag(index) {
        if (this.isMust) {
            if (this.value.length === 1) {
                return;
            }
        }
        const value = this.value[index];
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'index': index,
                'value': value,
                'mode': 'tag'
            }
        };
        this.emit('remove', event);
        if (!event.go) {
            return;
        }
        this.value.splice(index, 1);
        this.label.splice(index, 1);
        this.listValue = clickgo.tool.clone(this.value);
        this.updateValue();
        this.emit('removed', {
            'detail': {
                'index': index,
                'value': value,
                'mode': 'tag'
            }
        });
    }
    tagsWheel(e) {
        if (e.deltaY === 0) {
            return;
        }
        e.preventDefault();
        this.refs.tags.scrollLeft += e.deltaY;
    }
    tagdown(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        e.stopPropagation();
        clickgo.form.doFocusAndPopEvent(e);
    }
    onLoad(value, resolve) {
        this.emit('load', value, resolve);
    }
    onPop() {
        this.refs.list.refreshOffset();
    }
    onMounted() {
        let mvimmediate = true;
        this.watch('modelValue', () => __awaiter(this, void 0, void 0, function* () {
            if (mvimmediate) {
                mvimmediate = false;
            }
            else {
                if (JSON.stringify(this.value) === JSON.stringify(this.props.modelValue)) {
                    return;
                }
            }
            if (this.propBoolean('editable')) {
                if (this.props.modelValue.length) {
                    if (this.propBoolean('multi')) {
                        this.inputValue = '';
                        this.searchValue = '';
                        this.value.length = 0;
                        this.label.length = 0;
                        for (const item of this.props.modelValue) {
                            const items = item.toString();
                            const result = this.refs.list.findFormat(items, false);
                            if (result === null || result === void 0 ? void 0 : result[items]) {
                                this.value.push(result[items].value);
                                this.label.push(result[items].label);
                            }
                            else {
                                this.value.push(items);
                                this.label.push(items);
                            }
                        }
                        this.updateValue();
                        return;
                    }
                    this.inputValue = (this.props.modelValue[0]).toString();
                    this.value = [this.inputValue];
                    const result = this.refs.list.findFormat(this.inputValue, false);
                    this.label = [(result === null || result === void 0 ? void 0 : result[this.inputValue]) ? result[this.inputValue].label : this.inputValue];
                    this.listValue = [this.inputValue];
                    this.updateValue();
                    return;
                }
                this.value.length = 0;
                this.label.length = 0;
                this.updateValue({
                    'clearInput': true,
                    'clearList': true
                });
                return;
            }
            if (this.props.modelValue.length) {
                if (this.propBoolean('multi')) {
                    this.value.length = 0;
                    this.label.length = 0;
                    for (const item of this.props.modelValue) {
                        const items = item.toString();
                        const result = this.refs.list.findFormat(items, false);
                        if (result === null || result === void 0 ? void 0 : result[items]) {
                            this.value.push(result[items].value);
                            this.label.push(result[items].label);
                        }
                    }
                    this.updateValue();
                    this.listValue = this.value;
                    return;
                }
                this.listValue = [this.props.modelValue[0].toString()];
                yield this.nextTick();
                yield clickgo.tool.sleep(0);
                this.value = clickgo.tool.clone(this.listValue);
                this.label = clickgo.tool.clone(this.listLabel);
                this.updateValue();
                return;
            }
            this.listValue = [];
            yield this.nextTick();
            yield clickgo.tool.sleep(0);
            this.value = clickgo.tool.clone(this.listValue);
            this.label = clickgo.tool.clone(this.listLabel);
            this.updateValue();
        }), {
            'immediate': true,
            'deep': true
        });
        this.watch('search', () => __awaiter(this, void 0, void 0, function* () {
            yield this.nextTick();
            this.listValue = clickgo.tool.clone(this.value);
            if (!this.propBoolean('search')) {
                return;
            }
            this.searchValue = '';
            yield this._search();
        }));
        this.watch('remote', () => __awaiter(this, void 0, void 0, function* () {
            if (!this.propBoolean('search')) {
                return;
            }
            yield this._search();
        }));
        this.watch('editable', () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.propBoolean('editable')) {
                if (this.propBoolean('multi')) {
                    yield this.nextTick();
                    this.listValue = clickgo.tool.clone(this.value);
                    yield this.nextTick();
                    if (JSON.stringify(this.value) === JSON.stringify(this.listValue)) {
                        return;
                    }
                    this.value = clickgo.tool.clone(this.listValue);
                    this.label = clickgo.tool.clone(this.listLabel);
                    this.updateValue();
                }
                return;
            }
            if (!this.propBoolean('multi')) {
                this.inputValue = ((_a = this.value[0]) !== null && _a !== void 0 ? _a : '').toString();
            }
        }));
        this.watch('multi', () => {
            var _a;
            if (!this.propBoolean('multi')) {
                if (this.value.length > 1) {
                    this.value.splice(1);
                    this.label.splice(1);
                    this.updateValue();
                    this.listValue = clickgo.tool.clone(this.value);
                }
                if (this.propBoolean('editable')) {
                    this.inputValue = ((_a = this.value[0]) !== null && _a !== void 0 ? _a : '').toString();
                }
                return;
            }
            if (this.propBoolean('editable')) {
                this.inputValue = '';
            }
        });
        this.watch(() => JSON.stringify(this.props.data), (n, o) => __awaiter(this, void 0, void 0, function* () {
            if (n === o) {
                return;
            }
            if (this.propBoolean('editable')) {
                yield this._search();
                if (this.propBoolean('multi')) {
                    return;
                }
                this.listValue = this.value;
                yield this.nextTick();
                if (this.label[0] === this.listLabel[0]) {
                    return;
                }
                if (this.listValue.length) {
                    this.label = clickgo.tool.clone(this.listLabel);
                }
                else {
                    this.label[0] = this.value[0];
                }
                this.emit('label', clickgo.tool.clone(this.label));
                return;
            }
            yield this.nextTick();
            yield clickgo.tool.sleep(0);
            if (JSON.stringify(this.value) !== JSON.stringify(this.listValue)) {
                this.value = clickgo.tool.clone(this.listValue);
                this.emit('update:modelValue', clickgo.tool.clone(this.value));
            }
            if (JSON.stringify(this.label) !== JSON.stringify(this.listLabel)) {
                this.label = clickgo.tool.clone(this.listLabel);
                this.emit('label', clickgo.tool.clone(this.label));
            }
        }));
    }
}
exports.default = default_1;
