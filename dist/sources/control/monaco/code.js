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
        'default': undefined
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
        return this.maskTxt !== '' ? true : clickgo.dom.is.move;
    }
};
exports.data = {
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
exports.watch = {
    'isReadonly': function () {
        if (!this.instance) {
            return;
        }
        this.instance.updateOptions({
            'readOnly': this.isDisabled ? true : this.isReadonly
        });
    },
    'isDisabled': function () {
        if (!this.instance) {
            return;
        }
        this.instance.updateOptions({
            'readOnly': this.isDisabled ? true : this.isReadonly
        });
    },
    'files': {
        handler: function (after, before) {
            if (!this.instance) {
                return;
            }
            if (after !== undefined) {
                if (before === undefined) {
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
                    this.refreshModels();
                }
            }
            else {
                const models = this.monaco.editor.getModels();
                for (const model of models) {
                    model.dispose();
                }
                const model = this.monaco.editor.createModel(this.modelValue, this.language);
                model.pushEOL(0);
                model.onDidChangeContent(() => {
                    this.$emit('update:modelValue', model.getValue());
                });
                this.instance.setModel(model);
            }
        },
        'deep': true
    },
    'modelValue': function () {
        if (!this.instance) {
            return;
        }
        if (this.files) {
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
            const model = this.instance.getModel();
            if (this.modelValue === model.getValue()) {
                return;
            }
            this.setValue(model, this.modelValue);
        }
    },
    'language': function () {
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
    'theme': function () {
        if (!this.instance) {
            return;
        }
        this.monaco.editor.setTheme(this.theme);
    }
};
exports.methods = {
    setValue: function (model, val) {
        model.pushEditOperations([], [
            {
                range: model.getFullModelRange(),
                text: val === undefined ? model.getValue() : val
            }
        ], () => { });
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
                    const selection = this.instance.getSelection();
                    this.instance.executeEdits('', [
                        {
                            range: new this.monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn),
                            text: ''
                        }
                    ]);
                    break;
                }
                case 'paste': {
                    const str = yield navigator.clipboard.readText();
                    const selection = this.instance.getSelection();
                    this.instance.executeEdits('', [
                        {
                            range: new this.monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn),
                            text: str
                        }
                    ]);
                    break;
                }
            }
        });
    },
    refreshModels: function () {
        const beforePaths = [];
        const models = this.monaco.editor.getModels();
        let refreshInstance = false;
        for (const model of models) {
            if (this.files[model.uri.path] === undefined) {
                model.dispose();
                refreshInstance = true;
                continue;
            }
            beforePaths.push(model.uri.path);
        }
        for (const path in this.files) {
            if (beforePaths.includes(path)) {
                const model = this.monaco.editor.getModel(this.monaco.Uri.parse(path));
                if (model.getValue() !== this.files[path]) {
                    this.setValue(model, this.files[path]);
                    refreshInstance = true;
                }
                continue;
            }
            const model = this.monaco.editor.createModel(this.files[path], undefined, this.monaco.Uri.parse(path));
            model.pushEOL(0);
            model.onDidChangeContent(() => {
                this.files[path] = model.getValue();
                this.$emit('update:files', this.files);
            });
            refreshInstance = true;
        }
        if (this.language === 'typescript' && refreshInstance) {
            const model = this.instance.getModel();
            if (model) {
                this.setValue(model);
            }
        }
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
    idoc.body.style.overflow = 'hidden';
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
                    'vs': clickgo.getCdn() + '/npm/monaco-editor@0.33.0/min/vs'
                }
            });
            const proxy = iwindow.URL.createObjectURL(new Blob([`
                self.MonacoEnvironment = {
                    baseUrl: '${clickgo.getCdn()}/npm/monaco-editor@0.33.0/min/'
                };
                importScripts('${clickgo.getCdn()}/npm/monaco-editor@0.33.0/min/vs/base/worker/workerMain.js');
            `], { type: 'text/javascript' }));
            iwindow.MonacoEnvironment = {
                getWorkerUrl: () => proxy
            };
            iwindow.require(['vs/editor/editor.main'], (monaco) => {
                this.monaco = monaco;
                this.instance = this.monaco.editor.create(monacoEl, {
                    'model': null,
                    'contextmenu': false,
                    'minimap': {
                        'enabled': false
                    },
                    'readOnly': this.readonly
                });
                clickgo.dom.watchSize(this.$refs.iframe, () => {
                    this.instance.layout();
                });
                if (this.theme) {
                    this.monaco.editor.setTheme(this.theme);
                }
                const editorService = this.instance._codeEditorService;
                const openEditorBase = editorService.openCodeEditor.bind(editorService);
                editorService.openCodeEditor = (input, source) => __awaiter(this, void 0, void 0, function* () {
                    const result = yield openEditorBase(input, source);
                    if (result === null) {
                        this.$emit('jump', input);
                    }
                    return result;
                });
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
                if (this.files !== undefined) {
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
                    const model = this.monaco.editor.createModel(this.modelValue, this.language);
                    model.pushEOL(0);
                    model.onDidChangeContent(() => {
                        this.$emit('update:modelValue', model.getValue());
                    });
                    this.instance.setModel(model);
                }
                this.maskTxt = '';
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
        this.notInit = true;
    }
};
exports.mounted = mounted;
