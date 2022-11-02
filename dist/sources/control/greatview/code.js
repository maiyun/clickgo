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
            'scrollLeft': -1,
            'scrollTop': -1,
            'content': '',
            'selection': false,
            'same': false,
            'solo': true,
            'data': [],
            'itemsSize': []
        };
        this.padding = '';
        this.paddingChild = {
            'top': 0,
            'right': 0,
            'bottom': 0,
            'left': 0
        };
        this.showPos = {
            'start': 0,
            'end': 0
        };
        this.selectPos = {
            'start': 0,
            'end': 0
        };
        this.itemsPos = [];
        this.needItemsComp = [];
        this.scrollLeftEmit = 0;
        this.scrollTopEmit = 0;
        this.length = 0;
        this.lengthWidth = 0;
        this.lengthHeight = 0;
        this.client = 0;
        this.clientWidth = 0;
        this.clientHeight = 0;
        this.refreshCount = 0;
        this.lengthInit = false;
        this.reShowing = false;
    }
    get isSame() {
        return clickgo.tool.getBoolean(this.props.same);
    }
    get isSelection() {
        return clickgo.tool.getBoolean(this.props.selection);
    }
    get isSolo() {
        return clickgo.tool.getBoolean(this.props.solo);
    }
    get dataComp() {
        if (typeof this.props.data !== 'number') {
            return this.props.data;
        }
        const list = [];
        for (let i = 1; i <= this.props.data; ++i) {
            list.push(i);
        }
        return list;
    }
    get scrollOffset() {
        return this.props.direction === 'v' ? this.scrollTopEmit : this.scrollLeftEmit;
    }
    get itemStyle() {
        return (index) => {
            return {
                'left': (this.props.direction === 'v' ?
                    this.paddingChild.left :
                    (this.itemsPos[index] ?
                        this.itemsPos[index].start :
                        '0')) + 'px',
                'top': (this.props.direction === 'v' ?
                    (this.itemsPos[index] ?
                        this.itemsPos[index].start :
                        '0') :
                    this.paddingChild.top) + 'px',
                'min-width': (this.props.direction === 'v' ?
                    `calc(100% - ${this.paddingChild.left + this.paddingChild.right}px)` :
                    undefined),
                'min-height': (this.props.direction === 'v' ?
                    undefined :
                    `calc(100% - ${this.paddingChild.top + this.paddingChild.bottom}px)`)
            };
        };
    }
    get opMargin() {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
    refreshView() {
        return __awaiter(this, void 0, void 0, function* () {
            const nowCount = ++this.refreshCount;
            let lengthWidth = this.paddingChild.left;
            let lengthHeight = this.paddingChild.top;
            if (this.dataComp.length === 0) {
                this.lengthWidth = lengthWidth + this.paddingChild.right;
                this.lengthHeight = lengthHeight + this.paddingChild.bottom;
                this.length = this.props.direction === 'v' ? this.lengthHeight : this.lengthWidth;
                return;
            }
            yield clickgo.tool.sleep(0);
            if (nowCount !== this.refreshCount) {
                return;
            }
            const maxCursor = this.dataComp.length;
            let cursor = 0;
            let anotherMax = 0;
            const itemsSize = [];
            const itemsSizeAlias = {};
            while (true) {
                if (nowCount !== this.refreshCount) {
                    return;
                }
                const needItemsComp = [];
                for (let i = cursor; i < maxCursor; ++i) {
                    const type = typeof this.props.itemsSize[i];
                    if (type === 'number') {
                        cursor = i;
                        continue;
                    }
                    if (type === 'string') {
                        if (itemsSizeAlias[this.props.itemsSize[i]] !== undefined) {
                            cursor = i;
                            continue;
                        }
                        else {
                            itemsSizeAlias[this.props.itemsSize[i]] = -1;
                        }
                    }
                    else if (this.isSame) {
                        if (itemsSizeAlias['cg-same'] !== undefined) {
                            cursor = i;
                            continue;
                        }
                        else {
                            itemsSizeAlias['cg-same'] = -1;
                        }
                    }
                    needItemsComp.push(i);
                    if (needItemsComp.length === 50) {
                        cursor = i;
                        break;
                    }
                    cursor = i;
                }
                this.needItemsComp = needItemsComp;
                yield this.nextTick();
                if (nowCount !== this.refreshCount) {
                    return;
                }
                if (!this.refs.comp || !this.refs.comp.offsetParent) {
                    return;
                }
                for (let i = 0; i < this.refs.comp.children.length; ++i) {
                    const item = this.refs.comp.children.item(i);
                    const rect = item.getBoundingClientRect();
                    const theCursor = parseInt(item.dataset.cursor);
                    let size = 0;
                    if (this.props.direction === 'v') {
                        size = rect.height;
                        if (anotherMax < rect.width) {
                            anotherMax = rect.width;
                        }
                    }
                    else {
                        size = rect.width;
                        if (anotherMax < rect.height) {
                            anotherMax = rect.height;
                        }
                    }
                    if (typeof this.props.itemsSize[theCursor] === 'string') {
                        itemsSizeAlias[itemsSize[theCursor]] = size;
                    }
                    else if (this.isSame) {
                        itemsSizeAlias['cg-same'] = size;
                    }
                    else {
                        itemsSize[theCursor] = size;
                    }
                }
                if (cursor + 1 === maxCursor) {
                    break;
                }
                ++cursor;
            }
            const itemsPos = [];
            for (let i = 0; i < maxCursor; ++i) {
                let size = 0;
                if (this.props.itemsSize[i] !== undefined) {
                    const type = typeof this.props.itemsSize[i];
                    if (type === 'number') {
                        size = this.props.itemsSize[i];
                    }
                    else {
                        size = itemsSizeAlias[this.props.itemsSize[i]];
                    }
                }
                else if (this.isSame) {
                    size = itemsSizeAlias['cg-same'];
                }
                else {
                    size = itemsSize[i];
                }
                const start = this.props.direction === 'v' ? lengthHeight : lengthWidth;
                const end = start + size;
                itemsPos.push({
                    'start': start,
                    'end': end
                });
                if (this.props.direction === 'v') {
                    lengthHeight += size;
                }
                else {
                    lengthWidth += size;
                }
            }
            if (this.props.direction === 'v') {
                lengthWidth += anotherMax;
            }
            else {
                lengthHeight += anotherMax;
            }
            lengthWidth += this.paddingChild.right;
            lengthHeight += this.paddingChild.bottom;
            this.lengthWidth = lengthWidth;
            this.lengthHeight = lengthHeight;
            this.length = this.props.direction === 'v' ? this.lengthHeight : this.lengthWidth;
            this.itemsPos = itemsPos;
            if (!this.lengthInit) {
                this.lengthInit = true;
                yield clickgo.tool.sleep(34);
                if (this.props.scrollLeft >= 0) {
                    this.scrollLeftEmit = this.props.scrollLeft;
                    this.refs.view.goScroll(this.props.scrollLeft, 'left');
                }
                if (this.props.scrollTop >= 0) {
                    this.scrollTopEmit = this.props.scrollTop;
                    this.refs.view.goScroll(this.props.scrollTop, 'top');
                }
            }
            this.emit('itemsposchange');
            this.reShow();
        });
    }
    refreshPos(pos, area) {
        if (this.length <= area.start) {
            return {
                'start': -1,
                'end': -1
            };
        }
        const rtn = { 'start': pos.start, 'end': pos.end };
        let needFind = false;
        const startShow = this.isInArea(rtn.start, area);
        const endShow = this.isInArea(rtn.end, area);
        if (startShow) {
            for (let i = rtn.start - 1; i >= 0; --i) {
                if (this.isInArea(i, area)) {
                    rtn.start = i;
                    continue;
                }
                break;
            }
        }
        else {
            let found = false;
            const jmax = endShow ? 999 : 3;
            for (let i = rtn.start + 1, j = 0; i < this.dataComp.length && j < jmax; ++i, ++j) {
                if (!this.isInArea(i, area)) {
                    continue;
                }
                found = true;
                rtn.start = i;
                break;
            }
            if (!found) {
                needFind = true;
            }
        }
        if (endShow) {
            for (let i = rtn.end + 1; i < this.dataComp.length; ++i) {
                if (this.isInArea(i, area)) {
                    rtn.end = i;
                    continue;
                }
                break;
            }
        }
        else {
            let found = false;
            const jmax = startShow ? 999 : 3;
            for (let i = rtn.end - 1, j = 0; i >= 0 && j < jmax; --i, ++j) {
                if (!this.isInArea(i, area)) {
                    continue;
                }
                found = true;
                rtn.end = i;
                break;
            }
            if (!found) {
                needFind = true;
            }
        }
        if (needFind) {
            let firstShow = false;
            if (!this.itemsPos[rtn.start]) {
                rtn.start = 0;
                if (!this.itemsPos[rtn.start]) {
                    return { 'start': 0, 'end': 0 };
                }
            }
            if (area.start < this.itemsPos[rtn.start].start) {
                for (let i = rtn.start; i >= 0; --i) {
                    if (this.isInArea(i, area)) {
                        if (!firstShow) {
                            firstShow = true;
                            rtn.end = i;
                        }
                        if (!this.dataComp[i - 1]) {
                            rtn.start = i;
                        }
                        continue;
                    }
                    if (firstShow) {
                        rtn.start = i + 1;
                        break;
                    }
                }
            }
            else {
                for (let i = rtn.start; i < this.dataComp.length; ++i) {
                    if (this.isInArea(i, area)) {
                        if (!firstShow) {
                            firstShow = true;
                            rtn.start = i;
                        }
                        if (!this.dataComp[i + 1]) {
                            rtn.end = i;
                        }
                        continue;
                    }
                    if (firstShow) {
                        rtn.end = i - 1;
                        break;
                    }
                }
            }
        }
        return rtn;
    }
    reShow() {
        this.reShowing = true;
        const rtn = this.refreshPos(this.showPos, {
            'start': this.scrollOffset - 20,
            'end': this.scrollOffset + this.client + 20
        });
        this.showPos.start = rtn.start;
        this.showPos.end = rtn.end;
        this.nextTick().then(() => {
            this.reShowing = false;
        }).catch(() => {
        });
    }
    isInArea(i, area) {
        const pos = this.itemsPos[i];
        if (!pos) {
            return false;
        }
        if ((pos.end > area.start) && (pos.start < area.end)) {
            return true;
        }
        return false;
    }
    updateScrollOffset(val, pos) {
        if (!this.lengthInit) {
            return;
        }
        if (pos === 'left') {
            this.scrollLeftEmit = val;
            this.emit('update:scrollLeft', val);
            if (this.props.direction === 'h') {
                this.reShow();
            }
        }
        else {
            this.scrollTopEmit = val;
            this.emit('update:scrollTop', val);
            if (this.props.direction === 'v') {
                this.reShow();
            }
        }
    }
    onResize(val) {
        this.client = val;
        this.emit('resize', val);
        if (this.props.direction === 'v') {
            this.clientHeight = val;
        }
        else {
            this.clientWidth = val;
        }
        if (!this.lengthInit) {
            return;
        }
        this.refreshView().catch((e) => { console.log(e); });
    }
    onResizen(val) {
        this.emit('resizen', val);
        if (this.props.direction === 'h') {
            this.clientHeight = val;
        }
        else {
            this.clientWidth = val;
        }
        this.refreshView().catch((e) => { console.log(e); });
    }
    onChange(val) {
        if (!this.lengthInit) {
            return;
        }
        this.emit('change', val);
    }
    onSelect(area) {
        const offset = this.props.direction === 'v' ? area.y : area.x;
        const length = this.props.direction === 'v' ? area.height : area.width;
        const rtn = this.refreshPos(this.selectPos, {
            'start': offset,
            'end': offset + length
        });
        this.selectPos.start = rtn.start;
        this.selectPos.end = rtn.end;
        area.start = rtn.start;
        area.end = rtn.end;
        this.emit('select', area);
    }
    getPos(val) {
        return this.itemsPos[val];
    }
    onMounted() {
        this.watch('data', () => {
            this.refreshView().catch((e) => { console.log(e); });
        }, {
            'deep': true
        });
        this.watch('direction', () => {
            this.refreshView().catch((e) => { console.log(e); });
        });
        this.watch('scrollLeft', () => {
            if (this.props.direction === 'h' && this.scrollLeftEmit !== this.props.scrollLeft && this.props.scrollLeft >= 0) {
                this.scrollLeftEmit = this.props.scrollLeft;
                this.reShow();
            }
        });
        this.watch('scrollTop', () => {
            if (this.props.direction === 'v' && this.scrollTopEmit !== this.props.scrollTop && this.props.scrollTop >= 0) {
                this.scrollTopEmit = this.props.scrollTop;
                this.reShow();
            }
        });
        clickgo.dom.watchStyle(this.element, ['padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'font'], (n, v) => {
            switch (n) {
                case 'padding': {
                    this.padding = v;
                    break;
                }
                case 'padding-top': {
                    this.paddingChild.top = parseInt(v);
                    break;
                }
                case 'padding-right': {
                    this.paddingChild.right = parseInt(v);
                    break;
                }
                case 'padding-bottom': {
                    this.paddingChild.bottom = parseInt(v);
                    break;
                }
                case 'padding-left': {
                    this.paddingChild.left = parseInt(v);
                    break;
                }
            }
            this.refreshView().catch((e) => { console.log(e); });
        }, true);
        clickgo.dom.watch(this.element, () => {
            if (this.reShowing) {
                return;
            }
            this.refreshView().catch((e) => { console.log(e); });
        }, 'childsub');
    }
}
exports.default = default_1;
