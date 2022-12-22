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
            'direction': 'h',
            'selection': false,
            'gesture': [],
            'scrollLeft': 0,
            'scrollTop': 0,
            'data': [],
            'sizes': {}
        };
        this.showPos = {
            'start': 0,
            'end': 9
        };
        this.selectPos = {
            'start': 0,
            'end': 0
        };
        this.pos = [];
        this.size = 0;
        this.length = 0;
        this.scrollLeftData = 0;
        this.scrollTopData = 0;
        this.clientWidth = 0;
        this.clientHeight = 0;
        this.padding = {
            'top': 0,
            'right': 0,
            'bottom': 0,
            'left': 0
        };
    }
    get dataFormat() {
        if (typeof this.props.data !== 'number') {
            return this.props.data;
        }
        const list = [];
        for (let i = 1; i <= this.props.data; ++i) {
            list.push(i);
        }
        return list;
    }
    get scroll() {
        return this.props.direction === 'v' ? this.scrollTopData : this.scrollLeftData;
    }
    get client() {
        return this.props.direction === 'v' ? this.clientHeight : this.clientWidth;
    }
    get itemStyle() {
        return (index) => {
            return {
                'left': (this.props.direction === 'v' ?
                    this.padding.left :
                    (this.pos[index] ?
                        this.pos[index].start :
                        '0')) + 'px',
                'top': (this.props.direction === 'v' ?
                    (this.pos[index] ?
                        this.pos[index].start :
                        '0') :
                    this.padding.top) + 'px',
                'min-width': (this.props.direction === 'v' ?
                    `calc(100% - ${this.padding.left + this.padding.right}px)` :
                    undefined),
                'min-height': (this.props.direction === 'v' ?
                    undefined :
                    `calc(100% - ${this.padding.top + this.padding.bottom}px)`),
                'display': this.props.direction === 'v' ? undefined : 'flex'
            };
        };
    }
    getPos(val) {
        return this.pos[val];
    }
    inArea(i, area) {
        const pos = this.pos[i];
        if (!pos) {
            return false;
        }
        if ((pos.end > area.start) && (pos.start < area.end)) {
            return true;
        }
        return false;
    }
    getNewPos(pos, area) {
        const rtn = { 'start': -1, 'end': -1 };
        const startShow = this.inArea(pos.start, area);
        if (startShow) {
            rtn.start = pos.start;
            for (let i = pos.start - 1; i >= 0; --i) {
                if (this.inArea(i, area)) {
                    rtn.start = i;
                    continue;
                }
                break;
            }
        }
        else {
            let start = this.pos[pos.start];
            if (!start) {
                if (pos.start === 0 || !this.pos[0]) {
                    return { 'start': 0, 'end': 9 };
                }
                pos.start = 0;
                rtn.start = 0;
                start = this.pos[0];
            }
            if (area.start > start.start) {
                for (let i = pos.start + 1; i < this.dataFormat.length; ++i) {
                    if (!this.inArea(i, area)) {
                        continue;
                    }
                    rtn.start = i;
                    break;
                }
                if (rtn.start === -1) {
                    rtn.start = 0;
                    rtn.end = 9;
                }
            }
            else {
                let found = false;
                for (let i = pos.start - 1; i >= 0; --i) {
                    if (!this.inArea(i, area)) {
                        if (found) {
                            break;
                        }
                        continue;
                    }
                    if (!found) {
                        found = true;
                    }
                    rtn.start = i;
                    if (rtn.end === -1) {
                        rtn.end = i;
                    }
                }
            }
        }
        if (rtn.end > -1) {
            return rtn;
        }
        if (!this.pos[pos.end]) {
            pos.end = rtn.start;
        }
        const endShow = this.inArea(pos.end, area);
        if (endShow) {
            rtn.end = pos.end;
            for (let i = pos.end + 1; i < this.dataFormat.length; ++i) {
                if (this.inArea(i, area)) {
                    rtn.end = i;
                    continue;
                }
                break;
            }
        }
        else {
            const end = this.pos[pos.end];
            if (area.end < end.end) {
                for (let i = pos.end - 1; i >= 0; --i) {
                    if (!this.inArea(i, area)) {
                        continue;
                    }
                    rtn.end = i;
                    break;
                }
            }
            else {
                let found = false;
                for (let i = pos.end + 1; i < this.dataFormat.length; ++i) {
                    if (!this.inArea(i, area)) {
                        if (found) {
                            break;
                        }
                        continue;
                    }
                    if (!found) {
                        found = true;
                    }
                    rtn.end = i;
                }
            }
        }
        return rtn;
    }
    refreshSize() {
        var _a;
        let need = false;
        const el = this.element.querySelector('[data-cg-size="same"]');
        if (el) {
            const size = this.props.direction === 'h' ? el.offsetWidth : el.offsetHeight;
            if (size !== this.size) {
                this.size = size;
                need = true;
            }
        }
        if (!need && (this.pos.length === this.dataFormat.length)) {
            return;
        }
        this.pos = [];
        this.length = 0;
        const padding = this.props.direction === 'h' ? this.padding.left : this.padding.top;
        for (let i = 0; i < this.dataFormat.length; ++i) {
            const isize = (_a = this.props.sizes[i]) !== null && _a !== void 0 ? _a : this.size;
            this.pos.push({
                'start': this.length + padding,
                'end': this.length + isize + padding
            });
            this.length += isize;
        }
        this.reShow();
    }
    reShow() {
        const rtn = this.getNewPos(this.showPos, {
            'start': this.scroll - 20,
            'end': this.scroll + this.client + 20
        });
        this.showPos.start = rtn.start;
        this.showPos.end = rtn.end;
        this.nextTick().then(() => {
            let el = this.element.querySelector('[data-cg-roindex]');
            if (el) {
                if (el.dataset.cgSize !== 'same') {
                    clickgo.dom.unwatchSize(el);
                }
                else {
                    return;
                }
            }
            el = this.element.querySelector('[data-cg-size="same"]');
            if (!el) {
                return;
            }
            clickgo.dom.watchSize(el, () => {
                if (el.dataset.cgSize !== 'same') {
                    return;
                }
                this.refreshSize();
            });
        });
    }
    updateScrollOffset(val, pos) {
        if (pos === 'left') {
            this.emit('update:scrollLeft', val);
            this.scrollLeftData = val;
            if (this.props.direction === 'h') {
                this.reShow();
            }
        }
        else {
            this.emit('update:scrollTop', val);
            this.scrollTopData = val;
            if (this.props.direction === 'v') {
                this.reShow();
            }
        }
    }
    clientwidth(v) {
        this.clientWidth = v;
        if (this.props.direction === 'h') {
            this.reShow();
        }
    }
    clientheight(v) {
        this.clientHeight = v;
        if (this.props.direction === 'v') {
            this.reShow();
        }
    }
    onSelect(area) {
        const offset = this.props.direction === 'v' ? area.y : area.x;
        const length = this.props.direction === 'v' ? area.height : area.width;
        const rtn = this.getNewPos(this.selectPos, {
            'start': offset,
            'end': offset + length
        });
        this.selectPos.start = rtn.start;
        this.selectPos.end = rtn.end;
        area.start = rtn.start;
        area.end = rtn.end;
    }
    onMounted() {
        this.watch('dataFormat', () => __awaiter(this, void 0, void 0, function* () {
            yield this.nextTick();
            this.refreshSize();
        }), {
            'deep': true
        });
        this.watch('direction', () => __awaiter(this, void 0, void 0, function* () {
            yield this.nextTick();
            this.refreshSize();
        }));
        this.watch('scrollLeft', () => {
            if (this.props.direction === 'h' && this.scrollLeftData !== this.propInt('scrollLeft')) {
                this.scrollLeftData = this.propInt('scrollLeft');
                this.reShow();
            }
        });
        this.watch('scrollTop', () => {
            if (this.props.direction === 'v' && this.scrollTopData !== this.propInt('scrollTop')) {
                this.scrollTopData = this.propInt('scrollTop');
                this.reShow();
            }
        });
        this.watch('sizes', () => {
            this.refreshSize();
        });
        clickgo.dom.watchStyle(this.element, ['padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'font'], (n, v) => {
            switch (n) {
                case 'padding-top': {
                    this.padding.top = parseInt(v);
                    break;
                }
                case 'padding-right': {
                    this.padding.right = parseInt(v);
                    break;
                }
                case 'padding-bottom': {
                    this.padding.bottom = parseInt(v);
                    break;
                }
                case 'padding-left': {
                    this.padding.left = parseInt(v);
                    break;
                }
            }
            this.refreshSize();
        }, true);
    }
}
exports.default = default_1;
