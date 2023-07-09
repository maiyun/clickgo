import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'disabled': boolean | string;
        'editable': boolean | string;
        'multi': boolean | string;
        'remote': boolean | string;

        'tree': boolean | string;
        /** --- -1: 不存在子项, 0: 关闭状态, 1: 存在子项打开状态, 2: 加载状态 --- */
        'treeDefault': number | string;
        'async': boolean | string;
        'icon': boolean | string;
        'iconDefault': string;

        'modelValue': string[];
        'data': any[] | Record<string, string>;
    } = {
            'disabled': false,
            'editable': false,
            'multi': false,
            'remote': false,

            'tree': false,
            'treeDefault': 0,
            'async': false,
            'icon': false,
            'iconDefault': '',

            'modelValue': [],
            'data': []
        };

    public value: string[] = [];

    public label: string[] = [];

    public inputValue = '';

    public loading = 0;

    // --- 样式 ---

    public background = '';

    public padding = '';

    // --- 计算变量 ---

    public get opMargin(): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }

    // --- list 是否为必须选择的模式 ---
    public get isMust(): boolean {
        if (this.propBoolean('editable')) {
            // --- 输入模式的 list 必定是 must ---
            return false;
        }
        // --- 非输入模式 ---
        return this.propBoolean('multi') ? false : true;
    }

    // --- 传递给 list 的 value ---
    public get listValue(): string[] {
        const val = (this.propBoolean('editable') && this.propBoolean('multi')) ? [this.inputValue] : this.value;
        return val;
    }

    /** --- text 的 keydown 事件 --- */
    public keydown(e: KeyboardEvent): void {
        if (e.key === 'Backspace') {
            if (this.propBoolean('multi')) {
                // --- 判断是否删除其他 tag ---
                if ((e.target as HTMLInputElement).value === '' && this.propBoolean('multi') && this.value.length > 0) {
                    this.value.splice(-1);
                    this.label.splice(-1);
                }
            }
            return;
        }
        if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && this.element.dataset.cgPopOpen !== undefined) {
            // --- 展开状态，要键盘上下选择 ---
            e.preventDefault();
            switch (e.key) {
                case 'ArrowUp': {
                    this.refs.list.arrowUp();
                    break;
                }
                default: {
                    this.refs.list.arrowDown();
                }
            }
            return;
        }
        if (e.key !== 'Enter') {
            return;
        }
        // --- enter ---
        if (this.inputValue !== '') {
            this.listItemClick();
        }
    }

    // --- text 的值变更事件（只有 editable 时会触发） ----
    public updateInputValue(value: string): void {
        this.inputValue = value.trim();
        // --- 看看要不要远程搜索 ---
        if (this.propBoolean('remote')) {
            if (this.inputValue !== '') {
                // --- 不为空 ---
                const loading = ++this.loading;
                this.emit('remote', this.inputValue, () => {
                    if (this.loading > loading) {
                        return;
                    }
                    this.loading = 0;
                });
                // --- 显示加载框 ---
                if (this.element.dataset.cgPopOpen === undefined) {
                    this.refs.gs.showPop();
                }
            }
            else {
                this.loading = 0;
                // --- 为空不搜索 ---
                if (this.element.dataset.cgPopOpen !== undefined) {
                    clickgo.form.hidePop();
                }
            }
        }
        // --- 其他情况 ---
        if (this.propBoolean('multi')) {
            // --- 多选状态不处理，用户点选或回车后才处理 ---
            return;
        }
        // --- 单项 ---
        if (this.inputValue === '') {
            this.value = [];
            this.label = [];
        }
        else {
            this.value = [this.inputValue];
            this.label = [this.inputValue];
        }
        this.emit('update:modelValue', this.value);
        this.emit('label', this.label);
    }

    public updateLabel(label: string[]): void {
        if (!this.propBoolean('editable')) {
            // --- 不会有自定义值 ---
            this.label = label;
            this.emit('label', this.label);
            return;
        }
        // --- 可输入 ---
        if (!this.propBoolean('multi')) {
            // --- 单选 ---
            if (label.length) {
                // --- 有值才设定，否则是用户的自定义值 ---
                this.label = label;
                this.emit('label', this.label);
            }
            return;
        }
        // --- 可输入、多选，不管，在 value 的逻辑里会处理 ---
    }

    // --- list 值的变更 ---
    public updateListValue(value: string[]): void {
        if (!this.propBoolean('editable')) {
            // --- 不会有自定义值 ---
            this.value = value;
            this.emit('update:modelValue', value);
            return;
        }
        // --- 以下是有文本框的状态 ---
        if (!this.propBoolean('multi')) {
            // --- 单选 ---
            if (value?.length) {
                // -- 有值才设定 ---
                this.value = value;
                this.inputValue = value[0];
                this.emit('update:modelValue', value);
            }
            return;
        }
        // --- 可输入，多选（实际上的 list 还是单选） ---
        if (this.element.dataset.cgPopOpen !== undefined) {
            // --- 菜单打开状态要处理 ---
            if (value[0]) {
                // --- 存在才设置，如果不加这个判断将导致文本框一直输入不了内容，一输入就被 list 重置为空了 ---
                this.inputValue = value[0];
            }
        }
    }

    public listItemClick(): void {
        if (this.propBoolean('multi') && !this.propBoolean('editable')) {
            // --- 多行且不可输入，不隐藏 ---
            return;
        }
        if (this.propBoolean('editable') && this.propBoolean('multi')) {
            // --- 可输入，多选状态 ---
            if (this.inputValue !== '') {
                const result = this.refs.list.findFormat(this.inputValue, false);
                if (result?.[this.inputValue]) {
                    this.value.push(result[this.inputValue].value);
                    this.label.push(result[this.inputValue].label);
                }
                else {
                    this.value.push(this.inputValue);
                    this.label.push(this.inputValue);
                }
                this.emit('update:modelValue', this.value);
                this.emit('label', this.label);
                this.inputValue = '';
            }
        }
        clickgo.form.hidePop();
    }

    // --- tag 的点击事件 ---
    public removeTag(index: number): void {
        this.value.splice(index, 1);
        this.label.splice(index, 1);
        this.emit('update:modelValue', this.value);
        this.emit('label', this.label);
    }

    // --- async 模式的加载事件 ---
    public onLoad(value: string, resolve: (child?: any[]) => void): void {
        this.emit('load', value, resolve);
    }

    public onMounted(): void | Promise<void> {
        this.watch('modelValue', (): void => {
            this.value = this.props.modelValue;
            // --- 可能有异常 ---
        }, {
            'immediate': true
        });
        this.watch('editable', (): void => {
            if (!this.propBoolean('editable')) {
                return;
            }
            // --- 变成可输入 ---
            if (!this.propBoolean('multi')) {
                this.inputValue = this.value[0] ?? '';
            }
        }, {
            'immediate': true
        });
        this.watch('multi', (): void => {
            if (!this.propBoolean('multi')) {
                // --- 多变单 ---
                if (this.propBoolean('editable')) {
                    this.inputValue = this.value[0] ?? '';
                }
                return;
            }
            // --- 单变多 ---
            if (this.propBoolean('editable')) {
                this.inputValue = '';
            }
        }, {
            'immediate': true
        });

        clickgo.dom.watchStyle(this.element, ['background', 'padding'], (n, v) => {
            switch (n) {
                case 'background': {
                    this.background = v;
                    break;
                }
                case 'padding': {
                    this.padding = v;
                    break;
                }
            }
        }, true);
    }

}
