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
        this.widthMap = {};
        this.nowSort = [];
    }
    arrowUp() {
        this.refs.gl.arrowUp();
    }
    arrowDown() {
        this.refs.gl.arrowDown();
    }
    setHeaderLabel(n, old) {
        for (const item of this.items) {
            if (item.label !== old) {
                continue;
            }
            item.label = n;
            this.widthMap[n] = this.widthMap[old];
            delete this.widthMap[old];
            break;
        }
    }
    setHeaderWidth(n, width) {
        if (this.widthMap[n] === undefined) {
            return;
        }
        this.widthMap[n] = width;
    }
    setHeaderSort(n, sort) {
        for (const item of this.items) {
            if (item.label !== n) {
                continue;
            }
            item.sort = sort;
            break;
        }
    }
    updateScrollLeft(sl) {
        this.refs.header.scrollLeft = sl;
    }
    refreshHeader() {
        const slots = this.slotsAll('default');
        if (slots.length === this.items.length) {
            return;
        }
        this.items.length = 0;
        this.widthMap = {};
        for (const slot of slots) {
            if (!slot.props.label) {
                continue;
            }
            const width = slot.props.width ? parseInt(slot.props.width) : 0;
            this.items.push({
                'label': slot.props.label,
                'width': width,
                'sort': slot.props.sort !== undefined ? clickgo.tool.getBoolean(slot.props.sort) : slot.props.sort
            });
            this.widthMap[slot.props.label] = this.propBoolean('split') ? (width ? width : 150) : width;
        }
        this.checkNowSort();
    }
    checkNowSort() {
        if (!this.nowSort.length) {
            return;
        }
        for (const item of this.items) {
            if (item.label !== this.nowSort[0]) {
                continue;
            }
            const sort = item.sort === undefined ? this.propBoolean('sort') : item.sort;
            if (sort) {
                return;
            }
            break;
        }
        this.nowSort.length = 0;
        this.emit('sort');
    }
    headerClick(e, i) {
        clickgo.dom.bindClick(e, () => {
            const item = this.items[i];
            const sort = item.sort === undefined ? this.propBoolean('sort') : item.sort;
            if (!sort) {
                return;
            }
            if (this.nowSort[0] !== item.label) {
                this.nowSort.length = 0;
                this.nowSort.push(item.label);
                this.nowSort.push('desc');
                this.emit('sort', item.label, 'desc');
                return;
            }
            if (this.nowSort[1] === 'desc') {
                this.nowSort[1] = 'asc';
                this.emit('sort', item.label, 'asc');
                return;
            }
            this.nowSort.length = 0;
            this.emit('sort');
        });
    }
    bindResize(e, i) {
        const el = e.currentTarget.parentNode;
        clickgo.dom.bindResize(e, {
            'object': el,
            'border': 'r',
            'minWidth': 50,
            'move': (left, top, width) => {
                this.widthMap[this.items[i].label] = width;
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
                    this.widthMap[this.items[i].label] = this.refs.header.children[i].offsetWidth;
                }
            }
            else {
                for (const item of this.items) {
                    if (item.width === this.widthMap[item.label]) {
                        continue;
                    }
                    this.widthMap[item.label] = item.width;
                }
            }
        }, {
            'immediate': true
        });
    }
}
exports.default = default_1;
