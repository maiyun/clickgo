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
            'theme': 'light'
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
            'removeButtons': ['ai-assistant', 'about', 'speechRecognize', 'ai-commands'],
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
            'addNewLine': false
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
        // --- 绑定 contextmenu ---
        this.refs.content.addEventListener('contextmenu', (e: MouseEvent) => {
            e.preventDefault();
            if (clickgo.dom.hasTouchButMouse(e)) {
                return;
            }
            if (!e.target) {
                return;
            }
            const target = (e.target as HTMLElement);
            if (!target.classList.contains('jodit-workplace') && !clickgo.dom.findParentByClass(target, 'jodit-workplace')) {
                return;
            }
            clickgo.form.showPop(this.refs.content, this.refs.pop, e);
        });
        // --- 绑定 down 事件 ---
        const down = (e: MouseEvent | TouchEvent): void => {
            if (clickgo.dom.hasTouchButMouse(e)) {
                return;
            }
            const target = (e.target as HTMLElement);
            if (!target.classList.contains('jodit-workplace') && !clickgo.dom.findParentByClass(target, 'jodit-workplace')) {
                return;
            }
            if (this.refs.content.cgPopOpen !== undefined) {
                clickgo.form.hidePop(this.refs.content);
            }
            if (e instanceof TouchEvent) {
                // --- touch 长按弹出 ---
                clickgo.dom.bindLong(e, () => {
                    clickgo.form.showPop(this.refs.content, this.refs.pop, e);
                });
            }
        };
        this.refs.content.addEventListener('mousedown', down);
        this.refs.content.addEventListener('touchstart', down, {
            'passive': true
        });
        // --- 监听语言变动 ---
        this.watch('locale', () => {
            if (!this.access.editor) {
                return;
            }
            // --- 暂时无法动态修改语言 ---
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

}
