import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'label': null,
        'load': null,
        'loaded': null,
        /** --- modelValue 变更时同步提交所有层级的 level value/label 值 --- */
        'level': null
    };

    public props: {
        'disabled': boolean | string;
        'async': boolean | string;

        'modelValue': string;
        'placeholder': string;
        'data': any[] | Record<string, any>;
    } = {
            'disabled': false,
            'async': false,

            'modelValue': '',
            'placeholder': '',
            'data': []
        };

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

    /** --- 当前展示中的层级 --- */
    public level: number = 0;

    public value: string[] = [];

    public label: string[] = [];

    /** --- 输入框 --- */
    public inputValue = '';

    /** --- list 的选中值 --- */
    public listValue: string[] = [];

    /** --- list 的选中的 label --- */
    public listLabel: string[] = [];

    /** --- select 框框的 loading --- */
    public oploading = false;

    /** --- pop 的 loading --- */
    public loading = false;

    /** --- 已经装载的每层的数据列表 --- */
    public lists: any[] = [
        []
    ];

    /** --- 当前层级的 list，含 children --- */
    public nowlist: any[] | Record<string, any> = [];

    /** --- 要提交的 level data --- */
    public levelData: Array<{
        'label': string;
        'value': string;
    }> = [
            {
                'label': '',
                'value': ''
            }
        ];

    // --- 样式 ---

    public background = '';

    public padding = '';

    // --- 计算变量 ---

    public get opMargin(): string {
        return this.padding.replace(/(\w+)/g, '-$1');
    }

    // --- 传递给 list 的 data ---
    public get nowlistComp(): any[] | Record<string, any> {
        if (this.inputValue === '') {
            return this.nowlist;
        }
        const inputValue = this.inputValue.toLowerCase();
        const isArray = Array.isArray(this.nowlist);
        const searchData = isArray ? [] : {};
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
                (searchData as any).push(item);
            }
            else {
                (searchData as any)[key] = item;
            }
        }
        return searchData;
    }

    /** --- 向上更新值 --- */
    public updateValue(): void {
        const event: types.ILevelselectLevelEvent = {
            'detail': {
                'list': [],
                'values': [],
                'labels': []
            }
        };
        if (this.value.length < 2) {
            this.emit('label', '');
            this.emit('level', event);
            if (this.props.modelValue === '') {
                return;
            }
            this.emit('update:modelValue', '');
            return;
        }
        this.emit('label', this.label[this.label.length - 2]);
        for (let i = 0; i < this.levelData.length - 1; ++i) {
            event.detail.list.push({
                'label': this.levelData[i].label,
                'value': this.levelData[i].value
            });
            event.detail.values.push(this.levelData[i].value);
            event.detail.labels.push(this.levelData[i].label);
        }
        this.emit('level', event);
        const newval: string = this.value[this.value.length - 2];
        if (this.props.modelValue === newval) {
            return;
        }
        this.emit('update:modelValue', newval);
    }

    /** --- text 的失去焦点事件 --- */
    public async blur(): Promise<void> {
        await clickgo.tool.sleep(350);
        this.inputValue = '';
    }

    /** --- text 的 keydown 事件 --- */
    public async keydown(e: KeyboardEvent): Promise<void> {
        if (e.key === 'Backspace') {
            if (this.level > 0) {
                // --- 判断是否返回上级 ---
                if ((e.target as HTMLInputElement).value === '') {
                    // --- 返回上级 ---
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
            e.preventDefault(); // --- 用来防止光标依浏览器原生要求移动 ---
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
        if (!this.listValue[0]) {
            return;
        }
        e.stopPropagation(); // --- 放置响应到 greatselect 的 mode:text enter 导致收不起来 ---
        await this.listItemClicked();
    }

    // --- text 的值变更事件 ----
    public updateInputValue(value: string): void {
        this.inputValue = value.trim();
        this.listValue = [this.inputValue];
        if ((this.inputValue !== '') && (this.element.dataset.cgPopOpen === undefined)) {
            this.refs.gs.showPop();
            return;
        }
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

    // --- list 的点击事件 ---
    public async listItemClicked(): Promise<void> {
        this.inputValue = '';
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
            if (this.listValue[0] !== val) {
                continue;
            }
            // --- 有项被选择 ---
            nextChildren = item.children ?? null;
            isSelected = true;
            this.value[this.level] = this.listValue[0];
            this.label[this.level] = this.listLabel[0];
            this.levelData[this.level] = {
                'label': this.label[this.level],
                'value': this.value[this.level]
            };
        }

        if (!isSelected) {
            // --- 没有选中，可能是 enter ---
            return;
        }
        // --- 有选择 ---
        if (!nextChildren) {
            if (!this.propBoolean('async')) {
                // --- 无下层，啥也不管 ---
                clickgo.form.hidePop();
                ++this.level;
                this.listValue = [];
                this.nowlist = [];
                this.value[this.level] = '';
                this.label[this.level] = '';
                this.lists[this.level] = [];
                this.levelData[this.level] = {
                    'label': '',
                    'value': ''
                };
                this.updateValue();
                return;
            }
            // --- 无下层，但是要异步获取 ---
            this.loading = true;
            // --- 要远程获取 ---
            const children = await new Promise<any[] | undefined>((resolve) => {
                this.emit('load', this.value[this.level], (children?: any[]) => {
                    resolve(children);
                    this.emit('loaded');
                });
            });
            this.loading = false;
            if (!children?.length) {
                // --- 真的没下层，结束 ---
                clickgo.form.hidePop();
                ++this.level;
                this.listValue = [];
                this.nowlist = [];
                this.value[this.level] = '';
                this.label[this.level] = '';
                this.lists[this.level] = [];
                this.levelData[this.level] = {
                    'label': '',
                    'value': ''
                };
                this.updateValue();
                return;
            }
            // --- 有，那就走跳转模式 ---
            nextChildren = children;
        }
        // --- 有下层，跳转，不隐藏 pop ---
        ++this.level;
        this.listValue = [];
        this.setNowList(nextChildren);
        this.value[this.level] = '';
        this.label[this.level] = '';
        this.lists[this.level] = nextChildren;
        this.levelData[this.level] = {
            'label': '',
            'value': ''
        };
        this.updateValue();
    }

    // --- 返回上级 ---
    public back(): void {
        this.value.splice(-1);
        this.label.splice(-1);
        this.lists.splice(-1);
        this.levelData.splice(this.level);
        --this.level;
        this.listValue = [];
        this.value[this.level] = '';
        this.label[this.level] = '';
        this.levelData[this.level] = {
            'label': '',
            'value': ''
        };
        this.setNowList(this.lists[this.level]);
        this.updateValue();
    }

    /** --- 供外部调用的设置层级 value 的函数 --- */
    public async selectLevelValue(list: string[]): Promise<void> {
        this.level = 0;
        this.listValue = [];
        this.value = [''];
        this.label = [''];
        this.setNowList(this.props.data);
        this.lists = [this.props.data];
        this.levelData = [{
            'label': '',
            'value': ''
        }];
        for (let i = 0; i < list.length; ++i) {
            this.level = i;
            const r = await this._selectValue(list[i], false);
            await this.nextTick();
            if (!r) {
                break;
            }
        }
        // --- 结束更新 ---
        this.updateValue();
    }

    /** --- 选择一个值的内部方法 --- */
    private async _selectValue(value: string, autoUpdate: boolean = true): Promise<boolean> {
        if (value === '') {
            return false;
        }
        if (this.value.length > 1 && (value === this.value[this.level - 1])) {
            // --- 当前值和本层的上级值一样，可能仅仅是刚刚 update 的 ---
            return false;
        }
        /** --- 已选 item 的下一层 list --- */
        let nextChildren: any[] | Record<string, string> | null = null;
        let isSelected: boolean = false;
        const isArray = Array.isArray(this.lists[this.level]);
        for (const key in this.lists[this.level]) {
            const item = this.lists[this.level][key];
            const val = (isArray ?
                (typeof item === 'object' ? (item.value ?? item.label ?? '') : item) :
                key).toString();
            if (value !== val) {
                continue;
            }
            nextChildren = item.children ?? null;
            isSelected = true;
            this.value[this.level] = val;
            this.label[this.level] = item.label ?? val;
            this.levelData[this.level] = {
                'value': this.value[this.level],
                'label': this.label[this.level]
            };
        }
        if (!isSelected) {
            // --- 当前未被选中，直接结束 ---
            if (autoUpdate) {
                this.emit('update:modelValue', '');
            }
            return false;
        }
        // --- 选中 ---
        if (!nextChildren) {
            // --- 选中但无下级 ---
            if (!this.propBoolean('async')) {
                // --- 无下层，啥也不管 ---
                ++this.level;
                this.listValue = [];
                this.nowlist = [];
                this.value[this.level] = '';
                this.label[this.level] = '';
                this.lists[this.level] = [];
                this.levelData[this.level] = {
                    'label': '',
                    'value': ''
                };
                if (autoUpdate) {
                    this.updateValue();
                }
                return false;
            }
            // --- 无下层，但是要异步获取 ---
            this.loading = true;
            // --- 要远程获取 ---
            const children = await new Promise<any[] | undefined>((resolve) => {
                this.emit('load', this.value[this.level], (children?: any[]) => {
                    resolve(children);
                    this.emit('loaded');
                });
            });
            this.loading = false;
            if (!children?.length) {
                // --- 真的没下层，结束 ---
                ++this.level;
                this.listValue = [];
                this.nowlist = [];
                this.value[this.level] = '';
                this.label[this.level] = '';
                this.lists[this.level] = [];
                this.levelData[this.level] = {
                    'label': '',
                    'value': ''
                };
                if (autoUpdate) {
                    this.updateValue();
                }
                return false;
            }
            // --- 有，那就走跳转模式 ---
            nextChildren = children;
        }
        // --- 有下层，跳转 ---
        ++this.level;
        this.listValue = [];
        this.setNowList(nextChildren);
        this.value[this.level] = '';
        this.label[this.level] = '';
        this.lists[this.level] = nextChildren;
        this.levelData[this.level] = {
            'label': '',
            'value': ''
        };
        if (autoUpdate) {
            this.updateValue();
        }
        return true;
    }

    public onMounted(): void | Promise<void> {
        this.watch('data', () => {
            this.level = 0;
            this.listValue = [];
            this.value = [''];
            this.label = [''];
            this.setNowList(this.props.data);
            this.lists = [this.props.data];
            this.levelData = [{
                'label': '',
                'value': ''
            }];
            this.updateValue();
        }, {
            'deep': true
        });

        this.watch('modelValue', async (): Promise<void> => {
            await this._selectValue(this.props.modelValue.toString());
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

        this.setNowList(this.props.data);
        this.lists[0] = this.props.data;
    }

}
