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
        this.props = {
            'disabled': false,
            'must': false,
            'multi': true,
            'ctrl': true,
            'selection': true,
            'gesture': [],
            'scroll': 'auto',
            'size': 100,
            'name': true,
            'data': [],
            'modelValue': []
        };
        this.rand = '';
        this.focus = false;
        this.client = 0;
        this.length = 0;
        this.offset = 0;
        this.cw = 0;
        this.valueData = [];
        this.shiftStart = 0;
        this.selectValues = [];
        this.beforeSelectValues = [];
        this.isSelectStart = false;
        this.scrollShow = true;
        this.rowCount = 1;
        this.iconsData = [];
        this.dataCount = 0;
    }
    get isSelected() {
        return (value) => {
            return this.valueData.includes(value);
        };
    }
    get timeFormat() {
        return (time) => {
            const d = new Date(time * 1000);
            return (this.propInt('size') >= 128 ? d.getFullYear().toString() + '-' : '') +
                (d.getMonth() + 1).toString().padStart(2, '0') + '-' +
                d.getDate().toString().padStart(2, '0') + ' ' +
                d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
        };
    }
    get dataComp() {
        this.rowCount = Math.floor(this.cw / (this.propInt('size') + 80));
        if (this.rowCount < 1) {
            this.rowCount = 1;
        }
        const data = [];
        let rowNow = this.rowCount;
        const propData = clickgo.tool.clone(this.props.data);
        for (const item of propData) {
            ++rowNow;
            if (rowNow === this.rowCount + 1) {
                rowNow = 1;
                data.push([]);
            }
            if (item.type === undefined) {
                item.type = 1;
            }
            data[data.length - 1].push(item);
        }
        const remain = this.rowCount - rowNow;
        if (remain > 0) {
            for (let i = 0; i < remain; ++i) {
                data[data.length - 1].push({
                    'type': -1
                });
            }
        }
        return data;
    }
    get getIconData() {
        return (path) => {
            var _a;
            const pre = path.slice(0, 6).toLowerCase();
            if (pre === 'file:/') {
                return path;
            }
            if (pre === 'http:/' || pre === 'https:' || pre.startsWith('data:')) {
                return path;
            }
            return (_a = this.iconsData[path]) !== null && _a !== void 0 ? _a : '';
        };
    }
    arrowUp() {
        if (this.shiftStart === 0) {
            return;
        }
        const row = Math.ceil((this.shiftStart + 1) / this.rowCount) - 1;
        const rowNow = this.shiftStart % this.rowCount;
        if (row === 0) {
            return;
        }
        const prevRowCount = (row - 1) * this.rowCount;
        this.select(prevRowCount + rowNow);
    }
    arrowDown() {
        if (this.shiftStart === this.props.data.length - 1) {
            return;
        }
        const row = Math.ceil((this.shiftStart + 1) / this.rowCount) - 1;
        const rowNow = this.shiftStart % this.rowCount;
        const allRow = Math.ceil(this.props.data.length / this.rowCount) - 1;
        if (row === allRow) {
            return;
        }
        const nowRowCount = (row + 1) * this.rowCount;
        const newRowNow = nowRowCount + rowNow;
        if (!this.props.data[newRowNow]) {
            this.select(this.props.data.length - 1);
            return;
        }
        this.select(newRowNow);
    }
    arrowLeft() {
        if (this.shiftStart === 0) {
            return;
        }
        const rowNow = this.shiftStart % this.rowCount;
        if (rowNow > 0) {
            this.select(this.shiftStart - 1);
            return;
        }
        const row = Math.ceil((this.shiftStart + 1) / this.rowCount) - 1;
        if (row === 0) {
            return;
        }
        this.select(row * this.rowCount - 1);
    }
    arrowRight() {
        if (this.shiftStart === this.props.data.length - 1) {
            return;
        }
        const rowNow = this.shiftStart % this.rowCount;
        if (rowNow < this.rowCount - 1) {
            if (!this.props.data[this.shiftStart + 1]) {
                return;
            }
            this.select(this.shiftStart + 1);
            return;
        }
        const row = Math.ceil((this.shiftStart + 1) / this.rowCount) - 1;
        const allRow = Math.ceil(this.props.data.length / this.rowCount) - 1;
        if (row === allRow) {
            return;
        }
        this.select((row + 1) * this.rowCount);
    }
    checkValue() {
        var _a;
        if (!this.props.data.length) {
            return;
        }
        let change = false;
        const dataMaxIndex = this.props.data.length - 1;
        if (!this.propBoolean('multi') && (this.valueData.length > 1)) {
            change = true;
            this.valueData.splice(1);
            this.shiftStart = this.valueData[0];
        }
        for (let i = 0; i < this.valueData.length; ++i) {
            if (this.valueData[i] > dataMaxIndex) {
                change = true;
                if (this.shiftStart === this.valueData[i]) {
                    this.shiftStart = i > 0 ? ((_a = this.valueData[0]) !== null && _a !== void 0 ? _a : 0) : 0;
                }
                this.valueData.splice(i, 1);
                --i;
            }
        }
        if (this.propBoolean('must') && (this.valueData.length === 0)) {
            change = true;
            this.valueData = [0];
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
            if (!this.props.data[i]) {
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
    down(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.refs.flow.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
        }
        if (!this.propBoolean('must')) {
            if ((e.target.dataset.cgItem === undefined) && !clickgo.dom.findParentByData(e.target, 'cg-item')) {
                clickgo.dom.bindClick(e, () => {
                    this.select(-1, e.shiftKey, e.ctrlKey);
                });
            }
        }
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, () => {
                if (!this.propBoolean('must')) {
                    if ((e.target.dataset.cgItem === undefined) && !clickgo.dom.findParentByData(e.target, 'cg-item')) {
                        this.select(-1);
                    }
                }
                if (this.valueData.length > 0) {
                    clickgo.form.showPop(this.refs.flow.$el, this.refs.itempop, e);
                }
                else {
                    clickgo.form.showPop(this.refs.flow.$el, this.refs.pop, e);
                }
            });
        }
    }
    itemDown(e, dindex, value) {
        const v = dindex * this.rowCount + value;
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, () => {
                if (this.isSelected(v)) {
                    return;
                }
                this.select(value, e.shiftKey, (!this.propBoolean('ctrl') && this.propBoolean('multi')) ? true : e.ctrlKey);
            });
        }
        clickgo.dom.bindClick(e, () => {
            this.select(v, e.shiftKey, (!this.propBoolean('ctrl') && this.propBoolean('multi')) ? true : e.ctrlKey);
            this.emit('itemclick', e);
        });
        clickgo.dom.bindDrag(e, {
            'el': e.currentTarget,
            'start': () => {
                if (!this.isSelected(v)) {
                    this.select(v);
                }
                const list = [];
                for (const v of this.valueData) {
                    list.push({
                        'index': v,
                        'type': this.props.data[v].type,
                        'path': this.props.data[v].path
                    });
                }
                clickgo.dom.setDragData({
                    'rand': this.rand,
                    'type': 'fs',
                    'list': list
                });
            }
        });
        clickgo.dom.bindDblClick(e, () => {
            this.emit('open', [v]);
        });
    }
    itemContext(e, dindex, value) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        const v = dindex * this.rowCount + value;
        if (this.isSelected(v)) {
            return;
        }
        this.select(v, e.shiftKey, e.ctrlKey);
    }
    context(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.propBoolean('must')) {
            if ((e.target.dataset.cgItem === undefined) && !clickgo.dom.findParentByData(e.target, 'cg-item')) {
                this.select(-1);
            }
        }
        if (this.valueData.length > 0) {
            clickgo.form.showPop(this.refs.flow.$el, this.refs.itempop, e);
        }
        else {
            clickgo.form.showPop(this.refs.flow.$el, this.refs.pop, e);
        }
    }
    keydown(e) {
        if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
            return;
        }
        e.preventDefault();
        if (e.key === 'ArrowUp') {
            this.arrowUp();
        }
        else if (e.key === 'ArrowDown') {
            this.arrowDown();
        }
        else if (e.key === 'ArrowLeft') {
            this.arrowLeft();
        }
        else if (e.key === 'ArrowRight') {
            this.arrowRight();
        }
        else {
            if (!this.valueData.length) {
                return;
            }
            this.emit('open', this.valueData);
        }
    }
    drop(e, dindex, index) {
        var _a, _b, _c, _d;
        if (typeof e.detail.value !== 'object') {
            return;
        }
        if (e.detail.value.type !== 'fs') {
            return;
        }
        const list = [];
        for (const item of e.detail.value.list) {
            list.push({
                'index': (_a = item.index) !== null && _a !== void 0 ? _a : 0,
                'type': (_b = item.type) !== null && _b !== void 0 ? _b : -1,
                'path': (_c = item.path) !== null && _c !== void 0 ? _c : ''
            });
        }
        const tov = dindex * this.rowCount + index;
        this.emit('drop', {
            'self': e.detail.value.rand === this.rand ? true : false,
            'from': list,
            'to': {
                'index': tov,
                'type': this.props.data[tov].type,
                'path': (_d = this.props.data[tov].path) !== null && _d !== void 0 ? _d : ''
            }
        });
    }
    onBeforeSelect() {
        this.isSelectStart = true;
        this.selectValues = [];
        this.beforeSelectValues = this.valueData;
        this.emit('beforeselect');
    }
    onSelect(area) {
        const cellw = this.cw / this.rowCount;
        const cellStart = Math.floor(area.x / cellw);
        const cellEnd = Math.floor((area.x + area.width) / cellw);
        if (this.propBoolean('multi')) {
            if (area.shift || area.ctrl) {
                if (area.empty) {
                    for (const item of this.selectValues) {
                        this.select(item, false, true);
                    }
                    this.selectValues = [];
                }
                else if (area.shift) {
                    for (let i = area.start; i <= area.end; ++i) {
                        const before = i * this.rowCount;
                        for (let j = cellStart; j <= cellEnd; ++j) {
                            const v = before + j;
                            if (!this.props.data[v]) {
                                continue;
                            }
                            if (this.selectValues.includes(v)) {
                                continue;
                            }
                            if (this.beforeSelectValues.includes(v)) {
                                continue;
                            }
                            this.selectValues.push(v);
                            this.select(v, false, true);
                        }
                    }
                    for (let i = 0; i < this.selectValues.length; ++i) {
                        const row = Math.ceil((this.selectValues[i] + 1) / this.rowCount) - 1;
                        const rowNow = this.selectValues[i] % this.rowCount;
                        if (row >= area.start && row <= area.end) {
                            if (rowNow >= cellStart && rowNow <= cellEnd) {
                                continue;
                            }
                        }
                        this.select(this.selectValues[i], false, true);
                        this.selectValues.splice(i, 1);
                        --i;
                    }
                }
                else {
                    for (let i = area.start; i <= area.end; ++i) {
                        const before = i * this.rowCount;
                        for (let j = cellStart; j <= cellEnd; ++j) {
                            const v = before + j;
                            if (!this.props.data[v]) {
                                continue;
                            }
                            if (this.selectValues.includes(v)) {
                                continue;
                            }
                            if (this.beforeSelectValues.includes(v)) {
                                this.selectValues.push(v);
                                this.select(v, false, true);
                                continue;
                            }
                            this.selectValues.push(v);
                            this.select(v, false, true);
                        }
                    }
                    for (let i = 0; i < this.selectValues.length; ++i) {
                        const row = Math.ceil((this.selectValues[i] + 1) / this.rowCount) - 1;
                        const rowNow = this.selectValues[i] % this.rowCount;
                        if (row >= area.start && row <= area.end) {
                            if (rowNow >= cellStart && rowNow <= cellEnd) {
                                continue;
                            }
                        }
                        this.select(this.selectValues[i], false, true);
                        this.selectValues.splice(i, 1);
                        --i;
                    }
                }
            }
            else {
                if (!area.empty) {
                    let change = false;
                    for (let i = area.start; i <= area.end; ++i) {
                        const before = i * this.rowCount;
                        for (let j = cellStart; j <= cellEnd; ++j) {
                            const v = before + j;
                            if (!this.props.data[v]) {
                                continue;
                            }
                            if (this.selectValues.includes(v)) {
                                continue;
                            }
                            this.selectValues.push(v);
                            change = true;
                        }
                    }
                    for (let i = 0; i < this.selectValues.length; ++i) {
                        const row = Math.ceil((this.selectValues[i] + 1) / this.rowCount) - 1;
                        const rowNow = this.selectValues[i] % this.rowCount;
                        if (row >= area.start && row <= area.end) {
                            if (rowNow >= cellStart && rowNow <= cellEnd) {
                                continue;
                            }
                        }
                        if (this.propBoolean('must') && this.selectValues.length === 1) {
                            break;
                        }
                        this.selectValues.splice(i, 1);
                        --i;
                        change = true;
                    }
                    if (change) {
                        this.valueData = this.selectValues;
                        this.emit('update:modelValue', this.valueData);
                    }
                    else {
                        if (!this.propBoolean('must') && this.selectValues.length === 0 && this.valueData.length > 0) {
                            this.valueData = [];
                            this.emit('update:modelValue', this.valueData);
                        }
                    }
                }
                else {
                    this.select(-1);
                    this.selectValues.length = 0;
                }
            }
        }
        else {
            if (!area.empty) {
                this.select(area.start * this.rowCount + cellStart, area.shift, area.ctrl);
            }
        }
        this.emit('select', area);
    }
    onAfterSelect() {
        this.isSelectStart = false;
        this.emit('afterselect');
    }
    refreshIconsData() {
        return __awaiter(this, void 0, void 0, function* () {
            const needIcon = [];
            for (const item of this.props.data) {
                if (!item.icon) {
                    continue;
                }
                const pre = item.icon.slice(0, 6).toLowerCase();
                if (pre === 'file:/') {
                    continue;
                }
                if (pre === 'http:/' || pre === 'https:' || pre.startsWith('data:')) {
                    continue;
                }
                needIcon.push(item.icon);
            }
            for (const path in this.iconsData) {
                if (needIcon.includes(path)) {
                    continue;
                }
                delete this.iconsData[path];
            }
            for (const path of needIcon) {
                if (this.iconsData[path] !== undefined) {
                    continue;
                }
                this.iconsData[path] = '';
            }
            const count = ++this.dataCount;
            for (const path in this.iconsData) {
                if (this.iconsData[path]) {
                    continue;
                }
                const apath = clickgo.tool.urlResolve('/package' + this.path + '/', path);
                const blob = yield clickgo.fs.getContent(apath);
                if (count !== this.dataCount) {
                    return;
                }
                if (!blob || typeof blob === 'string') {
                    this.iconsData[path] = '';
                    continue;
                }
                const t = yield clickgo.tool.blob2DataUrl(blob);
                if (count !== this.dataCount) {
                    return;
                }
                if (t) {
                    this.iconsData[path] = t;
                    continue;
                }
                this.iconsData[path] = '';
            }
        });
    }
    onMounted() {
        this.watch('must', () => {
            if (this.propBoolean('must') && (this.valueData.length === 0)) {
                if (this.props.data[this.shiftStart]) {
                    this.valueData = [this.shiftStart];
                }
                else {
                    this.valueData = [0];
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
                const row = Math.ceil((this.shiftStart + 1) / this.rowCount) - 1;
                const pos = this.refs.flow.getPos(row);
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
        this.watch('data', () => __awaiter(this, void 0, void 0, function* () {
            this.checkValue();
            yield this.refreshIconsData();
        }), {
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
        this.refreshIconsData();
        this.rand = clickgo.tool.random(16);
    }
}
exports.default = default_1;
