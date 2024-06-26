import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'jump': null,
        'init': null,

        'update:files': null,
        'update:modelValue': null
    };

    public props: {
        'disabled': boolean | string;
        'readonly': boolean | string;

        'modelValue': string;
        'language': string;
        'theme': string;
        'files': Record<string, any>;
    } = {
            'disabled': false,
            'readonly': false,

            'modelValue': '',
            'language': '',
            'theme': '',
            'files': {}
        };

    public access: {
        'instance': any;
        'monaco': any;
    } = {
            'instance': undefined,
            'monaco': undefined
        };

    public get showMask(): boolean {
        // --- 防止拖动导致卡顿 ---
        return this.isLoading ? true : clickgo.dom.is.move;
    }

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

    public setValue(model: Record<string, any>, val?: string): void {
        model.pushEditOperations(
            [],
            [
                {
                    range: model.getFullModelRange(),
                    text: val === undefined ? model.getValue() : val
                }
            ],
            () => { /* Nothing */ },
        );
    }

    public async execCmd(ac: string): Promise<void> {
        switch (ac) {
            case 'copy': {
                clickgo.tool.execCommand(ac);
                break;
            }
            case 'cut': {
                clickgo.tool.execCommand('copy');
                const selection = this.access.instance.getSelection();
                this.access.instance.executeEdits('', [
                    {
                        range: new this.access.monaco.Range(
                            selection.startLineNumber,
                            selection.startColumn,
                            selection.endLineNumber,
                            selection.endColumn
                        ),
                        text: ''
                    }
                ]);
                // console.log(this.monacoInstance.getSupportedActions());
                break;
            }
            case 'paste': {
                const str = await navigator.clipboard.readText();
                const selection = this.access.instance.getSelection();
                this.access.instance.executeEdits('', [
                    {
                        range: new this.access.monaco.Range(
                            selection.startLineNumber,
                            selection.startColumn,
                            selection.endLineNumber,
                            selection.endColumn
                        ),
                        text: str
                    }
                ]);
                break;
            }
        }
    }

    /**
     * --- 根据 files 刷新代码提示 ---
     */
    public refreshModels(): void {
        const beforePaths: string[] = [];
        const models = this.access.monaco.editor.getModels();
        /** --- 是否刷新当前 instance 的代码提示 --- */
        let refreshInstance = false;
        for (const model of models) {
            // --- 遍历已经存在的 model ---
            if (this.props.files[model.uri.path] === undefined) {
                // --- 删除不存在的 model ---
                model.dispose();
                refreshInstance = true;
                continue;
            }
            beforePaths.push(model.uri.path);
        }
        for (const path in this.props.files) {
            // --- 遍历最新的文件列表 ---
            if (beforePaths.includes(path)) {
                // --- 检测老文件内容是否相同 ---
                const model = this.access.monaco.editor.getModel(this.access.monaco.Uri.parse(path));
                if (model.getValue() !== this.props.files[path]) {
                    // --- 内容不同，更新 ---
                    this.setValue(model, this.props.files[path]);
                    refreshInstance = true;
                }
                continue;
            }
            // --- 新增的 model ---
            const model =
                this.access.monaco.editor.createModel(
                    this.props.files[path],
                    undefined,
                    this.access.monaco.Uri.parse(path)
                );
            model.pushEOL(0);
            model.onDidChangeContent(() => {
                this.props.files[path] = model.getValue();
                this.emit('update:files', this.props.files);
            });
            refreshInstance = true;
        }
        // --- 刷新代码提示 ---
        if (this.props.language === 'typescript' && refreshInstance) {
            const model = this.access.instance.getModel();
            if (model) {
                this.setValue(model);
            }
        }
    }

    public async onMounted(): Promise<void> {
        this.watch('readonly', (): void => {
            if (!this.access.instance) {
                return;
            }
            this.access.instance.updateOptions({
                'readOnly': this.propBoolean('disabled') ? true : this.propBoolean('readonly')
            });
        });
        this.watch('disabled', (): void => {
            if (!this.access.instance) {
                return;
            }
            this.access.instance.updateOptions({
                'readOnly': this.propBoolean('disabled') ? true : this.propBoolean('readonly')
            });
        });

        this.watch('files', (
            after: Record<string, string> | undefined,
            before: Record<string, string> | undefined
        ): void => {
            if (!this.access.instance) {
                return;
            }
            if (after !== undefined) {
                if (before === undefined) {
                    // --- code 转 path 模式 ---
                    let model = this.access.monaco.editor.getModels()[0];
                    if (model) {
                        model.dispose();
                    }
                    model = this.access.monaco.editor.getModel(this.access.monaco.Uri.parse(this.props.modelValue));
                    if (model) {
                        this.access.instance.setModel(model);
                        if (this.props.language) {
                            this.access.monaco.editor.setModelLanguage(model, this.props.language.toLowerCase());
                        }
                    }
                }
                else {
                    // --- 什么模式也不转，仅仅 files 内容、文件数变动 ---
                    this.refreshModels();
                }
            }
            else {
                // --- path 转 code 模式 ---
                const models = this.access.monaco.editor.getModels();
                for (const model of models) {
                    model.dispose();
                }
                const model = this.access.monaco.editor.createModel(this.props.modelValue, this.props.language);
                model.pushEOL(0);
                // --- 内容改变 ---
                model.onDidChangeContent(() => {
                    this.emit('update:modelValue', model.getValue());
                });
                this.access.instance.setModel(model);
            }
        }, {
            'deep': true
        });
        this.watch('modelValue', (): void => {
            if (!this.access.instance) {
                return;
            }
            if (Object.keys(this.props.files).length) {
                // --- files 模式 ---
                const model = this.access.monaco.editor.getModel(this.access.monaco.Uri.parse(this.props.modelValue));
                if (model) {
                    this.access.instance.setModel(model);
                    if (this.props.language) {
                        this.access.monaco.editor.setModelLanguage(model, this.props.language.toLowerCase());
                        if (this.props.language === 'typescript') {
                            this.setValue(model);
                        }
                    }
                }
            }
            else {
                // --- code 模式 ---
                const model = this.access.instance.getModel();
                if (this.props.modelValue === model.getValue()) {
                    return;
                }
                this.setValue(model, this.props.modelValue);
            }
        });
        this.watch('language', (): void => {
            if (!this.access.instance) {
                return;
            }
            if (!this.props.language) {
                return;
            }
            const model = this.access.instance.getModel();
            if (!model) {
                return;
            }
            this.access.monaco.editor.setModelLanguage(model, this.props.language.toLowerCase());
            if (this.props.language === 'typescript') {
                this.setValue(model);
            }
        });
        this.watch('theme', (): void => {
            if (!this.access.instance) {
                return;
            }
            this.access.monaco.editor.setTheme(this.props.theme);
        });

        // --- 初始化 ---

        const iframeEl = this.refs.iframe as unknown as HTMLIFrameElement;
        if (!iframeEl.contentWindow) {
            return;
        }
        const iwindow = iframeEl.contentWindow;
        const idoc = iwindow.document;
        idoc.body.style.margin = '0';
        idoc.body.style.overflow = 'hidden';
        const monacoEl = idoc.createElement('div');
        monacoEl.id = 'monaco';
        monacoEl.style.height = '100%';
        idoc.body.append(monacoEl);
        /** --- monaco 的 loader 文件全量 data url --- */
        const monaco = await clickgo.core.getModule('monaco');
        if (!monaco) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        // --- 加载成功 ---
        const loaderEl = idoc.createElement('script');
        loaderEl.addEventListener('load', () => {
            (iwindow as any).require.config({
                paths: {
                    'vs': clickgo.core.getCdn() + '/npm/monaco-editor@0.50.0/min/vs'
                }
            });
            // --- 初始化 Monaco ---
            const proxy = (iwindow as any).URL.createObjectURL(new Blob([`
                self.MonacoEnvironment = {
                    baseUrl: '${clickgo.core.getCdn()}/npm/monaco-editor@0.50.0/min/'
                };
                importScripts('${clickgo.core.getCdn()}/npm/monaco-editor@0.50.0/min/vs/base/worker/workerMain.js');
            `], { type: 'text/javascript' }));
            (iwindow as any).MonacoEnvironment = {
                getWorkerUrl: () => proxy
            };
            // --- 加载 ---
            (iwindow as any).require(['vs/editor/editor.main'], (monaco: any) => {
                this.access.monaco = monaco;
                this.access.instance = this.access.monaco.editor.create(monacoEl, {
                    'model': null,
                    'contextmenu': false,
                    'minimap': {
                        'enabled': false
                    },
                    'readOnly': this.props.readonly,
                    'automaticLayout': true
                });
                this.access.instance._codeEditorService.openCodeEditor = (input: any) => {
                    this.emit('jump', input);
                    /*
                    source.setSelection(input.options.selection);
                    source.revealLine(input.options.selection.startLineNumber);
                    */
                    return this.access.instance;
                };
                // --- 设置主题 ---
                if (this.props.theme) {
                    this.access.monaco.editor.setTheme(this.props.theme);
                }
                // --- 绑定 contextmenu ---
                if (navigator.clipboard) {
                    monacoEl.addEventListener('contextmenu', (e: MouseEvent) => {
                        e.preventDefault();
                        if (clickgo.dom.hasTouchButMouse(e)) {
                            return;
                        }
                        const rect = this.element.getBoundingClientRect();
                        clickgo.form.showPop(this.element, this.refs.pop, {
                            'x': rect.left + e.clientX,
                            'y': rect.top + e.clientY
                        });
                    });
                }
                // --- 绑定 down 事件 ---
                const down = (e: MouseEvent | TouchEvent): void => {
                    if (clickgo.dom.hasTouchButMouse(e)) {
                        return;
                    }
                    if (e instanceof TouchEvent) {
                        // --- touch 长按弹出 ---
                        clickgo.dom.bindLong(e, () => {
                            clickgo.form.showPop(this.element, this.refs.pop, e);
                        });
                    }
                    // --- 让本窗体获取焦点 ---
                    clickgo.form.changeFocus(this.formId);
                    // --- 无论是否 menu 是否被展开，都要隐藏，因为 iframe 外的 doFocusAndPopEvent 并不会执行 ---
                    clickgo.form.hidePop();
                };
                monacoEl.addEventListener('mousedown', down);
                monacoEl.addEventListener('touchstart', down, {
                    'passive': true
                });
                // -- 设置文件列表 ---
                if (Object.keys(this.props.files).length) {
                    // --- 读取 files 中的文件内容 ---
                    this.refreshModels();
                    const model =
                        this.access.monaco.editor.getModel(this.access.monaco.Uri.parse(this.props.modelValue));
                    if (model) {
                        this.access.instance.setModel(model);
                        if (this.props.language) {
                            this.access.monaco.editor.setModelLanguage(model, this.props.language.toLowerCase());
                        }
                    }
                }
                else {
                    // --- modelValue 即是代码，无 files ---
                    const model = this.access.monaco.editor.createModel(this.props.modelValue, this.props.language);
                    model.pushEOL(0);
                    // --- 内容改变 ---
                    model.onDidChangeContent(() => {
                        this.emit('update:modelValue', model.getValue());
                    });
                    this.access.instance.setModel(model);
                }
                // --- 监听 font 相关信息 ---
                clickgo.dom.watchStyle(this.element, ['font-size', 'font-family'], (n, v) => {
                    switch (n) {
                        case 'font-size': {
                            idoc.body.style.fontSize = v;
                            this.access.instance.updateOptions({
                                'fontSize': v
                            });
                            break;
                        }
                        case 'font-family': {
                            idoc.body.style.fontFamily = v;
                            this.access.instance.updateOptions({
                                'fontFamily': v
                            });
                            break;
                        }
                    }
                }, true);
                // --- 初始化成功 ---
                this.isLoading = false;
                this.emit('init', {
                    'monaco': this.access.monaco,
                    'instance': this.access.instance
                });
            });
        });
        loaderEl.src = monaco;
        idoc.head.append(loaderEl);
    }

}
