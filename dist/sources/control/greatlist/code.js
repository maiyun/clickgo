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
        this.props = {
            'disabled': false,
            'must': true,
            'multi': false,
            'ctrl': true,
            'selection': false,
            'gesture': [],
            'scroll': 'auto',
            'data': [],
            'sizes': {},
            'modelValue': []
        };
        this.client = 0;
        this.length = 0;
        this.offset = 0;
        this.valueData = [];
        this.shiftStart = 0;
        this.selectValues = [];
        this.beforeSelectValues = [];
        this.isSelectStart = false;
    }
    get isSelected() {
        return (value) => {
            return this.valueData.includes(value);
        };
    }
    arrowUp() {
        if (this.shiftStart === 0) {
            return;
        }
        for (let i = this.shiftStart - 1; i >= 0; --i) {
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
    arrowDown() {
        if (this.shiftStart === this.props.data.length - 1) {
            return;
        }
        for (let i = this.shiftStart + 1; i < this.props.data.length; ++i) {
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
    checkValue() {
        var _a, _b, _c;
        if (!this.props.data.length) {
            return;
        }
        let change = false;
        const notDisabledIndex = this.getFirstNotDisabledIndex();
        const dataMaxIndex = this.props.data.length - 1;
        if (!this.propBoolean('multi') && (this.valueData.length > 1)) {
            change = true;
            this.valueData.splice(1);
            this.shiftStart = this.valueData[0];
        }
        for (let i = 0; i < this.valueData.length; ++i) {
            if ((this.valueData[i] > dataMaxIndex) ||
                (((_a = this.props.data[this.valueData[i]]) === null || _a === void 0 ? void 0 : _a.disabled) || (((_b = this.props.data[this.valueData[i]]) === null || _b === void 0 ? void 0 : _b.control) === 'split'))) {
                change = true;
                if (this.shiftStart === this.valueData[i]) {
                    this.shiftStart = i > 0 ? ((_c = this.valueData[0]) !== null && _c !== void 0 ? _c : notDisabledIndex) : notDisabledIndex;
                }
                this.valueData.splice(i, 1);
                --i;
            }
        }
        if (this.propBoolean('must') && (this.valueData.length === 0)) {
            change = true;
            this.valueData = [notDisabledIndex];
            this.shiftStart = this.valueData[0];
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
        if (this.propBoolean('must') && value === -1) {
            return;
        }
        const canSelect = (i) => {
            if (!this.props.data[i] || this.props.data[i].disabled || (this.props.data[i].control === 'split')) {
                return false;
            }
            return true;
        };
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
                            this.valueData[0] = value;
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
                        if (!this.propBoolean('must') || (this.valueData.length > 1)) {
                            change = true;
                            this.valueData.splice(indexOf, 1);
                            this.shiftStart = value;
                        }
                    }
                    else {
                        if (canSelect(value)) {
                            change = true;
                            this.shiftStart = value;
                            if (this.propBoolean('multi')) {
                                this.valueData.push(value);
                            }
                            else {
                                this.valueData = [value];
                            }
                        }
                    }
                }
            }
        }
        if (change) {
            this.emit('update:modelValue', this.valueData);
        }
    }
    arrowClick(e, value) {
        const hasTouch = clickgo.dom.hasTouchButMouse(e);
        this.select(value, e.shiftKey, ((!this.propBoolean('ctrl') || hasTouch) && this.propBoolean('multi')) ? true : e.ctrlKey);
        const current = e.currentTarget;
        if (current.dataset.cgPopOpen === undefined) {
            clickgo.form.showPop(current, this.refs.itempop, e);
        }
        else {
            clickgo.form.hidePop(current);
        }
        this.emit('itemclick', e, true);
    }
    innerClick(e, value) {
        const hasTouch = clickgo.dom.hasTouchButMouse(e);
        this.select(value, e.shiftKey, ((!this.propBoolean('ctrl') || hasTouch) && this.propBoolean('multi')) ? true : e.ctrlKey);
        this.emit('itemclick', e, false);
    }
    down(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.refs.flow.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
        }
        if (!this.propBoolean('must')) {
            const gi = clickgo.dom.findParentByData(e.target, 'cg-size');
            if (!gi) {
                clickgo.dom.bindClick(e, () => {
                    this.select(-1, e.shiftKey, e.ctrlKey);
                });
            }
        }
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.refs.flow.$el, this.refs.pop, e);
            });
        }
    }
    itemTouch(e, value) {
        clickgo.dom.bindLong(e, () => {
            if (this.isSelected(value)) {
                return;
            }
            this.select(value, e.shiftKey, this.propBoolean('multi') ? true : e.ctrlKey);
        });
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
    context(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.refs.flow.$el, this.refs.pop, e);
    }
    keydown(e) {
        if ((e.key !== 'ArrowDown') && (e.key !== 'ArrowUp')) {
            return;
        }
        e.preventDefault();
        if (e.key === 'ArrowUp') {
            this.arrowUp();
        }
        else {
            this.arrowDown();
        }
    }
    getFirstNotDisabledIndex() {
        let notDisabledIndex = 0;
        for (let i = 0; i < this.props.data.length; ++i) {
            if (this.props.data[i].disabled) {
                continue;
            }
            if (this.props.data[i].control === 'split') {
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
        this.emit('beforeselect');
    }
    onSelect(area) {
        if (this.propBoolean('multi')) {
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
        this.isSelectStart = false;
        this.emit('afterselect');
    }
    onMounted() {
        this.watch('must', () => {
            if (this.propBoolean('must') && (this.valueData.length === 0)) {
                if (this.props.data[this.shiftStart] &&
                    !this.props.data[this.shiftStart].disabled &&
                    (this.props.data[this.shiftStart].control !== 'split')) {
                    this.valueData = [this.shiftStart];
                }
                else {
                    const notDisabledIndex = this.getFirstNotDisabledIndex();
                    this.valueData = [notDisabledIndex];
                    this.shiftStart = this.valueData[0];
                }
                this.emit('update:modelValue', this.valueData);
            }
        });
        this.watch('multi', () => {
            if (!this.propBoolean('multi') && (this.valueData.length > 1)) {
                this.valueData.splice(1);
                this.shiftStart = this.valueData[0];
                this.emit('update:modelValue', this.valueData);
            }
        });
        this.watch('shiftStart', () => {
            const cb = (count = 0) => {
                if (this.isSelectStart) {
                    return;
                }
                const pos = this.refs.flow.getPos(this.shiftStart);
                if (!pos) {
                    if (count === 0) {
                        clickgo.task.sleep(() => {
                            cb(count + 1);
                        }, 50);
                    }
                    return;
                }
                if (pos.start < this.offset) {
                    this.offset = pos.start;
                    return;
                }
                if (pos.end > this.offset + this.client) {
                    this.offset = pos.end - this.client;
                }
            };
            cb();
        });
        this.watch('data', () => {
            this.checkValue();
        }, {
            'deep': true
        });
        this.watch('modelValue', () => {
            if ((this.valueData.length === this.props.modelValue.length)
                && this.valueData.every((item) => this.props.modelValue.includes(item))) {
                return;
            }
            this.valueData = this.props.modelValue;
            if (this.valueData[0] !== undefined) {
                this.shiftStart = this.valueData[0];
            }
            this.checkValue();
        });
        this.valueData = this.props.modelValue;
        if (this.valueData[0]) {
            this.shiftStart = this.valueData[0];
        }
        this.checkValue();
    }
}
exports.default = default_1;
