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
exports.mounted = exports.methods = exports.computed = exports.watch = exports.data = exports.props = void 0;
exports.props = {
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': undefined
    },
    'top': {
        'default': undefined
    },
    'zIndex': {
        'default': undefined
    },
    'flex': {
        'default': undefined
    },
    'direction': {
        'default': 'h'
    },
    'padding': {
        'default': undefined
    },
    'adaptation': {
        'dafault': false
    },
    'scrollLeft': {
        'default': undefined
    },
    'scrollTop': {
        'default': undefined
    },
    'content': {
        'default': 'max',
    },
    'same': {
        'default': false
    },
    'data': {
        'default': []
    }
};
exports.data = {
    'compPos': {
        'start': 0,
        'end': 0
    },
    'showPos': {
        'start': 0,
        'end': 0
    },
    'dataHeight': [],
    'lineHeight': 0,
    'scrollLeftEmit': 0,
    'scrollTopEmit': 0,
    'lengthWidth': 0,
    'lengthHeight': 0,
    'client': 0,
    'clientWidth': 0,
    'clientHeight': 0,
    'refreshCount': 0,
    'lengthInit': false,
    'cgNest': true
};
exports.watch = {
    'data': {
        handler: function () {
            this.refreshView();
        },
        'deep': true
    },
    'direction': function () {
        this.refreshView();
    },
    'scrollLeft': function () {
        if (this.direction === 'h' && this.scrollLeftEmit !== this.scrollLeft) {
            this.scrollLeftEmit = this.scrollLeft;
            this.reShow();
        }
    },
    'scrollTop': function () {
        if (this.direction === 'v' && this.scrollTopEmit !== this.scrollTop) {
            this.scrollTopEmit = this.scrollTop;
            this.reShow();
        }
    }
};
exports.computed = {
    'isSame': function () {
        return clickgo.tool.getBoolean(this.same);
    },
    'isAdaptation': function () {
        return clickgo.tool.getBoolean(this.adaptation);
    },
    'dataComp': function () {
        if (typeof this.data !== 'number') {
            return this.data;
        }
        let list = [];
        for (let i = 1; i <= this.data; ++i) {
            list.push(i);
        }
        return list;
    },
    'paddingComp': function () {
        if (!this.padding) {
            return { 'top': 0, 'right': 0, 'bottom': 0, 'left': 0 };
        }
        let arr = this.padding.split(' ');
        for (let i = 0; i < arr.length; ++i) {
            arr[i] = Math.round(arr[i]);
        }
        switch (arr.length) {
            case 1: {
                return { 'top': arr[0], 'right': arr[0], 'bottom': arr[0], 'left': arr[0] };
            }
            case 2: {
                return { 'top': arr[0], 'right': arr[1], 'bottom': arr[0], 'left': arr[1] };
            }
            case 3: {
                return { 'top': arr[0], 'right': arr[1], 'bottom': arr[2], 'left': arr[1] };
            }
            default: {
                return { 'top': arr[0], 'right': arr[1], 'bottom': arr[2], 'left': arr[3] };
            }
        }
    }
};
exports.methods = {
    refreshView: function () {
        return __awaiter(this, void 0, void 0, function* () {
            let nowCount = ++this.refreshCount;
            let lengthWidth = this.paddingComp.left;
            let lengthHeight = this.paddingComp.top;
            if (this.dataComp.length === 0) {
                this.dataHeight = [];
                this.lineHeight = 0;
                this.lengthWidth = lengthWidth + this.paddingComp.right;
                this.lengthHeight = lengthHeight + this.paddingComp.bottom;
                return;
            }
            if (!this.isSame) {
                let maxCursor = this.dataComp.length;
                let cursor = 0;
                let anotherWOH = 0;
                let dataHeight = [];
                while (true) {
                    if (nowCount !== this.refreshCount) {
                        return;
                    }
                    let theCursor = cursor + 50;
                    if (theCursor > maxCursor) {
                        theCursor = maxCursor;
                    }
                    this.compPos.start = cursor;
                    this.compPos.end = theCursor;
                    yield this.$nextTick();
                    yield clickgo.tool.sleep(34);
                    if (nowCount !== this.refreshCount) {
                        return;
                    }
                    if (!this.$refs.comp) {
                        return;
                    }
                    for (let i = 0; i < this.$refs.comp.children.length; ++i) {
                        let item = this.$refs.comp.children.item(i);
                        let start = this.direction === 'v' ? lengthHeight : lengthWidth;
                        let rect = item.getBoundingClientRect();
                        if (this.direction === 'v') {
                            lengthHeight += rect.height;
                            if (anotherWOH < rect.width) {
                                anotherWOH = rect.width;
                            }
                        }
                        else {
                            lengthWidth += rect.width;
                            if (anotherWOH < rect.height) {
                                anotherWOH = rect.height;
                            }
                        }
                        dataHeight[cursor + i] = {
                            'start': start,
                            'end': this.direction === 'v' ? lengthHeight : lengthWidth
                        };
                    }
                    if (theCursor === maxCursor) {
                        break;
                    }
                    cursor = theCursor;
                }
                this.dataHeight = dataHeight;
                if (this.direction === 'v') {
                    lengthWidth += anotherWOH;
                }
                else {
                    lengthHeight += anotherWOH;
                }
            }
            else {
                this.compPos.start = 0;
                this.compPos.end = 1;
                yield this.$nextTick();
                yield clickgo.tool.sleep(0);
                if (nowCount !== this.refreshCount) {
                    return;
                }
                if (!this.$refs.comp) {
                    return;
                }
                let item = this.$refs.comp.children.item(0);
                if (item) {
                    let rect = item.getBoundingClientRect();
                    if (this.direction === 'v') {
                        this.lineHeight = rect.height;
                        lengthHeight += this.lineHeight * this.dataComp.length;
                        lengthWidth += rect.width;
                    }
                    else {
                        this.lineHeight = rect.width;
                        lengthWidth += this.lineHeight * this.dataComp.length;
                        lengthHeight += rect.height;
                    }
                }
                else {
                    this.lineHeight = 0;
                }
            }
            lengthWidth += this.paddingComp.right;
            lengthHeight += this.paddingComp.bottom;
            this.lengthWidth = lengthWidth;
            this.lengthHeight = lengthHeight;
            if (!this.lengthInit) {
                this.lengthInit = true;
                yield clickgo.tool.sleep(34);
                if (this.scrollLeft) {
                    this.scrollLeftEmit = this.scrollLeft;
                    this.$refs.view.goScroll(this.scrollLeft, 'left');
                }
                if (this.scrollTop) {
                    this.scrollTopEmit = this.scrollTop;
                    this.$refs.view.goScroll(this.scrollTop, 'top');
                }
            }
            this.reShow();
        });
    },
    reShow: function () {
        let scrollOffset = this.direction === 'v' ? this.scrollTopEmit : this.scrollLeftEmit;
        if (!this.isSame) {
            let overShow = false;
            for (let i = 0; i < this.dataComp.length; ++i) {
                let pos = this.dataHeight[i];
                if (!pos) {
                    return;
                }
                if ((pos.end > scrollOffset - 10) && (pos.start < scrollOffset + this.client + 10)) {
                    if (!overShow) {
                        overShow = true;
                        this.showPos.start = i;
                    }
                    if (!this.dataComp[i + 1]) {
                        this.showPos.end = i + 1;
                    }
                    continue;
                }
                if (overShow) {
                    this.showPos.end = i;
                    break;
                }
            }
        }
        else {
            if (this.lineHeight === 0) {
                this.showPos.start = this.showPos.end = 0;
                return;
            }
            let start = Math.floor((scrollOffset - 10) / this.lineHeight);
            let end = Math.ceil((scrollOffset + this.client + 10) / this.lineHeight);
            if (start < 0) {
                start = 0;
            }
            if (end > this.dataComp.length) {
                end = this.dataComp.length;
            }
            this.showPos.start = start;
            this.showPos.end = end;
        }
    },
    updateScrollOffset: function (val, pos) {
        if (!this.lengthInit) {
            return;
        }
        if (pos === 'left') {
            this.scrollLeftEmit = val;
            this.$emit('update:scrollLeft', val);
            if (this.direction === 'h') {
                this.reShow();
            }
        }
        else {
            this.scrollTopEmit = val;
            this.$emit('update:scrollTop', val);
            if (this.direction === 'v') {
                this.reShow();
            }
        }
    },
    onResize: function (val) {
        this.client = val;
        this.$emit('resize', val);
        if (this.direction === 'v') {
            this.clientHeight = val;
        }
        else {
            this.clientWidth = val;
        }
        if (!this.lengthInit) {
            return;
        }
        this.refreshView();
    },
    onResizen: function (val) {
        this.refreshView();
        this.$emit('resizen', val);
        if (this.direction === 'h') {
            this.clientHeight = val;
        }
        else {
            this.clientWidth = val;
        }
    },
    onChange: function (val) {
        this.$emit('change', val);
    }
};
exports.mounted = function () {
    this.refreshView();
    let mo = new MutationObserver(() => {
        this.refreshView();
    });
    mo.observe(this.$refs.view.$el, {
        'attributeFilter': ['style', 'class'],
        'attributes': true
    });
};
