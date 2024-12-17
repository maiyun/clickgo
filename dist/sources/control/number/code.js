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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
        this.emits = {
            'focus': null,
            'blur': null,
            'enter': null,
            'beforechange': null,
            'minmaxchange': null,
            'update:modelValue': null,
        };
        this.props = {
            'disabled': false,
            'readonly': false,
            'plain': false,
            'require': false,
            'modelValue': '',
            'placeholder': '',
            'max': undefined,
            'min': undefined
        };
        this.isFocus = false;
        this.value = '';
        this.localeData = {
            'en': {
                'copy': 'Copy',
                'cut': 'Cut',
                'paste': 'Paste'
            },
            'sc': {
                'copy': '复制',
                'cut': '剪下',
                'paste': '粘上'
            },
            'tc': {
                'copy': '複製',
                'cut': '剪貼',
                'paste': '貼上'
            },
            'ja': {
                'copy': 'コピー',
                'cut': '切り取り',
                'paste': '貼り付け'
            },
            'ko': {
                'copy': '복사',
                'cut': '잘라내기',
                'paste': '붙여넣기'
            },
            'th': {
                'copy': 'คัดลอก',
                'cut': 'ตัด',
                'paste': 'วาง'
            },
            'es': {
                'copy': 'Copiar',
                'cut': 'Cortar',
                'paste': 'Pegar'
            },
            'de': {
                'copy': 'Kopieren',
                'cut': 'Ausschneiden',
                'paste': 'Einfügen'
            },
            'fr': {
                'copy': 'Copier',
                'cut': 'Couper',
                'paste': 'Coller'
            },
            'pt': {
                'copy': 'Copiar',
                'cut': 'Recortar',
                'paste': 'Colar'
            },
            'ru': {
                'copy': 'Копировать',
                'cut': 'Вырезать',
                'paste': 'Вставить'
            },
            'vi': {
                'copy': 'Sao chép',
                'cut': 'Cắt',
                'paste': 'Dán'
            }
        };
        this.dangerBorder = false;
    }
    focus() {
        this.refs.text.focus();
    }
    down(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.element.dataset.cgPopOpen === undefined) {
            return;
        }
        clickgo.form.hidePop();
    }
    tfocus() {
        this.isFocus = true;
        this.emit('focus');
        if (this.dangerBorder) {
            this.dangerBorder = false;
        }
    }
    tblur(e) {
        const target = e.target;
        if (this.checkNumber(target)) {
            const mxEvent = {
                'go': true,
                preventDefault: function () {
                    this.go = false;
                },
                'detail': {
                    'before': this.value,
                    'value': target.value,
                }
            };
            this.emit('minmaxchange', mxEvent);
            if (mxEvent.go) {
                const event = {
                    'go': true,
                    preventDefault: function () {
                        this.go = false;
                    },
                    'detail': {
                        'value': target.value,
                        'change': undefined
                    }
                };
                this.emit('beforechange', event);
                if (event.go) {
                    if (event.detail.change !== undefined) {
                        target.value = event.detail.change;
                    }
                    this.value = target.value;
                    this.emit('update:modelValue', this.value);
                }
                else {
                    target.value = this.value;
                }
            }
            else {
                target.value = this.value;
            }
        }
        this.isFocus = false;
        this.emit('blur');
        this.check();
    }
    input(e) {
        const target = e.target;
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'value': target.value,
                'change': undefined
            }
        };
        this.emit('beforechange', event);
        if (!event.go) {
            target.value = this.value;
            return;
        }
        if (event.detail.change !== undefined) {
            target.value = event.detail.change;
        }
        this.value = target.value;
        this.emit('update:modelValue', this.value);
    }
    checkNumber(target) {
        if (!target) {
            target = this.refs.text;
        }
        let change = false;
        if (!target.value && this.value) {
            change = true;
        }
        if (target.value) {
            const val = parseFloat(target.value);
            if (this.props.max !== undefined && this.props.max !== 'undefined' && val > this.propNumber('max')) {
                target.value = this.propNumber('max').toString();
                change = true;
            }
            if (this.props.min !== undefined && this.props.min !== 'undefined' && val < this.propNumber('min')) {
                target.value = this.propNumber('min').toString();
                change = true;
            }
        }
        return change;
    }
    inputTouch(e) {
        if (navigator.clipboard) {
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.element, this.refs.pop, e);
            });
        }
    }
    contextmenu(e) {
        if (!navigator.clipboard) {
            e.stopPropagation();
            return;
        }
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, e);
    }
    select(e) {
        e.stopPropagation();
    }
    numberClick(num) {
        var _a;
        if (!this.value) {
            this.value = '0';
        }
        const n = (parseFloat(this.value) + num).toString();
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'value': n,
                'change': undefined
            }
        };
        this.emit('beforechange', event);
        if (!event.go) {
            return;
        }
        this.value = (_a = event.detail.change) !== null && _a !== void 0 ? _a : n;
        this.emit('update:modelValue', this.value);
    }
    execCmd(ac) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.refs.text.focus();
            if (ac === 'paste') {
                if (this.propBoolean('readonly')) {
                    return;
                }
                const str = yield navigator.clipboard.readText();
                const event = {
                    'go': true,
                    preventDefault: function () {
                        this.go = false;
                    },
                    'detail': {
                        'value': str,
                        'change': undefined
                    }
                };
                this.emit('beforechange', event);
                if (!event.go) {
                    return;
                }
                this.value = (_a = event.detail.change) !== null && _a !== void 0 ? _a : str;
                this.emit('update:modelValue', this.value);
            }
            else {
                clickgo.tool.execCommand(ac);
            }
        });
    }
    keydown(e) {
        if (e.key === 'Enter') {
            this.emit('enter');
        }
    }
    check() {
        if (this.propBoolean('require')) {
            if (!this.value) {
                this.dangerBorder = true;
                return false;
            }
        }
        return true;
    }
    onMounted() {
        this.watch('modelValue', () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.value === this.props.modelValue) {
                return;
            }
            if (this.dangerBorder) {
                this.dangerBorder = false;
            }
            this.value = this.props.modelValue;
            yield this.nextTick();
            this.checkNumber();
            if (this.refs.text.value === this.value) {
                this.check();
                return;
            }
            const event = {
                'go': true,
                preventDefault: function () {
                    this.go = false;
                },
                'detail': {
                    'value': this.refs.text.value,
                    'change': undefined
                }
            };
            this.emit('beforechange', event);
            if (!event.go) {
                this.check();
                this.refs.text.value = this.value;
                return;
            }
            this.value = (_a = event.detail.change) !== null && _a !== void 0 ? _a : this.refs.text.value;
            this.emit('update:modelValue', this.value);
            this.check();
        }), {
            'immediate': true
        });
        this.watch('max', () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.nextTick();
            if (this.checkNumber()) {
                const mxEvent = {
                    'go': true,
                    preventDefault: function () {
                        this.go = false;
                    },
                    'detail': {
                        'before': this.value,
                        'value': this.refs.text.value
                    }
                };
                this.emit('minmaxchange', mxEvent);
                if (!mxEvent.go) {
                    this.refs.text.value = this.value;
                    return;
                }
                const event = {
                    'go': true,
                    preventDefault: function () {
                        this.go = false;
                    },
                    'detail': {
                        'value': this.value,
                        'change': undefined
                    }
                };
                this.emit('beforechange', event);
                if (!event.go) {
                    this.refs.text.value = this.value;
                    return;
                }
                this.value = (_a = event.detail.change) !== null && _a !== void 0 ? _a : this.refs.text.value;
                this.emit('update:modelValue', this.value);
            }
        }));
        this.watch('min', () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.nextTick();
            if (this.checkNumber()) {
                const mxEvent = {
                    'go': true,
                    preventDefault: function () {
                        this.go = false;
                    },
                    'detail': {
                        'before': this.value,
                        'value': this.refs.text.value
                    }
                };
                this.emit('minmaxchange', mxEvent);
                if (!mxEvent.go) {
                    this.refs.text.value = this.value;
                    return;
                }
                const event = {
                    'go': true,
                    preventDefault: function () {
                        this.go = false;
                    },
                    'detail': {
                        'value': this.value,
                        'change': undefined
                    }
                };
                this.emit('beforechange', event);
                if (!event.go) {
                    this.refs.text.value = this.value;
                    return;
                }
                this.value = (_a = event.detail.change) !== null && _a !== void 0 ? _a : this.refs.text.value;
                this.emit('update:modelValue', this.value);
            }
        }));
        const content = this.parentByName('content');
        if (content) {
            this.watch('require', () => {
                if (this.propBoolean('require')) {
                    content.controls.push(this);
                }
                else {
                    content.remove(this);
                }
            }, {
                'immediate': true
            });
        }
    }
}
exports.default = default_1;
