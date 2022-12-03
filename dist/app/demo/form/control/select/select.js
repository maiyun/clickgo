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
const clickgo = require("clickgo");
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.ntab = '';
        this.area = 'all';
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
        this.slist2 = [
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
        ];
        this.slist2r = [];
        this.select2 = ['haha2'];
        this.label2 = [];
        this.padding = false;
        this.fontSize = false;
        this.background = false;
        this.disabled = false;
        this.multi = false;
        this.editable = false;
        this.tree = false;
        this.async = false;
        this.icon = false;
        this.remote = false;
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
    onLoad(value, resolve) {
        return __awaiter(this, void 0, void 0, function* () {
            if (value !== 'haha4') {
                yield clickgo.tool.sleep(100);
                if (value === '2') {
                    resolve(['60']);
                }
                else {
                    resolve();
                }
                return;
            }
            yield clickgo.tool.sleep(300);
            resolve(['he', 'ha']);
        });
    }
    onRemote(value, resolve) {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.tool.sleep(300);
            if (value === '8') {
                this.slist2r = [];
                resolve();
                return;
            }
            this.slist2r = ['test', value, 'remote'];
            resolve();
        });
    }
    onMounted() {
        this.watch(() => this.select.join(','), (n, o) => {
            let select = [];
            const now = n.split(',');
            const old = o.split(',');
            for (const item of now) {
                if (this.slist[parseInt(item)].type !== 0) {
                    continue;
                }
                select.push(parseInt(item));
            }
            if (select.length === now.length) {
                return;
            }
            select = [];
            for (const item of old) {
                select.push(parseInt(item));
            }
            this.select = select;
        }, {
            'deep': true
        });
    }
}
exports.default = default_1;
