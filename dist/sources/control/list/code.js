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
            'remove': null,
            'add': null,
            'change': null,
            'changed': null,
            'itemclicked': null,
            'itemdblclicked': null,
            'label': null,
            'item': null,
            'load': null,
            'update:modelValue': null
        };
        this.props = {
            'disabled': false,
            'must': true,
            'multi': false,
            'ctrl': true,
            'selection': false,
            'gesture': [],
            'scroll': 'auto',
            'virtual': false,
            'plain': false,
            'tree': false,
            'treeDefault': 0,
            'async': false,
            'icon': false,
            'iconDefault': '',
            'check': false,
            'map': {},
            'data': [],
            'disabledList': [],
            'unavailableList': [],
            'modelValue': []
        };
        this.dataFormat = [];
        this.values = [];
    }
    get value() {
        if (this.propBoolean('check')) {
            return undefined;
        }
        let change = false;
        const modelValue = clickgo.tool.clone(this.values);
        if (modelValue.length > 1 && !this.propBoolean('multi')) {
            change = true;
            modelValue.splice(1);
        }
        if (!modelValue.length && this.propBoolean('must')) {
            return [];
        }
        const value = [];
        const label = [];
        const items = [];
        if (modelValue.length > 0) {
            for (let i = 0; i < modelValue.length; ++i) {
                const result = this.findFormat(modelValue[i]);
                if (result) {
                    const j = this.findGl(result[modelValue[i]].value);
                    value.push(j);
                    label.push(result[modelValue[i]].label);
                    items.push(this.dataGl[j]);
                }
                else {
                    change = true;
                    modelValue.splice(i, 1);
                    --i;
                }
            }
        }
        if (change) {
            this.emit('update:modelValue', modelValue);
        }
        this.emit('label', label);
        this.emit('item', items);
        return value;
    }
    get dataGl() {
        return this.unpack(this.dataFormat);
    }
    get mapComp() {
        var _a, _b, _c;
        return {
            'children': (_a = this.props.map.children) !== null && _a !== void 0 ? _a : 'children',
            'label': (_b = this.props.map.label) !== null && _b !== void 0 ? _b : 'label',
            'value': (_c = this.props.map.value) !== null && _c !== void 0 ? _c : 'value',
        };
    }
    select(index) {
        this.refs.gl.select(index);
    }
    findFormat(value, autoOpen = true, data, level) {
        const rtn = {};
        if (level === undefined) {
            level = 0;
        }
        if (!Array.isArray(value)) {
            value = [value];
        }
        for (let i = 0; i < value.length; ++i) {
            if (typeof value[i] === 'string') {
                continue;
            }
            value[i] = value[i].toString();
        }
        if (!data) {
            data = this.dataFormat;
        }
        for (const item of data) {
            if (value.includes(item.value)) {
                rtn[item.value] = item;
                if (Object.keys(rtn).length === value.length) {
                    return rtn;
                }
            }
            const result = this.findFormat(value, autoOpen, item.children, level + 1);
            if (Object.keys(result).length) {
                if (autoOpen && (item.tree === 0)) {
                    item.tree = 1;
                }
                Object.assign(rtn, result);
                if (Object.keys(rtn).length === value.length) {
                    return result;
                }
            }
        }
        return level ? rtn : (Object.keys(rtn).length ? rtn : null);
    }
    arrowUp() {
        this.refs.gl.arrowUp();
    }
    arrowDown() {
        this.refs.gl.arrowDown();
    }
    updateModelValue(value) {
        if (this.propBoolean('check')) {
            return;
        }
        const modelValue = [];
        const label = [];
        const items = [];
        for (const item of value) {
            if (!this.dataGl[item]) {
                continue;
            }
            modelValue.push(this.dataGl[item].value);
            label.push(this.dataGl[item].label);
            items.push(this.dataGl[item]);
        }
        this.values = modelValue;
        this.emit('update:modelValue', clickgo.tool.clone(modelValue));
        this.emit('label', label);
        this.emit('item', items);
    }
    formatData(nowData, oldData) {
        var _a, _b, _c, _d, _e, _f;
        if (!Array.isArray(nowData)) {
            const newArray = [];
            for (const k in nowData) {
                const item = nowData[k];
                if (typeof item == 'string') {
                    newArray.push({
                        'value': k, 'label': item
                    });
                    continue;
                }
                item.value = k;
                newArray.push(item);
            }
            nowData = newArray;
        }
        const data = [];
        const oldValues = [];
        for (const item of oldData) {
            oldValues.push(item.value);
        }
        for (let k = 0; k < nowData.length; ++k) {
            const over = {
                'label': '',
                'value': '',
                'title': false,
                'disabled': false,
                'color': undefined,
                'control': 'item',
                'tree': this.propInt('treeDefault'),
                'children': []
            };
            const item = nowData[k];
            let value = typeof item === 'object' ? ((_b = (_a = item[this.mapComp.value]) !== null && _a !== void 0 ? _a : item[this.mapComp.label]) !== null && _b !== void 0 ? _b : k) : item;
            if (typeof value === 'number') {
                value = value.toString();
            }
            const oldIo = oldValues.indexOf(value);
            if (typeof item === 'object') {
                over.label = (_d = (_c = item[this.mapComp.label]) !== null && _c !== void 0 ? _c : item[this.mapComp.value]) !== null && _d !== void 0 ? _d : k;
                over.value = value;
                over.title = item.title !== undefined ? item.title : false;
                over.disabled = item.disabled !== undefined ? item.disabled : (over.title ? true : false);
                over.color = item.color ? (item.color === 'tip' ? 'var(--g-color-disabled)' : item.color) : undefined;
                over.control = (_e = item.control) !== null && _e !== void 0 ? _e : 'item';
                if (item.icon) {
                    over.icon = item.icon;
                }
                if (item.openicon) {
                    over.openicon = item.openicon;
                }
                if (item.tree !== undefined) {
                    over.tree = item.tree;
                }
                if (((_f = item[this.mapComp.children]) === null || _f === void 0 ? void 0 : _f.length) > 0) {
                    over.children = this.formatData(item[this.mapComp.children], oldIo !== -1 ? oldData[oldIo].children : []);
                }
            }
            else {
                over.label = value;
                over.value = value;
            }
            if (oldIo !== -1) {
                over.tree = oldData[oldIo].tree;
            }
            if (over.tree === 2) {
                if (over.children.length === 0) {
                    over.tree = -1;
                }
                else {
                    over.tree = 1;
                }
            }
            data.push(over);
        }
        return data;
    }
    unpack(data, level = 0) {
        var _a, _b, _c;
        const result = [];
        const disabledList = this.propArray('disabledList');
        const unavailableList = this.propArray('unavailableList');
        for (const item of data) {
            let tree = item.tree;
            if ((item.children.length === 0) && !this.propBoolean('async')) {
                tree = -1;
            }
            result.push({
                'label': item.label,
                'value': item.value,
                'title': item.title,
                'disabled': disabledList.includes(item.value) ? true : item.disabled,
                'unavailable': unavailableList.includes(item.value) ? true : item.unavailable,
                'color': item.color,
                'control': item.control,
                'tree': tree,
                'icon': (_a = item.icon) !== null && _a !== void 0 ? _a : this.props.iconDefault,
                'openicon': (_c = (_b = item.openicon) !== null && _b !== void 0 ? _b : item.icon) !== null && _c !== void 0 ? _c : this.props.iconDefault,
                'level': level,
                'format': item
            });
            if (!this.propBoolean('tree') || (tree === 1)) {
                result.push(...this.unpack(item.children, level + 1));
            }
        }
        return result;
    }
    findGl(value) {
        for (let i = 0; i < this.dataGl.length; ++i) {
            if (this.dataGl[i].value === value) {
                return i;
            }
        }
        return null;
    }
    treeClick(e, item) {
        if (item.format.tree > -1) {
            e.stopPropagation();
        }
        if (item.format.tree === 0) {
            if (this.propBoolean('async') && !item.format.children.length) {
                item.format.tree = 2;
                this.emit('load', item.value, (children) => {
                    if (!(children === null || children === void 0 ? void 0 : children.length)) {
                        item.format.children = [];
                        item.format.tree = -1;
                        return;
                    }
                    item.format.children = this.formatData(children, []);
                    item.format.tree = 1;
                });
            }
            else {
                item.format.tree = 1;
            }
        }
        else if (item.format.tree === 1) {
            item.format.tree = 0;
            for (const vitem of this.props.modelValue) {
                if (!this.findFormat(vitem, false, item.format.children)) {
                    continue;
                }
                this.emit('update:modelValue', [item.value]);
                this.emit('label', [item.label]);
                this.emit('item', [item]);
                const event = {
                    'detail': {
                        'event': e,
                        'value': item.value,
                        'arrow': false
                    }
                };
                this.emit('itemclicked', event);
                break;
            }
        }
    }
    onAdd(e) {
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'index': e.detail.index,
                'value': this.dataGl[e.detail.value].value
            }
        };
        this.emit('add', event);
        if (!event.go) {
            e.preventDefault();
        }
    }
    onRemove(e) {
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'index': e.detail.index,
                'value': this.dataGl[e.detail.value].value
            }
        };
        this.emit('remove', event);
        if (!event.go) {
            e.preventDefault();
        }
    }
    onChange(e) {
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'value': e.detail.value[0] === undefined ? [] : [this.dataGl[e.detail.value[0]].value]
            }
        };
        this.emit('change', event);
        if (!event.go) {
            e.preventDefault();
        }
    }
    onChanged(e) {
        const event = {
            'detail': {
                'value': e.detail.value[0] === undefined ? [] : [this.dataGl[e.detail.value[0]].value]
            }
        };
        this.emit('changed', event);
    }
    onItemclicked(e) {
        const event = {
            'detail': {
                'event': e.detail.event,
                'value': this.dataGl[e.detail.value].value,
                'arrow': e.detail.arrow
            }
        };
        this.emit('itemclicked', event);
    }
    onItemdblclicked(e) {
        const event = {
            'detail': {
                'event': e.detail.event,
                'value': this.dataGl[e.detail.value].value,
                'arrow': e.detail.arrow
            }
        };
        this.emit('itemdblclicked', event);
    }
    onCheckChange(e, row) {
        e.preventDefault();
        if (row.format.children.length) {
            const r = this.childrenTotal(row, {
                'check': e.detail.value ? (e.detail.indeterminate ? true : false) : true
            });
            if (r.change) {
                this.emit('update:modelValue', clickgo.tool.clone(this.values));
            }
            return;
        }
        const io = this.values.indexOf(row.value);
        if (io === -1) {
            this.values.push(row.value);
        }
        else {
            this.values.splice(io, 1);
        }
        this.emit('update:modelValue', clickgo.tool.clone(this.values));
    }
    get isChecked() {
        return (data) => {
            if (data.format.children.length) {
                const r = this.childrenTotal(data);
                return r.check > 0 ? true : false;
            }
            return this.values.includes(data.value);
        };
    }
    get isIndeterminate() {
        return (data) => {
            if (data.format.children.length) {
                const r = this.childrenTotal(data);
                if (r.check === 0) {
                    return false;
                }
                return r.check < r.total ? true : false;
            }
            return false;
        };
    }
    get childrenTotal() {
        return (data, opt = {}) => {
            var _a, _b;
            const rtn = {
                'total': 0,
                'check': 0,
                'change': false
            };
            if (Array.isArray(data)) {
                for (const item of data) {
                    const r = this.childrenTotal(item, opt);
                    if (r.change) {
                        rtn.change = true;
                    }
                }
                return rtn;
            }
            if (data.format) {
                data = data.format;
            }
            if (!((_a = data.children) === null || _a === void 0 ? void 0 : _a.length)) {
                if (opt.checkValues) {
                    const io = opt.checkValues.wait.indexOf(data.value);
                    if (io > -1) {
                        opt.checkValues.result.push(opt.checkValues.wait[io]);
                    }
                }
                return rtn;
            }
            for (const item of data.children) {
                if ((_b = item.children) === null || _b === void 0 ? void 0 : _b.length) {
                    const r = this.childrenTotal(item, opt);
                    rtn.total += r.total;
                    rtn.check += r.check;
                    if (r.change) {
                        rtn.change = true;
                    }
                    continue;
                }
                if (opt.checkValues) {
                    const io = opt.checkValues.wait.indexOf(item.value);
                    if (io > -1) {
                        opt.checkValues.result.push(opt.checkValues.wait[io]);
                    }
                }
                ++rtn.total;
                if (opt.check !== undefined) {
                    if (opt.check) {
                        if (!this.values.includes(item.value)) {
                            this.values.push(item.value);
                            rtn.change = true;
                        }
                        ++rtn.check;
                    }
                    else {
                        const io = this.values.indexOf(item.value);
                        if (io > -1) {
                            this.values.splice(io, 1);
                            rtn.change = true;
                        }
                    }
                    continue;
                }
                if (!this.values.includes(item.value)) {
                    continue;
                }
                ++rtn.check;
            }
            return rtn;
        };
    }
    refreshCheckValues() {
        const waitingCheck = clickgo.tool.clone(this.values);
        const result = [];
        this.childrenTotal(this.dataGl, {
            'checkValues': {
                'wait': waitingCheck,
                'result': result
            }
        });
        const r = clickgo.tool.compar(this.values, result);
        if (r.length.add || r.length.remove) {
            this.values = result;
            this.emit('update:modelValue', this.values);
        }
    }
    onMounted() {
        this.watch('check', () => {
            if (!this.propBoolean('check')) {
                return;
            }
            this.refreshCheckValues();
        });
        this.watch(() => JSON.stringify(this.props.data), (n, o) => {
            if (n === o) {
                return;
            }
            this.dataFormat = this.props.data.length ? this.formatData(this.props.data, this.dataFormat) : [];
            if (this.propBoolean('check')) {
                this.refreshCheckValues();
            }
        }, {
            'deep': true
        });
        this.watch('map', () => {
            this.dataFormat = this.formatData(this.props.data, this.dataFormat);
            if (this.propBoolean('check')) {
                this.refreshCheckValues();
            }
        }, {
            'deep': true
        });
        this.watch('modelValue', () => {
            if ((this.values.length === this.propArray('modelValue').length)
                && this.values.every((item) => this.propArray('modelValue').includes(item))) {
                return;
            }
            this.values = clickgo.tool.clone(this.propArray('modelValue'));
            if (this.propBoolean('check')) {
                this.refreshCheckValues();
            }
        }, {
            'deep': true
        });
        this.dataFormat = this.formatData(this.props.data, this.dataFormat);
        this.values = clickgo.tool.clone(this.propArray('modelValue'));
        if (this.propBoolean('check')) {
            this.refreshCheckValues();
        }
    }
}
exports.default = default_1;
