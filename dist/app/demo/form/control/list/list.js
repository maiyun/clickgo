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
        this.ntab = '';
        this.slist = [
            {
                'type': 0,
                'name': 'Appraise',
                'path': 'Bob >> folder >> Appraise',
                'src': '/package/res/r-1.svg'
            },
            {
                'type': 0,
                'name': 'Card',
                'path': 'Bob >> folder >> Card',
                'src': '/package/res/r-2.svg',
                'menu': true
            },
            {
                'type': 0,
                'name': 'Appraise2',
                'path': 'Bob >> folder >> Appraise2',
                'src': '/package/res/r-1.svg',
                'disabled': true
            },
            {
                'control': 'split'
            },
            {
                'type': 1
            }
        ];
        this.select = [];
        this.select2 = ['Appraise'];
        this.label2 = [''];
        this.selectObject = ['test'];
        this.listDataObject = {
            'test': 'This is test',
            '-1': 'This is number',
            'other': 'This is other',
            'same': 'same'
        };
        this.sub6children = [];
        this.select3 = [0];
        this.listData3 = [];
        this.select4 = [];
        this.listData4 = [];
        this.disabled = false;
        this.must = true;
        this.multi = false;
        this.ctrl = true;
        this.selection = false;
        this.gesture = false;
        this.selectionArea = {};
        this.tree = false;
        this.async = false;
        this.icon = false;
        this.scroll = 'auto';
        this.virtual = false;
        this.check = false;
    }
    get sizes() {
        const rtn = {};
        for (let i = 0; i < this.slist.length; ++i) {
            if (this.slist[i].control === 'split') {
                rtn[i] = 3;
                continue;
            }
            if (this.slist[i].type === 1) {
                rtn[i] = 31;
                continue;
            }
        }
        return rtn;
    }
    get adData() {
        const data = [];
        for (let i = 0; i < this.slist.length; ++i) {
            const item = this.slist[i];
            data.push({
                'type': item.type === undefined ? 'split' : item.type,
                'menu': i === 20 ? true : false
            });
        }
        return data;
    }
    get listData() {
        const data = ['Item1', {
                'label': 'Tip',
                'color': 'tip'
            }, {
                'label': 'Title1',
                'children': [
                    'Sub1',
                    {
                        'label': 'Title2',
                        'children': ['Sub2', 'Sub3'],
                        'icon': '../../../res/zip.svg',
                        'openicon': '../../../res/sql.svg'
                    },
                    'Sub4',
                    {
                        'label': 'Title3',
                        'title': true,
                        'children': ['Sub5',
                            {
                                'value': 'Sub6',
                                'children': this.sub6children
                            }
                        ],
                        'tree': 1
                    }
                ]
            }];
        for (let k = 0; k < this.slist.length; ++k) {
            if (this.slist[k].name) {
                data.push({
                    'label': `index: ${k}, value: ${this.slist[k].name}${(k === 20 ? ' long test long test long test long test long test' : '')}`,
                    'value': this.slist[k].name,
                    'disabled': this.slist[k].disabled
                });
            }
            else {
                data.push({
                    'label': `index: ${k}, value: i${k}${(k === 20 ? ' long test long test long test long test long test' : '')}`,
                    'value': 'i' + k.toString(),
                    'disabled': true
                });
            }
        }
        return data;
    }
    get listData2() {
        const data = [];
        for (let k = 0; k < this.listData.length; k++) {
            data.push(k + 1);
        }
        return data;
    }
    showIndex() {
        clickgo.form.dialog('Index is ' + this.select.toString() + '.').catch((e) => { throw e; });
    }
    showIndex2() {
        clickgo.form.dialog('Index is ' + this.select2.toString() + '.').catch((e) => { throw e; });
    }
    showType() {
        if (this.select.length === 0) {
            clickgo.form.dialog('There are currently no selected items.').catch((e) => { throw e; });
        }
        else {
            const types = [];
            for (const item of this.select) {
                types.push(this.slist[item].type);
            }
            clickgo.form.dialog(`Type is ${types}.`).catch((e) => { throw e; });
        }
    }
    selectButton() {
        if (this.ntab === 'list') {
            this.select2 = ['Item1'];
        }
        else {
            this.select = [1];
        }
    }
    selectButtonList() {
        this.select2 = ['Sub3'];
    }
    onSelectLoad(value, resolve) {
        return __awaiter(this, void 0, void 0, function* () {
            if (value !== 'Sub6') {
                yield clickgo.tool.sleep(100);
                if (value === 'Sub8') {
                    resolve(['Sub9', 'Sub10']);
                }
                else {
                    resolve();
                }
                return;
            }
            yield clickgo.tool.sleep(300);
            this.sub6children = ['Sub7', 'Sub8'];
        });
    }
    onSelect(area) {
        this.selectionArea = area;
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
    onGesture(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog('onGesture: ' + dir);
        });
    }
    onGAdd(e) {
        clickgo.form.notify({
            'type': 'info',
            'title': 'Greatlist @add',
            'content': 'value: ' + e.detail.value.toString()
        });
    }
    onGRemove(e) {
        clickgo.form.notify({
            'type': 'info',
            'title': 'Greatlist @remove',
            'content': 'value: ' + e.detail.value.toString()
        });
    }
    onLAdd(e) {
        clickgo.form.notify({
            'type': 'info',
            'title': 'List @add',
            'content': 'value: ' + e.detail.value
        });
    }
    onLRemove(e) {
        clickgo.form.notify({
            'type': 'info',
            'title': 'List @remove',
            'content': 'value: ' + e.detail.value
        });
    }
}
exports.default = default_1;
