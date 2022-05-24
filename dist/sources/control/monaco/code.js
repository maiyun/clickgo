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
exports.mounted = exports.methods = exports.watch = exports.data = exports.computed = exports.props = void 0;
const clickgo = require("clickgo");
exports.props = {
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
exports.computed = {
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isReadonly': function () {
        return clickgo.tool.getBoolean(this.readonly);
    },
    'showMask': function () {
        return clickgo.dom.is.move;
    },
    'filesComp': function () {
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
exports.data = {
    'notInit': false,
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
exports.watch = {
    'isReadonly': function () {
        if (!this.monacoInstance) {
            return;
        }
        this.monacoInstance.updateOptions({
            'readOnly': this.isDisabled ? true : this.isReadonly
        });
    },
    'isDisabled': function () {
        if (!this.monacoInstance) {
            return;
        }
        this.monacoInstance.updateOptions({
            'readOnly': this.isDisabled ? true : this.isReadonly
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
    },
    'filesComp': function () {
        if (!this.monacoInstance) {
            return;
        }
        this.monaco.languages.typescript.typescriptDefaults.setExtraLibs(this.filesComp);
    },
    'theme': function () {
        if (!this.monacoInstance) {
            return;
        }
        this.monaco.editor.setTheme(this.theme);
    }
};
exports.methods = {
    execCmd: function (ac) {
        return __awaiter(this, void 0, void 0, function* () {
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
                            range: new this.monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn),
                            text: ''
                        }
                    ]);
                    break;
                }
                case 'paste': {
                    const str = yield navigator.clipboard.readText();
                    const selection = this.monacoInstance.getSelection();
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
const mounted = function () {
    const iframeEl = this.$refs.iframe;
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
    const monaco = clickgo.core.getModule('monaco');
    if (monaco) {
        const loaderEl = idoc.createElement('script');
        loaderEl.addEventListener('load', () => {
            iwindow.require.config({
                paths: {
                    'vs': clickgo.getCdn() + '/npm/monaco-editor@0.29.1/min/vs'
                }
            });
            const proxy = iwindow.URL.createObjectURL(new Blob([`
                self.MonacoEnvironment = {
                    baseUrl: '${clickgo.getCdn()}/npm/monaco-editor@0.29.1/min/'
                };
                importScripts('${clickgo.getCdn()}/npm/monaco-editor@0.29.1/min/vs/base/worker/workerMain.js');
            `], { type: 'text/javascript' }));
            iwindow.MonacoEnvironment = {
                getWorkerUrl: () => proxy
            };
            iwindow.require(['vs/editor/editor.main'], (monaco) => {
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
                clickgo.dom.watchSize(this.$refs.iframe, () => {
                    this.monacoInstance.layout();
                });
                this.monacoInstance.getModel().onDidChangeContent(() => {
                    this.$emit('update:modelValue', this.monacoInstance.getValue());
                });
                monaco.languages.typescript.typescriptDefaults.setExtraLibs(this.filesComp);
                if (this.theme) {
                    this.monaco.editor.setTheme(this.theme);
                }
                if (navigator.clipboard) {
                    monacoEl.addEventListener('contextmenu', (e) => {
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
                const down = (e) => {
                    if (clickgo.dom.hasTouchButMouse(e)) {
                        return;
                    }
                    if (e instanceof TouchEvent) {
                        clickgo.dom.bindLong(e, () => {
                            clickgo.form.showPop(this.$el, this.$refs.pop, e);
                        });
                    }
                    clickgo.form.changeFocus(this.formId);
                    clickgo.form.hidePop();
                };
                monacoEl.addEventListener('mousedown', down);
                monacoEl.addEventListener('touchstart', down);
                this.$emit('init', this.monacoInstance);
            });
        });
        loaderEl.src = monaco;
        idoc.head.append(loaderEl);
    }
    else {
        this.notInit = true;
    }
};
exports.mounted = mounted;
