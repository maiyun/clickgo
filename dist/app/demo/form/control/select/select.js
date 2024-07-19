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
            'haha1', 'haha2', 'haha3', {
                'label': 'tip',
                'color': 'tip'
            }, 'haha4', {
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
                'children': ['xixi', 'xixida', {
                        'value': 'gogogo',
                        'children': ['aaa', 'bbb', 'ccc']
                    }]
            }
        ];
        this.addRemoveList = [];
        this.select2 = ['haha4'];
        this.aemodel = [];
        this.label2 = [];
        this.asyncModel = ['1'];
        this.asyncData = [];
        this.select3 = '';
        this.label3 = '';
        this.level3 = [];
        this.s3other = false;
        this.slist3r = ['a', 'b', 'c', 'haha3'];
        this.editableDataValue = ['0'];
        this.editableData = {
            '0': ['1', '2', '3', { 'label': 'is gDa', 'value': 'gDa' }, '5'],
            '1': ['6', '7', '8', '9', '10', { 'label': 'But gDa', 'value': 'gDa' }],
            '2': ['11', '12', '13', '14', 'gDa', { 'label': 'Other', 'value': 'o' }]
        };
        this.disabledList = [];
        this.unavailableList = [];
        this.padding = false;
        this.fontSize = false;
        this.background = false;
        this.disabled = false;
        this.multi = false;
        this.search = false;
        this.editable = false;
        this.tree = false;
        this.async = false;
        this.icon = false;
        this.remote = false;
        this.remoteDelay = [0];
        this.plain = false;
        this.virtual = false;
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
                if (value === 'haha2') {
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
    onLoaded() {
        clickgo.form.notify({
            'type': 'info',
            'title': 'Levelselect @loaded',
            'content': 'Done'
        });
    }
    onRemote(e) {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.tool.sleep(300);
            if (!e.detail.value || e.detail.value === '8') {
                yield e.detail.callback();
                return;
            }
            yield e.detail.callback(['test', e.detail.value, 'remote', {
                    'label': 'label',
                    'value': 'ok'
                }, {
                    'label': 'label2',
                    'value': 2
                }]);
        });
    }
    onGAdd(e) {
        clickgo.form.notify({
            'type': 'info',
            'title': 'Greatselect @add',
            'content': 'value: ' + e.detail.value.toString()
        });
        if (this.slist[e.detail.value].type === 1) {
            e.preventDefault();
        }
    }
    onGRemove(e) {
        clickgo.form.notify({
            'type': 'info',
            'title': 'Greaselect @remove',
            'content': 'value: ' + e.detail.value.toString()
        });
    }
    onGChange(e) {
        console.log('onGChange', e);
    }
    onGChanged(e) {
        console.log('onGChanged', e);
    }
    onAdd(e) {
        this.addRemoveList.unshift('@add, index: ' + e.detail.index.toString() + ', value: ' + e.detail.value);
    }
    onAdded(e) {
        this.addRemoveList.unshift('@added, index: ' + e.detail.index.toString() + ', value: ' + e.detail.value);
    }
    onRemove(e) {
        this.addRemoveList.unshift('@remove, index: ' + e.detail.index.toString() + ', value: ' + e.detail.value + ', mode: ' + e.detail.mode);
    }
    onRemoved(e) {
        this.addRemoveList.unshift('@removed, index: ' + e.detail.index.toString() + ', value: ' + e.detail.value + ', mode: ' + e.detail.mode);
    }
    onChange(e) {
        console.log('onChange', e);
        if (e.detail.value[0] === 'title') {
            e.preventDefault();
        }
    }
    onChanged(e) {
        console.log('onChanged', e);
    }
    onTagclick(e) {
        this.addRemoveList.unshift('@tagclick, index: ' + e.detail.index.toString() + ', value: ' + e.detail.value);
    }
    changeArea() {
        switch (this.area) {
            case 'all': {
                this.area = 'arrow';
                break;
            }
            case 'arrow': {
                this.area = 'text';
                break;
            }
            default: {
                this.area = 'all';
            }
        }
    }
    asyncLoad() {
        const list = ['0', {
                'label': 'ok',
                'value': '1'
            }, '2', '3'];
        for (const item of list) {
            this.asyncData.push(item);
        }
    }
    onMounted() {
        this.watch(() => this.select.join(','), (n, o) => {
            if (this.multi) {
                return;
            }
            if (this.slist[parseInt(n)].type === 0) {
                return;
            }
            this.select = [parseInt(o)];
        });
    }
}
exports.default = default_1;
