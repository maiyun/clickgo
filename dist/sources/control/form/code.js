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
exports.mounted = exports.methods = exports.watch = exports.computed = exports.data = exports.props = void 0;
exports.props = {
    'icon': {
        'default': '',
    },
    'title': {
        'default': 'title'
    },
    'min': {
        'default': true
    },
    'max': {
        'default': true
    },
    'close': {
        'default': true
    },
    'stateMax': {
        'default': false
    },
    'stateMin': {
        'default': false
    },
    'show': {
        'default': undefined
    },
    'width': {
        'default': 300
    },
    'height': {
        'default': 200
    },
    'left': {
        'default': -1
    },
    'top': {
        'default': -1
    },
    'zIndex': {
        'default': -1
    },
    'minWidth': {
        'default': 200
    },
    'minHeight': {
        'default': 100
    },
    'resize': {
        'default': true
    },
    'move': {
        'default': true
    },
    'border': {
        'default': 'normal'
    },
    'background': {
        'default': undefined
    },
    'padding': {
        'default': undefined
    },
    'direction': {
        'default': 'v'
    }
};
exports.data = {
    'stateMaxData': false,
    'stateMinData': false,
    'stateAbs': false,
    'showData': false,
    'iconData': '',
    'widthData': undefined,
    'heightData': undefined,
    'leftData': 0,
    'topData': 0,
    'zIndexData': 0,
    'historyLocation': {
        'width': 0,
        'height': 0,
        'left': 0,
        'top': 0
    },
    'maskFor': undefined,
    'maskFrom': undefined,
    'flashTimer': undefined,
    'isInside': false
};
exports.computed = {
    'isMin': function () {
        return clickgo.tool.getBoolean(this.min);
    },
    'isMax': function () {
        return clickgo.tool.getBoolean(this.max);
    },
    'isClose': function () {
        return clickgo.tool.getBoolean(this.close);
    },
    'isStateMax': function () {
        return clickgo.tool.getBoolean(this.stateMax);
    },
    'isStateMin': function () {
        return clickgo.tool.getBoolean(this.stateMin);
    },
    'isResize': function () {
        return clickgo.tool.getBoolean(this.resize);
    },
    'isMove': function () {
        return clickgo.tool.getBoolean(this.move);
    },
    'taskPosition': function () {
        return clickgo.form.taskInfo.taskId === 0 ? 'bottom' : clickgo.core.config['task.position'];
    }
};
exports.watch = {
    'icon': {
        handler: function () {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                if (this.icon === '') {
                    this.iconData = '';
                }
                else {
                    this.iconData = (_a = yield this.cgGetDataUrl(this.icon)) !== null && _a !== void 0 ? _a : '';
                }
                clickgo.core.trigger('formIconChanged', this.taskId, this.formId, this.iconData);
            });
        },
        'immediate': false
    },
    'title': function () {
        clickgo.core.trigger('formTitleChanged', this.taskId, this.formId, this.title);
    },
    'isStateMin': function () {
        if (this.stateMin === this.stateMinData) {
            return;
        }
        this.minMethod();
    },
    'isStateMax': function () {
        if (this.stateMax === this.stateMaxData) {
            return;
        }
        this.maxMethod();
    },
    'show': function () {
        if (this.showData !== this.show) {
            this.showData = this.show;
        }
    },
    'showData': function () {
        clickgo.core.trigger('formShowChanged', this.taskId, this.formId, this.showData);
    },
    'width': function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.width === 'auto') {
                if (this.widthData !== undefined) {
                    this.widthData = undefined;
                }
            }
            else {
                this.widthData = parseInt(this.width);
            }
        });
    },
    'height': function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.height === 'auto') {
                if (this.heightData !== undefined) {
                    this.heightData = undefined;
                }
            }
            else {
                this.heightData = parseInt(this.height);
            }
        });
    },
    'left': function () {
        this.leftData = parseInt(this.left);
    },
    'top': function () {
        this.topData = parseInt(this.top);
    },
    'zIndex': function () {
        this.zIndexData = parseInt(this.zIndex);
    }
};
exports.methods = {
    moveMethod: function (e, custom = false) {
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (!this.isMove && !custom) {
            return;
        }
        if (this.isInside) {
            return;
        }
        let el = e.currentTarget;
        let dataHasDbl = el.getAttribute('data-has-dbl');
        if (!dataHasDbl) {
            el.setAttribute('data-has-dbl', 'yes');
            el.addEventListener('dblclick', () => {
                if (this.stateAbs) {
                    this.maxVMethod(true);
                }
                else {
                    this.maxMethod();
                }
            });
        }
        let isBorder = '';
        clickgo.dom.bindMove(e, {
            'start': (x, y) => {
                var _a, _b;
                if (this.stateMaxData) {
                    this.$emit('max', e, 0, this.historyLocation);
                    this.stateMaxData = false;
                    this.$emit('update:stateMax', false);
                    let olx = x - this.leftData;
                    let orx = this.leftData + this.widthData - x;
                    let w2 = this.historyLocation.width / 2;
                    if (olx <= w2) {
                        this.leftData = x - olx;
                    }
                    else if (orx <= w2) {
                        this.leftData = x - (this.historyLocation.width - orx);
                    }
                    else {
                        this.leftData = x - w2;
                    }
                    this.$emit('update:left', this.leftData);
                    let oty = y - this.topData;
                    let oby = this.topData + this.heightData - y;
                    let h2 = this.historyLocation.height / 2;
                    if (oty <= h2) {
                        this.topData = y - oty;
                    }
                    else if (oby <= h2) {
                        this.topData = y - (this.historyLocation.height - oby);
                    }
                    else {
                        this.topData = y - h2;
                    }
                    this.$emit('update:top', this.topData);
                    if (this.width === 'auto') {
                        this.widthData = undefined;
                    }
                    else {
                        this.widthData = this.historyLocation.width;
                        this.$emit('update:width', this.historyLocation.width);
                    }
                    if (this.height === 'auto') {
                        this.heightData = undefined;
                    }
                    else {
                        this.heightData = this.historyLocation.height;
                        this.$emit('update:height', this.historyLocation.height);
                    }
                }
                else if (this.stateAbs) {
                    this.stateAbs = false;
                    let olx = x - this.leftData;
                    let orx = this.leftData + this.widthData - x;
                    let w2 = this.historyLocation.width / 2;
                    if (olx <= w2) {
                        this.leftData = x - olx;
                    }
                    else if (orx <= w2) {
                        this.leftData = x - (this.historyLocation.width - orx);
                    }
                    else {
                        this.leftData = x - w2;
                    }
                    this.$emit('update:left', this.leftData);
                    let oty = y - this.topData;
                    let oby = this.topData + this.heightData - y;
                    let h2 = this.historyLocation.height / 2;
                    if (oty <= h2) {
                        this.topData = y - oty;
                    }
                    else if (oby <= h2) {
                        this.topData = y - (this.historyLocation.height - oby);
                    }
                    else {
                        this.topData = y - h2;
                    }
                    this.$emit('update:top', this.topData);
                    if (this.width === 'auto') {
                        this.widthData = undefined;
                    }
                    else {
                        this.widthData = this.historyLocation.width;
                        this.$emit('update:width', this.historyLocation.width);
                    }
                    if (this.height === 'auto') {
                        this.heightData = undefined;
                    }
                    else {
                        this.heightData = this.historyLocation.height;
                        this.$emit('update:height', this.historyLocation.height);
                    }
                }
                else if (!this.stateMinData) {
                    this.historyLocation = {
                        'width': (_a = this.widthData) !== null && _a !== void 0 ? _a : this.$el.offsetWidth,
                        'height': (_b = this.heightData) !== null && _b !== void 0 ? _b : this.$el.offsetHeight,
                        'left': this.leftData,
                        'top': this.topData
                    };
                }
            },
            'move': (ox, oy, x, y, border) => {
                this.leftData += ox;
                this.$emit('update:left', this.leftData);
                this.topData += oy;
                this.$emit('update:top', this.topData);
                if (border !== '') {
                    if ((border === 't' && this.max) || (border !== 't' && this.isResize)) {
                        if (isBorder === '') {
                            isBorder = border;
                            clickgo.form.showCircular(x, y);
                            clickgo.form.showRectangle(x, y, border);
                        }
                        else {
                            isBorder = border;
                            clickgo.form.moveRectangle(border);
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
                        if (this.max) {
                            this.widthData = this.width === 'auto' ? undefined : this.historyLocation.width;
                            this.heightData = this.height === 'auto' ? undefined : this.historyLocation.height;
                            this.leftData = this.historyLocation.left;
                            this.topData = this.historyLocation.top;
                            this.maxMethod();
                        }
                    }
                    else {
                        if (this.isResize) {
                            if (this.stateMinData) {
                                if (!this.minMethod()) {
                                    clickgo.form.hideRectangle();
                                    return;
                                }
                            }
                            this.stateAbs = true;
                            let pos = clickgo.form.getRectByBorder(isBorder);
                            this.widthData = pos.width;
                            if (this.width !== 'auto') {
                                this.$emit('update:width', this.widthData);
                            }
                            this.heightData = pos.height;
                            if (this.height !== 'auto') {
                                this.$emit('update:height', this.heightData);
                            }
                            this.leftData = pos.left;
                            this.$emit('update:left', this.leftData);
                            this.topData = pos.top;
                            this.$emit('update:top', this.topData);
                        }
                    }
                    clickgo.form.hideRectangle();
                }
            }
        });
    },
    minMethod: function () {
        if (this.isInside) {
            return true;
        }
        let event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            }
        };
        if (this.stateMaxData) {
            if (this.maxMethod() === false) {
                return false;
            }
        }
        if (this.stateAbs) {
            this.stateAbs = false;
            this.widthData = this.width === 'auto' ? undefined : this.historyLocation.width;
            this.heightData = this.height === 'auto' ? undefined : this.historyLocation.height;
            this.leftData = this.historyLocation.left;
            this.$emit('update:left', this.leftData);
            this.topData = this.historyLocation.top;
            this.$emit('update:top', this.topData);
        }
        if (!this.stateMinData) {
            this.$emit('min', event, 1, {});
            if (event.go) {
                this.stateMinData = true;
                this.$emit('update:stateMin', true);
                if (this.cgFocus) {
                    let formId = clickgo.form.getMaxZIndexFormID({
                        'formIds': [this.formId]
                    });
                    this.cgCreateTimer(function () {
                        if (formId) {
                            clickgo.form.changeFocus(formId);
                        }
                        else {
                            clickgo.form.changeFocus();
                        }
                    }, 100);
                }
            }
            else {
                return false;
            }
        }
        else {
            this.$emit('min', event, 0, this.historyLocation);
            if (event.go) {
                this.stateMinData = false;
                this.$emit('update:stateMin', false);
            }
            else {
                return false;
            }
        }
        clickgo.core.trigger('formStateMinChanged', this.taskId, this.formId, this.stateMinData);
        return true;
    },
    maxVMethod: function (dbl) {
        var _a, _b;
        if (this.isInside) {
            return;
        }
        if (this.stateAbs) {
            this.stateAbs = false;
            this.topData = this.historyLocation.top;
            this.$emit('update:top', this.topData);
            if (this.height === 'auto') {
                this.heightData = undefined;
            }
            else {
                this.heightData = this.historyLocation.height;
                this.$emit('update:height', this.heightData);
            }
            if (dbl) {
                this.leftData = this.historyLocation.left;
                this.$emit('update:top', this.leftData);
                if (this.width === 'auto') {
                    this.widthData = undefined;
                }
                else {
                    this.widthData = this.historyLocation.width;
                    this.$emit('update:width', this.widthData);
                }
            }
        }
        else {
            this.stateAbs = true;
            this.historyLocation = {
                'width': (_a = this.widthData) !== null && _a !== void 0 ? _a : this.$el.offsetWidth,
                'height': (_b = this.heightData) !== null && _b !== void 0 ? _b : this.$el.offsetHeight,
                'left': this.leftData,
                'top': this.topData
            };
            let area = clickgo.form.getAvailArea();
            this.topData = area.top;
            this.$emit('update:top', this.topData);
            this.heightData = area.height;
            if (this.height !== 'auto') {
                this.$emit('update:height', this.heightData);
            }
        }
    },
    maxMethod: function () {
        var _a, _b;
        if (this.isInside) {
            return true;
        }
        if (this.stateMinData) {
            if (this.minMethod() === false) {
                return false;
            }
        }
        let event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            }
        };
        if (!this.stateMaxData) {
            this.$emit('max', event, 1, {});
            if (event.go) {
                if (this.stateAbs) {
                    this.stateAbs = false;
                }
                else {
                    this.historyLocation = {
                        'width': (_a = this.widthData) !== null && _a !== void 0 ? _a : this.$el.offsetWidth,
                        'height': (_b = this.heightData) !== null && _b !== void 0 ? _b : this.$el.offsetHeight,
                        'left': this.leftData,
                        'top': this.topData
                    };
                }
                this.stateMaxData = true;
                this.$emit('update:stateMax', true);
                let area = clickgo.form.getAvailArea();
                this.leftData = area.left;
                this.$emit('update:left', this.leftData);
                this.topData = area.top;
                this.$emit('update:top', this.topData);
                this.widthData = area.width;
                if (this.width !== 'auto') {
                    this.$emit('update:width', this.widthData);
                }
                this.heightData = area.height;
                if (this.height !== 'auto') {
                    this.$emit('update:height', this.heightData);
                }
            }
            else {
                return false;
            }
        }
        else {
            this.$emit('max', event, 0, this.historyLocation);
            if (event.go) {
                this.stateMaxData = false;
                this.$emit('update:stateMax', false);
                this.leftData = this.historyLocation.left;
                this.$emit('update:left', this.historyLocation.left);
                this.topData = this.historyLocation.top;
                this.$emit('update:top', this.historyLocation.top);
                if (this.width === 'auto') {
                    this.widthData = undefined;
                }
                else {
                    this.widthData = this.historyLocation.width;
                    this.$emit('update:width', this.historyLocation.width);
                }
                if (this.height === 'auto') {
                    this.heightData = undefined;
                }
                else {
                    this.heightData = this.historyLocation.height;
                    this.$emit('update:height', this.historyLocation.height);
                }
            }
            else {
                return false;
            }
        }
        clickgo.core.trigger('formStateMaxChanged', this.taskId, this.formId, this.stateMaxData);
        return true;
    },
    closeMethod: function () {
        if (this.isInside) {
            return;
        }
        let event = {
            go: true,
            preventDefault: function () {
                this.go = false;
            }
        };
        this.$emit('close', event);
        if (event.go) {
            this.cgClose();
        }
    },
    resizeMethod: function (e, border) {
        var _a, _b, _c, _d;
        if (this.stateMaxData) {
            return;
        }
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        let isBorder = '';
        let top = this.topData;
        let height = (_a = this.heightData) !== null && _a !== void 0 ? _a : this.$el.offsetHeight;
        if (border !== 'l' && border !== 'r') {
            if (this.stateAbs) {
                if (border === 'lt' || border === 't' || border === 'tr') {
                    height = this.historyLocation.top + this.historyLocation.height;
                }
                else {
                    top = this.historyLocation.top;
                    height = clickgo.form.getAvailArea().height - top;
                }
            }
            else {
                this.historyLocation = {
                    'width': (_b = this.widthData) !== null && _b !== void 0 ? _b : this.$el.offsetWidth,
                    'height': (_c = this.heightData) !== null && _c !== void 0 ? _c : this.$el.offsetHeight,
                    'left': this.leftData,
                    'top': this.topData
                };
            }
        }
        clickgo.dom.bindResize(e, {
            'objectLeft': this.leftData,
            'objectTop': top,
            'objectWidth': (_d = this.widthData) !== null && _d !== void 0 ? _d : this.$el.offsetWidth,
            'objectHeight': height,
            'minWidth': parseInt(this.minWidth),
            'minHeight': parseInt(this.minHeight),
            'border': border,
            'start': () => {
                if (border === 'l' || border === 'r') {
                    return;
                }
                if (this.stateAbs) {
                    this.stateAbs = false;
                }
            },
            'move': (left, top, width, height, x, y, nborder) => {
                this.leftData = left;
                this.$emit('update:left', left);
                this.topData = top;
                this.$emit('update:top', top);
                this.widthData = width;
                this.$emit('update:width', width);
                this.heightData = height;
                this.$emit('update:height', height);
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
                    if (isBorder !== 'l' && isBorder !== 'r') {
                        let area = clickgo.form.getAvailArea();
                        this.stateAbs = true;
                        this.heightData = area.height;
                        this.$emit('update:height', this.heightData);
                        this.topData = area.top;
                        this.$emit('update:top', this.topData);
                    }
                    clickgo.form.hideRectangle();
                }
            }
        });
    },
    setPropData: function (name, val, mode = '') {
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
                this.$emit('update:left', this.leftData);
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
                this.$emit('update:top', this.topData);
                break;
            }
            case 'width': {
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
                this.$emit('update:width', this.widthData);
                break;
            }
            case 'height': {
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
                this.$emit('update:height', this.heightData);
                break;
            }
            case 'zIndex': {
                switch (mode) {
                    case '': {
                        this.zIndexData = val;
                        break;
                    }
                    case '+': {
                        this.zIndexData += val;
                        break;
                    }
                    default: {
                        this.zIndexData -= val;
                    }
                }
                this.$emit('update:zIndex', this.zIndexData);
                break;
            }
        }
    }
};
exports.mounted = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.$nextTick();
        yield clickgo.tool.sleep(0);
        if (this.$parent.controlName !== 'root') {
            this.isInside = true;
            this.showData = true;
        }
        if (this.width !== 'auto') {
            this.widthData = parseInt(this.width);
            if (this.widthData < this.minWidth) {
                this.widthData = this.minWidth;
                this.$emit('update:width', this.widthData);
            }
        }
        if (this.height !== 'auto') {
            this.heightData = parseInt(this.height);
            if (this.heightData < this.minHeight) {
                this.heightData = this.minHeight;
                this.$emit('update:height', this.heightData);
            }
        }
        let zIndex = parseInt(this.zIndex);
        if (zIndex !== -1) {
            this.zIndexData = zIndex;
        }
        if (this.isStateMax) {
            let area = clickgo.form.getAvailArea();
            this.leftData = (area.width - this.widthData) / 2;
            this.topData = (area.height - this.heightData) / 2;
            this.maxMethod();
        }
    });
};
