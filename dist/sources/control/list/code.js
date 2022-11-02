"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'adaptation': false,
            'disabled': false,
            'must': true,
            'multi': false,
            'tree': false,
            'treeDefault': 0,
            'async': false,
            'icon': false,
            'iconDefault': '',
            'data': [],
            'modelValue': ''
        };
        this.dataFormat = [];
    }
    get isMust() {
        return clickgo.tool.getBoolean(this.props.must);
    }
    get isMulti() {
        return clickgo.tool.getBoolean(this.props.multi);
    }
    get isTree() {
        return clickgo.tool.getBoolean(this.props.tree);
    }
    get isAsync() {
        return clickgo.tool.getBoolean(this.props.async);
    }
    get isIcon() {
        return clickgo.tool.getBoolean(this.props.icon);
    }
    get value() {
        var _a;
        let change = false;
        let modelValue = this.props.modelValue;
        if (typeof modelValue === 'object') {
            if (!this.isMulti) {
                change = true;
                modelValue = (_a = modelValue[0]) !== null && _a !== void 0 ? _a : '';
            }
        }
        else {
            if (this.isMulti) {
                change = true;
                modelValue = modelValue === '' ? [] : [modelValue];
            }
        }
        if (this.isMust) {
            if (typeof modelValue === 'object') {
                if (modelValue.length === 0) {
                    return [];
                }
            }
            else {
                if (modelValue === '') {
                    return -1;
                }
            }
        }
        let value;
        let label;
        if (typeof modelValue === 'object') {
            value = [];
            label = [];
            if (modelValue.length > 0) {
                for (let i = 0; i < modelValue.length; ++i) {
                    const item = this.find(modelValue[i], this.dataFormat);
                    if (item) {
                        const j = this.findComp(item.value);
                        value.push(j);
                        label.push(item.label);
                    }
                    else {
                        change = true;
                        modelValue.splice(i, 1);
                        --i;
                    }
                }
            }
        }
        else {
            value = -1;
            label = '';
            if (modelValue !== '') {
                const item = this.find(modelValue, this.dataFormat);
                if (item) {
                    const j = this.findComp(item.value);
                    value = j;
                    label = item.label;
                }
                else {
                    change = true;
                    modelValue = '';
                }
            }
        }
        if (change) {
            this.emit('update:modelValue', modelValue);
        }
        this.emit('label', label);
        return value;
    }
    get dataComp() {
        return this.unpack(this.dataFormat);
    }
    updateModelValue(value) {
        if (typeof value === 'object') {
            const modelValue = [];
            const label = [];
            for (const item of value) {
                if (this.dataComp[item] && !this.dataComp[item].disabled) {
                    modelValue.push(this.dataComp[item].value);
                    label.push(this.dataComp[item].label);
                }
            }
            this.emit('update:modelValue', modelValue);
            this.emit('label', label);
        }
        else {
            this.emit('update:modelValue', this.dataComp[value] ? this.dataComp[value].value : '');
            this.emit('label', this.dataComp[value] ? this.dataComp[value].label : '');
        }
    }
    formatData(newData, oldData) {
        var _a, _b, _c, _d, _e, _f;
        const data = [];
        const oldValues = [];
        for (const item of oldData) {
            if (oldValues.includes(item.value)) {
                continue;
            }
            oldValues.push(item.value);
        }
        for (let k = 0; k < newData.length; ++k) {
            const item = newData[k];
            const type = typeof item;
            const over = {
                'label': '',
                'value': '',
                'title': false,
                'disabled': false,
                'control': 'item',
                'tree': this.props.treeDefault,
                'children': []
            };
            const value = type === 'object' ? ((_b = (_a = item.value) !== null && _a !== void 0 ? _a : item.label) !== null && _b !== void 0 ? _b : k) : item;
            const oldIo = oldValues.indexOf(value);
            if (type === 'object') {
                over.label = (_d = (_c = item.label) !== null && _c !== void 0 ? _c : item.value) !== null && _d !== void 0 ? _d : k;
                over.value = value;
                over.title = item.title !== undefined ? item.title : false;
                over.disabled = item.disabled !== undefined ? item.disabled : (over.title ? true : false);
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
                if (((_f = item.children) === null || _f === void 0 ? void 0 : _f.length) > 0) {
                    over.children = this.formatData(item.children, oldIo !== -1 ? oldData[oldIo].children : []);
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
        for (const item of data) {
            let tree = item.tree;
            if ((item.children.length === 0) && !this.isAsync) {
                tree = -1;
            }
            result.push({
                'label': item.label,
                'value': item.value,
                'title': item.title,
                'disabled': item.disabled,
                'control': item.control,
                'tree': tree,
                'icon': (_a = item.icon) !== null && _a !== void 0 ? _a : this.props.iconDefault,
                'openicon': (_c = (_b = item.openicon) !== null && _b !== void 0 ? _b : item.icon) !== null && _c !== void 0 ? _c : this.props.iconDefault,
                'level': level,
                'format': item
            });
            if (!this.isTree || (tree === 1)) {
                result.push(...this.unpack(item.children, level + 1));
            }
        }
        return result;
    }
    find(value, data) {
        for (const item of data) {
            if ((item.value === value) && !item.disabled) {
                return item;
            }
            const result = this.find(value, item.children);
            if (result) {
                if (item.tree === 0) {
                    item.tree = 1;
                }
                return result;
            }
        }
        return null;
    }
    findComp(value) {
        for (let i = 0; i < this.dataComp.length; ++i) {
            if (this.dataComp[i].value === value) {
                return i;
            }
        }
        return null;
    }
    treeClick(item) {
        if (item.format.tree === 0) {
            if (this.isAsync && item.format.children.length === 0) {
                item.format.tree = 2;
                this.emit('load', item.value, (children) => {
                    if (children) {
                        if (children.length === 0) {
                            item.format.children = [];
                            item.format.tree = -1;
                        }
                        else {
                            item.format.children = this.formatData(children, []);
                            item.format.tree = 1;
                        }
                    }
                    else {
                        item.format.tree = -1;
                    }
                });
            }
            else {
                item.format.tree = 1;
            }
        }
        else if (item.format.tree === 1) {
            item.format.tree = 0;
        }
    }
    onMounted() {
        this.watch('data', () => {
            this.dataFormat = this.formatData(this.props.data, this.dataFormat);
        }, {
            'immediate': true,
            'deep': true
        });
    }
}
exports.default = default_1;
