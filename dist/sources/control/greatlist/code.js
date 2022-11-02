"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.client = 0;
        this.clientWidth = 0;
        this.length = 0;
        this.offset = 0;
        this.valueData = -1;
        this.shiftStart = 0;
        this.needResetOffsetOfShiftStartPos = false;
        this.selectValues = [];
        this.beforeSelectValues = [];
        this.isSelectStart = false;
        this.props = {
            'same': false,
            'disabled': false,
            'must': true,
            'multi': false,
            'selection': false,
            'scroll': 'auto',
            'data': [],
            'modelValue': -1
        };
    }
    get isSame() {
        return clickgo.tool.getBoolean(this.props.same);
    }
    get isSelection() {
        return clickgo.tool.getBoolean(this.props.selection);
    }
    get isDisabled() {
        return clickgo.tool.getBoolean(this.props.disabled);
    }
    get isMust() {
        return clickgo.tool.getBoolean(this.props.must);
    }
    get isMulti() {
        return clickgo.tool.getBoolean(this.props.multi);
    }
    get isSelected() {
        return (value) => {
            return typeof this.valueData === 'number' ? (this.valueData === value) : this.valueData.includes(value);
        };
    }
    onItemsPosChange() {
        if (!this.needResetOffsetOfShiftStartPos) {
            return;
        }
        this.needResetOffsetOfShiftStartPos = false;
        this.resetOffsetOfShiftStartPos();
    }
    resetOffsetOfShiftStartPos(pos) {
        var _a;
        if (!pos) {
            pos = (_a = this.refs.view) === null || _a === void 0 ? void 0 : _a.getPos(this.shiftStart);
        }
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
    }
    checkValue() {
        var _a, _b, _c, _d, _e, _f;
        let change = false;
        const notDisabledIndex = this.getFirstNotDisabledDataIndex();
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
        const dataMaxIndex = this.props.data.length - 1;
        if (typeof this.valueData !== 'number') {
            for (let i = 0; i < this.valueData.length; ++i) {
                if (((this.valueData[i] > 0) && (this.valueData[i] > dataMaxIndex)) ||
                    (((_b = this.props.data[this.valueData[i]]) === null || _b === void 0 ? void 0 : _b.disabled) || (((_c = this.props.data[this.valueData[i]]) === null || _c === void 0 ? void 0 : _c.control) === 'split'))) {
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
                (((_e = this.props.data[this.valueData]) === null || _e === void 0 ? void 0 : _e.disabled) || (((_f = this.props.data[this.valueData]) === null || _f === void 0 ? void 0 : _f.control) === 'split'))) {
                change = true;
                if (this.shiftStart === this.valueData) {
                    this.shiftStart = notDisabledIndex;
                }
                this.valueData = this.isMust ? notDisabledIndex : -1;
            }
        }
        if (change) {
            this.emit('update:modelValue', this.valueData);
        }
    }
    select(value, shift = false, ctrl = false) {
        let change = false;
        if (value < -1) {
            value = -1;
        }
        if (this.isMust && value === -1) {
            value = 0;
        }
        const canSelect = (i) => {
            if (this.props.data[i].disabled || (this.props.data[i].control === 'split')) {
                return false;
            }
            return true;
        };
        if (typeof this.valueData !== 'number') {
            if (!shift && !ctrl) {
                if (value === -1) {
                    if (this.valueData.length > 0) {
                        change = true;
                        this.valueData = [];
                    }
                }
                else {
                    if (this.valueData.length > 1 || this.valueData.length === 0) {
                        if (canSelect(value)) {
                            change = true;
                            this.valueData = [value];
                            this.shiftStart = value;
                        }
                    }
                    else {
                        if (this.valueData[0] !== value) {
                            if (canSelect(value)) {
                                change = true;
                                this.valueData = [value];
                                this.shiftStart = value;
                            }
                        }
                    }
                }
            }
            else {
                if (value === -1) {
                }
                else {
                    if (shift) {
                        const valueData = [];
                        if (value > this.shiftStart) {
                            for (let k = this.shiftStart; k <= value; ++k) {
                                if (!canSelect(k)) {
                                    continue;
                                }
                                change = true;
                                valueData.push(k);
                            }
                        }
                        else {
                            for (let k = this.shiftStart; k >= value; --k) {
                                if (!canSelect(k)) {
                                    continue;
                                }
                                change = true;
                                valueData.push(k);
                            }
                        }
                        if ((valueData.length !== this.valueData.length)
                            || !valueData.every((item) => this.valueData.includes(item))) {
                            change = true;
                            this.valueData = valueData;
                        }
                    }
                    else {
                        const indexOf = this.valueData.indexOf(value);
                        if (indexOf > -1) {
                            if (!this.isMust || (this.valueData.length > 1)) {
                                change = true;
                                this.valueData.splice(indexOf, 1);
                                this.shiftStart = value;
                            }
                        }
                        else {
                            if (canSelect(value)) {
                                change = true;
                                this.valueData.push(value);
                                this.shiftStart = value;
                            }
                        }
                    }
                }
            }
        }
        else {
            if (this.valueData !== value) {
                if (value === -1) {
                    change = true;
                    this.valueData = -1;
                    this.shiftStart = 0;
                }
                else if (canSelect(value)) {
                    change = true;
                    this.valueData = value;
                    this.shiftStart = value;
                }
            }
        }
        if (change) {
            this.emit('update:modelValue', this.valueData);
        }
    }
    innerDown(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.refs.inner.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
        }
        this.isSelectStart = false;
        console.log('TODO', this.isSelectStart);
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.refs.inner, this.refs.pop, e);
            });
        }
    }
    context(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.refs.inner, this.refs.pop, e);
    }
    click(e) {
        if (this.isSelection && this.isSelectStart) {
            return;
        }
        if (!this.isMust) {
            const gi = clickgo.dom.findParentByData(e.target, 'cg-control-greatlist-item');
            if (!gi) {
                this.select(-1, e.shiftKey, e.ctrlKey);
            }
        }
    }
    keydown(e) {
        if ((e.key === 'ArrowDown') || (e.key === 'ArrowUp')) {
            e.preventDefault();
            let nvalue = -1;
            if (typeof this.valueData !== 'number') {
                if (this.valueData.length > 0) {
                    if (e.key === 'ArrowDown') {
                        for (const i of this.valueData) {
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
                        for (const i of this.valueData) {
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
                    if (!this.props.data[i]) {
                        continue;
                    }
                    if (this.props.data[i].disabled) {
                        continue;
                    }
                    if (this.props.data[i].control === 'split') {
                        continue;
                    }
                    this.select(i);
                    break;
                }
            }
            else {
                if (nvalue === this.props.data.length - 1) {
                    return;
                }
                for (let i = nvalue + 1; i < this.props.data.length; ++i) {
                    if (!this.props.data[i]) {
                        continue;
                    }
                    if (this.props.data[i].disabled) {
                        continue;
                    }
                    if (this.props.data[i].control === 'split') {
                        continue;
                    }
                    this.select(i);
                    break;
                }
            }
        }
    }
    itemContext(e, value) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.isSelected(value)) {
            return;
        }
        this.select(value, e.shiftKey, e.ctrlKey);
    }
    itemTouch(e, value) {
        clickgo.dom.bindLong(e, () => {
            if (this.isSelected(value)) {
                return;
            }
            this.select(value, e.shiftKey, this.isMulti ? true : e.ctrlKey);
        });
    }
    itemClick(e, value) {
        if (this.isSelection && this.isSelectStart) {
            return;
        }
        e.stopPropagation();
        const hasTouch = clickgo.dom.hasTouchButMouse(e);
        this.select(value, e.shiftKey, (hasTouch && this.isMulti) ? true : e.ctrlKey);
        this.emit('itemclick', e, false);
    }
    arrowClick(e, value) {
        e.stopPropagation();
        const hasTouch = clickgo.dom.hasTouchButMouse(e);
        this.select(value, e.shiftKey, (hasTouch && this.isMulti) ? true : e.ctrlKey);
        const current = e.currentTarget;
        if (current.dataset.cgPopOpen === undefined) {
            clickgo.form.showPop(current, this.refs.itempop, e);
        }
        else {
            clickgo.form.hidePop(current);
        }
        this.emit('itemclick', e, true);
    }
    getFirstNotDisabledDataIndex() {
        let notDisabledIndex = 0;
        for (let i = 0; i < this.props.data.length; ++i) {
            if (this.props.data[i].disabled) {
                continue;
            }
            notDisabledIndex = i;
            break;
        }
        return notDisabledIndex;
    }
    onBeforeSelect() {
        this.isSelectStart = true;
        this.selectValues = [];
        this.beforeSelectValues = typeof this.valueData !== 'number' ? this.valueData : (this.valueData > 0 ? [this.valueData] : []);
    }
    onSelect(area) {
        if (this.isMulti) {
            if (area.shift || area.ctrl) {
                if (area.start === -1) {
                    for (const item of this.selectValues) {
                        this.select(item, false, true);
                    }
                    this.selectValues = [];
                }
                else if (area.shift) {
                    for (let i = area.start; i <= area.end; ++i) {
                        if (this.selectValues.includes(i)) {
                            continue;
                        }
                        if (this.beforeSelectValues.includes(i)) {
                            continue;
                        }
                        this.selectValues.push(i);
                        this.select(i, false, true);
                    }
                    for (let i = 0; i < this.selectValues.length; ++i) {
                        if (this.selectValues[i] >= area.start && this.selectValues[i] <= area.end) {
                            continue;
                        }
                        this.select(this.selectValues[i], false, true);
                        this.selectValues.splice(i, 1);
                        --i;
                    }
                }
                else {
                    for (let i = area.start; i <= area.end; ++i) {
                        if (this.selectValues.includes(i)) {
                            continue;
                        }
                        if (this.beforeSelectValues.includes(i)) {
                            this.selectValues.push(i);
                            this.select(i, false, true);
                            continue;
                        }
                        this.selectValues.push(i);
                        this.select(i, false, true);
                    }
                    for (let i = 0; i < this.selectValues.length; ++i) {
                        if (this.selectValues[i] >= area.start && this.selectValues[i] <= area.end) {
                            continue;
                        }
                        this.select(this.selectValues[i], false, true);
                        this.selectValues.splice(i, 1);
                        --i;
                    }
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
        this.emit('select', area);
    }
    onAfterSelect() {
    }
    onMounted() {
        this.watch('data', (n, o) => {
            if (o.length === 0 && n.length > 0) {
                this.valueData = this.props.modelValue;
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
        }, {
            'deep': true
        });
        this.watch('modelValue', (n, o) => {
            var _a, _b;
            if (Array.isArray(n) && Array.isArray(o)) {
                if (n.length === 0 && o.length === 0) {
                    return;
                }
            }
            if (typeof this.props.modelValue !== 'number') {
                if (typeof this.valueData === 'number') {
                    this.valueData = this.props.modelValue;
                    this.shiftStart = (_a = this.valueData[0]) !== null && _a !== void 0 ? _a : 0;
                }
                else {
                    if ((this.valueData.length === this.props.modelValue.length)
                        && this.valueData.every((ele) => this.props.modelValue.includes(ele))) {
                        return;
                    }
                    this.valueData = this.props.modelValue;
                    this.shiftStart = (_b = this.valueData[0]) !== null && _b !== void 0 ? _b : 0;
                }
            }
            else {
                if (typeof this.valueData !== 'number') {
                    this.valueData = this.props.modelValue;
                    this.shiftStart = this.valueData === -1 ? 0 : this.valueData;
                }
                else {
                    if (this.valueData === this.props.modelValue) {
                        return;
                    }
                    this.valueData = this.props.modelValue;
                    this.shiftStart = this.valueData;
                }
            }
            this.checkValue();
        }, {
            'deep': true,
            'immediate': true
        });
        this.watch('must', () => {
            this.checkValue();
        });
        this.watch('multi', () => {
            this.checkValue();
        });
        this.watch('shiftStart', () => {
            var _a;
            if (this.isSelectStart) {
                return;
            }
            const pos = (_a = this.refs.view) === null || _a === void 0 ? void 0 : _a.getPos(this.shiftStart);
            if (pos) {
                this.resetOffsetOfShiftStartPos(pos);
            }
            else {
                this.needResetOffsetOfShiftStartPos = true;
            }
        });
        this.checkValue();
    }
}
exports.default = default_1;
