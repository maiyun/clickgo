import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'imgselect': null
    };

    public props: {
        'disabled': boolean | string;

        'modelValue': string;
        'visual': boolean | string;
        'theme': 'dark' | 'light';
    } = {
            'disabled': false,

            'modelValue': '',
            'visual': false,
            'theme': 'light'
        };

    public notInit = false;

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
        'tuieditor': any;
    } = {
            'tuieditor': undefined
        };

    public async execCmd(ac: string): Promise<void> {
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
                const str = await navigator.clipboard.readText();
                if (str) {
                    this.access.tuieditor.insertText(str);
                }
                break;
            }
        }
    }

    /** --- 获得语言 --- */
    public getLanguage(): string {
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

    public async onMounted(): Promise<void> {
        const tuieditor = await clickgo.core.getModule('tuieditor');
        if (!tuieditor) {
            // --- 没有成功 ---
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
            'autofocus': false,
            'events': {
                // --- 用户输入事件 ---
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
            this.emit('imgselect', (url: string, opt?: {
                'alt'?: string;
                'width'?: number;
                'height'?: number;
                'align'?: string;
            }) => {
                if (opt && (opt.width || opt.height)) {
                    if (this.access.tuieditor.isMarkdownMode()) {
                        this.access.tuieditor.replaceSelection(`<div${opt.align ? ' align="center"' : ''}><img src="${url}"${opt.alt ? ` alt="${opt.alt}"` : ''}${opt.width ? ` width="${opt.width}"` : ''}${opt.height ? ` height="${opt.height}"` : ''}></div>`);
                        return;
                    }
                }
                this.access.tuieditor.exec('addImage', {
                    'imageUrl': url,
                    'altText': opt?.alt ?? ''
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
        // --- 绑定 contextmenu ---
        this.element.addEventListener('contextmenu', (e: MouseEvent) => {
            e.preventDefault();
            if (clickgo.dom.hasTouchButMouse(e)) {
                return;
            }
            const target = e.target as HTMLElement;
            if (!target.classList.contains('ProseMirror') && !clickgo.dom.findParentByClass(target, 'ProseMirror')) {
                return;
            }
            if (target.tagName.toLowerCase() === 'table' || clickgo.dom.findParentByTag(target, 'table')) {
                return;
            }
            clickgo.form.showPop(this.element, this.refs.pop, e);
        });
        // --- 绑定 down 事件 ---
        const down = (e: MouseEvent | TouchEvent): void => {
            if (clickgo.dom.hasTouchButMouse(e)) {
                return;
            }
            if (this.element.dataset.cgPopOpen !== undefined) {
                clickgo.form.hidePop(this.element);
            }
            const target = e.target as HTMLElement;
            if (!target.classList.contains('ProseMirror') && !clickgo.dom.findParentByClass(target, 'ProseMirror')) {
                return;
            }
            if (e instanceof TouchEvent) {
                // --- touch 长按弹出 ---
                clickgo.dom.bindLong(e, () => {
                    clickgo.form.showPop(this.element, this.refs.pop, e);
                });
            }
        };
        this.element.addEventListener('mousedown', down);
        this.element.addEventListener('touchstart', down, {
            'passive': true
        });
        // --- 绑定 wheel 事件 ---
        const wheel = (e: WheelEvent | TouchEvent, el: HTMLElement): void => {
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
        const list: NodeListOf<HTMLElement> = this.refs.content.querySelectorAll('.ProseMirror, .toastui-editor-md-preview');
        for (const el of list) {
            el.addEventListener('wheel', (e) => {
                wheel(e, el);
            });
            el.addEventListener('touchstart', (e) => {
                wheel(e, el);
            });
        }
        // --- 监听语言变动 ---
        this.watch('locale', () => {
            if (!this.access.tuieditor) {
                return;
            }
            // --- 暂时无法动态修改语言 ---
            // this.access.tuieditor.i18n.setCode(this.getLanguage());
        });
        // --- 监听 prop 变动 ---
        this.watch('visual', (): void => {
            if (!this.access.tuieditor) {
                return;
            }
            this.access.tuieditor.changeMode(this.propBoolean('visual') ? 'wysiwyg' : 'markdown');
        });
        this.watch('theme', (): void => {
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
        // --- 监听上面的值的变动 ---
        this.watch('modelValue', (v: string) => {
            if (!this.access.tuieditor) {
                return;
            }
            if (v === this.access.tuieditor.getMarkdown()) {
                return;
            }
            this.access.tuieditor.setMarkdown(v);
        });
        // --- 监听 font 相关信息 ---
        clickgo.dom.watchStyle(this.element, ['font-size', 'font-family'], (n, v) => {
            if (!this.access.tuieditor) {
                return;
            }
            const pm: HTMLElement | null = this.refs.content.querySelector('.ProseMirror');
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
        // --- 初始化成功 ---
        this.isLoading = false;
        this.emit('init', this.access.tuieditor);
    }

}
