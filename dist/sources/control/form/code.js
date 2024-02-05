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
        this.emits = {
            'max': null,
            'min': null,
            'close': null
        };
        this.props = {
            'icon': '',
            'title': 'title',
            'min': true,
            'max': true,
            'close': true,
            'resize': true,
            'move': true,
            'loading': false,
            'minWidth': 200,
            'minHeight': 100,
            'border': 'normal',
            'background': '',
            'padding': '',
            'direction': 'h',
            'stateMin': false,
            'stateMax': false,
            'width': 300,
            'height': 200,
            'left': -1,
            'top': -1,
        };
        this.stateMinData = false;
        this.stateMaxData = false;
        this.widthData = 0;
        this.heightData = 0;
        this.leftData = 0;
        this.topData = 0;
        this.isShow = false;
        this.iconDataUrl = '';
        this.zIndex = 0;
        this.stateAbs = '';
        this.historyLocation = {
            'width': 0,
            'height': 0,
            'left': 0,
            'top': 0
        };
        this.flashTimer = undefined;
        this.isInside = false;
        this.isNativeSync = false;
        this.stepData = [];
        this.stepValue = '';
        this.stepShowData = false;
    }
    get isMin() {
        return clickgo.tool.getBoolean(this.props.min);
    }
    get isMax() {
        return clickgo.tool.getBoolean(this.props.max);
    }
    get isClose() {
        return clickgo.tool.getBoolean(this.props.close);
    }
    get isResize() {
        return this.isNativeSync ? false : clickgo.tool.getBoolean(this.props.resize);
    }
    get isMove() {
        return clickgo.tool.getBoolean(this.props.move);
    }
    get isLoading() {
        return this.isInside ? clickgo.tool.getBoolean(this.props.loading) : this.parent.loading;
    }
    get isStateMax() {
        return clickgo.tool.getBoolean(this.props.stateMax);
    }
    get isStateMin() {
        return clickgo.tool.getBoolean(this.props.stateMin);
    }
    get taskPosition() {
        return clickgo.task.systemTaskInfo.taskId === 0 ? 'bottom' : clickgo.core.config['task.position'];
    }
    get isMask() {
        if (this.isInside) {
            return false;
        }
        return this.rootForm.isMask;
    }
    moveMethod(e, custom = false) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.isMove && !custom) {
            return;
        }
        if (this.isInside) {
            return;
        }
        clickgo.dom.bindDblClick(e, () => {
            if (this.stateAbs) {
                this.maxVMethod();
            }
            else {
                if (this.propBoolean('max')) {
                    this.maxMethod();
                }
            }
        });
        let isBorder = '';
        clickgo.dom.bindMove(e, {
            'start': (x, y) => {
                if (this.stateMaxData) {
                    const event = {
                        'detail': {
                            'event': e,
                            'action': 'move',
                            'max': true,
                            'history': {
                                'width': this.historyLocation.width,
                                'height': this.historyLocation.height,
                                'left': this.historyLocation.left,
                                'top': this.historyLocation.top
                            }
                        }
                    };
                    this.emit('max', event);
                    this.element.removeAttribute('data-cg-max');
                    this.stateMaxData = false;
                    this.emit('update:stateMax', false);
                    const olx = x - this.leftData;
                    const orx = this.leftData + this.widthData - x;
                    const w2 = this.historyLocation.width / 2;
                    if (olx <= w2) {
                        this.leftData = x - olx;
                    }
                    else if (orx <= w2) {
                        this.leftData = x - (this.historyLocation.width - orx);
                    }
                    else {
                        this.leftData = x - w2;
                    }
                    this.emit('update:left', this.leftData);
                    const oty = y - this.topData;
                    const oby = this.topData + this.heightData - y;
                    const h2 = this.historyLocation.height / 2;
                    if (oty <= h2) {
                        this.topData = y - oty;
                    }
                    else if (oby <= h2) {
                        this.topData = y - (this.historyLocation.height - oby);
                    }
                    else {
                        this.topData = y - h2;
                    }
                    this.emit('update:top', this.topData);
                    if (!this.propInt('width')) {
                        this.widthData = 0;
                    }
                    else {
                        this.widthData = this.historyLocation.width;
                        this.emit('update:width', this.historyLocation.width);
                    }
                    if (!this.propInt('height')) {
                        this.heightData = 0;
                    }
                    else {
                        this.heightData = this.historyLocation.height;
                        this.emit('update:height', this.historyLocation.height);
                    }
                }
                else if (this.stateAbs) {
                    this.stateAbs = '';
                    const olx = x - this.leftData;
                    const orx = this.leftData + this.widthData - x;
                    const hW2 = this.historyLocation.width / 2;
                    if (olx <= hW2) {
                        this.leftData = x - olx;
                    }
                    else if (orx <= hW2) {
                        this.leftData = x - (this.historyLocation.width - orx);
                    }
                    else {
                        this.leftData = x - hW2;
                    }
                    this.emit('update:left', this.leftData);
                    const oty = y - this.topData;
                    const oby = this.topData + this.heightData - y;
                    const hH2 = this.historyLocation.height / 2;
                    if (oty <= hH2) {
                        this.topData = y - oty;
                    }
                    else if (oby <= hH2) {
                        this.topData = y - (this.historyLocation.height - oby);
                    }
                    else {
                        this.topData = y - hH2;
                    }
                    this.emit('update:top', this.topData);
                    if (!this.propInt('width')) {
                        this.widthData = 0;
                    }
                    else {
                        this.widthData = this.historyLocation.width;
                        this.emit('update:width', this.historyLocation.width);
                    }
                    if (!this.propInt('height')) {
                        this.heightData = 0;
                    }
                    else {
                        this.heightData = this.historyLocation.height;
                        this.emit('update:height', this.historyLocation.height);
                    }
                }
                else if (!this.stateMinData) {
                    this.historyLocation = {
                        'width': this.widthData || this.element.offsetWidth,
                        'height': this.heightData || this.element.offsetHeight,
                        'left': this.leftData,
                        'top': this.topData
                    };
                }
            },
            'move': (e, o) => {
                this.leftData += o.ox;
                this.emit('update:left', this.leftData);
                this.topData += o.oy;
                this.emit('update:top', this.topData);
                if (o.border !== '') {
                    if ((o.border === 't' && this.isMax) || (o.border !== 't' && this.isResize)) {
                        if (isBorder === '') {
                            isBorder = o.border;
                            clickgo.form.showCircular(o.x, o.y);
                            clickgo.form.showRectangle(o.x, o.y, o.border);
                        }
                        else {
                            isBorder = o.border;
                            clickgo.form.moveRectangle(o.border);
                        }
                    }
                    else {
                        if (isBorder !== '') {
                            isBorder = '';
                            clickgo.form.hideRectangle();
                        }
                    }
                }
                else {
                    if (isBorder !== '') {
                        isBorder = '';
                        clickgo.form.hideRectangle();
                    }
                }
            },
            'end': () => {
                if (isBorder !== '') {
                    if (isBorder === 't') {
                        if (this.isMax) {
                            this.widthData = !this.propInt('width') ? 0 : this.historyLocation.width;
                            this.heightData = !this.propInt('height') ? 0 : this.historyLocation.height;
                            this.leftData = this.historyLocation.left;
                            this.topData = this.historyLocation.top;
                            this.maxMethod();
                        }
                    }
                    else {
                        if (this.isResize) {
                            this.stateAbs = isBorder;
                            const pos = clickgo.form.getRectByBorder(isBorder);
                            this.widthData = pos.width;
                            if (this.propInt('width') > 0) {
                                this.emit('update:width', this.widthData);
                            }
                            this.heightData = pos.height;
                            if (this.propInt('height') > 0) {
                                this.emit('update:height', this.heightData);
                            }
                            this.leftData = pos.left;
                            this.emit('update:left', this.leftData);
                            this.topData = pos.top;
                            this.emit('update:top', this.topData);
                        }
                    }
                    clickgo.form.hideRectangle();
                }
            }
        });
    }
    minMethod(e) {
        if (this.isInside) {
            return true;
        }
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            }
        };
        if (!this.stateMinData) {
            const event = {
                'detail': {
                    'event': e !== null && e !== void 0 ? e : null,
                    'action': e ? 'click' : 'method',
                    'min': false,
                    'history': null
                }
            };
            this.emit('min', event);
            if (clickgo.isNative() && (this.formId === 1) && !clickgo.hasFrame()) {
                clickgo.native.min();
            }
            else {
                this.element.dataset.cgMin = '';
                this.stateMinData = true;
                this.emit('update:stateMin', true);
                if (this.formFocus) {
                    const formId = clickgo.form.getMaxZIndexID({
                        'formIds': [this.formId]
                    });
                    clickgo.tool.sleep(100).then(() => {
                        if (formId) {
                            clickgo.form.changeFocus(formId);
                        }
                        else {
                            clickgo.form.changeFocus();
                        }
                    }).catch((e) => { throw e; });
                }
            }
        }
        else {
            const event = {
                'detail': {
                    'event': e !== null && e !== void 0 ? e : null,
                    'action': e ? 'click' : 'method',
                    'min': true,
                    'history': {
                        'width': this.historyLocation.width,
                        'height': this.historyLocation.height,
                        'left': this.historyLocation.left,
                        'top': this.historyLocation.top
                    }
                }
            };
            this.emit('min', event);
            this.element.removeAttribute('data-cg-min');
            this.stateMinData = false;
            this.emit('update:stateMin', false);
        }
        this.trigger('formStateMinChanged', this.stateMinData);
        return true;
    }
    maxVMethod() {
        if (this.isInside) {
            return;
        }
        if (this.stateAbs) {
            this.stateAbs = '';
            this.topData = this.historyLocation.top;
            this.emit('update:top', this.topData);
            if (!this.propInt('height')) {
                this.heightData = 0;
            }
            else {
                this.heightData = this.historyLocation.height;
                this.emit('update:height', this.heightData);
            }
        }
        else {
            this.stateAbs = 'l';
            this.historyLocation = {
                'width': this.widthData || this.element.offsetWidth,
                'height': this.heightData || this.element.offsetHeight,
                'left': this.leftData,
                'top': this.topData
            };
            const area = clickgo.core.getAvailArea();
            this.topData = area.top;
            this.emit('update:top', this.topData);
            this.heightData = area.height;
            if (this.propInt('height')) {
                this.emit('update:height', this.heightData);
            }
        }
    }
    maxMethod(e) {
        if (this.isInside) {
            return true;
        }
        if (this.stateMinData) {
            if (!this.minMethod()) {
                return false;
            }
        }
        if (!this.stateMaxData) {
            const event = {
                'detail': {
                    'event': e !== null && e !== void 0 ? e : null,
                    'action': e ? 'click' : 'move',
                    'max': false,
                    'history': null
                }
            };
            this.emit('max', event);
            if (this.stateAbs) {
                this.stateAbs = '';
            }
            else {
                this.historyLocation = {
                    'width': this.widthData || this.element.offsetWidth,
                    'height': this.heightData || this.element.offsetHeight,
                    'left': this.leftData,
                    'top': this.topData
                };
            }
            if (this.isNativeSync) {
                clickgo.native.max();
            }
            else {
                this.element.dataset.cgMax = '';
                this.stateMaxData = true;
                this.emit('update:stateMax', true);
            }
            if (!this.isNativeSync) {
                this.element.style.transition = 'all .1s linear';
                this.element.style.transitionProperty = 'left,top,width,height';
                clickgo.tool.sleep(150).then(() => {
                    this.element.style.transition = '';
                }).catch((e) => { console.log(e); });
            }
            const area = clickgo.core.getAvailArea();
            if (this.rootForm.bottomMost) {
                this.leftData = 0;
                this.topData = 0;
                this.widthData = area.owidth;
                this.heightData = area.oheight;
            }
            else {
                this.leftData = area.left;
                this.topData = area.top;
                this.widthData = area.width;
                this.heightData = area.height;
            }
            this.emit('update:left', this.leftData);
            this.emit('update:top', this.topData);
            if (this.propInt('width') > 0) {
                this.emit('update:width', this.widthData);
            }
            if (this.propInt('height') > 0) {
                this.emit('update:height', this.heightData);
            }
        }
        else {
            const event = {
                'detail': {
                    'event': e !== null && e !== void 0 ? e : null,
                    'action': e ? 'click' : 'move',
                    'max': true,
                    'history': {
                        'height': this.historyLocation.height,
                        'left': this.historyLocation.left,
                        'top': this.historyLocation.top,
                        'width': this.historyLocation.width
                    }
                }
            };
            this.emit('max', event);
            if (this.isNativeSync) {
                clickgo.native.restore();
            }
            else {
                this.element.removeAttribute('data-cg-max');
                this.stateMaxData = false;
                this.emit('update:stateMax', false);
                this.element.style.transition = 'all .1s linear';
                this.element.style.transitionProperty = 'left,top,width,height';
            }
            if (!this.propInt('width')) {
                this.widthData = 0;
            }
            else {
                this.widthData = this.historyLocation.width;
                this.emit('update:width', this.historyLocation.width);
            }
            if (!this.propInt('height')) {
                this.heightData = 0;
            }
            else {
                this.heightData = this.historyLocation.height;
                this.emit('update:height', this.historyLocation.height);
            }
            this.leftData = this.historyLocation.left;
            this.emit('update:left', this.historyLocation.left);
            this.topData = this.historyLocation.top;
            this.emit('update:top', this.historyLocation.top);
            if (this.isNativeSync) {
                if (clickgo.getPlatform() === 'darwin') {
                    clickgo.native.size(this.widthData, this.heightData);
                }
            }
            else {
                clickgo.tool.sleep(150).then(() => {
                    this.element.style.transition = '';
                }).catch((e) => { console.log(e); });
            }
        }
        this.trigger('formStateMaxChanged', this.stateMaxData);
        return true;
    }
    closeMethod(e) {
        if (this.isInside) {
            return;
        }
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'event': e
            }
        };
        this.emit('close', event);
        if (event.go) {
            clickgo.form.close(this.formId);
        }
    }
    resizeMethod(e, border) {
        if (this.stateMaxData) {
            return;
        }
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        let isBorder = '';
        let top = this.topData;
        let left = this.leftData;
        let height = this.heightData || this.element.offsetHeight;
        let width = this.widthData || this.element.offsetWidth;
        if (this.stateAbs) {
        }
        else {
            this.historyLocation = {
                'width': width,
                'height': height,
                'left': this.leftData,
                'top': this.topData
            };
        }
        clickgo.dom.bindResize(e, {
            'objectLeft': left,
            'objectTop': top,
            'objectWidth': width,
            'objectHeight': height,
            'minWidth': this.propInt('minWidth'),
            'minHeight': this.propInt('minHeight'),
            'border': border,
            'start': () => {
            },
            'move': (left, top, width, height, x, y, nborder) => {
                this.leftData = left;
                this.emit('update:left', left);
                this.topData = top;
                this.emit('update:top', top);
                this.widthData = width;
                this.emit('update:width', width);
                this.heightData = height;
                this.emit('update:height', height);
                if (nborder !== '') {
                    if (((border === 'lt' || border === 't' || border === 'tr') && (nborder === 'lt' || nborder === 't' || nborder === 'tr')) ||
                        ((border === 'bl' || border === 'b' || border === 'rb') && (nborder === 'bl' || nborder === 'b' || nborder === 'rb'))) {
                        if (isBorder === '') {
                            isBorder = nborder;
                            if (!this.stateAbs) {
                                clickgo.form.showCircular(x, y);
                                clickgo.form.showRectangle(x, y, {
                                    'left': left,
                                    'width': width
                                });
                            }
                        }
                        else {
                            isBorder = nborder;
                            if (!this.stateAbs) {
                                clickgo.form.moveRectangle({
                                    'left': left,
                                    'width': width
                                });
                            }
                        }
                    }
                    else {
                        if (isBorder !== '') {
                            isBorder = '';
                            clickgo.form.hideRectangle();
                        }
                    }
                }
                else {
                    if (isBorder !== '') {
                        isBorder = '';
                        clickgo.form.hideRectangle();
                    }
                }
            },
            'end': () => {
                if (!isBorder) {
                    return;
                }
                if (this.stateAbs) {
                    return;
                }
                if (isBorder === 'l' || isBorder === 'r') {
                    return;
                }
                const area = clickgo.core.getAvailArea();
                this.stateAbs = 'l';
                this.heightData = area.height;
                this.emit('update:height', this.heightData);
                this.topData = area.top;
                this.emit('update:top', this.topData);
                clickgo.form.hideRectangle();
            }
        });
        if (border === 't' || border === 'b') {
            clickgo.dom.bindDblClick(e, () => {
                this.maxVMethod();
            });
        }
    }
    setPropData(name, val, mode = '') {
        switch (name) {
            case 'left': {
                switch (mode) {
                    case '': {
                        this.leftData = val;
                        break;
                    }
                    case '+': {
                        this.leftData += val;
                        break;
                    }
                    default: {
                        this.leftData -= val;
                    }
                }
                this.emit('update:left', this.leftData);
                break;
            }
            case 'top': {
                switch (mode) {
                    case '': {
                        this.topData = val;
                        break;
                    }
                    case '+': {
                        this.topData += val;
                        break;
                    }
                    default: {
                        this.topData -= val;
                    }
                }
                this.emit('update:top', this.topData);
                break;
            }
            case 'width': {
                if (!val) {
                    this.widthData = 0;
                    this.emit('update:width', 0);
                }
                else {
                    switch (mode) {
                        case '': {
                            this.widthData = val;
                            break;
                        }
                        case '+': {
                            this.widthData += val;
                            break;
                        }
                        default: {
                            this.widthData -= val;
                        }
                    }
                    this.emit('update:width', this.widthData);
                }
                break;
            }
            case 'height': {
                if (!val) {
                    this.heightData = 0;
                    this.emit('update:height', 0);
                }
                else {
                    if (typeof val !== 'number') {
                        break;
                    }
                    switch (mode) {
                        case '': {
                            this.heightData = val;
                            break;
                        }
                        case '+': {
                            this.heightData += val;
                            break;
                        }
                        default: {
                            this.heightData -= val;
                        }
                    }
                    this.emit('update:height', this.heightData);
                }
                break;
            }
        }
    }
    stepHide() {
        this.stepShowData = false;
    }
    stepShow() {
        this.refs.step.style.top = (this.refs.content.offsetHeight / 10 * 9 - this.refs.step.offsetHeight).toString() + 'px';
        this.refs.step.style.left = ((this.refs.content.offsetWidth - this.refs.step.offsetWidth) / 2).toString() + 'px';
        this.stepShowData = true;
    }
    stepDone() {
        return __awaiter(this, void 0, void 0, function* () {
            this.stepValue = '#';
            yield clickgo.tool.sleep(500);
            this.stepShowData = false;
        });
    }
    stepDown(e) {
        clickgo.dom.bindMove(e, {
            'areaObject': this.refs.content,
            'object': this.refs.step,
            move: (e, o) => {
                this.refs.step.style.left = (parseFloat(this.refs.step.style.left) + o.ox).toString() + 'px';
                this.refs.step.style.top = (parseFloat(this.refs.step.style.top) + o.oy).toString() + 'px';
            }
        });
    }
    onMounted() {
        this.watch('icon', () => __awaiter(this, void 0, void 0, function* () {
            if (this.props.icon === '') {
                this.iconDataUrl = '';
            }
            else {
                const icon = yield clickgo.fs.getContent(this.props.icon);
                this.iconDataUrl = (icon instanceof Blob) ? yield clickgo.tool.blob2DataUrl(icon) : '';
            }
            this.trigger('formIconChanged', this.iconDataUrl);
        }));
        this.watch('title', () => {
            this.trigger('formTitleChanged', this.props.title);
        });
        this.watch('isStateMin', () => {
            if (this.isStateMin === this.stateMinData) {
                return;
            }
            this.minMethod();
        });
        this.watch('isStateMax', () => {
            if (this.isStateMax === this.stateMaxData) {
                return;
            }
            this.maxMethod();
        });
        this.watch('isShow', () => {
            this.trigger('formShowChanged', this.isShow);
        });
        this.watch('width', () => {
            if (this.propInt('width') === this.widthData) {
                return;
            }
            this.widthData = this.propInt('width');
            if (!this.propInt('width')) {
                return;
            }
            if (this.widthData < this.propInt('minWidth')) {
                this.widthData = this.propInt('minWidth');
                this.emit('update:width', this.widthData);
            }
        }, {
            'immediate': true
        });
        this.watch('height', () => {
            if (this.propInt('height') === this.heightData) {
                return;
            }
            this.heightData = this.propInt('height');
            if (!this.propInt('height')) {
                return;
            }
            if (this.heightData < this.propInt('minHeight')) {
                this.heightData = this.propInt('minHeight');
                this.emit('update:height', this.heightData);
            }
        }, {
            'immediate': true
        });
        this.watch('left', () => {
            this.leftData = this.propInt('left');
        });
        this.watch('top', () => {
            this.topData = this.propInt('top');
        });
        if (this.parent.controlName === 'root') {
            this.isNativeSync = this.parent.isNativeSync;
            if (this.isNativeSync) {
                clickgo.native.on('maximize', () => {
                    this.element.dataset.cgMax = '';
                    this.stateMaxData = true;
                    this.emit('update:stateMax', true);
                }, false, this.formId);
                clickgo.native.on('unmaximize', () => {
                    this.element.removeAttribute('data-cg-max');
                    this.stateMaxData = false;
                    this.emit('update:stateMax', false);
                }, false, this.formId);
                this.watch('max', () => {
                    clickgo.native.maximizable(this.propBoolean('max'));
                }, {
                    'immediate': true
                });
            }
        }
        if (this.parent.controlName !== 'root') {
            this.isInside = true;
            this.isShow = true;
        }
        if (this.isStateMax) {
            const area = clickgo.core.getAvailArea();
            this.leftData = (area.width - this.widthData) / 2;
            this.topData = (area.height - this.heightData) / 2;
            this.maxMethod();
        }
    }
}
exports.default = default_1;
