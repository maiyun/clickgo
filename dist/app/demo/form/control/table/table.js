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
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.loadFirst = false;
        this.val = [];
        this.data = [];
        this.adaptation = false;
        this.disabled = false;
        this.must = true;
        this.multi = false;
        this.ctrl = true;
        this.selection = false;
        this.gesture = false;
        this.selectionArea = {};
        this.scroll = 'auto';
        this.sort = undefined;
        this.nowSort = [];
        this.index = false;
        this.split = false;
        this.virtual = false;
    }
    get sizes() {
        const rtn = {};
        for (let i = 0; i < this.data.length; ++i) {
            if (this.data[i].control === 'split') {
                rtn[i] = 3;
                continue;
            }
        }
        return rtn;
    }
    onGesture(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('onGesture: ' + dir);
        });
    }
    onSelect(area) {
        this.selectionArea = area;
    }
    onSort(label, sort) {
        this.nowSort.length = 0;
        if (!label) {
            return;
        }
        this.nowSort.push(label);
        this.nowSort.push(sort !== null && sort !== void 0 ? sort : 'asc');
        this.refreshSort();
    }
    refreshSort() {
        if (this.nowSort[0] === 'name') {
            this.data.sort((a, b) => {
                var _a, _b;
                const aname = (_a = a.name) !== null && _a !== void 0 ? _a : 'name';
                const bname = (_b = b.name) !== null && _b !== void 0 ? _b : 'name';
                if (this.nowSort[1] === 'asc') {
                    return aname.localeCompare(bname);
                }
                else {
                    return bname.localeCompare(aname);
                }
            });
            return;
        }
        this.data.sort((a, b) => {
            var _a, _b;
            const atype = (_a = a.type) !== null && _a !== void 0 ? _a : 0;
            const btype = (_b = b.type) !== null && _b !== void 0 ? _b : 0;
            if (this.nowSort[1] === 'asc') {
                return atype - btype;
            }
            else {
                return btype - atype;
            }
        });
    }
    showIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('Index is ' + this.val[0].toString() + '.');
        });
    }
    scrollChange() {
        switch (this.scroll) {
            case 'auto': {
                this.scroll = 'visible';
                break;
            }
            case 'visible': {
                this.scroll = 'hidden';
                break;
            }
            default: {
                this.scroll = 'auto';
            }
        }
    }
    sortChange() {
        switch (this.sort) {
            case true: {
                this.sort = false;
                break;
            }
            case false: {
                this.sort = undefined;
                break;
            }
            default: {
                this.sort = true;
            }
        }
    }
    load() {
        this.data = [
            {
                'type': 0,
                'name': 'Appraise'
            },
            {
                'type': 0,
                'name': 'Card',
            },
            {
                'type': 0,
                'name': 'Appraise2',
                'disabled': true
            },
            {
                'control': 'split'
            },
            {
                'type': 1
            }
        ];
        this.loadFirst = true;
    }
}
exports.default = default_1;
