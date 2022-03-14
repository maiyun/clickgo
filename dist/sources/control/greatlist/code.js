"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.methods = exports.watch = exports.computed = exports.data = exports.props = void 0;
exports.props = {
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
    'selection': {
        'default': false
    },
    'scroll': {
        'default': 'auto'
    },
    'data': {
        'default': []
    },
    'modelValue': {
        'default': -1
    }
};
exports.data = {
    'client': 0,
    'clientWidth': 0,
    'length': 0,
    'offset': 0,
    'valueData': -1,
    'shiftStart': 0,
    'delayRefreshShiftStartPos': false,
    'selectValues': [],
    'beforeSelectValues': []
};
exports.computed = {
    'isSame': function () {
        return clickgo.tool.getBoolean(this.same);
    },
    'isSelection': function () {
        return clickgo.tool.getBoolean(this.selection);
    },
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isMust': function () {
        return clickgo.tool.getBoolean(this.must);
    },
    'isMulti': function () {
        return clickgo.tool.getBoolean(this.multi);
    },
    'isSelected': function () {
        return (value) => {
            return this.multi ? this.valueData.includes(value) : (this.valueData === value);
        };
    },
};
exports.watch = {
    'data': {
        handler: function (n, o) {
            if (o.length === 0 && n.length > 0) {
                this.valueData = this.modelValue;
                if (typeof this.valueData === 'object') {
                    if (this.valueData[0] !== undefined) {
                        this.shiftStart = this.valueData[0];
                        this.valueData = [];
                    }
                }
                else {
                    this.shiftStart = this.valueData;
                    if (this.valueData === 0) {
                        this.valueData = -1;
                    }
                }
            }
            this.checkValue();
        },
        'deep': true
    },
    'modelValue': {
        handler: function (n, o) {
            var _a, _b;
            if (Array.isArray(n) && Array.isArray(o)) {
                if (n.length === 0 && o.length === 0) {
                    return;
                }
            }
            if (typeof this.modelValue === 'object') {
                if (typeof this.valueData !== 'object') {
                    this.valueData = this.modelValue;
                    this.shiftStart = (_a = this.valueData[0]) !== null && _a !== void 0 ? _a : 0;
                }
                else {
                    if ((this.valueData.length === this.modelValue.length) && this.valueData.every((ele) => this.modelValue.includes(ele))) {
                        return;
                    }
                    this.valueData = this.modelValue;
                    this.shiftStart = (_b = this.valueData[0]) !== null && _b !== void 0 ? _b : 0;
                }
            }
            else {
                if (typeof this.valueData === 'object') {
                    this.valueData = this.modelValue;
                    this.shiftStart = this.valueData === -1 ? 0 : this.valueData;
                }
                else {
                    if (this.valueData === this.modelValue) {
                        return;
                    }
                    this.valueData = this.modelValue;
                    this.shiftStart = this.valueData;
                }
            }
            this.checkValue();
        },
        'deep': true,
        'immediate': true
    },
    'must': {
        handler: function () {
            this.checkValue();
        }
    },
    'multi': {
        handler: function () {
            this.checkValue();
        }
    },
    'shiftStart': {
        handler: function () {
            var _a;
            let pos = (_a = this.$refs.view) === null || _a === void 0 ? void 0 : _a.getPos(this.shiftStart);
            if (pos) {
                this.refreshShiftStartPos(pos);
            }
            else {
                this.delayRefreshShiftStartPos = true;
            }
        }
    }
};
exports.methods = {
    onItemsPosChange: function () {
        var _a;
        if (!this.delayRefreshShiftStartPos) {
            return;
        }
        this.delayRefreshShiftStartPos = false;
        this.refreshShiftStartPos((_a = this.$refs.view) === null || _a === void 0 ? void 0 : _a.getPos(this.shiftStart));
    },
    refreshShiftStartPos: function () {
        var _a;
        let pos = (_a = this.$refs.view) === null || _a === void 0 ? void 0 : _a.getPos(this.shiftStart);
        if (!pos) {
            return;
        }
        if (pos.start < this.offset) {
            this.offset = pos.start;
            return;
        }
        if (pos.end > this.offset + this.client) {
            this.offset = pos.end - this.client;
        }
    },
    checkValue: function () {
        var _a, _b, _c, _d, _e, _f;
        let change = false;
        let notDisabledIndex = this.getFirstNotDisabledDataIndex();
        if (typeof this.valueData === 'object') {
            if (this.isMulti) {
                if (this.isMust && (this.valueData.length === 0)) {
                    change = true;
                    this.valueData = [notDisabledIndex];
                    this.shiftStart = this.valueData[0];
                }
            }
            else {
                change = true;
                this.valueData = (_a = this.valueData[0]) !== null && _a !== void 0 ? _a : -1;
                this.shiftStart = (this.valueData === -1) ? notDisabledIndex : this.valueData;
                if (this.isMust && (this.valueData === -1)) {
                    this.valueData = notDisabledIndex;
                }
            }
        }
        else {
            if (this.isMulti) {
                change = true;
                this.valueData = this.valueData === -1 ? [] : [this.valueData];
                this.shiftStart = this.valueData.length === 0 ? notDisabledIndex : this.valueData[0];
                if (this.isMust && (this.valueData.length === 0)) {
                    this.valueData = [notDisabledIndex];
                }
            }
            else {
                if (this.isMust && (this.valueData === -1)) {
                    change = true;
                    this.valueData = notDisabledIndex;
                    this.shiftStart = notDisabledIndex;
                }
            }
        }
        let dataMaxIndex = this.data.length - 1;
        if (this.isMulti) {
            for (let i = 0; i < this.valueData.length; ++i) {
                if (((this.valueData[i] > 0) && (this.valueData[i] > dataMaxIndex)) ||
                    (((_b = this.data[this.valueData[i]]) === null || _b === void 0 ? void 0 : _b.disabled) || (((_c = this.data[this.valueData[i]]) === null || _c === void 0 ? void 0 : _c.control) === 'split'))) {
                    change = true;
                    if (this.shiftStart === this.valueData[i]) {
                        this.shiftStart = i > 0 ? ((_d = this.valueData[0]) !== null && _d !== void 0 ? _d : notDisabledIndex) : notDisabledIndex;
                    }
                    this.valueData.splice(i, 1);
                    --i;
                }
            }
            if (change) {
                if (this.isMust && this.valueData.length === 0) {
                    this.valueData = [notDisabledIndex];
                }
            }
        }
        else {
            if (((this.valueData > 0) && (this.valueData > dataMaxIndex)) ||
                (((_e = this.data[this.valueData]) === null || _e === void 0 ? void 0 : _e.disabled) || (((_f = this.data[this.valueData]) === null || _f === void 0 ? void 0 : _f.control) === 'split'))) {
                change = true;
                if (this.shiftStart === this.valueData) {
                    this.shiftStart = notDisabledIndex;
                }
                this.valueData = this.isMust ? notDisabledIndex : -1;
            }
        }
        if (change) {
            this.$emit('update:modelValue', this.valueData);
        }
    },
    select: function (value, shift = false, ctrl = false) {
        let change = false;
        if (value < -1) {
            value = -1;
        }
        if (this.isMust && value === -1) {
            value = 0;
        }
        if (this.data[value]) {
            if (this.data[value].disabled || (this.data[value].control === 'split')) {
                return;
            }
        }
        if (this.isMulti) {
            if (!shift && !ctrl) {
                if (value === -1) {
                    if (this.valueData.length > 0) {
                        change = true;
                        this.valueData = [];
                    }
                }
                else {
                    if (this.valueData.length > 1 || this.valueData.length === 0) {
                        change = true;
                        this.valueData = [value];
                        this.shiftStart = value;
                    }
                    else {
                        if (this.valueData[0] !== value) {
                            change = true;
                            this.valueData = [value];
                            this.shiftStart = value;
                        }
                    }
                }
            }
            else {
                if (value === -1) {
                }
                else {
                    if (shift) {
                        let valueData = [];
                        if (value > this.shiftStart) {
                            for (let k = this.shiftStart; k <= value; ++k) {
                                if (this.data[k].disabled || (this.data[k].control === 'split')) {
                                    continue;
                                }
                                valueData.push(k);
                                change = true;
                            }
                        }
                        else {
                            for (let k = this.shiftStart; k >= value; --k) {
                                if (this.data[k].disabled === true) {
                                    continue;
                                }
                                if (this.data[k].control === 'split') {
                                    continue;
                                }
                                valueData.push(k);
                                change = true;
                            }
                        }
                        if ((valueData.length !== this.valueData.length) || !valueData.every((item) => this.valueData.includes(item))) {
                            this.valueData = valueData;
                            change = true;
                        }
                    }
                    else {
                        let indexOf = this.valueData.indexOf(value);
                        if (indexOf > -1) {
                            if (!this.isMust || (this.valueData.length > 1)) {
                                change = true;
                                this.valueData.splice(indexOf, 1);
                                this.shiftStart = value;
                            }
                        }
                        else {
                            change = true;
                            this.valueData.push(value);
                            this.shiftStart = value;
                        }
                    }
                }
            }
        }
        else {
            if (this.valueData !== value) {
                this.valueData = value;
                if (value !== -1) {
                    this.shiftStart = value;
                }
                change = true;
            }
        }
        if (change) {
            this.$emit('update:modelValue', this.valueData);
        }
    },
    innerDown: function (e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.$refs.inner.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
        }
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.$refs.inner, this.$refs.pop, e);
            });
        }
    },
    context: function (e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.$refs.inner, this.$refs.pop, e);
    },
    click: function (e) {
        if (!this.isMust) {
            let gi = clickgo.dom.findParentByData(e.target, 'cg-control-greatlist-item');
            if (!gi) {
                this.select(-1, e.shiftKey, e.ctrlKey);
            }
        }
    },
    keydown: function (e) {
        if ((e.key === 'ArrowDown') || (e.key === 'ArrowUp')) {
            e.preventDefault();
            let nvalue = -1;
            if (this.isMulti) {
                if (this.valueData.length > 0) {
                    if (e.key === 'ArrowDown') {
                        for (let i of this.valueData) {
                            if (nvalue === -1) {
                                nvalue = i;
                                continue;
                            }
                            if (i < nvalue) {
                                continue;
                            }
                            nvalue = i;
                        }
                    }
                    else {
                        for (let i of this.valueData) {
                            if (nvalue === -1) {
                                nvalue = i;
                                continue;
                            }
                            if (i > nvalue) {
                                continue;
                            }
                            nvalue = i;
                        }
                    }
                }
                else {
                    this.select(0);
                    return;
                }
            }
            else {
                if (this.valueData === -1) {
                    this.select(0);
                    return;
                }
                nvalue = this.valueData;
            }
            if (e.key === 'ArrowUp') {
                if (nvalue === 0) {
                    return;
                }
                for (let i = nvalue - 1; i >= 0; --i) {
                    if (!this.data[i]) {
                        continue;
                    }
                    if (this.data[i].disabled === true) {
                        continue;
                    }
                    if (this.data[i].control === 'split') {
                        continue;
                    }
                    this.select(i);
                    break;
                }
            }
            else {
                if (nvalue === this.data.length - 1) {
                    return;
                }
                for (let i = nvalue + 1; i < this.data.length; ++i) {
                    if (!this.data[i]) {
                        continue;
                    }
                    if (this.data[i].disabled === true) {
                        continue;
                    }
                    if (this.data[i].control === 'split') {
                        continue;
                    }
                    this.select(i);
                    break;
                }
            }
        }
    },
    itemContext: function (e, value) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.isSelected(value)) {
            return;
        }
        this.select(value, e.shiftKey, e.ctrlKey);
    },
    itemTouch: function (e, value) {
        clickgo.dom.bindLong(e, () => {
            if (this.isSelected(value)) {
                return;
            }
            this.select(value, e.shiftKey, this.multi ? true : e.ctrlKey);
        });
    },
    itemClick: function (e, value) {
        e.stopPropagation();
        let hasTouch = clickgo.dom.hasTouchButMouse(e);
        this.select(value, e.shiftKey, (hasTouch && this.multi) ? true : e.ctrlKey);
        this.$emit('itemclick', e, false);
    },
    arrowClick: function (e, value) {
        e.stopPropagation();
        let hasTouch = clickgo.dom.hasTouchButMouse(e);
        this.select(value, e.shiftKey, (hasTouch && this.multi) ? true : e.ctrlKey);
        let current = e.currentTarget;
        if (current.dataset.cgPopOpen === undefined) {
            clickgo.form.showPop(current, this.$refs.itempop, e);
        }
        else {
            clickgo.form.hidePop(current);
        }
        this.$emit('itemclick', e, true);
    },
    getFirstNotDisabledDataIndex: function () {
        let notDisabledIndex = 0;
        for (let i = 0; i < this.data.length; ++i) {
            if (this.data[i].disabled === true) {
                continue;
            }
            notDisabledIndex = i;
            break;
        }
        return notDisabledIndex;
    },
    onBeforeSelect: function () {
        this.selectValues = [];
        this.beforeSelectValues = Array.isArray(this.valueData) ? this.valueData : [this.valueData];
    },
    onSelect: function (area) {
        if (this.isMulti) {
            if (area.shift) {
            }
            else if (area.ctrl) {
                for (let i = area.start; i <= area.end; ++i) {
                }
            }
            else {
                if (area.start !== -1) {
                    this.shiftStart = area.start;
                    this.select(area.end, true);
                }
                else {
                    this.select(-1);
                }
            }
        }
        else {
            if (area.start !== -1) {
                this.select(area.start, area.shift, area.ctrl);
            }
        }
        this.$emit('select', area);
    },
    onAfterSelect: function () {
    }
};
exports.mounted = function () {
    this.checkValue();
};
