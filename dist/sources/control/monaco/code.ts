export let props = {
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

export let computed = {
    'isDisabled': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isReadonly': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.readonly);
    },

    'filesComp': function(this: IVControl): any[] {
        let list = [];
        for (let path in this.files) {
            list.push({
                'content': this.files[path],
                'filePath': path
            });
        }
        return list;
    }
};

export let data = {
    'notInit': false,

    'localData': {
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

export let watch = {
    'isReadonly': function(this: IVControl): void {
        if (!this.monacoInstance) {
            return;
        }
        this.monacoInstance.updateOptions({
            'readOnly': this.isDisabled ? true : this.isReadonly
        });
    },
    'isDisabled': function(this: IVControl): void {
        if (!this.monacoInstance) {
            return;
        }
        this.monacoInstance.updateOptions({
            'readOnly': this.isDisabled ? true : this.isReadonly
        });
    },

    'modelValue': function(this: IVControl): void {
        if (!this.monacoInstance) {
            return;
        }
        if (this.modelValue === this.monacoInstance.getValue()) {
            return;
        }
        this.monacoInstance.setValue(this.modelValue);
    },
    'language': function(this: IVControl): void {
        if (!this.monacoInstance) {
            return;
        }
        this.monaco.editor.setModelLanguage(this.monacoInstance.getModel(), this.language.toLowerCase());
    }
};

export let methods = {
    contextmenu: function(this: IVControl, e: MouseEvent): void {
        if (!navigator.clipboard) {
            e.stopPropagation();
            return;
        }
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, e);
    },
    touch: function(this: IVControl, e: TouchEvent): void {
        if (navigator.clipboard) {
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.$el, this.$refs.pop, e);
            });
        }
    },
    down: function(this: IVControl, e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
        }
    },
    execCmd: async function(this: IVControl, ac: string): Promise<void> {
        switch (ac) {
            case 'copy': {
                clickgo.tool.execCommand(ac);
                break;
            }
            case 'cut': {
                clickgo.tool.execCommand('copy');
                let selection = this.monacoInstance.getSelection();
                this.monacoInstance.executeEdits('', [
                    {
                        range: new this.monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn),
                        text: ''
                    }
                ]);
                // console.log(this.monacoInstance.getSupportedActions());
                break;
            }
            case 'paste': {
                let str = await navigator.clipboard.readText();
                let selection = this.monacoInstance.getSelection();
                this.monacoInstance.executeEdits('', [
                    {
                        range: new this.monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn),
                        text: str
                    }
                ]);
                break;
            }
        }
    }
};

export let mounted = function(this: IVControl): void {
    let monaco = clickgo.core.getModule('monaco');
    if (monaco) {
        this.monaco = monaco;
        this.monacoInstance = monaco.editor.create(this.$refs.monaco, {
            'language': this.language.toLowerCase(),
            'value': this.modelValue,
            'contextmenu': false,
            'minimap': {
                'enabled': false
            },
            'readOnly': this.readonly
        });
        // --- 内容改变 ---
        this.monacoInstance.getModel().onDidChangeContent(() => {
            this.$emit('update:modelValue', this.monacoInstance.getValue());
        });
        // --- 焦点 ---
        this.monacoInstance.onDidFocusEditorWidget(() => {
            monaco.languages.typescript.typescriptDefaults.setExtraLibs(this.filesComp);
        });
        // --- 自动设置大小 ---
        clickgo.dom.watchSize(this.$refs.monaco, () => {
            this.monacoInstance.layout();
        });
        // --- 初始化成功 ---
        this.$emit('init', this.monacoInstance);
    }
    else {
        // --- 没有成功 ---
        this.notInit = true;
    }
};

export let unmounted = function(this: IVControl): void {
    if (this.monacoInstance) {
        this.monacoInstance.dispose();
    }
};
