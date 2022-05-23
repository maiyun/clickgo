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
exports.watch = exports.data = void 0;
exports.data = {
    'ntab': '',
    'area': 'all',
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
    'disabled': false,
    'slist2': [
        'haha1', 'haha2', 'haha3', 'haha4', {
            'value': 'ha5',
            'label': 'The value is ha5'
        }, {
            'value': 'ha6',
            'label': 'Can not be selected',
            'disabled': true
        }, {
            'value': 'title',
            'children': [
                {
                    'label': 'sub1label'
                }, {
                    'label': 'sub2'
                }, {
                    'label': 'Sub title',
                    'children': ['1', '2']
                }
            ]
        }, {
            'label': 'happy',
            'children': ['xixi', 'xixida', 'gogogo']
        }
    ],
    'select2': 'haha2',
    'editable': false,
    'padding': false,
    'fontSize': false,
    'background': false
};
exports.watch = {
    'select': function (n, o) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.slist[n].type === 0) {
                return;
            }
            yield this.$nextTick();
            if (this.slist[o].type === 0) {
                this.select = o;
                return;
            }
            this.select = 0;
        });
    }
};
