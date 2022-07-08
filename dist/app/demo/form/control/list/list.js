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
exports.methods = exports.computed = exports.data = void 0;
const clickgo = require("clickgo");
exports.data = {
    'ntab': '',
    'slist': [
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
    ],
    'select': 0,
    'select2': 'Appraise',
    'label2': '',
    'tree': false,
    'async': false,
    'icon': false,
    'sub6children': [],
    'select3': 0,
    'listData3': [],
    'select4': '',
    'listData4': [],
    'disabled': false,
    'must': true,
    'multi': false,
    'selection': false,
    'selectionArea': {},
    'scroll': 'auto'
};
exports.computed = {
    'adData': function () {
        const data = [];
        for (let i = 0; i < this.slist.length; ++i) {
            const item = this.slist[i];
            data.push({
                'type': item.type === undefined ? 'split' : item.type,
                'menu': i === 20 ? true : false
            });
        }
        return data;
    },
    'listData': function () {
        const data = ['Item1', {
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
    },
    'listData2': function () {
        const data = [];
        for (let k = 0; k < this.listData.length; k++) {
            data.push(k + 1);
        }
        return data;
    }
};
exports.methods = {
    showIndex: function () {
        clickgo.form.dialog('Index is ' + this.select.toString() + '.').catch((e) => { throw e; });
    },
    showIndex2: function () {
        clickgo.form.dialog('Index is ' + this.select2.toString() + '.').catch((e) => { throw e; });
    },
    showType: function () {
        if (Array.isArray(this.select)) {
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
        else {
            clickgo.form.dialog(this.select === -1 ? 'There are currently no selected items.' : `Type is ${this.slist[this.select].type}.`).catch((e) => { throw e; });
        }
    },
    selectButton: function () {
        if (this.ntab === 'list') {
            this.select2 = 'Item1';
        }
        else {
            this.select = 1;
        }
    },
    selectButtonList: function () {
        this.select2 = 'Sub3';
    },
    onSelectLoad: function (value, resolve) {
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
    },
    onSelect: function (area) {
        this.selectionArea = area;
    },
    scrollChange: function () {
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
};
