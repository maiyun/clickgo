"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.computed = exports.data = exports.props = void 0;
exports.props = {
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': undefined
    },
    'top': {
        'default': undefined
    },
    'zIndex': {
        'default': undefined
    },
    'flex': {
        'default': undefined
    },
    'padding': {
        'default': undefined
    },
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
exports.data = {
    'cgNest': true
};
function formatData(inData, level = 0) {
    var _a, _b, _c, _d, _e;
    let data = [];
    for (let k = 0; k < inData.length; ++k) {
        let item = inData[k];
        let type = typeof item;
        let over = {
            'label': '',
            'value': '',
            'disabled': false,
            'title': false,
            'level': level
        };
        if (type === 'object') {
            over.label = (_b = (_a = item.label) !== null && _a !== void 0 ? _a : item.value) !== null && _b !== void 0 ? _b : k;
            over.value = (_d = (_c = item.value) !== null && _c !== void 0 ? _c : item.label) !== null && _d !== void 0 ? _d : k;
            over.disabled = (_e = item.disabled) !== null && _e !== void 0 ? _e : false;
            over.title = item.children ? true : false;
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
                modelValue = (_a = modelValue[0]) !== null && _a !== void 0 ? _a : '';
                change = true;
            }
        }
        else {
            if (this.isMulti) {
                modelValue = modelValue === '' ? [] : [modelValue];
                change = true;
            }
        }
        if (this.isMust) {
            if (typeof modelValue === 'object') {
                if (modelValue.length === []) {
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
                                value.push(k);
                                label.push(this.dataComp[k].label);
                                found = true;
                            }
                            break;
                        }
                    }
                    if (!found) {
                        modelValue.splice(i, 1);
                        --i;
                        change = true;
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
                    modelValue = '';
                    change = true;
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
            let modelValue = [];
            let label = [];
            for (let item of value) {
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
