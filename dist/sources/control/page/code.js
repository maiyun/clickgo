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
            'modelValue': 1,
            'max': 0,
            'total': 0,
            'count': 10,
            'control': 2
        };
        this.svg = '<svg width="14" height="14" viewBox="0 0 24 24" stroke="none"><path d="m6 10.25c-.9665 0-1.75.7835-1.75 1.75s.7835 1.75 1.75 1.75h.01c.9665 0 1.75-.7835 1.75-1.75s-.7835-1.75-1.75-1.75zm4.25 1.75c0-.9665.7835-1.75 1.75-1.75h.01c.9665 0 1.75.7835 1.75 1.75s-.7835 1.75-1.75 1.75h-.01c-.9665 0-1.75-.7835-1.75-1.75zm6 0c0-.9665.7835-1.75 1.75-1.75h.01c.9665 0 1.75.7835 1.75 1.75s-.7835 1.75-1.75 1.75h-.01c-.9665 0-1.75-.7835-1.75-1.75z" /></svg>';
        this.prevs = [];
        this.nexts = [];
        this.page = 0;
        this.maxPage = 0;
        this.localeData = {
            'en': {
                'total-of': 'Total of ? items'
            },
            'sc': {
                'total-of': '共 ? 条'
            },
            'tc': {
                'total-of': '共 ? 條'
            },
            'ja': {
                'total-of': '? 件の合計'
            },
            'ko': {
                'total-of': '? 개 항목 총계'
            },
            'th': {
                'total-of': 'ทั้งหมด ? รายการ'
            },
            'es': {
                'total-of': 'Total de ? elementos'
            },
            'de': {
                'total-of': 'Insgesamt ?'
            },
            'fr': {
                'total-of': 'Total de ?'
            },
            'pt': {
                'total-of': 'Total de ?'
            },
            'ru': {
                'total-of': 'Всего ?'
            },
            'vi': {
                'total-of': 'Tổng cộng ?'
            }
        };
    }
    refresh() {
        this.prevs.length = 0;
        if (this.page > this.propNumber('control')) {
            let prev = this.page - this.propNumber('control');
            if (prev < this.propNumber('control')) {
                prev = this.propNumber('control');
            }
            for (let i = prev; i < this.page; ++i) {
                this.prevs.push(i);
            }
        }
        this.nexts.length = 0;
        const last2 = this.maxPage - 1;
        if (this.page < last2) {
            let next = this.page + this.propNumber('control');
            if (next > last2) {
                next = last2;
            }
            for (let i = this.page + 1; i <= next; ++i) {
                this.nexts.push(i);
            }
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
        this.maxPage = Math.ceil(this.propInt('total') / this.propInt('count'));
    }
    keydown(e) {
        if (e.key !== 'Enter') {
            return;
        }
        e.preventDefault();
        e.target.click();
    }
    onMounted() {
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
