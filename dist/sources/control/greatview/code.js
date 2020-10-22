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
        'default': 'v'
    },
    'padding': {
        'default': undefined
    },
    'scrollOffset': {
        'default': undefined
    },
    'same': {
        'default': false
    },
    'data': {
        'default': []
    }
};
exports.data = {
    'innerPos': {
        'start': 0,
        'end': 0
    },
    'showPos': {
        'start': 0,
        'end': 0
    },
    'dataHeight': [],
    'lineHeight': 0,
    'scrollOffsetData': 0,
    'client': 0,
    'length': 0,
    'refreshCount': 0,
    'lengthInit': false,
    'initFirst': false
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
    }
};
exports.computed = {
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
    'sameComp': function () {
        if (typeof this.same === 'boolean') {
            return this.same;
        }
        return this.same === 'true' ? true : false;
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
            let length = this.direction === 'v' ? this.paddingComp.top : this.paddingComp.left;
            if (this.dataComp.length === 0) {
                this.dataHeight = [];
                this.lineHeight = 0;
                this.length = length + (this.direction === 'v' ? this.paddingComp.bottom : this.paddingComp.right);
                return;
            }
            if (!this.sameComp) {
                let maxCursor = this.dataComp.length;
                let cursor = 0;
                let dataHeight = [];
                while (true) {
                    if (nowCount !== this.refreshCount) {
                        return;
                    }
                    let theCursor = cursor + 50;
                    if (theCursor > maxCursor) {
                        theCursor = maxCursor;
                    }
                    this.innerPos.start = cursor;
                    this.innerPos.end = theCursor;
                    yield this.$nextTick();
                    yield clickgo.tool.sleep(0);
                    if (nowCount !== this.refreshCount) {
                        return;
                    }
                    if (!this.$refs.inner) {
                        return;
                    }
                    for (let i = 0; i < this.$refs.inner.children.length; ++i) {
                        let item = this.$refs.inner.children.item(i);
                        let start = length;
                        let rect = item.getBoundingClientRect();
                        length += this.direction === 'v' ? rect.height : rect.width;
                        dataHeight[cursor + i] = {
                            'start': start,
                            'end': length
                        };
                    }
                    if (theCursor === maxCursor) {
                        break;
                    }
                    cursor = theCursor;
                }
                this.dataHeight = dataHeight;
            }
            else {
                this.innerPos.start = 0;
                this.innerPos.end = 1;
                yield this.$nextTick();
                yield clickgo.tool.sleep(0);
                if (nowCount !== this.refreshCount) {
                    return;
                }
                if (!this.$refs.inner) {
                    return;
                }
                let item = this.$refs.inner.children.item(0);
                if (item) {
                    let rect = item.getBoundingClientRect();
                    this.lineHeight = this.direction === 'v' ? rect.height : rect.width;
                }
                else {
                    this.lineHeight = 0;
                }
                length += this.lineHeight * this.dataComp.length;
            }
            this.innerPos.start = 0;
            this.innerPos.end = 0;
            length += this.direction === 'v' ? this.paddingComp.bottom : this.paddingComp.right;
            this.length = length;
            this.lengthInit = true;
            this.reShow();
        });
    },
    reShow: function () {
        if (!this.sameComp) {
            let overShow = false;
            for (let i = 0; i < this.dataComp.length; ++i) {
                let pos = this.dataHeight[i];
                if (!pos) {
                    return;
                }
                if ((pos.end > this.scrollOffsetData - 10) && (pos.start < this.scrollOffsetData + this.client + 10)) {
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
            let start = Math.floor((this.scrollOffsetData - 10) / this.lineHeight);
            let end = Math.ceil((this.scrollOffsetData + this.client + 10) / this.lineHeight);
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
    updateScrollOffset: function (val) {
        if (!this.lengthInit) {
            return;
        }
        if (!this.initFirst) {
            this.initFirst = true;
            if (this.scrollOffset) {
                this.$refs.view.goScroll(this.scrollOffset);
            }
            return;
        }
        this.scrollOffsetData = val;
        this.$emit('update:scroll-offset', val);
        this.reShow();
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
