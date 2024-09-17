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
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'mode': 'default',
            'content': '',
            'size': 's',
            'align': 'left',
            'copy': false,
            'thru': false,
            'time': true,
            'date': true,
            'zone': false,
            'tz': undefined
        };
        this.localeData = {
            'en': {
                'copy': 'Copy',
                'copied': 'Copied'
            },
            'sc': {
                'copy': '复制',
                'copied': '已复制'
            },
            'tc': {
                'copy': '複製',
                'copied': '已複製'
            },
            'ja': {
                'copy': 'コピー',
                'copied': 'コピーしました'
            },
            'ko': {
                'copy': '복사',
                'copied': '복사됨'
            },
            'th': {
                'copy': 'คัดลอก',
                'copied': 'คัดลอกแล้ว'
            },
            'es': {
                'copy': 'Copiar',
                'copied': 'Copiado'
            },
            'de': {
                'copy': 'Kopieren',
                'copied': 'Kopiert'
            },
            'fr': {
                'copy': 'Copier',
                'copied': 'Copié'
            },
            'pt': {
                'copy': 'Copiar',
                'copied': 'Copiado'
            },
            'ru': {
                'copy': 'Копировать',
                'copied': 'Скопировано'
            },
            'vi': {
                'copy': 'Sao chép',
                'copied': 'Đã sao chép'
            }
        };
    }
    get alignComp() {
        switch (this.props.align) {
            case 'center': {
                return 'center';
            }
            case 'left':
            case 'start': {
                return 'flex-start';
            }
            default: {
                return 'flex-end';
            }
        }
    }
    get contentComp() {
        if (this.props.mode !== 'date') {
            return this.props.content;
        }
        if (this.propNumber('content') === 0) {
            return '';
        }
        const rtn = [];
        const content = this.props.content.toString().length >= 13 ? this.propNumber('content') : this.propNumber('content') * 1000;
        const res = clickgo.tool.formatTime(content, this.props.tz === undefined ? undefined : this.propNumber('tz'));
        if (this.propBoolean('date')) {
            rtn.push(res.date);
        }
        if (this.propBoolean('time')) {
            rtn.push(res.time);
        }
        if (this.propBoolean('zone')) {
            rtn.push(res.zone);
        }
        return rtn.join(' ');
    }
    click() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.propBoolean('copy')) {
                return;
            }
            yield navigator.clipboard.writeText(this.props.content ? this.contentComp : this.element.innerText);
            clickgo.form.alert(this.l('copied'));
        });
    }
    down(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.propBoolean('copy')) {
            return;
        }
        clickgo.dom.bindClick(e, () => __awaiter(this, void 0, void 0, function* () {
            yield navigator.clipboard.writeText(this.props.content ? this.contentComp : this.element.innerText);
            clickgo.form.alert(this.l('copied'));
        }));
        if (!navigator.clipboard) {
            return;
        }
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.element, this.refs.pop, e);
            });
        }
        if (this.element.dataset.cgPopOpen === undefined) {
            return;
        }
        clickgo.form.hidePop();
    }
    contextmenu(e) {
        if (!this.propBoolean('copy')) {
            return;
        }
        if (!navigator.clipboard) {
            e.stopPropagation();
            return;
        }
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, e);
    }
    execCmd(ac) {
        clickgo.tool.execCommand(ac);
    }
}
exports.default = default_1;
