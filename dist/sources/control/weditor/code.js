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
            'imgupload': null,
            'videoselect': null,
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
        return __awaiter(this, void 0, void 0, function* () {
            switch (ac) {
                case 'copy': {
                    yield navigator.clipboard.writeText(this.access.editor.getSelectionText());
                    break;
                }
                case 'cut': {
                    yield navigator.clipboard.writeText(this.access.editor.getSelectionText());
                    this.access.editor.insertText('');
                    break;
                }
                case 'paste': {
                    try {
                        const ls = yield navigator.clipboard.read();
                        for (const item of ls) {
                            if (!item.types.length) {
                                continue;
                            }
                            if (item.types.length === 1) {
                                if (item.types[0].includes('text')) {
                                    const data = yield item.getType(item.types[0]);
                                    this.access.editor.insertText(yield data.text());
                                    continue;
                                }
                                const e = {
                                    'detail': {
                                        'file': yield item.getType(item.types[0]),
                                        callback: (url, opt = {}) => {
                                            this.access.editor.dangerouslyInsertHtml(`<p${opt.align ? ' style="text-align:center;"' : ''}><img src="${url}"${opt.alt ? ` alt="${opt.alt}"` : ''} style="${opt.width ? `width:${opt.width};` : ''}${opt.height ? `height:${opt.height};` : ''}"></p>`);
                                        }
                                    }
                                };
                                this.emit('imgupload', e);
                                continue;
                            }
                            const blob = yield item.getType(item.types[1]);
                            let html = yield blob.text();
                            this.access.editor.dangerouslyInsertHtml(html);
                        }
                    }
                    catch (_a) {
                        break;
                    }
                    break;
                }
            }
        });
    }
    getLanguage() {
        switch (this.locale) {
            case 'sc': {
                return 'zh-CN';
            }
            case 'tc': {
                return 'zh-TW';
            }
        }
        return this.locale;
    }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            const weditor = yield clickgo.core.getModule('weditor');
            if (!weditor) {
                this.isLoading = false;
                this.notInit = true;
                return;
            }
            const { createEditor, createToolbar, i18nChangeLanguage, SlateTransforms } = weditor;
            i18nChangeLanguage(this.getLanguage());
            this.access.editor = createEditor({
                'selector': this.refs.editor,
                'html': this.props.modelValue,
                'config': {
                    'placeholder': this.props.placeholder,
                    'autoFocus': false,
                    'MENU_CONF': {
                        'uploadImage': {
                            customBrowseAndUpload: (insertFn) => {
                                this.emit('imgselect', (url, alt) => {
                                    insertFn(url, alt);
                                });
                            }
                        },
                        'uploadVideo': {
                            customBrowseAndUpload: (insertFn) => {
                                this.emit('videoselect', (url, poster) => {
                                    insertFn(url, poster);
                                });
                            }
                        }
                    },
                    onChange: (editor) => {
                        const html = editor.getHtml();
                        this.emit('update:modelValue', html);
                        this.emit('text', editor.getText());
                    },
                    onFocus: () => {
                        this.isFocus = true;
                    },
                    onBlur: () => {
                        this.isFocus = false;
                    }
                },
                'mode': 'default'
            });
            const tb = createToolbar({
                'editor': this.access.editor,
                'selector': this.refs.toolbar,
                'config': {
                    'excludeKeys': [
                        'fullScreen'
                    ]
                },
                'mode': 'default',
            });
            this.refs.editor.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (clickgo.dom.hasTouchButMouse(e)) {
                    return;
                }
                clickgo.form.showPop(this.element, this.refs.pop, e);
            });
            const down = (e) => {
                if (clickgo.dom.hasTouchButMouse(e)) {
                    return;
                }
                if (this.element.dataset.cgPopOpen !== undefined) {
                    clickgo.form.hidePop(this.element);
                }
                if (e instanceof TouchEvent) {
                    clickgo.dom.bindLong(e, () => {
                        clickgo.form.showPop(this.element, this.refs.pop, e);
                    });
                }
            };
            this.refs.editor.addEventListener('mousedown', down);
            this.refs.editor.addEventListener('touchstart', down, {
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
                if (this.propBoolean('readonly')) {
                    this.access.editor.disable();
                }
                else {
                    this.access.editor.enable();
                }
            }, {
                'immediate': true
            });
            this.watch('modelValue', (v) => __awaiter(this, void 0, void 0, function* () {
                if (!this.access.editor) {
                    return;
                }
                if (v === this.access.editor.getHtml()) {
                    return;
                }
                this.access.editor.children.forEach(() => {
                    SlateTransforms.delete(this.access.editor, { 'at': [0] });
                });
                SlateTransforms.insertNodes(this.access.editor, {
                    'type': 'p',
                    'children': [{ text: '' }]
                }, { at: [0] });
                SlateTransforms.select(this.access.editor, {
                    'anchor': { 'path': [0, 0], 'offset': 0 },
                    'focus': { 'path': [0, 0], 'offset': 0 },
                });
                yield clickgo.tool.sleep(0);
                this.access.editor.setHtml(v);
            }));
            this.isLoading = false;
            this.emit('init', this.access.editor);
            if (this.props.modelValue) {
                this.emit('text', this.access.editor.getText());
            }
        });
    }
}
exports.default = default_1;
