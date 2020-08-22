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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
        }
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
        var list = [];
        for (var i = 1; i <= this.data; ++i) {
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
        var arr = this.padding.split(' ');
        for (var i = 0; i < arr.length; ++i) {
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
        return __awaiter(this, void 0, void 0, function () {
            var nowCount, length, maxCursor, cursor, dataHeight, theCursor, i, item, start, rect, item, rect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nowCount = ++this.refreshCount;
                        length = this.direction === 'v' ? this.paddingComp.top : this.paddingComp.left;
                        if (this.dataComp.length === 0) {
                            this.dataHeight = [];
                            this.lineHeight = 0;
                            this.length = length + (this.direction === 'v' ? this.paddingComp.bottom : this.paddingComp.right);
                            return [2];
                        }
                        if (!!this.sameComp) return [3, 5];
                        maxCursor = this.dataComp.length;
                        cursor = 0;
                        dataHeight = [];
                        _a.label = 1;
                    case 1:
                        if (!true) return [3, 4];
                        if (nowCount !== this.refreshCount) {
                            return [2];
                        }
                        theCursor = cursor + 50;
                        if (theCursor > maxCursor) {
                            theCursor = maxCursor;
                        }
                        this.innerPos.start = cursor;
                        this.innerPos.end = theCursor;
                        return [4, this.$nextTick()];
                    case 2:
                        _a.sent();
                        return [4, clickgo.tool.sleep(0)];
                    case 3:
                        _a.sent();
                        if (nowCount !== this.refreshCount) {
                            return [2];
                        }
                        if (!this.$refs.inner) {
                            return [2];
                        }
                        for (i = 0; i < this.$refs.inner.children.length; ++i) {
                            item = this.$refs.inner.children.item(i);
                            start = length;
                            rect = item.getBoundingClientRect();
                            length += this.direction === 'v' ? rect.height : rect.width;
                            dataHeight[cursor + i] = {
                                'start': start,
                                'end': length
                            };
                        }
                        if (theCursor === maxCursor) {
                            return [3, 4];
                        }
                        cursor = theCursor;
                        return [3, 1];
                    case 4:
                        this.dataHeight = dataHeight;
                        return [3, 8];
                    case 5:
                        this.innerPos.start = 0;
                        this.innerPos.end = 1;
                        return [4, this.$nextTick()];
                    case 6:
                        _a.sent();
                        return [4, clickgo.tool.sleep(0)];
                    case 7:
                        _a.sent();
                        if (nowCount !== this.refreshCount) {
                            return [2];
                        }
                        if (!this.$refs.inner) {
                            return [2];
                        }
                        item = this.$refs.inner.children.item(0);
                        if (item) {
                            rect = item.getBoundingClientRect();
                            this.lineHeight = this.direction === 'v' ? rect.height : rect.width;
                        }
                        else {
                            this.lineHeight = 0;
                        }
                        length += this.lineHeight * this.dataComp.length;
                        _a.label = 8;
                    case 8:
                        this.innerPos.start = 0;
                        this.innerPos.end = 0;
                        length += this.direction === 'v' ? this.paddingComp.bottom : this.paddingComp.right;
                        this.length = length;
                        this.lengthInit = true;
                        this.reShow();
                        return [2];
                }
            });
        });
    },
    reShow: function () {
        if (!this.sameComp) {
            var overShow = false;
            for (var i = 0; i < this.dataComp.length; ++i) {
                var pos = this.dataHeight[i];
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
            var start = Math.floor((this.scrollOffsetData - 10) / this.lineHeight);
            var end = Math.ceil((this.scrollOffsetData + this.client + 10) / this.lineHeight);
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
        this.$emit('update:scrollOffset', val);
        this.reShow();
    }
};
exports.mounted = function () {
    var _this = this;
    this.refreshView();
    var mo = new MutationObserver(function () {
        _this.refreshView();
    });
    mo.observe(this.$children[0].$el, {
        'attributeFilter': ['style', 'class'],
        'attributes': true
    });
};
