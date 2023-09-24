import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'disabled': boolean | string;
        'editable': boolean | string;
        'multi': boolean | string;
        'async': boolean | string;

        'modelValue': Array<string | number>;
        'placeholder': string;
        'data': any[] | Record<string, any>;
    } = {
            'disabled': false,
            'editable': false,
            'multi': false,
            'async': false,

            'modelValue': [],
            'placeholder': '',
            'data': []
        };

    public inputValue = '';

    public oploading = false;

    public loading = false;

    // --- 本地使用 ---

    public localeData = {
        'en': {
            'back': 'Back'
        },
        'sc': {
            'back': '返回'
        },
        'tc': {
            'back': '返回'
        },
        'ja': {
            'back': '戻る'
        },
        'ko': {
            'back': '뒤로'
        },
        'th': {
            'back': 'ย้อนกลับ'
        },
        'es': {
            'back': 'Volver'
        },
        'de': {
            'back': 'Zurück'
        },
        'fr': {
            'back': 'Retour'
        },
        'pt': {
            'back': 'Voltar'
        },
        'ru': {
            'back': 'Назад'
        },
        'vi': {
            'back': 'Quay lại'
        }
    };

    public level: number = 0;

    public vals: string[] = [];

    public labs: string[] = [];

    public lists: any[] = [];

    public nowlist: any[] | Record<string, any> = [];

    // --- 样式 ---

    public background = '';

    public padding = '';

    // --- 计算变量 ---

    public get opMargin(): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }

    // --- 传递给 list 的 value ---
    public get listValue(): Array<string | number> {
        return this.vals[this.level] ? [this.vals[this.level]] : [];
    }

    // --- 传递给 list 的 data ---
    public get nowlistComp(): any[] | Record<string, any> {
        if (this.inputValue === '') {
            return this.nowlist;
        }
        const inputValue = this.inputValue.toLowerCase();
        const isArray = Array.isArray(this.nowlist);
        const newlist: any[] | Record<string, any> = isArray ? [] : {};
        for (const key in this.nowlist) {
            const item = (this.nowlist as any)[key];
            const val = (isArray ?
                (typeof item === 'object' ? item.value ?? '' : item) :
                key).toString().toLowerCase();
            const lab = (isArray ?
                (typeof item === 'object' ? item.label ?? '' : '') : '').toLowerCase();
            let include = true;
            for (const char of inputValue) {
                if (val.includes(char) || lab.includes(char)) {
                    continue;
                }
                // --- 没包含 ---
                include = false;
                break;
            }
            if (!include) {
                continue;
            }
            if (isArray) {
                (newlist as any).push(item);
            }
            else {
                (newlist as any)[key] = item;
            }
        }
        return newlist;
    }

    /** --- text 的 keydown 事件 --- */
    public async keydown(e: KeyboardEvent): Promise<void> {
        if (e.key === 'Backspace') {
            if (this.level > 0) {
                // --- 判断是否返回上级 ---
                if ((e.target as HTMLInputElement).value === '') {
                    this.back();
                }
            }
            return;
        }
        if ((e.key === 'ArrowDown') && (this.element.dataset.cgPopOpen === undefined)) {
            // --- 展开下拉菜单 ---
            this.refs.gs.showPop();
            return;
        }
        if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && (this.element.dataset.cgPopOpen !== undefined)) {
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
        if (e.key === 'Enter') {
            // --- enter ---
            await this.listItemClick();
            this.inputValue = '';
            return;
        }
    }

    /** --- remote 模式下，最后一次键入的时间 --- */
    public lastRemoteInput: number = 0;

    // --- text 的值变更事件（只有 editable 时会触发） ----
    public updateInputValue(value: string): void {
        this.inputValue = value.trim();
        if ((this.inputValue !== '') && (this.element.dataset.cgPopOpen === undefined)) {
            this.refs.gs.showPop();
            return;
        }
    }

    public updateLabel(label: string[]): void {
        if (!label[0]) {
            return;
        }
        this.labs[this.level] = label[0];
        this.emit('label', this.propBoolean('multi') ? this.labs : [this.labs[this.level]]);
    }

    // --- list 值的变更 ---
    public updateListValue(value: string[]): void {
        if (!value[0]) {
            return;
        }
        this.vals[this.level] = value[0];
        this.emit('update:modelValue', this.propBoolean('multi') ? this.vals : [this.vals[this.level]]);
    }

    /** --- 向上级提交 modelValue 和 labs 变动 --- */
    public emitModelValueAndLabel(): void {
        let newval: string[] = [];
        let newlabel: string[] = [];
        if (this.propBoolean('multi')) {
            newval = this.vals;
            newlabel = this.labs;
        }
        else {
            newval = this.vals.length ? [this.vals[this.vals.length - 1]] : [];
            newlabel = this.labs.length ? [this.labs[this.labs.length - 1]] : [];
        }
        if (JSON.stringify(this.props.modelValue) === JSON.stringify(newval)) {
            return;
        }
        this.emit('update:modelValue', newval);
        this.emit('label', newlabel);
    }

    /** --- 将一个对象克隆，并设置到 nowlist --- */
    public setNowList(list: any[] | Record<string, any>): void {
        this.nowlist = clickgo.tool.clone(list);
        for (const key in this.nowlist) {
            if ((this.nowlist as any)[key].children === undefined) {
                continue;
            }
            delete (this.nowlist as any)[key].children;
        }
    }

    public async listItemClick(): Promise<void> {
        /** --- 已选 item 的下一层 list --- */
        let nextChildren: any[] | Record<string, any> | null = null;
        /** --- 当前层是否有选择 --- */
        let isSelected: boolean = false;
        const isArray = Array.isArray(this.lists[this.level]);
        for (const key in this.lists[this.level]) {
            const item = this.lists[this.level][key];
            const val = (isArray ?
                (typeof item === 'object' ? (item.value ?? item.label ?? '') : item) :
                key).toString();
            if (this.vals[this.level] !== val) {
                continue;
            }
            // --- 有项被选择 ---
            nextChildren = item.children ?? null;
            isSelected = true;
        }

        if (isSelected) {
            // --- 有选择 ---
            if (!nextChildren) {
                if (!this.propBoolean('async')) {
                    // --- 无下层，啥也不管 ---
                    clickgo.form.hidePop();
                    return;
                }
                // --- 无下层，但是要异步获取 ---
                this.loading = true;
                // --- 要远程获取 ---
                const children = await new Promise<any[] | undefined>((resolve) => {
                    this.emit('load', this.vals[this.level], (children?: any[]) => {
                        resolve(children);
                    });
                });
                this.loading = false;
                if (!children?.length) {
                    // --- 真的没下层，结束 ---
                    clickgo.form.hidePop();
                    return;
                }
                // --- 有，那就走跳转模式 ---
                nextChildren = children;
            }
            // --- 有下层，跳转 ---
            this.setNowList(nextChildren);
            ++this.level;
            this.lists[this.level] = nextChildren;
            return;
        }
        // --- 没有选中，那么这里理论上不应该触发 ---
        clickgo.form.hidePop();
    }

    // --- 返回上级 ---
    public back(): void {
        this.vals.splice(this.level);
        this.labs.splice(this.level);
        this.lists.splice(this.level);
        --this.level;
        this.emitModelValueAndLabel();
        this.setNowList(this.lists[this.level]);
    }

    public onMounted(): void | Promise<void> {
        this.watch('data', () => {
            /** --- 当前层的 list --- */
            let leveldata = this.props.data;
            for (let level = 0; level <= this.level; ++level) {
                /** --- 已选 item 的下一层 list --- */
                let nextChildren: any[] | Record<string, string> | null = null;
                /** --- 当前层是否有选择 --- */
                let isSelected: boolean = false;
                const isArray = Array.isArray(leveldata);
                for (const key in leveldata) {
                    const item = (leveldata as any)[key];
                    const val = (isArray ?
                        (typeof item === 'object' ? (item.value ?? item.label ?? '') : item) :
                        key).toString();
                    if (this.vals[level] !== val) {
                        continue;
                    }
                    // --- 选择的是本层（leveldata） ---
                    nextChildren = item.children ?? null;
                    isSelected = true;
                }
                this.lists[level] = leveldata;

                if (isSelected) {
                    // --- 有选择 ---
                    if (nextChildren) {
                        // --- 有下层，接着循环 ---
                        leveldata = nextChildren;
                        continue;
                    }
                    // --- 没下层，结束循环 ---
                    this.level = level;
                    this.vals.splice(level + 1);
                    this.labs.splice(level + 1);
                    this.lists.splice(level + 1);
                    this.emitModelValueAndLabel();
                    this.setNowList(leveldata);
                    break;
                }
                // --- 无选择 ---
                this.level = level;
                this.vals.splice(level);
                this.labs.splice(level);
                this.lists.splice(level + 1);
                this.emitModelValueAndLabel();
                this.setNowList(leveldata);
                break;
            }
        }, {
            'deep': true,
            'immediate': true
        });

        this.watch('modelValue', async (): Promise<void> => {
            const nowval: string[] = this.propBoolean('multi') ? this.vals : (this.vals.length ? [this.vals[this.vals.length - 1]] : []);
            if (JSON.stringify(this.props.modelValue) === JSON.stringify(nowval)) {
                return;
            }
            if (!this.propBoolean('multi')) {
                if (!this.props.modelValue.length) {
                    this.vals.length = 0;
                    this.labs.length = 0;
                    this.lists.splice(1);
                    this.emitModelValueAndLabel();
                    return;
                }
                const lval = this.props.modelValue[0].toString();
                /** --- 已选 item 的下一层 list --- */
                let nextChildren: any[] | Record<string, string> | null = null;
                // --- 单层情况，比较简单 ---
                let isSelected: boolean = false;
                const isArray = Array.isArray(this.lists[this.level]);
                for (const key in this.lists[this.level]) {
                    const item = this.lists[this.level][key];
                    const val = (isArray ?
                        (typeof item === 'object' ? (item.value ?? item.label ?? '') : item) :
                        key).toString();
                    if (lval !== val) {
                        continue;
                    }
                    nextChildren = item.children ?? null;
                    isSelected = true;
                    this.vals[this.level] = val;
                    this.labs[this.level] = item.label ?? val;
                    this.emitModelValueAndLabel();
                }
                if (!isSelected) {
                    // --- 当前未被选中，直接结束 ---
                    this.vals.splice(this.level);
                    this.labs.splice(this.level);
                    this.lists.splice(this.level + 1);
                    this.emitModelValueAndLabel();
                    return;
                }
                // --- 选中 ---
                if (!nextChildren) {
                    // --- 选中但无下级 ---
                    if (!this.propBoolean('async')) {
                        // --- 无下层，啥也不管 ---
                        return;
                    }
                    // --- 无下层，但是要异步获取 ---
                    this.loading = true;
                    // --- 要远程获取 ---
                    const children = await new Promise<any[] | undefined>((resolve) => {
                        this.emit('load', this.vals[this.level], (children?: any[]) => {
                            resolve(children);
                        });
                    });
                    this.loading = false;
                    if (!children?.length) {
                        // --- 真的没下层，结束 ---
                        return;
                    }
                    // --- 有，那就走跳转模式 ---
                    nextChildren = children;
                }
                // --- 有下层，跳转 ---
                ++this.level;
                this.lists[this.level] = nextChildren;
                this.setNowList(this.lists[this.level]);
                return;
            }
            // --- 多层情况 ---
            this.vals.length = 0;
            this.labs.length = 0;
            if (!this.props.modelValue.length) {
                // --- 没有值 ---
                this.lists.splice(1);
                this.emitModelValueAndLabel();
                this.level = 0;
                this.setNowList(this.lists[0]);
                return;
            }
            // --- 需要逐层处理 ---
            for (let i = 0; i < this.props.modelValue.length; ++i) {
                const lval = this.props.modelValue[i].toString();
                /** --- 已选 item 的下一层 list --- */
                let nextChildren: any[] | Record<string, string> | null = null;
                /** --- 当前层是否有选择 --- */
                let isSelected: boolean = false;
                const isArray = Array.isArray(this.lists[i]);
                for (const key in this.lists[i]) {
                    const item = this.lists[i][key];
                    const val = (isArray ?
                        (typeof item === 'object' ? (item.value ?? item.label ?? '') : item) :
                        key).toString();
                    if (lval !== val) {
                        continue;
                    }
                    // --- 选择的是本层（leveldata） ---
                    nextChildren = item.children ?? null;
                    isSelected = true;
                    this.vals.push(val);
                    this.labs.push(item.label ?? val);
                }
                if (!isSelected) {
                    // --- 当前未被选中，直接结束 ---
                    this.lists.splice(i + 1);
                    this.emitModelValueAndLabel();
                    this.level = i;
                    this.setNowList(this.lists[i]);
                    return;
                }
                // --- 选中了，接着去下级 ---
                if (!nextChildren) {
                    if (!this.propBoolean('async')) {
                        // --- 没有下级，直接结束 ---
                        this.lists.splice(i + 1);
                        this.emitModelValueAndLabel();
                        this.level = i;
                        this.setNowList(this.lists[i]);
                        return;
                    }
                    // --- 要远程获取 ---
                    const children = await new Promise<any[] | undefined>((resolve) => {
                        this.emit('load', this.vals[i], (children?: any[]) => {
                            resolve(children);
                        });
                    });
                    if (!children?.length) {
                        // --- 没有下级，直接结束 ---
                        this.lists.splice(i + 1);
                        this.emitModelValueAndLabel();
                        this.level = i;
                        this.setNowList(this.lists[i]);
                        return;
                    }
                    nextChildren = children;
                }
                // --- 有下级，接着循环 ---
                this.lists[i + 1] = nextChildren;
            }
        }, {
            'immediate': true
        });
        this.watch('editable', (): void => {
            if (!this.propBoolean('editable')) {
                return;
            }
            // --- 变成可输入 ---
            this.inputValue = '';
        }, {
            'immediate': true
        });
        this.watch('multi', (): void => {
            if (this.propBoolean('multi')) {
                // --- 单变多 ---
                this.emit('update:modelValue', this.vals);
                return;
            }
            // --- 多变单 ---
            if (!this.vals.length) {
                return;
            }
            this.emit('update:modelValue', [this.vals[this.vals.length - 1]]);
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
