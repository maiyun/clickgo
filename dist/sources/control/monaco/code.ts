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
        'default': {}
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
        return this.maskTxt !== '' ? true : clickgo.dom.is.move;
    },
    'filesComp': function(this: types.IVControl): any[] {
        const list = [];
        for (const path in this.files) {
            list.push({
                'content': this.files[path],
                'filePath': path
            });
        }
        return list;
    }
};

export const data = {
    'notInit': false,
    'maskTxt': 'Loading...',

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
        if (!this.monacoInstance) {
            return;
        }
        this.monacoInstance.updateOptions({
            'readOnly': this.isDisabled ? true : this.isReadonly
        });
    },
    'isDisabled': function(this: types.IVControl): void {
        if (!this.monacoInstance) {
            return;
        }
        this.monacoInstance.updateOptions({
            'readOnly': this.isDisabled ? true : this.isReadonly
        });
    },

    'modelValue': function(this: types.IVControl): void {
        if (!this.monacoInstance) {
            return;
        }
        if (this.modelValue === this.monacoInstance.getValue()) {
            return;
        }
        this.monacoInstance.setValue(this.modelValue);
    },
    'language': function(this: types.IVControl): void {
        if (!this.monacoInstance) {
            return;
        }
        this.monaco.editor.setModelLanguage(this.monacoInstance.getModel(), this.language.toLowerCase());
    },
    'filesComp': function(this: types.IVControl): void {
        if (!this.monacoInstance) {
            return;
        }
        this.monaco.languages.typescript.typescriptDefaults.setExtraLibs(this.filesComp);
    },
    'theme': function(this: types.IVControl): void {
        if (!this.monacoInstance) {
            return;
        }
        this.monaco.editor.setTheme(this.theme);
    }
};

export const methods = {
    execCmd: async function(this: types.IVControl, ac: string): Promise<void> {
        switch (ac) {
            case 'copy': {
                clickgo.tool.execCommand(ac);
                break;
            }
            case 'cut': {
                clickgo.tool.execCommand('copy');
                const selection = this.monacoInstance.getSelection();
                this.monacoInstance.executeEdits('', [
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
                const selection = this.monacoInstance.getSelection();
                this.monacoInstance.executeEdits('', [
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
                    'vs': clickgo.getCdn() + '/npm/monaco-editor@0.29.1/min/vs'
                }
            });
            // --- 初始化 Monaco ---
            const proxy = (iwindow as any).URL.createObjectURL(new Blob([`
                self.MonacoEnvironment = {
                    baseUrl: '${clickgo.getCdn()}/npm/monaco-editor@0.29.1/min/'
                };
                importScripts('${clickgo.getCdn()}/npm/monaco-editor@0.29.1/min/vs/base/worker/workerMain.js');
            `], { type: 'text/javascript' }));
            (iwindow as any).MonacoEnvironment = {
                getWorkerUrl: () => proxy
            };
            // --- 加载 ---
            (iwindow as any).require(['vs/editor/editor.main'], (monaco: any) => {
                this.monaco = monaco;
                this.monacoInstance = this.monaco.editor.create(monacoEl, {
                    'language': this.language.toLowerCase(),
                    'value': this.modelValue,
                    'contextmenu': false,
                    'minimap': {
                        'enabled': false
                    },
                    'readOnly': this.readonly
                });
                // --- 自动设置大小 ---
                clickgo.dom.watchSize(this.$refs.iframe, () => {
                    this.monacoInstance.layout();
                });
                // --- 内容改变 ---
                this.monacoInstance.getModel().onDidChangeContent(() => {
                    this.$emit('update:modelValue', this.monacoInstance.getValue());
                });
                // -- 设置文件外挂 ---
                monaco.languages.typescript.typescriptDefaults.setExtraLibs(this.filesComp);
                // --- 设置主题 ---
                if (this.theme) {
                    this.monaco.editor.setTheme(this.theme);
                }
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
                monacoEl.addEventListener('touchstart', down);
                // --- 初始化成功 ---
                this.maskTxt = '';
                this.$emit('init', this.monacoInstance);
            });
        });
        loaderEl.src = monaco;
        idoc.head.append(loaderEl);
    }
    else {
        // --- 没有成功 ---
        this.notInit = true;
    }
};
