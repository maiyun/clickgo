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
            'change': null,
            'update:modelValue': null,
            'update:count': null
        };
        this.props = {
            'modelValue': 1,
            'max': 0,
            'total': 0,
            'count': 10,
            'counts': [],
            'control': 2
        };
        this.countSelect = ['0'];
        this.svg = '<svg width="14" height="14" viewBox="0 0 24 24" stroke="none"><path d="m6 10.25c-.9665 0-1.75.7835-1.75 1.75s.7835 1.75 1.75 1.75h.01c.9665 0 1.75-.7835 1.75-1.75s-.7835-1.75-1.75-1.75zm4.25 1.75c0-.9665.7835-1.75 1.75-1.75h.01c.9665 0 1.75.7835 1.75 1.75s-.7835 1.75-1.75 1.75h-.01c-.9665 0-1.75-.7835-1.75-1.75zm6 0c0-.9665.7835-1.75 1.75-1.75h.01c.9665 0 1.75.7835 1.75 1.75s-.7835 1.75-1.75 1.75h-.01c-.9665 0-1.75-.7835-1.75-1.75z" /></svg>';
        this.prevs = [];
        this.nexts = [];
        this.page = 0;
        this.maxPage = 0;
        this.localeData = {
            'en': {
                'total-of': 'Total of ? items',
                'page': 'Page'
            },
            'sc': {
                'total-of': '共 ? 条',
                'page': '页'
            },
            'tc': {
                'total-of': '共 ? 條',
                'page': '頁'
            },
            'ja': {
                'total-of': '? 件の合計',
                'page': 'ページ'
            },
            'ko': {
                'total-of': '? 개 항목 총계',
                'page': '페이지'
            },
            'th': {
                'total-of': 'ทั้งหมด ? รายการ',
                'page': 'หน้า'
            },
            'es': {
                'total-of': 'Total de ? elementos',
                'page': 'Página'
            },
            'de': {
                'total-of': 'Insgesamt ?',
                'page': 'Seite'
            },
            'fr': {
                'total-of': 'Total de ?',
                'page': 'Page'
            },
            'pt': {
                'total-of': 'Total de ?',
                'page': 'Página'
            },
            'ru': {
                'total-of': 'Всего ?',
                'page': 'Страница'
            },
            'vi': {
                'total-of': 'Tổng cộng ?',
                'page': 'Trang'
            }
        };
    }
    get countsComp() {
        const counts = this.propArray('counts');
        const list = [];
        for (const item of counts) {
            list.push({
                'label': item.toString() + ' / ' + this.l('page'),
                'value': item.toString()
            });
        }
        return list;
    }
    refresh() {
        this.prevs.length = 0;
        let min = this.page - this.propNumber('control');
        if (min < 2) {
            min = 2;
        }
        for (let i = this.page - 1; i >= min; --i) {
            this.prevs.unshift(i);
        }
        this.nexts.length = 0;
        let max = this.page + this.propNumber('control');
        if (max > this.maxPage - 1) {
            max = this.maxPage - 1;
        }
        for (let i = this.page + 1; i <= max; ++i) {
            this.nexts.push(i);
        }
    }
    refreshMaxPage() {
        const max = this.propInt('max');
        if (max) {
            this.maxPage = max;
            return;
        }
        if (!this.propInt('total')) {
            this.maxPage = 1;
            return;
        }
        this.maxPage = Math.ceil(this.propInt('total') / parseInt(this.countSelect[0]));
    }
    keydown(e) {
        if (e.key !== 'Enter') {
            return;
        }
        e.preventDefault();
        e.target.click();
    }
    changed() {
        this.emit('update:count', parseInt(this.countSelect[0]));
        this.refreshMaxPage();
        this.refresh();
    }
    onMounted() {
        this.countSelect[0] = this.propInt('count').toString();
        this.watch('count', () => {
            this.countSelect[0] = this.propInt('count').toString();
            this.refreshMaxPage();
            this.refresh();
        });
        this.watch('modelValue', () => {
            this.page = this.propInt('modelValue');
            this.refresh();
        }, {
            'immediate': true
        });
        this.watch('max', () => {
            this.refreshMaxPage();
            this.refresh();
        });
        this.watch('total', () => {
            this.refreshMaxPage();
            this.refresh();
        });
        this.watch('control', () => {
            this.refresh();
        });
        this.refreshMaxPage();
        this.refresh();
    }
}
exports.default = default_1;
