"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'jump': null,
            'init': null,
            'update:files': null,
            'update:modelValue': null
        };
        this.props = {
            'disabled': false,
            'readonly': false,
            'modelValue': '',
            'language': '',
            'theme': '',
            'files': {}
        };
        this.access = {
            'instance': undefined,
            'monaco': undefined
        };
        this.notInit = false;
        this.isLoading = true;
        this.localeData = {
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
    }
    get showMask() {
        return this.isLoading ? true : clickgo.dom.is.move;
    }
    setValue(model, val) {
        model.pushEditOperations([], [
            {
                range: model.getFullModelRange(),
                text: val === undefined ? model.getValue() : val
            }
        ], () => { });
    }
    execCmd(ac) {
        return __awaiter(this, void 0, void 0, function* () {
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
                            range: new this.access.monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn),
                            text: ''
                        }
                    ]);
                    break;
                }
                case 'paste': {
                    const str = yield navigator.clipboard.readText();
                    const selection = this.access.instance.getSelection();
                    this.access.instance.executeEdits('', [
                        {
                            range: new this.access.monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn),
                            text: str
                        }
                    ]);
                    break;
                }
            }
        });
    }
    refreshModels() {
        const beforePaths = [];
        const models = this.access.monaco.editor.getModels();
        let refreshInstance = false;
        for (const model of models) {
            if (this.props.files[model.uri.path] === undefined) {
                model.dispose();
                refreshInstance = true;
                continue;
            }
            beforePaths.push(model.uri.path);
        }
        for (const path in this.props.files) {
            if (beforePaths.includes(path)) {
                const model = this.access.monaco.editor.getModel(this.access.monaco.Uri.parse(path));
                if (model.getValue() !== this.props.files[path]) {
                    this.setValue(model, this.props.files[path]);
                    refreshInstance = true;
                }
                continue;
            }
            const model = this.access.monaco.editor.createModel(this.props.files[path], undefined, this.access.monaco.Uri.parse(path));
            model.pushEOL(0);
            model.onDidChangeContent(() => {
                this.props.files[path] = model.getValue();
                this.emit('update:files', this.props.files);
            });
            refreshInstance = true;
        }
        if (this.props.language === 'typescript' && refreshInstance) {
            const model = this.access.instance.getModel();
            if (model) {
                this.setValue(model);
            }
        }
    }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            this.watch('readonly', () => {
                if (!this.access.instance) {
                    return;
                }
                this.access.instance.updateOptions({
                    'readOnly': this.propBoolean('disabled') ? true : this.propBoolean('readonly')
                });
            });
            this.watch('disabled', () => {
                if (!this.access.instance) {
                    return;
                }
                this.access.instance.updateOptions({
                    'readOnly': this.propBoolean('disabled') ? true : this.propBoolean('readonly')
                });
            });
            this.watch('files', (after, before) => {
                if (!this.access.instance) {
                    return;
                }
                if (after !== undefined) {
                    if (before === undefined) {
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
                        this.refreshModels();
                    }
                }
                else {
                    const models = this.access.monaco.editor.getModels();
                    for (const model of models) {
                        model.dispose();
                    }
                    const model = this.access.monaco.editor.createModel(this.props.modelValue, this.props.language);
                    model.pushEOL(0);
                    model.onDidChangeContent(() => {
                        this.emit('update:modelValue', model.getValue());
                    });
                    this.access.instance.setModel(model);
                }
            }, {
                'deep': true
            });
            this.watch('modelValue', () => {
                if (!this.access.instance) {
                    return;
                }
                if (Object.keys(this.props.files).length) {
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
                    const model = this.access.instance.getModel();
                    if (this.props.modelValue === model.getValue()) {
                        return;
                    }
                    this.setValue(model, this.props.modelValue);
                }
            });
            this.watch('language', () => {
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
            this.watch('theme', () => {
                if (!this.access.instance) {
                    return;
                }
                this.access.monaco.editor.setTheme(this.props.theme);
            });
            const iframeEl = this.refs.iframe;
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
            const monaco = yield clickgo.core.getModule('monaco');
            if (!monaco) {
                this.isLoading = false;
                this.notInit = true;
                return;
            }
            const loaderEl = idoc.createElement('script');
            loaderEl.addEventListener('load', () => {
                iwindow.require.config({
                    paths: {
                        'vs': clickgo.core.getCdn() + '/npm/monaco-editor@0.46.0/min/vs'
                    }
                });
                const proxy = iwindow.URL.createObjectURL(new Blob([`
                self.MonacoEnvironment = {
                    baseUrl: '${clickgo.core.getCdn()}/npm/monaco-editor@0.46.0/min/'
                };
                importScripts('${clickgo.core.getCdn()}/npm/monaco-editor@0.46.0/min/vs/base/worker/workerMain.js');
            `], { type: 'text/javascript' }));
                iwindow.MonacoEnvironment = {
                    getWorkerUrl: () => proxy
                };
                iwindow.require(['vs/editor/editor.main'], (monaco) => {
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
                    this.access.instance._codeEditorService.openCodeEditor = (input) => {
                        this.emit('jump', input);
                        return this.access.instance;
                    };
                    if (this.props.theme) {
                        this.access.monaco.editor.setTheme(this.props.theme);
                    }
                    if (navigator.clipboard) {
                        monacoEl.addEventListener('contextmenu', (e) => {
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
                    const down = (e) => {
                        if (clickgo.dom.hasTouchButMouse(e)) {
                            return;
                        }
                        if (e instanceof TouchEvent) {
                            clickgo.dom.bindLong(e, () => {
                                clickgo.form.showPop(this.element, this.refs.pop, e);
                            });
                        }
                        clickgo.form.changeFocus(this.formId);
                        clickgo.form.hidePop();
                    };
                    monacoEl.addEventListener('mousedown', down);
                    monacoEl.addEventListener('touchstart', down, {
                        'passive': true
                    });
                    if (Object.keys(this.props.files).length) {
                        this.refreshModels();
                        const model = this.access.monaco.editor.getModel(this.access.monaco.Uri.parse(this.props.modelValue));
                        if (model) {
                            this.access.instance.setModel(model);
                            if (this.props.language) {
                                this.access.monaco.editor.setModelLanguage(model, this.props.language.toLowerCase());
                            }
                        }
                    }
                    else {
                        const model = this.access.monaco.editor.createModel(this.props.modelValue, this.props.language);
                        model.pushEOL(0);
                        model.onDidChangeContent(() => {
                            this.emit('update:modelValue', model.getValue());
                        });
                        this.access.instance.setModel(model);
                    }
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
                    this.isLoading = false;
                    this.emit('init', {
                        'monaco': this.access.monaco,
                        'instance': this.access.instance
                    });
                });
            });
            loaderEl.src = monaco;
            idoc.head.append(loaderEl);
        });
    }
}
exports.default = default_1;
