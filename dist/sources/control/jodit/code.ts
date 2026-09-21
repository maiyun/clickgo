import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'imgselect': null,
        'init': null,
        'text': null,
        'update:modelValue': null
    };

    public props: {
        'disabled': boolean | string;
        'readonly': boolean | string;
        'placeholder': string;

        'modelValue': string;
        'theme': 'dark' | 'light';
    } = {
            'disabled': false,
            'readonly': false,
            'placeholder': '',

            'modelValue': '',
            'theme': 'light',
        };

    public notInit = false;

    public isFocus = false;

    public isLoading = true;

    public localeData = {
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

    public access: {
        /** --- 终端控件对象 --- */
        'editor': any;
    } = {
            'editor': undefined
        };

    public execCmd(ac: string): void {
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
    public getLanguage(): string {
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

    public async onMounted(): Promise<void> {
        const jodit = await clickgo.core.getModule('jodit');
        if (!jodit) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }

        /** --- 创建编辑器 --- */
        this.access.editor = jodit.make(this.refs.editor, {
            'height': '100%',
            // --- 去除一些不需要的按钮，包括最大化/全屏
            'removeButtons': ['ai-assistant', 'about', 'speechRecognize', 'ai-commands', 'fullsize'],
            'extraButtons': [{
                'image': 'bold',
                'icon': 'upload',
                'exec': () => {
                    this.emit('imgselect', (url: string, alt?: string) => {
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
        this.refs.content.addEventListener('pointerdown', (e: PointerEvent): void => {
            const target = (e.target as HTMLElement);
            if (!target.classList.contains('jodit-workplace') && !clickgo.dom.findParentByClass(target, 'jodit-workplace')) {
                return;
            }
            if (this.refs.content.cgPopOpen !== undefined) {
                clickgo.form.hidePop(this.refs.content);
            }
            clickgo.modules.pointer.menu(e, () => {
                clickgo.form.showPop(this.refs.content, this.refs.pop, e);
            });
        });
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
        this.watch('modelValue', (v: string) => {
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

    /** --- 编辑正文跟随阿语方向，代码/弹出菜单仍由 ClickGo 外层管理 --- */
    private _refreshDirection(): void {
        const rtl = this.locale === 'ar';
        this.refs.content.dir = rtl ? 'rtl' : 'ltr';
        const editor = this.access.editor?.container as HTMLElement | undefined;
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
