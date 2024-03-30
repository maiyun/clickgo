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
        this.emits = {
            'sort': null,
            'select': null,
            'gesture': null,
            'update:modelValue': null
        };
        this.props = {
            'disabled': false,
            'must': true,
            'multi': false,
            'ctrl': true,
            'selection': false,
            'gesture': [],
            'scroll': 'auto',
            'sort': false,
            'split': false,
            'virtual': false,
            'data': [],
            'sizes': {},
            'modelValue': []
        };
        this.items = [];
        this.widthMap = [];
        this.nowSort = {
            'index': -1,
            'sort': 'desc'
        };
    }
    get itemsLength() {
        return this.items.length;
    }
    arrowUp() {
        this.refs.gl.arrowUp();
    }
    arrowDown() {
        this.refs.gl.arrowDown();
    }
    setHeaderLabel(index, n) {
        const item = this.items[index];
        if (!item) {
            return;
        }
        item.label = n;
    }
    setHeaderWidth(index, width) {
        if (this.widthMap[index] === undefined) {
            return;
        }
        this.widthMap[index] = width;
    }
    setHeaderSort(index, sort) {
        const item = this.items[index];
        if (!item) {
            return;
        }
        item.sort = sort;
    }
    updateScrollLeft(sl) {
        this.refs.header.scrollLeft = sl;
    }
    refreshHeader() {
        var _a;
        const slots = this.slotsAll('default');
        this.items.length = 0;
        this.widthMap.length = 0;
        for (const slot of slots) {
            const width = slot.props.width ? parseInt(slot.props.width) : 0;
            this.items.push({
                'label': (_a = slot.props.label) !== null && _a !== void 0 ? _a : '',
                'width': width,
                'sort': slot.props.sort !== undefined ? clickgo.tool.getBoolean(slot.props.sort) : slot.props.sort
            });
            this.widthMap.push(this.propBoolean('split') ? (width ? width : 150) : width);
        }
        this.checkNowSort();
    }
    checkNowSort() {
        if (this.nowSort.index === -1) {
            return;
        }
        for (let i = 0; i < this.items.length; ++i) {
            if (i !== this.nowSort.index) {
                continue;
            }
            const item = this.items[i];
            const sort = item.sort === undefined ? this.propBoolean('sort') : item.sort;
            if (sort) {
                return;
            }
            break;
        }
        this.nowSort.index = -1;
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'index': -1,
                'label': '',
                'sort': 'desc'
            }
        };
        this.emit('sort', event);
    }
    headerClick(e, i) {
        clickgo.dom.bindClick(e, () => {
            const item = this.items[i];
            const sort = item.sort === undefined ? this.propBoolean('sort') : item.sort;
            if (!sort) {
                return;
            }
            const event = {
                'go': true,
                preventDefault: function () {
                    this.go = false;
                },
                'detail': {
                    'index': i,
                    'label': item.label,
                    'sort': 'desc'
                }
            };
            if (this.nowSort.index !== i) {
                this.emit('sort', event);
                if (!event.go) {
                    return;
                }
                this.nowSort.index = i;
                this.nowSort.sort = 'desc';
                return;
            }
            if (this.nowSort.sort === 'desc') {
                event.detail.sort = 'asc';
                this.emit('sort', event);
                if (!event.go) {
                    return;
                }
                this.nowSort.index = i;
                this.nowSort.sort = 'asc';
                return;
            }
            event.detail.index = -1;
            event.detail.label = '';
            this.emit('sort', event);
            if (!event.go) {
                return;
            }
            this.nowSort.index = -1;
        });
    }
    bindResize(e, i) {
        const el = e.currentTarget.parentNode;
        clickgo.dom.bindResize(e, {
            'object': el,
            'border': 'r',
            'minWidth': 50,
            'move': (left, top, width) => {
                this.widthMap[i] = width;
            }
        });
    }
    onMounted() {
        this.watch('sort', () => {
            this.checkNowSort();
        });
        this.watch('split', () => {
            if (this.props.split) {
                for (let i = 0; i < this.items.length; ++i) {
                    if (this.items[i].width > 0) {
                        continue;
                    }
                    this.widthMap[i] = this.refs.header.children[i].offsetWidth;
                }
            }
            else {
                for (let i = 0; i < this.items.length; ++i) {
                    const item = this.items[i];
                    if (item.width === this.widthMap[i]) {
                        continue;
                    }
                    this.widthMap[i] = item.width;
                }
            }
        }, {
            'immediate': true
        });
    }
}
exports.default = default_1;
