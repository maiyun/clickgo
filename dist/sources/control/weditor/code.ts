import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'imgselect': null,
        'imgupload': null,
        'videoselect': null,
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

    public async execCmd(ac: string): Promise<void> {
        switch (ac) {
            case 'copy': {
                await navigator.clipboard.writeText(this.access.editor.getSelectionText());
                break;
            }
            case 'cut': {
                await navigator.clipboard.writeText(this.access.editor.getSelectionText());
                this.access.editor.insertText('');
                break;
            }
            case 'paste': {
                try {
                    const ls = await navigator.clipboard.read();
                    for (const item of ls) {
                        if (!item.types.length) {
                            continue;
                        }
                        if (item.types.length === 1) {
                            if (item.types[0].includes('text')) {
                                const data = await item.getType(item.types[0]);
                                this.access.editor.insertText(await data.text());
                                continue;
                            }
                            // --- 图片文件 ---
                            const e: types.ITuieditorImguploadEvent = {
                                'detail': {
                                    'file': await item.getType(item.types[0]),
                                    callback: (url: string, opt: {
                                        'alt'?: string;
                                        'width'?: number;
                                        'height'?: number;
                                        'align'?: string;
                                    } = {}) => {
                                        this.access.editor.dangerouslyInsertHtml(`<p${opt.align ? ' style="text-align:center;"' : ''}><img src="${url}"${opt.alt ? ` alt="${opt.alt}"` : ''} style="${opt.width ? `width:${opt.width};` : ''}${opt.height ? `height:${opt.height};` : ''}"></p>`);
                                    }
                                }
                            };
                            this.emit('imgupload', e);
                            continue;
                        }
                        // --- 可能是 HTML ---
                        const blob = await item.getType(item.types[1]);
                        let html = await blob.text();
                        this.access.editor.dangerouslyInsertHtml(html);
                    }
                }
                catch {
                    break;
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
        const weditor = await clickgo.core.getModule('weditor');
        if (!weditor) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        const { createEditor, createToolbar, i18nChangeLanguage, SlateTransforms } = weditor;

        // --- 仅支持中英文 ---
        i18nChangeLanguage(this.getLanguage());

        /** --- 创建编辑器 --- */
        this.access.editor = createEditor({
            'selector': this.refs.editor,
            'html': this.props.modelValue,
            'config': {
                'placeholder': this.props.placeholder,
                'autoFocus': false,
                'MENU_CONF': {
                    'uploadImage': {
                        customBrowseAndUpload: (insertFn: (url: string, alt?: string, href?: string) => void) => {
                            this.emit('imgselect', (url: string, alt?: string) => {
                                insertFn(url, alt);
                            });
                        }
                    },
                    'uploadVideo': {
                        customBrowseAndUpload: (insertFn: (url: string, poster?: string) => void) => {
                            this.emit('videoselect', (url: string, poster?: string) => {
                                insertFn(url, poster);
                            });
                        }
                    }
                },
                onChange: (editor: any) => {
                    const html = editor.getHtml();
                    this.emit('update:modelValue', html);
                    this.emit('text', editor.getText())
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
        // console.log('x', tb.getConfig());
        // --- 绑定 contextmenu ---
        this.refs.editor.addEventListener('contextmenu', (e: MouseEvent) => {
            e.preventDefault();
            if (clickgo.dom.hasTouchButMouse(e)) {
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
            if (e instanceof TouchEvent) {
                // --- touch 长按弹出 ---
                clickgo.dom.bindLong(e, () => {
                    clickgo.form.showPop(this.element, this.refs.pop, e);
                });
            }
        };
        this.refs.editor.addEventListener('mousedown', down);
        this.refs.editor.addEventListener('touchstart', down, {
            'passive': true
        });
        // --- 监听语言变动 ---
        this.watch('locale', () => {
            if (!this.access.editor) {
                return;
            }
            // --- 暂时无法动态修改语言 ---
            // this.access.tuieditor.i18n.setCode(this.getLanguage());
        });
        // --- 监听 readonly 变动 ---
        this.watch('readonly', () => {
            if (!this.access.editor) {
                return;
            }
            if (this.propBoolean('readonly')) {
                // --- 变为不可操作 ---
                this.access.editor.disable();
            }
            else {
                // --- 变为可操作 ---
                this.access.editor.enable();
            }
        }, {
            'immediate': true
        });
        // --- 监听上面的值的变动 ---
        this.watch('modelValue', async (v: string) => {
            if (!this.access.editor) {
                return;
            }
            if (v === this.access.editor.getHtml()) {
                return;
            }
            // --- thx ---
            // --- 删除内容 ---
            this.access.editor.children.forEach(() => {
                SlateTransforms.delete(this.access.editor, { 'at': [0] })
            });
            // --- 初始化内容 ---
            SlateTransforms.insertNodes(this.access.editor, {
                'type': 'p',
                'children': [{ text: '' }]
            }, { at: [0] });
            // --- 初始化选取 ---
            SlateTransforms.select(this.access.editor, {
                'anchor': { 'path': [0, 0], 'offset': 0 },
                'focus': { 'path': [0, 0], 'offset': 0 },
            });
            await clickgo.tool.sleep(0);
            this.access.editor.setHtml(v);
            // --- thx for: https://github.com/wangeditor-team/wangEditor/issues/4878 ---
            /*
            this.access.editor.clear();
            this.access.editor.select([]);
            this.access.editor.dangerouslyInsertHtml(v);
            */
        });
        // --- 初始化成功 ---
        this.isLoading = false;
        this.emit('init', this.access.editor);
        if (this.props.modelValue) {
            this.emit('text', this.access.editor.getText());
        }
    }

}
