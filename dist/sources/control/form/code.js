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
exports.mounted = exports.methods = exports.watch = exports.data = exports.props = void 0;
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
    'focus': {
        'default': false
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
    'iconData': undefined,
    'widthData': 300,
    'heightData': 200,
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
    'flashTimer': undefined
};
exports.watch = {
    'icon': {
        handler: function () {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                let first = false;
                if (this.iconData === undefined) {
                    first = true;
                }
                if (this.icon === '') {
                    this.iconData = '';
                }
                else {
                    this.iconData = (_a = yield this.cgGetDataUrl(this.icon)) !== null && _a !== void 0 ? _a : '';
                }
                if (!first) {
                    clickgo.core.trigger('formIconChanged', this.taskId, this.formId, { 'icon': this.iconData });
                }
            });
        },
        'immediate': true
    },
    'title': function () {
        clickgo.core.trigger('formTitleChanged', this.taskId, this.formId, { 'title': this.title });
    },
    'stateMin': function () {
        this.minMethod();
    },
    'stateMax': function () {
        this.maxMethod();
    },
    'width': function () {
        this.widthData = parseInt(this.width);
    },
    'height': function () {
        this.heightData = parseInt(this.height);
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
    moveMethod: function (e) {
        if (e instanceof MouseEvent && clickgo.hasTouch) {
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
        clickgo.element.bindMove(e, {
            'start': (x, y) => {
                if (this.stateMaxData) {
                    this.$emit('max', event, 0, this.historyLocation);
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
                    this.widthData = this.historyLocation.width;
                    this.$emit('update:width', this.historyLocation.width);
                    this.heightData = this.historyLocation.height;
                    this.$emit('update:height', this.historyLocation.height);
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
                    this.widthData = this.historyLocation.width;
                    this.$emit('update:width', this.historyLocation.width);
                    this.heightData = this.historyLocation.height;
                    this.$emit('update:height', this.historyLocation.height);
                }
                else if (!this.stateMinData) {
                    this.historyLocation = {
                        'width': this.widthData,
                        'height': this.heightData,
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
                    if ((border === 't' && this.max) || (border !== 't' && this.resize)) {
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
                            this.widthData = this.historyLocation.width;
                            this.heightData = this.historyLocation.height;
                            this.leftData = this.historyLocation.left;
                            this.topData = this.historyLocation.top;
                            this.maxMethod();
                        }
                    }
                    else {
                        if (this.resize) {
                            if (this.stateMinData) {
                                if (!this.minMethod()) {
                                    clickgo.form.hideRectangle();
                                    return;
                                }
                            }
                            this.stateAbs = true;
                            let pos = clickgo.form.getRectByDir(isBorder);
                            this.widthData = pos.width;
                            this.$emit('update:width', this.widthData);
                            this.heightData = pos.height;
                            this.$emit('update:height', this.heightData);
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
        let event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'ds': false,
            disableShape: function () {
                this.ds = false;
            }
        };
        if (this.stateMaxData) {
            if (this.maxMethod() === false) {
                return false;
            }
        }
        if (this.stateAbs) {
            this.stateAbs = false;
            this.widthData = this.historyLocation.width;
            this.heightData = this.historyLocation.height;
            this.leftData = this.historyLocation.left;
            this.$emit('update:left', this.leftData);
            this.topData = this.historyLocation.top;
            this.$emit('update:top', this.topData);
        }
        if (!this.stateMinData) {
            this.$emit('min', event, 1, {});
            if (event.go) {
                this.historyLocation = {
                    'width': this.widthData,
                    'height': this.heightData,
                    'left': this.leftData,
                    'top': this.topData
                };
                this.stateMinData = true;
                this.$emit('update:stateMin', true);
                this.$el.classList.add('cg-state-min');
                if (!event.ds) {
                    this.$el.style.height = 'auto';
                    this.heightData = this.$el.offsetHeight;
                    this.$emit('update:height', this.$el.offsetHeight);
                    if (this.border !== 'thin') {
                        this.widthData = 200;
                        this.$emit('update:width', 200);
                    }
                    else {
                        this.widthData = 150;
                        this.$emit('update:width', 150);
                    }
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
                this.$el.classList.remove('cg-state-min');
                if (!event.ds) {
                    this.heightData = this.historyLocation.height;
                    this.$emit('update:height', this.historyLocation.height);
                    this.widthData = this.historyLocation.width;
                    this.$emit('update:width', this.historyLocation.width);
                }
            }
            else {
                return false;
            }
        }
        clickgo.core.trigger('formStateMinChanged', this.taskId, this.formId, { 'state': this.stateMinData });
        return true;
    },
    maxVMethod: function (dbl) {
        if (this.stateAbs) {
            this.stateAbs = false;
            this.topData = this.historyLocation.top;
            this.$emit('update:top', this.topData);
            this.heightData = this.historyLocation.height;
            this.$emit('update:height', this.heightData);
            if (dbl) {
                this.leftData = this.historyLocation.left;
                this.$emit('update:top', this.leftData);
                this.widthData = this.historyLocation.width;
                this.$emit('update:width', this.widthData);
            }
        }
        else {
            this.stateAbs = true;
            this.historyLocation = {
                'width': this.widthData,
                'height': this.heightData,
                'left': this.leftData,
                'top': this.topData
            };
            let pos = clickgo.getPosition();
            this.topData = pos.top;
            this.$emit('update:top', this.topData);
            this.heightData = pos.height;
            this.$emit('update:height', this.heightData);
        }
    },
    maxMethod: function () {
        if (this.stateMinData) {
            if (this.minMethod() === false) {
                return false;
            }
        }
        let event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'ds': false,
            disableShape: function () {
                this.ds = false;
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
                        'width': this.widthData,
                        'height': this.heightData,
                        'left': this.leftData,
                        'top': this.topData
                    };
                }
                this.stateMaxData = true;
                this.$emit('update:stateMax', true);
                if (!event.ds) {
                    let pos = clickgo.getPosition();
                    this.leftData = pos.left;
                    this.$emit('update:left', this.leftData);
                    this.topData = pos.top;
                    this.$emit('update:top', this.topData);
                    this.widthData = pos.width;
                    this.$emit('update:width', this.widthData);
                    this.heightData = pos.height;
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
                if (!event.ds) {
                    this.leftData = this.historyLocation.left;
                    this.$emit('update:left', this.historyLocation.left);
                    this.topData = this.historyLocation.top;
                    this.$emit('update:top', this.historyLocation.top);
                    this.widthData = this.historyLocation.width;
                    this.$emit('update:width', this.historyLocation.width);
                    this.heightData = this.historyLocation.height;
                    this.$emit('update:height', this.historyLocation.height);
                }
            }
            else {
                return false;
            }
        }
        clickgo.core.trigger('formStateMaxChanged', this.taskId, this.formId, { 'state': this.stateMaxData });
        return true;
    },
    closeMethod: function () {
        let event = {
            go: true,
            preventDefault: function () {
                this.go = false;
            }
        };
        this.$emit('close', event);
        if (event.go) {
            clickgo.form.remove(this.formId);
        }
    },
    resizeMethod: function (e, dir) {
        if (e instanceof MouseEvent && clickgo.hasTouch) {
            return;
        }
        let isBorder = '';
        let top = this.topData;
        let height = this.heightData;
        if (dir !== 'l' && dir !== 'r') {
            if (this.stateAbs) {
                if (dir === 'lt' || dir === 't' || dir === 'tr') {
                    height = this.historyLocation.top + this.historyLocation.height;
                }
                else {
                    top = this.historyLocation.top;
                    height = clickgo.getPosition().height - top;
                }
            }
            else {
                this.historyLocation = {
                    'width': this.widthData,
                    'height': this.heightData,
                    'left': this.leftData,
                    'top': this.topData
                };
            }
        }
        clickgo.element.bindResize(e, {
            'left': this.leftData,
            'top': top,
            'width': this.widthData,
            'height': height,
            'minWidth': parseInt(this.minWidth),
            'minHeight': parseInt(this.minHeight),
            'dir': dir,
            'start': () => {
                if (dir === 'l' || dir === 'r') {
                    return;
                }
                if (this.stateAbs) {
                    this.stateAbs = false;
                }
            },
            'move': (left, top, width, height, x, y, border) => {
                this.leftData = left;
                this.$emit('update:left', left);
                this.topData = top;
                this.$emit('update:top', top);
                this.widthData = width;
                this.$emit('update:width', width);
                this.heightData = height;
                this.$emit('update:height', height);
                if (border !== '') {
                    if (((dir === 'lt' || dir === 't' || dir === 'tr') && (border === 'lt' || border === 't' || border === 'tr')) ||
                        ((dir === 'bl' || dir === 'b' || dir === 'rb') && (border === 'bl' || border === 'b' || border === 'rb'))) {
                        if (isBorder === '') {
                            isBorder = border;
                            clickgo.form.showCircular(x, y);
                            clickgo.form.showRectangle(x, y, {
                                'left': left,
                                'width': width
                            });
                        }
                        else {
                            isBorder = border;
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
            },
            'end': () => {
                if (isBorder !== '') {
                    if (isBorder !== 'l' && isBorder !== 'r') {
                        let pos = clickgo.getPosition();
                        this.stateAbs = true;
                        this.heightData = pos.height;
                        this.$emit('update:height', this.heightData);
                        this.topData = pos.top;
                        this.$emit('update:top', this.topData);
                    }
                    clickgo.form.hideRectangle();
                }
            }
        });
    },
    maskDown: function (e) {
        if (e instanceof MouseEvent && clickgo.hasTouch) {
            return;
        }
        if (typeof this.maskFor !== 'number') {
            return;
        }
        if (!clickgo.core.tasks[this.taskId].forms[this.maskFor]) {
            return;
        }
        e.stopPropagation();
        clickgo.core.tasks[this.taskId].forms[this.maskFor].vroot.flash();
    },
    setPropData: function (name, val, mode = '') {
        if (this[name + 'Data'] === undefined || this[name] === undefined) {
            return;
        }
        if (mode === '') {
            this[name + 'Data'] = val;
        }
        else if (mode === '+') {
            this[name + 'Data'] += val;
        }
        else {
            this[name + 'Data'] -= val;
        }
        this.$emit('update:' + name, this[name + 'Data']);
    }
};
exports.mounted = function () {
    this.widthData = parseInt(this.width);
    this.heightData = parseInt(this.height);
    this.zIndexData = parseInt(this.zIndex);
    let stateMax = (typeof this.stateMax === 'string') ? ((this.stateMax === 'true') ? true : false) : this.stateMax;
    if (stateMax) {
        let pos = clickgo.getPosition();
        this.leftData = (pos.width - this.widthData) / 2;
        this.topData = (pos.height - this.heightData) / 2;
        this.maxMethod();
    }
};
