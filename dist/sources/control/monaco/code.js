"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmounted = exports.mounted = exports.methods = exports.watch = exports.data = exports.computed = exports.props = void 0;
exports.props = {
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
exports.computed = {
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    }
};
exports.data = {
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
exports.watch = {
    'readonly': function () {
        if (!this.monacoInstance) {
            return;
        }
        this.monacoInstance.updateOptions({
            'readOnly': this.readonly
        });
    },
    'modelValue': function () {
        if (!this.monacoInstance) {
            return;
        }
        if (this.modelValue === this.monacoInstance.getValue()) {
            return;
        }
        this.monacoInstance.setValue(this.modelValue);
    },
    'language': function () {
        if (!this.monacoInstance) {
            return;
        }
        this.monaco.editor.setModelLanguage(this.monacoInstance.getModel(), this.language.toLowerCase());
    }
};
exports.methods = {
    contextmenu: function (e) {
        if (!navigator.clipboard) {
            e.stopPropagation();
            return;
        }
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        this.cgShowPop(e);
    },
    down: function (e) {
        this.cgDown(e);
        if (clickgo.dom.isMouseAlsoTouchEvent(e)) {
            return;
        }
        if (this.cgSelfPopOpen) {
            this.cgHidePop();
        }
    },
    execCmd: function (ac) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    break;
                }
                case 'paste': {
                    let str = yield navigator.clipboard.readText();
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
        });
    }
};
exports.mounted = function () {
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
        this.monacoInstance.getModel().onDidChangeContent(() => {
            this.$emit('update:modelValue', this.monacoInstance.getValue());
        });
        clickgo.dom.watchSize(this.$refs.monaco, () => {
            this.monacoInstance.layout();
        });
    }
    else {
        this.notInit = true;
    }
};
exports.unmounted = function () {
    if (this.monacoInstance) {
        this.monacoInstance.dispose();
    }
};
