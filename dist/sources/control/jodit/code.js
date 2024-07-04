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
        this.emits = {
            'imgselect': null,
            'init': null,
            'text': null,
            'update:modelValue': null
        };
        this.props = {
            'disabled': false,
            'readonly': false,
            'placeholder': '',
            'modelValue': '',
            'theme': 'light'
        };
        this.notInit = false;
        this.isFocus = false;
        this.isLoading = true;
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
        this.access = {
            'editor': undefined
        };
    }
    execCmd(ac) {
        switch (ac) {
            case 'copy': {
                this.access.editor.execCommand('copy');
                break;
            }
            case 'cut': {
                this.access.editor.execCommand('cut');
                break;
            }
            case 'paste': {
                this.access.editor.execCommand('paste');
                break;
            }
        }
    }
    getLanguage() {
        switch (this.locale) {
            case 'sc': {
                return 'zh_cn';
            }
            case 'tc': {
                return 'zh_tw';
            }
        }
        return this.locale;
    }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            const jodit = yield clickgo.core.getModule('jodit');
            if (!jodit) {
                this.isLoading = false;
                this.notInit = true;
                return;
            }
            this.access.editor = jodit.make(this.refs.editor, {
                'height': '100%',
                'removeButtons': ['ai-assistant', 'about', 'speechRecognize', 'ai-commands'],
                'extraButtons': [{
                        'image': 'bold',
                        'icon': 'upload',
                        'exec': () => {
                            this.emit('imgselect', (url, alt) => {
                                this.access.editor.selection.insertImage(url, alt);
                            });
                        }
                    }],
                'statusbar': false,
                'allowResizeY': false,
                'addNewLine': false,
                'language': this.getLanguage(),
                'theme': this.props.theme === 'dark' ? 'dark' : undefined
            });
            this.access.editor.value = this.props.modelValue;
            this.access.editor.events.on('change', () => {
                this.emit('update:modelValue', this.access.editor.value);
                this.emit('text', this.access.editor.text);
            });
            this.access.editor.events.on('focus', () => {
                this.isFocus = true;
            });
            this.access.editor.events.on('blur', () => {
                this.isFocus = false;
            });
            this.refs.content.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (clickgo.dom.hasTouchButMouse(e)) {
                    return;
                }
                if (!e.target) {
                    return;
                }
                const target = e.target;
                if (!target.classList.contains('jodit-workplace') && !clickgo.dom.findParentByClass(target, 'jodit-workplace')) {
                    return;
                }
                clickgo.form.showPop(this.refs.content, this.refs.pop, e);
            });
            const down = (e) => {
                if (clickgo.dom.hasTouchButMouse(e)) {
                    return;
                }
                const target = e.target;
                if (!target.classList.contains('jodit-workplace') && !clickgo.dom.findParentByClass(target, 'jodit-workplace')) {
                    return;
                }
                if (this.refs.content.cgPopOpen !== undefined) {
                    clickgo.form.hidePop(this.refs.content);
                }
                if (e instanceof TouchEvent) {
                    clickgo.dom.bindLong(e, () => {
                        clickgo.form.showPop(this.refs.content, this.refs.pop, e);
                    });
                }
            };
            this.refs.content.addEventListener('mousedown', down);
            this.refs.content.addEventListener('touchstart', down, {
                'passive': true
            });
            this.watch('locale', () => {
                if (!this.access.editor) {
                    return;
                }
            });
            this.watch('readonly', () => {
                if (!this.access.editor) {
                    return;
                }
                this.access.editor.setReadOnly(this.propBoolean('readonly') ? true : false);
            }, {
                'immediate': true
            });
            this.watch('modelValue', (v) => {
                if (!this.access.editor) {
                    return;
                }
                if (v === this.access.editor.value) {
                    return;
                }
                this.access.editor.value = v;
            });
            this.isLoading = false;
            this.emit('init', this.access.editor);
            if (this.props.modelValue) {
                this.emit('text', this.access.editor.text);
            }
        });
    }
}
exports.default = default_1;
