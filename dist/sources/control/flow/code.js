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
            'direction': 'h',
            'selection': false,
            'gesture': [],
            'scrollLeft': 0,
            'scrollTop': 0
        };
        this.access = {
            'selectionOrigin': { 'x': 0, 'y': 0 },
            'selectionCurrent': { 'x': 0, 'y': 0, 'quick': false },
            'selectionTimer': 0
        };
    }
    maxScrollLeft() {
        return this.element.scrollWidth - this.element.clientWidth;
    }
    maxScrollTop() {
        return this.element.scrollHeight - this.element.clientHeight;
    }
    scroll() {
        let sl = Math.round(this.element.scrollLeft);
        const msl = this.maxScrollLeft();
        if (sl > msl) {
            sl = msl;
        }
        if (this.propInt('scrollLeft') !== sl) {
            this.emit('update:scrollLeft', sl);
        }
        let st = Math.round(this.element.scrollTop);
        const mst = this.maxScrollTop();
        if (st > mst) {
            st = mst;
        }
        if (this.propInt('scrollTop') !== st) {
            this.emit('update:scrollTop', st);
        }
        if (!this.access.selectionTimer) {
            return;
        }
        this.refreshSelection(clickgo.dom.is.shift, clickgo.dom.is.ctrl);
    }
    wheel(e) {
        clickgo.dom.bindGesture(e, (e, dir) => {
            switch (dir) {
                case 'top': {
                    if (this.element.scrollTop > 0) {
                        e.stopPropagation();
                    }
                    else {
                        if (this.propArray('gesture').includes('top')) {
                            return true;
                        }
                    }
                    break;
                }
                case 'bottom': {
                    if (Math.round(this.element.scrollTop) < this.maxScrollTop()) {
                        e.stopPropagation();
                    }
                    else {
                        if (this.propArray('gesture').includes('bottom')) {
                            return true;
                        }
                    }
                    break;
                }
                case 'left': {
                    if (this.element.scrollLeft > 0) {
                        e.stopPropagation();
                    }
                    else {
                        if (this.propArray('gesture').includes('left')) {
                            return true;
                        }
                    }
                    break;
                }
                default: {
                    if (Math.round(this.element.scrollLeft) < this.maxScrollLeft()) {
                        e.stopPropagation();
                    }
                    else {
                        if (this.propArray('gesture').includes('right')) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }, (dir) => {
            this.emit('gesture', dir);
        });
    }
    down(e) {
        if (this.propBoolean('selection')) {
            const x = (e instanceof MouseEvent) ? e.clientX : e.touches[0].clientX;
            const y = (e instanceof MouseEvent) ? e.clientY : e.touches[0].clientY;
            clickgo.dom.bindDown(e, {
                start: () => {
                    const rect = this.element.getBoundingClientRect();
                    this.access.selectionOrigin.x = x - rect.left + this.element.scrollLeft;
                    this.access.selectionOrigin.y = y - rect.top + this.element.scrollTop;
                    this.refs.selection.style.opacity = '1';
                    this.access.selectionCurrent.x = x;
                    this.access.selectionCurrent.y = y;
                    this.access.selectionTimer = clickgo.task.onFrame(() => {
                        const rect = this.element.getBoundingClientRect();
                        if (this.access.selectionCurrent.x < rect.left) {
                            if (this.element.scrollLeft > 0) {
                                const x = rect.left - this.access.selectionCurrent.x;
                                let dist = 0;
                                if (this.access.selectionCurrent.quick) {
                                    dist = x / 2;
                                    this.access.selectionCurrent.quick = false;
                                }
                                else {
                                    dist = x / 5;
                                }
                                if (this.element.scrollLeft - dist < 0) {
                                    dist = this.element.scrollLeft;
                                }
                                this.element.scrollLeft -= dist;
                                this.emit('update:scrollLeft', Math.round(this.element.scrollLeft));
                            }
                        }
                        else if (this.access.selectionCurrent.x > rect.right) {
                            const maxLeft = this.maxScrollLeft();
                            if (this.element.scrollLeft < maxLeft) {
                                const x = this.access.selectionCurrent.x - rect.right;
                                let dist = 0;
                                if (this.access.selectionCurrent.quick) {
                                    dist = x / 2;
                                    this.access.selectionCurrent.quick = false;
                                }
                                else {
                                    dist = x / 5;
                                }
                                if (this.element.scrollLeft + dist > maxLeft) {
                                    dist = maxLeft - this.element.scrollLeft;
                                }
                                this.element.scrollLeft += dist;
                                this.emit('update:scrollLeft', Math.round(this.element.scrollLeft));
                            }
                        }
                        if (this.access.selectionCurrent.y < rect.top) {
                            if (this.element.scrollTop > 0) {
                                const x = rect.top - this.access.selectionCurrent.y;
                                let dist = 0;
                                if (this.access.selectionCurrent.quick) {
                                    dist = x / 2;
                                    this.access.selectionCurrent.quick = false;
                                }
                                else {
                                    dist = x / 5;
                                }
                                if (this.element.scrollTop - dist < 0) {
                                    dist = this.element.scrollTop;
                                }
                                this.element.scrollTop -= dist;
                                this.emit('update:scrollTop', Math.round(this.element.scrollTop));
                            }
                        }
                        else if (this.access.selectionCurrent.y > rect.bottom) {
                            const maxTop = this.maxScrollTop();
                            if (this.element.scrollTop < maxTop) {
                                const x = this.access.selectionCurrent.y - rect.bottom;
                                let dist = 0;
                                if (this.access.selectionCurrent.quick) {
                                    dist = x / 2;
                                    this.access.selectionCurrent.quick = false;
                                }
                                else {
                                    dist = x / 5;
                                }
                                if (this.element.scrollTop + dist > maxTop) {
                                    dist = maxTop - this.element.scrollTop;
                                }
                                this.element.scrollTop += dist;
                                this.emit('update:scrollTop', Math.round(this.element.scrollTop));
                            }
                        }
                    }, {
                        'formId': this.formId
                    });
                    this.emit('beforeselect');
                },
                move: (ne) => {
                    const nx = (ne instanceof MouseEvent) ? ne.clientX : ne.touches[0].clientX;
                    const ny = (ne instanceof MouseEvent) ? ne.clientY : ne.touches[0].clientY;
                    this.access.selectionCurrent.x = nx;
                    this.access.selectionCurrent.y = ny;
                    this.access.selectionCurrent.quick = true;
                    this.refreshSelection(ne.shiftKey, ne.ctrlKey);
                },
                end: () => {
                    this.refs.selection.style.opacity = '0';
                    this.refs.selection.style.left = '0px';
                    this.refs.selection.style.top = '0px';
                    this.refs.selection.style.width = '1px';
                    this.refs.selection.style.height = '1px';
                    clickgo.task.offFrame(this.access.selectionTimer);
                    this.access.selectionTimer = 0;
                    this.emit('afterselect');
                }
            });
        }
        else {
            if (e instanceof MouseEvent) {
                return;
            }
            clickgo.dom.bindGesture(e, (ne, dir) => {
                switch (dir) {
                    case 'top': {
                        if (this.element.scrollTop > 0) {
                            ne.stopPropagation();
                        }
                        else {
                            if (this.propArray('gesture').includes('top')) {
                                return true;
                            }
                        }
                        break;
                    }
                    case 'bottom': {
                        if (Math.round(this.element.scrollTop) < this.maxScrollTop()) {
                            ne.stopPropagation();
                        }
                        else {
                            if (this.propArray('gesture').includes('bottom')) {
                                return true;
                            }
                        }
                        break;
                    }
                    case 'left': {
                        if (this.element.scrollLeft > 0) {
                            ne.stopPropagation();
                        }
                        else {
                            if (this.propArray('gesture').includes('left')) {
                                return true;
                            }
                        }
                        break;
                    }
                    default: {
                        if (Math.round(this.element.scrollLeft) < this.maxScrollLeft()) {
                            ne.stopPropagation();
                        }
                        else {
                            if (this.propArray('gesture').includes('right')) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            }, (dir) => {
                this.emit('gesture', dir);
            });
        }
    }
    refreshSelection(shift = false, ctrl = false) {
        if (!this.access.selectionTimer) {
            return;
        }
        const rect = this.element.getBoundingClientRect();
        const x = this.access.selectionCurrent.x - rect.left + this.element.scrollLeft;
        const y = this.access.selectionCurrent.y - rect.top + this.element.scrollTop;
        const area = {
            'x': 0,
            'y': 0,
            'width': 0,
            'height': 0,
            'shift': shift,
            'ctrl': ctrl
        };
        if (x >= this.access.selectionOrigin.x) {
            area.x = Math.round(this.access.selectionOrigin.x);
            area.width = Math.round(x - this.access.selectionOrigin.x);
            const maxWidth = this.maxScrollLeft() + this.element.clientWidth - area.x;
            if (area.width > maxWidth) {
                area.width = maxWidth;
            }
        }
        else {
            area.x = Math.round(x);
            if (area.x < 0) {
                area.x = 0;
            }
            area.width = Math.round(this.access.selectionOrigin.x - area.x);
        }
        if (y >= this.access.selectionOrigin.y) {
            area.y = Math.round(this.access.selectionOrigin.y);
            area.height = Math.round(y - this.access.selectionOrigin.y);
            const maxHeight = this.maxScrollTop() + this.element.clientHeight - area.y;
            if (area.height > maxHeight) {
                area.height = maxHeight;
            }
        }
        else {
            area.y = Math.round(y);
            if (area.y < 0) {
                area.y = 0;
            }
            area.height = Math.round(this.access.selectionOrigin.y - area.y);
        }
        this.refs.selection.style.left = area.x.toString() + 'px';
        this.refs.selection.style.top = area.y.toString() + 'px';
        this.refs.selection.style.width = area.width.toString() + 'px';
        this.refs.selection.style.height = area.height.toString() + 'px';
        this.emit('select', area);
    }
    onMounted() {
        this.watch('scrollLeft', () => {
            const prop = this.propInt('scrollLeft');
            if (prop === Math.round(this.element.scrollLeft)) {
                return;
            }
            this.element.scrollLeft = prop;
        });
        this.watch('scrollTop', () => {
            const prop = this.propInt('scrollTop');
            if (prop === Math.round(this.element.scrollTop)) {
                return;
            }
            this.element.scrollTop = prop;
        });
        clickgo.dom.watchSize(this.element, () => {
            this.emit('clientwidth', this.element.clientWidth);
            this.emit('clientheight', this.element.clientHeight);
        }, true);
        clickgo.dom.watchProperty(this.element, ['scrollWidth', 'scrollHeight'], (name, val) => {
            this.emit(name.toLowerCase(), val);
        }, true);
        this.element.scrollTop = this.propInt('scrollTop');
        this.element.scrollLeft = this.propInt('scrollLeft');
    }
}
exports.default = default_1;
