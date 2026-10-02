import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'imgselect': null,
        'init': null,
        'text': null,
        'update:modelValue': null
    };
    props = {
        'disabled': false,
        'readonly': false,
        'placeholder': '',
        'modelValue': '',
        'theme': 'light',
    };
    notInit = false;
    isFocus = false;
    isLoading = true;
    localeData = {
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
        },
        'ar': {
            'copy': 'نسخ',
            'cut': 'قص',
            'paste': 'لصق'
        },
        'id': {
            'copy': 'Salin',
            'cut': 'Potong',
            'paste': 'Tempel'
        },
        'it': {
            'copy': 'Copia',
            'cut': 'Taglia',
            'paste': 'Incolla'
        },
        'tr': {
            'copy': 'Kopyala',
            'cut': 'Kes',
            'paste': 'Yapıştır'
        }
    };
    access = {
        'editor': undefined,
        'disposed': false,
        'pointerdown': null
    };
    execCmd(ac) {
        if (!this.access.editor) {
            return;
        }
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
    /** --- 获得语言 --- */
    getLanguage() {
        // --- Jodit 的语言包不一定与 ClickGo 的语言集合完全同步，未知语言使用英文工具栏 ---
        const supported = ['ar', 'de', 'en', 'es', 'fr', 'id', 'it', 'ja', 'ko', 'pt', 'ru', 'sc', 'tc', 'th', 'tr', 'vi'];
        if (!supported.includes(this.locale)) {
            return 'en';
        }
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
    async onMounted() {
        if (this.access.disposed) {
            return;
        }
        const jodit = await clickgo.core.getModule('jodit');
        // --- Vue 的 mounted 和模块加载都会异步让出，回显可能已移除本实例 ---
        if (this.access.disposed) {
            return;
        }
        if (!jodit) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        const element = this.refs.editor;
        const content = this.refs.content;
        if (!(element instanceof HTMLElement) || !(content instanceof HTMLElement)) {
            return;
        }
        /** --- 创建编辑器 --- */
        this.access.editor = jodit.make(element, {
            'height': '100%',
            // --- 去除一些不需要的按钮，包括最大化/全屏
            'removeButtons': ['ai-assistant', 'about', 'speechRecognize', 'ai-commands', 'fullsize'],
            'extraButtons': [{
                    'image': 'bold',
                    'icon': 'upload',
                    'exec': () => {
                        this.emit('imgselect', (url, alt) => {
                            if (this.access.disposed) {
                                return;
                            }
                            this.access.editor.selection.insertImage(url, alt);
                        });
                    }
                }],
            'statusbar': false,
            'allowResizeY': false,
            'addNewLine': false,
            'language': this.getLanguage(),
            'direction': this.locale === 'ar' ? 'rtl' : 'ltr',
            'theme': this.props.theme === 'dark' ? 'dark' : undefined,
            'toolbarAdaptive': false,
            'beautifyHTMLCDNUrlsJS': [],
            'sourceEditorCDNUrlsJS': []
        });
        this._refreshDirection();
        this.access.editor.value = this.props.modelValue;
        this.access.editor.events.on('change', () => {
            if (this.access.disposed) {
                return;
            }
            this.emit('update:modelValue', this.access.editor.value);
            this.emit('text', this.access.editor.text);
        });
        this.access.editor.events.on('focus', () => {
            this.isFocus = true;
        });
        this.access.editor.events.on('blur', () => {
            this.isFocus = false;
        });
        // --- 绑定 contextmenu ---
        this.access.pointerdown = (e) => {
            const target = e.target;
            if (!target.classList.contains('jodit-workplace') && !clickgo.dom.findParentByClass(target, 'jodit-workplace')) {
                return;
            }
            if (content.cgPopOpen !== undefined) {
                clickgo.form.hidePop(content);
            }
            clickgo.modules.pointer.menu(e, () => {
                if (this.access.disposed) {
                    return;
                }
                clickgo.form.showPop(content, this.refs.pop, e);
            });
        };
        content.addEventListener('pointerdown', this.access.pointerdown);
        // --- 监听语言变动 ---
        this.watch('locale', () => {
            if (!this.access.editor) {
                return;
            }
            this._refreshDirection();
            // --- Jodit 当前实例不支持可靠地动态替换工具栏语言，保留当前编辑内容 ---
        });
        // --- 监听 readonly 变动 ---
        this.watch('readonly', () => {
            if (!this.access.editor) {
                return;
            }
            this.access.editor.setReadOnly(this.propBoolean('readonly') ? true : false);
        }, {
            'immediate': true
        });
        // --- 监听上面的值的变动 ---
        this.watch('modelValue', (v) => {
            if (!this.access.editor) {
                return;
            }
            if (v === this.access.editor.value) {
                return;
            }
            this.access.editor.value = v;
        });
        // --- 初始化成功 ---
        this.isLoading = false;
        this.emit('init', this.access.editor);
        if (this.props.modelValue) {
            this.emit('text', this.access.editor.text);
        }
    }
    /** --- 取消迟到的初始化，并在 DOM 移除前释放编辑器及菜单监听 --- */
    onBeforeUnmount() {
        this.access.disposed = true;
        if (this.access.pointerdown) {
            this.refs.content?.removeEventListener('pointerdown', this.access.pointerdown);
            this.access.pointerdown = null;
        }
        const editor = this.access.editor;
        this.access.editor = undefined;
        editor?.destruct();
    }
    /** --- 编辑正文跟随阿语方向，代码/弹出菜单仍由 ClickGo 外层管理 --- */
    _refreshDirection() {
        const rtl = this.locale === 'ar';
        this.refs.content.dir = rtl ? 'rtl' : 'ltr';
        const editor = this.access.editor?.container;
        const wysiwyg = editor?.querySelector('.jodit-wysiwyg');
        if (wysiwyg instanceof HTMLElement) {
            wysiwyg.dir = rtl ? 'rtl' : 'ltr';
        }
        const source = editor?.querySelector('.jodit-source');
        if (source instanceof HTMLElement) {
            source.dir = 'ltr';
        }
    }
}
