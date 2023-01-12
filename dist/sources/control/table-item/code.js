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
            'width': 0,
            'label': 'label',
            'sort': undefined
        };
        this.table = {
            'widthMap': {
                [this.props.label]: 0
            }
        };
    }
    onMounted() {
        const table = this.parentByName('table');
        if (!table) {
            return;
        }
        table.refreshHeader();
        this.watch('label', (n, o) => {
            table.setHeaderLabel(n, o);
        });
        this.watch('width', () => {
            table.setHeaderWidth(this.props.label, this.propNumber('width'));
        });
        this.watch('sort', () => {
            table.setHeaderSort(this.props.label, this.props.sort === undefined ? undefined : this.propBoolean('sort'));
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
