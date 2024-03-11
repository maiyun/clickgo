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
            'imgselect': null
        };
        this.props = {
            'disabled': false,
            'modelValue': '',
            'visual': false,
            'theme': 'light'
        };
        this.notInit = false;
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
            'tuieditor': undefined
        };
    }
    execCmd(ac) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (ac) {
                case 'copy': {
                    clickgo.tool.execCommand(ac);
                    break;
                }
                case 'cut': {
                    clickgo.tool.execCommand('copy');
                    this.access.tuieditor.insertText('');
                    break;
                }
                case 'paste': {
                    const str = yield navigator.clipboard.readText();
                    if (str) {
                        this.access.tuieditor.insertText(str);
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
            const tuieditor = yield clickgo.core.getModule('tuieditor');
            if (!tuieditor) {
                this.isLoading = false;
                this.notInit = true;
                return;
            }
            this.access.tuieditor = new tuieditor({
                'el': this.refs.content,
                'height': 'initial',
                'previewStyle': 'vertical',
                'initialEditType': this.propBoolean('visual') ? 'wysiwyg' : 'markdown',
                'hideModeSwitch': true,
                'theme': this.props.theme,
                'initialValue': this.props.modelValue,
                'language': this.getLanguage(),
                'events': {
                    change: () => {
                        this.emit('update:modelValue', this.access.tuieditor.getMarkdown());
                    }
                },
                'toolbarItems': [
                    ['heading', 'bold', 'italic', 'strike'],
                    ['hr', 'quote'],
                    ['ul', 'ol', 'task', 'indent', 'outdent'],
                    ['table', 'link'],
                    ['code', 'codeblock'],
                    ['scrollSync'],
                ]
            });
            const cgimage = clickgo.dom.createElement('button');
            cgimage.className = 'image toastui-editor-toolbar-icons';
            cgimage.style.margin = '0';
            cgimage.addEventListener('click', () => {
                this.emit('imgselect', (url, opt) => {
                    var _a;
                    if (opt && (opt.width || opt.height)) {
                        if (this.access.tuieditor.isMarkdownMode()) {
                            this.access.tuieditor.replaceSelection(`<div${opt.align ? ' align="center"' : ''}><img src="${url}"${opt.alt ? ` alt="${opt.alt}"` : ''}${opt.width ? ` width="${opt.width}"` : ''}${opt.height ? ` height="${opt.height}"` : ''}></div>`);
                            return;
                        }
                    }
                    this.access.tuieditor.exec('addImage', {
                        'imageUrl': url,
                        'altText': (_a = opt === null || opt === void 0 ? void 0 : opt.alt) !== null && _a !== void 0 ? _a : ''
                    });
                });
            });
            this.access.tuieditor.insertToolbarItem({
                'groupIndex': 3,
                'itemIndex': 1
            }, {
                'el': cgimage,
                'tooltip': this.access.tuieditor.i18n.get('Insert image')
            });
            this.element.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (clickgo.dom.hasTouchButMouse(e)) {
                    return;
                }
                const target = e.target;
                if (!target.classList.contains('ProseMirror') && !clickgo.dom.findParentByClass(target, 'ProseMirror')) {
                    return;
                }
                if (target.tagName.toLowerCase() === 'table' || clickgo.dom.findParentByTag(target, 'table')) {
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
                const target = e.target;
                if (!target.classList.contains('ProseMirror') && !clickgo.dom.findParentByClass(target, 'ProseMirror')) {
                    return;
                }
                if (e instanceof TouchEvent) {
                    clickgo.dom.bindLong(e, () => {
                        clickgo.form.showPop(this.element, this.refs.pop, e);
                    });
                }
            };
            this.element.addEventListener('mousedown', down);
            this.element.addEventListener('touchstart', down, {
                'passive': true
            });
            const wheel = (e, el) => {
                clickgo.dom.bindGesture(e, (e, dir) => {
                    switch (dir) {
                        case 'top': {
                            if (el.scrollTop > 0) {
                                return -1;
                            }
                            break;
                        }
                        case 'bottom': {
                            if (Math.round(el.scrollTop) < el.scrollHeight - el.clientHeight) {
                                return -1;
                            }
                            break;
                        }
                        case 'left': {
                            if (el.scrollLeft > 0) {
                                return -1;
                            }
                            break;
                        }
                        default: {
                            if (Math.round(el.scrollLeft) < el.scrollWidth - el.clientWidth) {
                                return -1;
                            }
                        }
                    }
                    return 0;
                });
            };
            const list = this.refs.content.querySelectorAll('.ProseMirror, .toastui-editor-md-preview');
            for (const el of list) {
                el.addEventListener('wheel', (e) => {
                    wheel(e, el);
                });
                el.addEventListener('touchstart', (e) => {
                    wheel(e, el);
                });
            }
            this.watch('locale', () => {
                if (!this.access.tuieditor) {
                    return;
                }
            });
            this.watch('visual', () => {
                if (!this.access.tuieditor) {
                    return;
                }
                this.access.tuieditor.changeMode(this.propBoolean('visual') ? 'wysiwyg' : 'markdown');
            });
            this.watch('theme', () => {
                if (!this.access.tuieditor) {
                    return;
                }
                const el = this.refs.content.children[0];
                if (this.props.theme === 'dark') {
                    if (!el.classList.contains('toastui-editor-dark')) {
                        el.classList.add('toastui-editor-dark');
                    }
                }
                else {
                    if (el.classList.contains('toastui-editor-dark')) {
                        el.classList.remove('toastui-editor-dark');
                    }
                }
            });
            clickgo.dom.watchStyle(this.element, ['font-size', 'font-family'], (n, v) => {
                if (!this.access.tuieditor) {
                    return;
                }
                const pm = this.refs.content.querySelector('.ProseMirror');
                if (!pm) {
                    return;
                }
                switch (n) {
                    case 'font-size': {
                        pm.style.fontSize = v;
                        break;
                    }
                    case 'font-family': {
                        pm.style.fontFamily = v;
                        break;
                    }
                }
            }, true);
            this.isLoading = false;
            this.emit('init', this.access.tuieditor);
        });
    }
}
exports.default = default_1;
