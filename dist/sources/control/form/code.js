"use strict";
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
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
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
        return clickgo.tool.getBoolean(this.props.loading);
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
    get widthComp() {
        return typeof this.props.width === 'string' ? parseInt(this.props.width) : this.props.width;
    }
    get heightComp() {
        return typeof this.props.height === 'string' ? parseInt(this.props.height) : this.props.height;
    }
    get minWidthComp() {
        return typeof this.props.minWidth === 'string' ? parseInt(this.props.minWidth) : this.props.minWidth;
    }
    get minHeightComp() {
        return typeof this.props.minHeight === 'string' ? parseInt(this.props.minHeight) : this.props.minHeight;
    }
    get leftComp() {
        return typeof this.props.left === 'string' ? parseInt(this.props.left) : this.props.left;
    }
    get topComp() {
        return typeof this.props.top === 'string' ? parseInt(this.props.top) : this.props.top;
    }
    get isMask() {
        var _a;
        if (this.isInside) {
            return false;
        }
        return (_a = this.parentByName('root')) === null || _a === void 0 ? void 0 : _a.isMask;
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
        const el = e.currentTarget;
        const dataHasDbl = el.getAttribute('data-has-dbl');
        if (!dataHasDbl) {
            el.setAttribute('data-has-dbl', 'yes');
            el.addEventListener('dblclick', () => {
                if (this.stateAbs) {
                    this.maxVMethod(true);
                }
                else {
                    if (this.propBoolean('max')) {
                        this.maxMethod();
                    }
                }
            });
        }
        let isBorder = '';
        clickgo.dom.bindMove(e, {
            'start': (x, y) => {
                if (this.stateMaxData) {
                    this.emit('max', e, 0, this.historyLocation);
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
                    if (!this.widthComp) {
                        this.widthData = 0;
                    }
                    else {
                        this.widthData = this.historyLocation.width;
                        this.emit('update:width', this.historyLocation.width);
                    }
                    if (!this.heightComp) {
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
                    if (!this.widthComp) {
                        this.widthData = 0;
                    }
                    else {
                        this.widthData = this.historyLocation.width;
                        this.emit('update:width', this.historyLocation.width);
                    }
                    if (!this.heightComp) {
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
                            this.widthData = !this.widthComp ? 0 : this.historyLocation.width;
                            this.heightData = !this.heightComp ? 0 : this.historyLocation.height;
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
                            if (this.widthComp > 0) {
                                this.emit('update:width', this.widthData);
                            }
                            this.heightData = pos.height;
                            if (this.heightComp > 0) {
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
    minMethod() {
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
            this.emit('min', event, 1, {});
            if (event.go) {
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
                return false;
            }
        }
        else {
            this.emit('min', event, 0, this.historyLocation);
            if (event.go) {
                this.element.removeAttribute('data-cg-min');
                this.stateMinData = false;
                this.emit('update:stateMin', false);
            }
            else {
                return false;
            }
        }
        this.trigger('formStateMinChanged', this.stateMinData);
        return true;
    }
    maxVMethod(dbl) {
        if (this.isInside) {
            return;
        }
        if (this.stateAbs) {
            this.stateAbs = '';
            this.topData = this.historyLocation.top;
            this.emit('update:top', this.topData);
            if (!this.heightComp) {
                this.heightData = 0;
            }
            else {
                this.heightData = this.historyLocation.height;
                this.emit('update:height', this.heightData);
            }
            if (dbl) {
                this.leftData = this.historyLocation.left;
                this.emit('update:left', this.leftData);
                if (!this.widthComp) {
                    this.widthData = 0;
                }
                else {
                    this.widthData = this.historyLocation.width;
                    this.emit('update:width', this.widthData);
                }
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
            if (this.heightComp) {
                this.emit('update:height', this.heightData);
            }
        }
    }
    maxMethod() {
        if (this.isInside) {
            return true;
        }
        if (this.stateMinData) {
            if (!this.minMethod()) {
                return false;
            }
        }
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            }
        };
        if (!this.stateMaxData) {
            this.emit('max', event, 1, {});
            if (event.go) {
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
                this.leftData = area.left;
                this.emit('update:left', this.leftData);
                this.topData = area.top;
                this.emit('update:top', this.topData);
                this.widthData = area.width;
                if (this.widthComp > 0) {
                    this.emit('update:width', this.widthData);
                }
                this.heightData = area.height;
                if (this.heightComp > 0) {
                    this.emit('update:height', this.heightData);
                }
            }
            else {
                return false;
            }
        }
        else {
            this.emit('max', event, 0, this.historyLocation);
            if (event.go) {
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
                if (!this.widthComp) {
                    this.widthData = 0;
                }
                else {
                    this.widthData = this.historyLocation.width;
                    this.emit('update:width', this.historyLocation.width);
                }
                if (!this.heightComp) {
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
            else {
                return false;
            }
        }
        this.trigger('formStateMaxChanged', this.stateMaxData);
        return true;
    }
    closeMethod() {
        if (this.isInside) {
            return;
        }
        const event = {
            go: true,
            preventDefault: function () {
                this.go = false;
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
        let changeStateAbs = false;
        if (this.stateAbs) {
            switch (this.stateAbs) {
                case 'l':
                case 'r': {
                    if (border === 'l' || border === 'r') {
                        break;
                    }
                    changeStateAbs = true;
                    if (border === 'bl' || border === 'b' || border === 'rb') {
                        top = height - this.historyLocation.height;
                    }
                    height = this.historyLocation.height;
                    break;
                }
                case 'b': {
                    if (border === 't' || border === 'b') {
                        break;
                    }
                    changeStateAbs = true;
                    if (border === 'tr' || border === 'r' || border === 'rb') {
                        left = width - this.historyLocation.width;
                    }
                    width = this.historyLocation.width;
                    break;
                }
                default: {
                    break;
                }
            }
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
            'minWidth': this.minWidthComp,
            'minHeight': this.minHeightComp,
            'border': border,
            'start': () => {
                if (this.stateAbs && changeStateAbs) {
                    this.stateAbs = '';
                }
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
                if (!this.isInside) {
                    if (nborder !== '') {
                        if (((border === 'lt' || border === 't' || border === 'tr') && (nborder === 'lt' || nborder === 't' || nborder === 'tr')) ||
                            ((border === 'bl' || border === 'b' || border === 'rb') && (nborder === 'bl' || nborder === 'b' || nborder === 'rb'))) {
                            if (isBorder === '') {
                                isBorder = nborder;
                                clickgo.form.showCircular(x, y);
                                clickgo.form.showRectangle(x, y, {
                                    'left': left,
                                    'width': width
                                });
                            }
                            else {
                                isBorder = nborder;
                                clickgo.form.moveRectangle({
                                    'left': left,
                                    'width': width
                                });
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
                }
            },
            'end': () => {
                if (isBorder !== '') {
                    if (!this.stateAbs && isBorder !== 'l' && isBorder !== 'r') {
                        const area = clickgo.core.getAvailArea();
                        this.stateAbs = 'l';
                        this.heightData = area.height;
                        this.emit('update:height', this.heightData);
                        this.topData = area.top;
                        this.emit('update:top', this.topData);
                    }
                    clickgo.form.hideRectangle();
                }
            }
        });
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
            if (this.widthComp === this.widthData) {
                return;
            }
            this.widthData = this.widthComp;
            if (!this.widthComp) {
                return;
            }
            if (this.widthData < this.minWidthComp) {
                this.widthData = this.minWidthComp;
                this.emit('update:width', this.widthData);
            }
        }, {
            'immediate': true
        });
        this.watch('height', () => {
            if (this.heightComp === this.heightData) {
                return;
            }
            this.heightData = this.heightComp;
            if (!this.heightComp) {
                return;
            }
            if (this.heightData < this.minHeightComp) {
                this.heightData = this.minHeightComp;
                this.emit('update:height', this.heightData);
            }
        }, {
            'immediate': true
        });
        this.watch('left', () => {
            this.leftData = this.leftComp;
        });
        this.watch('top', () => {
            this.topData = this.topComp;
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
