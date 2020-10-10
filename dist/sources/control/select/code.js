"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.computed = exports.watch = exports.data = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
    },
    'width': {
        'default': undefined
    },
    'height': {
        'default': 30
    },
    'left': {
        'default': 0
    },
    'top': {
        'default': 0
    },
    'zIndex': {
        'default': 0
    },
    'flex': {
        'default': ''
    },
    'padding': {
        'default': undefined
    },
    'modelValue': {
        'default': ''
    },
    'editable': {
        'default': false
    },
    'data': {
        'default': []
    }
};
exports.data = {
    'valueData': 0,
    'valueIndex': 0
};
exports.watch = {
    'data': {
        handler: function () {
            if (this.dataComp[this.valueIndex]) {
                return;
            }
            this.valueIndex = this.dataComp.length - 1;
            if (!this.editable) {
                this.valueData = this.valueIndex >= 0 ? this.dataComp[this.valueIndex].value : '';
                this.$emit('update:modelValue', this.valueData);
            }
        },
        'deep': true
    },
    'modelValue': {
        handler: function () {
            if (this.valueData === this.modelValue) {
                return;
            }
            this.valueData = this.modelValue;
            for (let i = 0; i < this.dataComp.length; ++i) {
                if (this.dataComp[i].value !== this.modelValue) {
                    continue;
                }
                this.valueIndex = i;
                return;
            }
            this.valueIndex = 0;
            if (!this.editable) {
                this.valueData = this.dataComp[0] ? this.dataComp[0].value : '';
                this.$emit('update:modelValue', this.valueData);
            }
        },
        'immediate': true
    }
};
function listToData(o, child = false) {
    var _a, _b, _c, _d, _e, _f, _g;
    let data = [];
    if (Array.isArray(o)) {
        for (let item of o) {
            if (typeof item === 'string') {
                data.push({
                    'label': item,
                    'value': item,
                    'child': child
                });
            }
            else {
                data.push({
                    'label': (_b = (_a = item.label) !== null && _a !== void 0 ? _a : item.value) !== null && _b !== void 0 ? _b : '',
                    'value': (_d = (_c = item.value) !== null && _c !== void 0 ? _c : item.label) !== null && _d !== void 0 ? _d : '',
                    'disabled': item.disabled,
                    'title': item.children ? true : false,
                    'child': child
                });
                if (item.children) {
                    data = data.concat(listToData(item.children, true));
                }
            }
        }
    }
    else {
        for (let k in o) {
            let item = o[k];
            data.push({
                'label': (_f = (_e = item.label) !== null && _e !== void 0 ? _e : item.value) !== null && _f !== void 0 ? _f : k,
                'value': (_g = item.value) !== null && _g !== void 0 ? _g : k,
                'disabled': item.disabled,
                'title': item.children ? true : false,
                'child': child
            });
            if (item.children) {
                data = data.concat(listToData(item.children, true));
            }
        }
    }
    return data;
}
exports.computed = {
    'editableComp': function () {
        if (typeof this.editable === 'boolean') {
            return this.editable;
        }
        return this.editable === 'true' ? true : false;
    },
    'dataComp': function () {
        return listToData(this.data);
    }
};
exports.methods = {
    updateValue: function (index) {
        this.valueIndex = index;
        this.valueData = this.dataComp[index] ? this.dataComp[index].value : '';
        this.$emit('update:modelValue', this.valueData);
    },
    tinput: function () {
        this.valueData = this.$refs.input.value;
        this.$emit('update:modelValue', this.valueData);
        for (let i = 0; i < this.dataComp.length; ++i) {
            if (this.dataComp[i].value !== this.valueData) {
                continue;
            }
            this.valueIndex = i;
            return;
        }
        this.valueIndex = 0;
    }
};
