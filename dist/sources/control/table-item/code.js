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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'width': 0,
            'minWidth': 50,
            'label': 'label',
            'sort': undefined,
            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined
        };
        this.index = 0;
        this.table = {
            'widthMap': {
                [this.index]: 0
            },
            'minWidthMap': {
                [this.index]: 0
            }
        };
    }
    get isFixed() {
        if (this.table.clientWidth < 500) {
            return undefined;
        }
        if (this.index === 0) {
            return this.table.isFixed?.left;
        }
        if (this.index === this.table.itemsLength - 1) {
            return this.table.isFixed?.right;
        }
        return undefined;
    }
    get isBase() {
        if (this.table.clientWidth < 500) {
            return undefined;
        }
        if (this.isFixed === 'left') {
            if (this.scrollLeft > 0) {
                return 'left';
            }
            return undefined;
        }
        if (this.isFixed === 'right') {
            if (this.scrollLeft < this.maxScrollLeft) {
                return 'right';
            }
            return undefined;
        }
        return undefined;
    }
    get scrollLeft() {
        return this.table.scrollLeft ?? 0;
    }
    get maxScrollLeft() {
        return this.table.maxScrollLeft ?? 0;
    }
    onMounted() {
        const table = this.parentByName('table');
        if (!table) {
            return;
        }
        this.index = clickgo.dom.index(this.element);
        table.refreshHeader();
        this.watch('label', (n) => {
            table.setHeaderLabel(this.index, n);
        });
        this.watch('width', () => {
            table.setHeaderWidth(this.index, this.propNumber('width'));
        });
        this.watch('minWidth', () => {
            table.setHeaderMinWidth(this.index, this.propNumber('minWidth'));
        });
        this.watch('sort', () => {
            table.setHeaderSort(this.index, this.props.sort === undefined ? undefined : this.propBoolean('sort'));
        });
        this.watch(() => {
            return table.itemsLength;
        }, () => {
            this.index = clickgo.dom.index(this.element);
        });
        this.table = table;
    }
    onUnmounted() {
        const table = this.parentByName('table');
        if (!table) {
            return;
        }
        table.refreshHeader();
    }
}
exports.default = default_1;
