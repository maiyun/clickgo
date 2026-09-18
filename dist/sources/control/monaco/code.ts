import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'jump': null,
        'init': null,
        'error': null,
        'change': null,
        'focus': null,
        'blur': null,

        'update:files': null,
        'update:modelValue': null
    };

    public props: {
        'disabled': boolean | string;
        'readonly': boolean | string;

        'modelValue': string;
        'language': string;
        'theme': string;
        'files': Record<string, string> | undefined;
        'options': Record<string, unknown>;
    } = {
            'disabled': false,
            'readonly': false,

            'modelValue': '',
            'language': '',
            'theme': '',
            'files': {},
            'options': {}
        };

    public access: {
        // --- Monaco 由 iframe 动态加载，未作为项目依赖；其运行时对象使用 any ---
        'instance': any;
        'monaco': any;
        'models': Map<string, {
            model: any;
            listener: { dispose(): void; };
            view: unknown;
            language: string;
            libValue: string | null;
            libs: Array<{ dispose(): void; }>;
        }>;
        'disposables': Array<{ dispose(): void; }>;
        'workerUrl': string;
        'loader': HTMLScriptElement | null;
        'timer': ReturnType<typeof setTimeout> | undefined;
        'removePointer': (() => void) | null;
    } = {
            'instance': undefined,
            'monaco': undefined,
            'models': new Map(),
            'disposables': [],
            'workerUrl': '',
            'loader': null,
            'timer': undefined,
            'removePointer': null
        };

    public get showMask(): boolean {
        // --- 防止拖动导致卡顿 ---
        return this.isLoading ? true : clickgo.dom.is.move;
    }

    public notInit = false;

    public isLoading = true;

    /** --- 忽略由外部绑定同步引起的内容事件 --- */
    public syncing = false;

    public isUnmounting = false;

    public filesMode = false;

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

    /**
     * --- 更新内容并保留撤销历史；相同内容不产生编辑操作 ---
     * @param model Monaco 文本模型（动态加载的第三方对象）
     * @param val 新内容
     */
    public setValue(model: Record<string, any>, val?: string): void {
        if (!model || model.isDisposed() || val === undefined) {
            return;
        }
        const value = val.replace(/\r\n|\r|\n/g, model.getEOL());
        if (model.getValue() === value) {
            return;
        }
        model.pushStackElement();
        model.pushEditOperations([], [{
            'range': model.getFullModelRange(),
            'text': value
        }], () => null);
        model.pushStackElement();
    }

    /**
     * --- 执行剪贴板命令，异步授权后重新检查编辑状态 ---
     * @param ac copy、cut 或 paste
     */
    public async execCmd(ac: string): Promise<void> {
        const editor = this.access.instance;
        if (!editor || this.isUnmounting || this.propBoolean('disabled')) {
            return;
        }
        if (ac !== 'copy' && ac !== 'cut' && ac !== 'paste') {
            return;
        }
        if (ac !== 'copy' && this.propBoolean('readonly')) {
            return;
        }
        const model = editor.getModel();
        const selections = editor.getSelections();
        if (!model || !selections?.length) {
            return;
        }
        const version = model.getVersionId();
        try {
            editor.focus();
            if (ac === 'copy') {
                const iframe = this.refs.iframe as unknown as HTMLIFrameElement;
                iframe.contentDocument?.execCommand('copy');
                return;
            }
            let text = '';
            if (ac === 'cut') {
                text = selections.map((selection: Record<string, number>) =>
                    model.getValueInRange(selection)).join('\n');
                if (!text) {
                    return;
                }
                await navigator.clipboard.writeText(text);
                text = '';
            }
            else {
                text = await navigator.clipboard.readText();
            }
            if (this.isUnmounting || this.access.instance !== editor ||
                editor.getModel() !== model || model.isDisposed() || model.getVersionId() !== version ||
                JSON.stringify(editor.getSelections()) !== JSON.stringify(selections) ||
                this.propBoolean('disabled') || this.propBoolean('readonly')) {
                return;
            }
            editor.pushUndoStop();
            editor.executeEdits('clickgo.clipboard', selections.map((selection: Record<string, number>) => ({
                'range': selection,
                'text': text,
                'forceMoveMarkers': true
            })));
            editor.pushUndoStop();
        }
        catch (error) {
            this.emit('error', { 'stage': 'clipboard', 'error': error });
        }
    }

    /**
     * --- 应用编辑器选项；禁用和只读始终由控件参数决定 ---
     */
    public updateOptions(): void {
        if (!this.access.instance || this.isUnmounting) {
            return;
        }
        const style = getComputedStyle(this.element);
        this.access.instance?.updateOptions({
            ...this.props.options,
            'fontSize': this.props.options.fontSize ?? parseFloat(style.fontSize),
            'fontFamily': this.props.options.fontFamily ?? style.fontFamily,
            'minimap': this.props.options.minimap ?? { 'enabled': false },
            'automaticLayout': this.props.options.automaticLayout ?? true,
            'readOnly': this.propBoolean('disabled') || this.propBoolean('readonly'),
            'domReadOnly': this.propBoolean('disabled') || this.propBoolean('readonly'),
            'contextmenu': false
        });
    }

    /**
     * --- 声明文件同时注册到语言服务，通知已有编辑器重新诊断 ---
     */
    private _refreshLibraries(): void {
        const typescript = this.access.monaco?.typescript ?? this.access.monaco?.languages.typescript;
        if (!typescript || this.isUnmounting) {
            return;
        }
        for (const [path, entry] of this.access.models) {
            if (!/\.d\.(?:ts|mts|cts)$/i.test(path)) {
                continue;
            }
            const value = entry.model.getValue();
            if (entry.libValue === value) {
                continue;
            }
            for (const lib of entry.libs.splice(0)) {
                lib.dispose();
            }
            for (const defaults of [typescript.typescriptDefaults, typescript.javascriptDefaults]) {
                if (!defaults) {
                    continue;
                }
                entry.libs.push(defaults.addExtraLib(value, entry.model.uri.toString()));
            }
            entry.libValue = value;
        }
    }

    /**
     * --- 同步控件自己的模型，不处理通过 init 创建的其他模型 ---
     */
    public refreshModels(): void {
        if (!this.access.instance || this.isUnmounting) {
            return;
        }
        const files = this.props.files ?? {};
        const filesMode = Object.keys(files).length > 0;
        const editor = this.access.instance;
        const current = editor.getModel();
        for (const entry of this.access.models.values()) {
            if (entry.model === current) {
                entry.view = editor.saveViewState();
                break;
            }
        }
        this.syncing = true;
        try {
            const paths = filesMode ? Object.keys(files) : [''];
            const pathSet = new Set(paths);
            for (const [path, entry] of this.access.models) {
                if (filesMode === this.filesMode && pathSet.has(path)) {
                    continue;
                }
                if (current === entry.model) {
                    editor.setModel(null);
                }
                entry.listener.dispose();
                for (const lib of entry.libs) {
                    lib.dispose();
                }
                entry.model.dispose();
                this.access.models.delete(path);
            }
            this.filesMode = filesMode;
            for (const path of paths) {
                const value = filesMode ? files[path] : this.props.modelValue;
                let entry = this.access.models.get(path);
                if (!entry) {
                    const model = this.access.monaco.editor.createModel(
                        value,
                        filesMode ? undefined : this.props.language.toLowerCase() || 'plaintext',
                        filesMode ? this.access.monaco.Uri.parse(path) : undefined
                    );
                    model.pushEOL(0);
                    const listener = model.onDidChangeContent(() => {
                        if (this.syncing || this.isUnmounting) {
                            return;
                        }
                        const content = model.getValue();
                        this._refreshLibraries();
                        if (this.filesMode) {
                            this.emit('update:files', Object.fromEntries(
                                [...this.access.models].map(([name, item]) => [name, item.model.getValue()])
                            ));
                        }
                        else {
                            this.emit('update:modelValue', content);
                        }
                        this.emit('change', { 'detail': { 'path': path, 'value': content } });
                    });
                    entry = {
                        'model': model, 'listener': listener, 'view': null,
                        'language': filesMode ? model.getLanguageId() : 'plaintext',
                        'libValue': null, 'libs': []
                    };
                    this.access.models.set(path, entry);
                }
                else {
                    this.setValue(entry.model, value);
                }
            }
            const target = this.access.models.get(filesMode ? this.props.modelValue : '');
            const model = target?.model ?? null;
            if (editor.getModel() !== model) {
                editor.setModel(model);
                if (target?.view) {
                    editor.restoreViewState(target.view);
                }
            }
            if (model) {
                // --- 空语言恢复由 URI 推断的语言，单文件恢复纯文本 ---
                this.access.monaco.editor.setModelLanguage(
                    model, this.props.language.toLowerCase() || (target?.language ?? 'plaintext')
                );
            }
            this._refreshLibraries();
        }
        finally {
            this.syncing = false;
        }
    }

    /**
     * --- 清理编辑器、模型、订阅和 Worker URL ---
     */
    public disposeEditor(): void {
        clearTimeout(this.access.timer);
        this.access.timer = undefined;
        this.access.loader?.remove();
        this.access.loader = null;
        this.access.removePointer?.();
        this.access.removePointer = null;
        for (const disposable of this.access.disposables.splice(0)) {
            disposable.dispose();
        }
        this.access.instance?.dispose();
        this.access.instance = undefined;
        for (const entry of this.access.models.values()) {
            entry.listener.dispose();
            for (const lib of entry.libs) {
                lib.dispose();
            }
            entry.model.dispose();
        }
        this.access.models.clear();
        if (this.access.workerUrl) {
            URL.revokeObjectURL(this.access.workerUrl);
            this.access.workerUrl = '';
        }
        this.access.monaco = undefined;
    }

    /**
     * --- 结束失败的初始化并通知调用者 ---
     * @param stage 失败阶段
     * @param error 原始错误
     */
    public failInit(stage: string, error: unknown): void {
        if (this.isUnmounting || this.notInit || !this.isLoading) {
            return;
        }
        this.notInit = true;
        this.isLoading = false;
        this.disposeEditor();
        this.emit('error', { 'stage': stage, 'error': error });
    }

    public onCreated(): void {
        // --- 框架按普通对象克隆 access，Map 必须在每个实例创建后独立初始化 ---
        this.access.models = new Map();
    }

    public async onMounted(): Promise<void> {
        // --- mounted 包装等待 nextTick 时，控件可能已经被移除 ---
        if (this.isUnmounting) {
            return;
        }
        this.watch('readonly', () => { this.updateOptions(); });
        this.watch('disabled', () => { this.updateOptions(); });
        this.watch('options', () => { this.updateOptions(); }, { 'deep': true });
        this.watch('files', () => { this.refreshModels(); }, { 'deep': true });
        this.watch('modelValue', () => { this.refreshModels(); });
        this.watch('language', () => { this.refreshModels(); });
        this.watch('theme', () => {
            this.access.monaco?.editor.setTheme(this.props.theme || 'vs');
        });

        const iframe = this.refs.iframe as unknown as HTMLIFrameElement;
        const iwindow = iframe.contentWindow;
        if (!iwindow) {
            this.failInit('iframe', new Error('Monaco iframe unavailable.'));
            return;
        }
        // --- AMD 运行时由第三方 loader 注入 iframe，无法使用静态 Window 类型 ---
        const runtime = iwindow as any;
        const idoc = iwindow.document;
        idoc.body.style.margin = '0';
        idoc.body.style.overflow = 'hidden';
        const monacoEl = idoc.createElement('div');
        monacoEl.style.height = '100vh';
        idoc.body.append(monacoEl);
        this.access.timer = setTimeout(() => {
            this.failInit('timeout', new Error('Monaco initialization timed out.'));
        }, 30000);
        try {
            const resources = await clickgo.core.getModule('monaco-editor');
            if (this.isUnmounting || this.notInit) {
                return;
            }
            if (!resources) {
                this.failInit('loader', new Error('Monaco module not found.'));
                return;
            }
            // --- 资源路径由注册模块提供，控件不重复定义版本和 CDN ---
            const baseUrl = resources.baseUrl;
            const loaderEl = idoc.createElement('script');
            this.access.loader = loaderEl;
            loaderEl.addEventListener('error', (error) => { this.failInit('loader', error); }, { 'once': true });
            loaderEl.addEventListener('load', () => {
                if (this.isUnmounting || this.notInit) {
                    return;
                }
                try {
                    runtime.require.config({ 'paths': { 'vs': baseUrl + 'vs' } });
                    this.access.workerUrl = URL.createObjectURL(new Blob([
                        'self.MonacoEnvironment = { baseUrl: ' + JSON.stringify(baseUrl) + ' };\n' +
                        'importScripts(' + JSON.stringify(baseUrl + 'vs/base/worker/workerMain.js') + ');'
                    ], { 'type': 'text/javascript' }));
                    runtime.MonacoEnvironment = { 'getWorkerUrl': () => this.access.workerUrl };
                    // --- Monaco 由 AMD 动态导入，没有本地类型依赖 ---
                    runtime.require(['vs/editor/editor.main'], (monaco: any) => {
                        if (this.isUnmounting || this.notInit) {
                            return;
                        }
                        try {
                            this.access.monaco = monaco;
                            this.access.instance = monaco.editor.create(monacoEl, {
                                ...this.props.options,
                                'model': null,
                                'contextmenu': false,
                                'minimap': this.props.options.minimap ?? { 'enabled': false },
                                'readOnly': this.propBoolean('disabled') || this.propBoolean('readonly'),
                                'domReadOnly': this.propBoolean('disabled') || this.propBoolean('readonly'),
                                'automaticLayout': this.props.options.automaticLayout ?? true
                            });
                            // --- 新旧 Monaco 版本的 TypeScript 命名空间兼容 ---
                            const typescript = monaco.typescript ?? monaco.languages.typescript;
                            typescript?.typescriptDefaults?.setEagerModelSync(true);
                            typescript?.javascriptDefaults?.setEagerModelSync(true);
                            this.access.disposables.push(monaco.editor.registerEditorOpener({
                                // --- 保留 jump 的 resource/options 事件结构，使用公开 API ---
                                'openCodeEditor': (
                                    source: unknown, resource: unknown, selection: unknown
                                ): boolean => {
                                    if (source !== this.access.instance || this.isUnmounting) {
                                        return false;
                                    }
                                    this.emit('jump', { 'resource': resource, 'options': { 'selection': selection } });
                                    return true;
                                }
                            }));
                            this.access.disposables.push(
                                this.access.instance.onDidFocusEditorText(() => { this.emit('focus'); }),
                                this.access.instance.onDidBlurEditorText(() => { this.emit('blur'); })
                            );
                            monaco.editor.setTheme(this.props.theme || 'vs');
                            const down = (e: PointerEvent): void => {
                                if (this.propBoolean('disabled')) {
                                    return;
                                }
                                if (navigator.clipboard) {
                                    clickgo.modules.pointer.menu(e, () => {
                                        if (this.isUnmounting || this.propBoolean('disabled')) {
                                            return;
                                        }
                                        const rect = iframe.getBoundingClientRect();
                                        clickgo.form.showPop(this.element, this.refs.pop, {
                                            'x': rect.left + e.clientX,
                                            'y': rect.top + e.clientY
                                        });
                                    });
                                }
                                clickgo.form.changeFocus(this.formId).catch(() => {});
                                clickgo.form.hidePop();
                            };
                            monacoEl.addEventListener('pointerdown', down);
                            this.access.removePointer = () => { monacoEl.removeEventListener('pointerdown', down); };
                            this.refreshModels();
                            clickgo.dom.watchStyle(this.element, ['font-size', 'font-family'], (name, value) => {
                                if (!this.access.instance || this.isUnmounting) {
                                    return;
                                }
                                if (name === 'font-size') {
                                    this.access.instance.updateOptions({
                                        'fontSize': this.props.options.fontSize ?? parseFloat(value)
                                    });
                                }
                                else {
                                    this.access.instance.updateOptions({
                                        'fontFamily': this.props.options.fontFamily ?? value
                                    });
                                }
                            }, true);
                            clearTimeout(this.access.timer);
                            this.access.timer = undefined;
                            this.isLoading = false;
                            this.emit('init', {
                                'monaco': monaco,
                                'instance': this.access.instance
                            });
                        }
                        catch (error) {
                            this.failInit('editor', error);
                        }
                    }, (error: unknown) => { this.failInit('module', error); });
                }
                catch (error) {
                    this.failInit('module', error);
                }
            }, { 'once': true });
            loaderEl.src = resources.loader;
            idoc.head.append(loaderEl);
        }
        catch (error) {
            this.failInit('loader', error);
        }
    }

    public onBeforeUnmount(): void {
        this.isUnmounting = true;
        this.disposeEditor();
    }

}
