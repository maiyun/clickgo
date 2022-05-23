"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.computed = exports.props = void 0;
const clickgo = require("clickgo");
exports.props = {
    'adaptation': {
        'dafault': undefined
    },
    'disabled': {
        'default': undefined
    },
    'must': {
        'default': true
    },
    'multi': {
        'default': false,
    },
    'data': {
        'default': []
    },
    'modelValue': {
        'default': ''
    }
};
function formatData(inData, level = 0) {
    var _a, _b, _c, _d, _e, _f;
    let data = [];
    for (let k = 0; k < inData.length; ++k) {
        const item = inData[k];
        const type = typeof item;
        const over = {
            'label': '',
            'value': '',
            'title': false,
            'disabled': false,
            'control': 'item',
            'level': level
        };
        if (type === 'object') {
            over.label = (_b = (_a = item.label) !== null && _a !== void 0 ? _a : item.value) !== null && _b !== void 0 ? _b : k;
            over.value = (_d = (_c = item.value) !== null && _c !== void 0 ? _c : item.label) !== null && _d !== void 0 ? _d : k;
            over.title = item.children ? true : false;
            over.disabled = over.title ? true : ((_e = item.disabled) !== null && _e !== void 0 ? _e : false);
            over.control = (_f = item.control) !== null && _f !== void 0 ? _f : 'item';
            data.push(over);
            if (item.children) {
                data = data.concat(formatData(item.children, level + 1));
            }
        }
        else {
            over.label = item;
            over.value = item;
            data.push(over);
        }
    }
    return data;
}
exports.computed = {
    'isMust': function () {
        return clickgo.tool.getBoolean(this.must);
    },
    'isMulti': function () {
        return clickgo.tool.getBoolean(this.multi);
    },
    'dataComp': function () {
        return formatData(this.data);
    },
    'value': function () {
        var _a;
        let change = false;
        let modelValue = this.modelValue;
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
                    let found = false;
                    for (let k = 0; k < this.dataComp.length; ++k) {
                        if (this.dataComp[k].value === modelValue[i]) {
                            if (!this.dataComp[k].disabled && !this.dataComp[k].title) {
                                found = true;
                                value.push(k);
                                label.push(this.dataComp[k].label);
                            }
                            break;
                        }
                    }
                    if (!found) {
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
                for (let k = 0; k < this.dataComp.length; ++k) {
                    if (this.dataComp[k].value === modelValue) {
                        if (!this.dataComp[k].disabled && !this.dataComp[k].title) {
                            value = k;
                            label = this.dataComp[k].label;
                        }
                        break;
                    }
                }
                if (value === -1) {
                    change = true;
                    modelValue = '';
                }
            }
        }
        if (change) {
            this.$emit('update:modelValue', modelValue);
        }
        this.$emit('label', label);
        return value;
    }
};
exports.methods = {
    updateModelValue: function (value) {
        if (typeof value === 'object') {
            const modelValue = [];
            const label = [];
            for (const item of value) {
                if (this.dataComp[item] && !this.dataComp[item].disabled && !this.dataComp[item].title) {
                    modelValue.push(this.dataComp[item].value);
                    label.push(this.dataComp[item].label);
                }
            }
            this.$emit('update:modelValue', modelValue);
            this.$emit('label', label);
        }
        else {
            this.$emit('update:modelValue', this.dataComp[value] ? this.dataComp[value].value : '');
            this.$emit('label', this.dataComp[value] ? this.dataComp[value].label : '');
        }
    }
};
