export let props = {
    'disabled': {
        'default': false
    },

    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': 0
    },
    'top': {
        'default': 0
    },
    'zIndex': {
        'default': 0
    },
    'flex': {
        'default': ''
    },

    'readonly': {
        'default': false
    },
    'modelValue': {
        'default': ''
    },
    'language': {
        'default': undefined
    }
};

export let computed = {
    'isDisabled': function(this: IVueControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    }
};

export let data = {
    'notInit': false,

    'localData': {
        'en-us': {
            'copy': 'Copy',
            'cut': 'Cut',
            'paste': 'Paste'
        },
        'zh-cn': {
            'copy': '复制',
            'cut': '剪下',
            'paste': '粘上'
        },
        'zh-tw': {
            'copy': '複製',
            'cut': '剪貼',
            'paste': '貼上'
        },
        'ja-jp': {
            'copy': 'コピー',
            'cut': '切り取り',
            'paste': '貼り付け'
        }
    }
};

export let watch = {
    'readonly': function(this: IVueControl): void {
        if (!this.monacoInstance) {
            return;
        }
        this.monacoInstance.updateOptions({
            'readOnly': this.readonly
        });
    },
    'modelValue': function(this: IVueControl): void {
        if (!this.monacoInstance) {
            return;
        }
        if (this.modelValue === this.monacoInstance.getValue()) {
            return;
        }
        this.monacoInstance.setValue(this.modelValue);
    },
    'language': function(this: IVueControl): void {
        if (!this.monacoInstance) {
            return;
        }
        this.monaco.editor.setModelLanguage(this.monacoInstance.getModel(), this.language.toLowerCase());
    }
};

export let methods = {
    contextmenu: function(this: IVueControl, e: MouseEvent): void {
        if (!navigator.clipboard) {
            e.stopPropagation();
            return;
        }
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        this.cgShowPop(e);
    },
    down: function(this: IVueControl, e: MouseEvent | TouchEvent): void {
        this.cgDown(e);
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (this.cgSelfPopOpen) {
            this.cgHidePop();
        }
    },
    execCmd: async function(this: IVueControl, ac: string): Promise<void> {
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

export let mounted = function(this: IVueControl): void {
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
        // --- 自动设置大小 ---
        clickgo.dom.watchSize(this.$refs.monaco, () => {
            this.monacoInstance.layout();
        });
    }
    else {
        // --- 没有成功 ---
        this.notInit = true;
    }
};

export let unmounted = function(this: IVueControl): void {
    if (this.monacoInstance) {
        this.monacoInstance.dispose();
    }
};
