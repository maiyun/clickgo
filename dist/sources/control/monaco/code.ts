import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export const props = {
    'disabled': {
        'default': false
    },

    'readonly': {
        'default': false
    },
    'modelValue': {
        'default': ''
    },
    'language': {
        'default': undefined
    },
    'theme': {
        'default': undefined
    },
    'files': {
        'default': undefined
    }
};

export const computed = {
    'isDisabled': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isReadonly': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.readonly);
    },

    'showMask': function(this: types.IVControl): boolean {
        // --- 防止拖动导致卡顿 ---
        return this.isLoading ? true : clickgo.dom.is.move;
    }
};

export const data = {
    'notInit': false,
    'isLoading': true,

    'localeData': {
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
        }
    }
};

export const watch = {
    'isReadonly': function(this: types.IVControl): void {
        if (!this.instance) {
            return;
        }
        this.instance.updateOptions({
            'readOnly': this.isDisabled ? true : this.isReadonly
        });
    },
    'isDisabled': function(this: types.IVControl): void {
        if (!this.instance) {
            return;
        }
        this.instance.updateOptions({
            'readOnly': this.isDisabled ? true : this.isReadonly
        });
    },

    'files': {
        handler: function(
            this: types.IVControl,
            after: Record<string, string> | undefined,
            before: Record<string, string> | undefined
        ): void {
            if (!this.instance) {
                return;
            }
            if (after !== undefined) {
                if (before === undefined) {
                    // --- code 转 path 模式 ---
                    let model = this.monaco.editor.getModels()[0];
                    if (model) {
                        model.dispose();
                    }
                    model = this.monaco.editor.getModel(this.monaco.Uri.parse(this.modelValue));
                    if (model) {
                        this.instance.setModel(model);
                        if (this.language) {
                            this.monaco.editor.setModelLanguage(model, this.language.toLowerCase());
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
                const models = this.monaco.editor.getModels();
                for (const model of models) {
                    model.dispose();
                }
                const model = this.monaco.editor.createModel(this.modelValue, this.language);
                model.pushEOL(0);
                // --- 内容改变 ---
                model.onDidChangeContent(() => {
                    this.$emit('update:modelValue', model.getValue());
                });
                this.instance.setModel(model);
            }
        },
        'deep': true
    },
    'modelValue': function(this: types.IVControl): void {
        if (!this.instance) {
            return;
        }
        if (this.files) {
            // --- files 模式 ---
            const model = this.monaco.editor.getModel(this.monaco.Uri.parse(this.modelValue));
            if (model) {
                this.instance.setModel(model);
                if (this.language) {
                    this.monaco.editor.setModelLanguage(model, this.language.toLowerCase());
                    if (this.language === 'typescript') {
                        this.setValue(model);
                    }
                }
            }
        }
        else {
            // --- code 模式 ---
            const model = this.instance.getModel();
            if (this.modelValue === model.getValue()) {
                return;
            }
            this.setValue(model, this.modelValue);
        }
    },
    'language': function(this: types.IVControl): void {
        if (!this.instance) {
            return;
        }
        if (!this.language) {
            return;
        }
        const model = this.instance.getModel();
        if (!model) {
            return;
        }
        this.monaco.editor.setModelLanguage(model, this.language.toLowerCase());
        if (this.language === 'typescript') {
            this.setValue(model);
        }
    },
    'theme': function(this: types.IVControl): void {
        if (!this.instance) {
            return;
        }
        this.monaco.editor.setTheme(this.theme);
    }
};

export const methods = {
    setValue: function(this: types.IVControl, model: Record<string, any>, val?: string): void {
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
    },
    execCmd: async function(this: types.IVControl, ac: string): Promise<void> {
        switch (ac) {
            case 'copy': {
                clickgo.tool.execCommand(ac);
                break;
            }
            case 'cut': {
                clickgo.tool.execCommand('copy');
                const selection = this.instance.getSelection();
                this.instance.executeEdits('', [
                    {
                        range: new this.monaco.Range(
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
                const selection = this.instance.getSelection();
                this.instance.executeEdits('', [
                    {
                        range: new this.monaco.Range(
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
    },
    refreshModels: function(this: types.IVControl): void {
        const beforePaths: string[] = [];
        const models = this.monaco.editor.getModels();
        /** --- 是否刷新当前 instance 的代码提示 --- */
        let refreshInstance = false;
        for (const model of models) {
            // --- 遍历已经存在的 model ---
            if (this.files[model.uri.path] === undefined) {
                // --- 删除不存在的 model ---
                model.dispose();
                refreshInstance = true;
                continue;
            }
            beforePaths.push(model.uri.path);
        }
        for (const path in this.files) {
            // --- 遍历最新的文件列表 ---
            if (beforePaths.includes(path)) {
                // --- 检测老文件内容是否相同 ---
                const model = this.monaco.editor.getModel(this.monaco.Uri.parse(path));
                if (model.getValue() !== this.files[path]) {
                    // --- 内容不同，更新 ---
                    this.setValue(model, this.files[path]);
                    refreshInstance = true;
                }
                continue;
            }
            // --- 新增的 model ---
            const model = this.monaco.editor.createModel(this.files[path], undefined, this.monaco.Uri.parse(path));
            model.pushEOL(0);
            model.onDidChangeContent(() => {
                this.files[path] = model.getValue();
                this.$emit('update:files', this.files);
            });
            refreshInstance = true;
        }
        // --- 刷新代码提示 ---
        if (this.language === 'typescript' && refreshInstance) {
            const model = this.instance.getModel();
            if (model) {
                this.setValue(model);
            }
        }
    }
};

export const mounted = function(this: types.IVControl): void {
    const iframeEl = this.$refs.iframe as unknown as HTMLIFrameElement;
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
    const monaco = clickgo.core.getModule('monaco');
    if (monaco) {
        const loaderEl = idoc.createElement('script');
        loaderEl.addEventListener('load', () => {
            (iwindow as any).require.config({
                paths: {
                    'vs': clickgo.core.cdn + '/npm/monaco-editor@0.33.0/min/vs'
                }
            });
            // --- 初始化 Monaco ---
            const proxy = (iwindow as any).URL.createObjectURL(new Blob([`
                self.MonacoEnvironment = {
                    baseUrl: '${clickgo.core.cdn}/npm/monaco-editor@0.33.0/min/'
                };
                importScripts('${clickgo.core.cdn}/npm/monaco-editor@0.33.0/min/vs/base/worker/workerMain.js');
            `], { type: 'text/javascript' }));
            (iwindow as any).MonacoEnvironment = {
                getWorkerUrl: () => proxy
            };
            // --- 加载 ---
            (iwindow as any).require(['vs/editor/editor.main'], (monaco: any) => {
                this.monaco = monaco;
                this.instance = this.monaco.editor.create(monacoEl, {
                    'model': null,
                    'contextmenu': false,
                    'minimap': {
                        'enabled': false
                    },
                    'readOnly': this.readonly
                });
                // --- 自动设置大小 ---
                clickgo.dom.watchSize(this.$refs.iframe, () => {
                    this.instance.layout();
                });
                // --- 设置主题 ---
                if (this.theme) {
                    this.monaco.editor.setTheme(this.theme);
                }
                // --- 绑定点击引用事件 ---
                const editorService = this.instance._codeEditorService;
                const openEditorBase = editorService.openCodeEditor.bind(editorService);
                editorService.openCodeEditor = async (input: any, source: any) => {
                    const result = await openEditorBase(input, source);
                    if (result === null) {
                        this.$emit('jump', input);
                        /*
                        source.setSelection(input.options.selection);
                        source.revealLine(input.options.selection.startLineNumber);
                        */
                    }
                    return result;  // 必须 return result
                };
                // --- 绑定 contextmenu ---
                if (navigator.clipboard) {
                    monacoEl.addEventListener('contextmenu', (e: MouseEvent) => {
                        e.preventDefault();
                        if (clickgo.dom.hasTouchButMouse(e)) {
                            return;
                        }
                        const rect = this.$el.getBoundingClientRect();
                        clickgo.form.showPop(this.$el, this.$refs.pop, {
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
                            clickgo.form.showPop(this.$el, this.$refs.pop, e);
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
                if (this.files !== undefined) {
                    // --- 读取 files 中的文件内容 ---
                    this.refreshModels(this.files, undefined);
                    const model = this.monaco.editor.getModel(this.monaco.Uri.parse(this.modelValue));
                    if (model) {
                        this.instance.setModel(model);
                        if (this.language) {
                            this.monaco.editor.setModelLanguage(model, this.language.toLowerCase());
                        }
                    }
                }
                else {
                    // --- modelValue 即是代码，无 files ---
                    const model = this.monaco.editor.createModel(this.modelValue, this.language);
                    model.pushEOL(0);
                    // --- 内容改变 ---
                    model.onDidChangeContent(() => {
                        this.$emit('update:modelValue', model.getValue());
                    });
                    this.instance.setModel(model);
                }
                // --- 监听 font 相关信息 ---
                clickgo.dom.watchStyle(this.$el, ['font-size', 'font-family'], (n, v) => {
                    switch (n) {
                        case 'font-size': {
                            idoc.body.style.fontSize = v;
                            this.instance.updateOptions({
                                'fontSize': v
                            });
                            break;
                        }
                        case 'font-family': {
                            idoc.body.style.fontFamily = v;
                            this.instance.updateOptions({
                                'fontFamily': v
                            });
                            break;
                        }
                    }
                }, true);
                // --- 初始化成功 ---
                this.isLoading = false;
                this.$emit('init', {
                    'monaco': this.monaco,
                    'instance': this.instance
                });
            });
        });
        loaderEl.src = monaco;
        idoc.head.append(loaderEl);
    }
    else {
        // --- 没有成功 ---
        this.isLoading = false;
        this.notInit = true;
    }
};
