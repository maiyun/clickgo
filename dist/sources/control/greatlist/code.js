"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.watch = exports.computed = exports.data = exports.props = void 0;
exports.props = {
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
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
    'adaptation': {
        'dafault': false
    },
    'same': {
        'default': false
    },
    'disabled': {
        'default': false
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
        'default': -1
    }
};
exports.data = {
    'direction': 'v',
    'client': 0,
    'length': 0,
    'offset': 0,
    'valueData': -1,
    'shiftStart': 0,
    'itemDown': false,
    'itemClick': false
};
exports.computed = {
    'isAdaptation': function () {
        return clickgo.tool.getBoolean(this.adaptation);
    },
    'isSame': function () {
        return clickgo.tool.getBoolean(this.same);
    },
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isMust': function () {
        return clickgo.tool.getBoolean(this.must);
    },
    'isMulti': function () {
        return clickgo.tool.getBoolean(this.multi);
    }
};
exports.watch = {
    'data': {
        handler: function () {
            this.select();
        },
        'deep': true
    },
    'modelValue': {
        handler: function () {
            this.valueData = this.modelValue;
            this.select();
            if (typeof this.valueData !== 'object') {
                this.shiftStart = this.valueData;
            }
        },
        'deep': true,
        'immediate': true
    },
    'must': {
        handler: function () {
            this.select();
        }
    },
    'multi': {
        handler: function () {
            this.select();
        }
    }
};
exports.methods = {
    select: function (value, shift = false, ctrl = false) {
        var _a;
        let change = false;
        if (value !== undefined) {
            if (this.isMulti) {
                if (!shift && !ctrl) {
                    this.valueData = this.isMulti ? [value] : value;
                    this.shiftStart = value;
                    this.$emit('update:modelValue', this.valueData);
                    return true;
                }
            }
            else {
                if (this.valueData !== value) {
                    this.valueData = value;
                    this.shiftStart = value;
                    this.$emit('update:modelValue', this.valueData);
                    return true;
                }
                return false;
            }
        }
        if (typeof this.valueData === 'object') {
            if (this.isMust && (this.valueData.length === 0)) {
                this.valueData = [0];
                change = true;
            }
            if (!this.isMulti) {
                this.valueData = (_a = this.valueData[0]) !== null && _a !== void 0 ? _a : -1;
                change = true;
            }
        }
        else {
            if (this.isMust && (this.valueData === -1)) {
                this.valueData = 0;
                change = true;
            }
            if (this.isMulti) {
                this.valueData = this.valueData === -1 ? [] : [this.valueData];
                change = true;
            }
        }
        if (this.isMulti) {
            if (this.valueData.length > 0) {
                for (let k = 0; k < this.valueData.length; ++k) {
                    if (!this.data[this.valueData[k]]) {
                        this.valueData.splice(k, 1);
                        --k;
                        change = true;
                    }
                }
            }
        }
        else {
            if (this.valueData > -1) {
                if (!this.data[this.valueData]) {
                    this.valueData = this.isMust ? 0 : -1;
                    change = true;
                }
            }
        }
        if (value === undefined) {
            if (change) {
                this.$emit('update:modelValue', this.valueData);
                return true;
            }
            return false;
        }
        if (shift) {
            this.valueData = [];
            if (value > this.shiftStart) {
                for (let k = this.shiftStart; k <= value; ++k) {
                    this.valueData.push(k);
                    change = true;
                }
            }
            else {
                for (let k = this.shiftStart; k >= value; --k) {
                    this.valueData.push(k);
                    change = true;
                }
            }
            if (change) {
                this.$emit('update:modelValue', this.valueData);
                return true;
            }
            return false;
        }
        else {
            if (this.valueData.includes(value)) {
                if (this.isMust && this.valueData.length === 1) {
                    if (change) {
                        this.$emit('update:modelValue', this.valueData);
                        return true;
                    }
                    return false;
                }
                this.valueData.splice(this.valueData.indexOf(value), 1);
                this.shiftStart = value;
                this.$emit('update:modelValue', this.valueData);
                return true;
            }
            else {
                this.valueData.push(value);
                this.shiftStart = value;
                this.valueData.sort();
                this.$emit('update:modelValue', this.valueData);
                return true;
            }
        }
    },
    down: function (e) {
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        this.cgDown(e);
        if (this.cgSelfPopOpen) {
            this.cgHidePop();
        }
        if (!this.itemDown) {
            if (this.cgChildPopItemShowing) {
                this.cgChildPopItemShowing.cgHidePop();
            }
        }
        else {
            this.itemDown = false;
        }
    },
    innerDown: function (e) {
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (this.itemDown) {
            return;
        }
        if (e instanceof MouseEvent) {
            if (!this.isMust) {
                this.valueData = this.isMulti ? [] : -1;
                this.$emit('update:modelValue', this.valueData);
            }
        }
        else {
            clickgo.dom.bindLong(e, () => {
                if (!this.isMust) {
                    this.valueData = this.isMulti ? [] : -1;
                    this.$emit('update:modelValue', this.valueData);
                }
                this.cgShowPop(e);
            });
        }
    },
    click: function (e) {
        if (!clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (!this.itemClick) {
            if (!this.isMust) {
                this.valueData = this.isMulti ? [] : -1;
                this.$emit('update:modelValue', this.valueData);
            }
        }
        else {
            this.itemClick = false;
        }
    },
    contextmenu: function (e) {
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        this.cgShowPop(e);
    }
};
