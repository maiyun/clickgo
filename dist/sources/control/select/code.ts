import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'add': null,
        'added': null,
        'remove': null,
        'removed': null,
        'tagclick': null,

        'remote': null,
        'load': null,
        'label': null
    };

    public props: {
        'disabled': boolean | string;
        'editable': boolean | string;
        'multi': boolean | string;

        /** --- 是否开启可搜索特性 --- */
        'search': boolean | string;
        /** --- 搜索模式默认为本地搜索，remote 可变为远程搜索 --- */
        'remote': boolean | string;
        /** --- 远程查询时输入延迟调用，防止频繁发起查询 --- */
        'remoteDelay': number | string;
        /** --- 是否开启树模式 --- */
        'tree': boolean | string;
        /** --- -1: 不存在子项, 0: 关闭状态, 1: 存在子项打开状态, 2: 加载状态 --- */
        'treeDefault': number | string;
        /** --- 树形状态下，设置为 true 将判断下级是否异步加载 --- */
        'async': boolean | string;
        'icon': boolean | string;
        'iconDefault': string;

        'modelValue': Array<string | number>;
        'placeholder': string;
        'data': any[] | Record<string, string>;
    } = {
            'disabled': false,
            'editable': false,
            'multi': false,

            'search': false,
            'remote': false,
            'remoteDelay': 500,
            'tree': false,
            'treeDefault': 0,
            'async': false,
            'icon': false,
            'iconDefault': '',

            'modelValue': [],
            'placeholder': '',
            'data': []
        };

    /** --- 语言包 --- */
    public localeData = {
        'en': {
            'search': 'Search'
        },
        'sc': {
            'search': '搜索'
        },
        'tc': {
            'search': '搜尋'
        },
        'ja': {
            'search': '検索'
        },
        'ko': {
            'search': '검색'
        },
        'th': {
            'search': 'ค้นหา'
        },
        'es': {
            'search': 'buscar'
        },
        'de': {
            'search': 'suchen'
        },
        'fr': {
            'search': 'rechercher'
        },
        'pt': {
            'search': 'pesquisar'
        },
        'ru': {
            'search': 'поиск'
        },
        'vi': {
            'search': 'tìm kiếm'
        }
    };

    public value: string[] = [];

    public label: string[] = [];

    /** --- 输入框 --- */
    public inputValue = '';

    /** --- 搜索输入框 --- */
    public searchValue = '';

    /** --- 远程或本地 search 结果的 list --- */
    public searchData: any[] | Record<string, string> = [];

    /** --- list 的选中值 --- */
    public listValue: string[] = [];

    /** --- list 的选中的 label --- */
    public listLabel: string[] = [];

    /** --- list 的选中的 item 属性包列表 --- */
    public listItem: any[] = [];

    /** --- pop 的 loading --- */
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
            // --- 输入模式的 list 必定不是 must ---
            return false;
        }
        if (this.propBoolean('search')) {
            // --- 搜索模式的 list 必定不是 must ---
            return false;
        }
        // --- 非输入模式、非搜索模式 ---
        return true;
    }

    // --- 传递给 list 的 data ---
    public get dataComp(): any[] | Record<string, any> {
        if (!this.propBoolean('search')) {
            // --- 不搜索，data 数据恒定不变 ---
            return this.props.data;
        }
        return this.searchData;
    }

    /** --- 向上更新值 --- */
    public updateValue(opt: {
        'clearList'?: boolean;
        'clearInput'?: boolean;
    } = {}): void {
        this.emit('update:modelValue', clickgo.tool.clone(this.value));
        this.emit('label', clickgo.tool.clone(this.label));
        if (opt.clearList) {
            this.listValue.length = 0;
            this.listLabel.length = 0;
        }
        if (opt.clearInput) {
            this.inputValue = '';
            this.searchValue = '';
        }
    }

    /** --- text 的失去焦点事件 --- */
    public blur(): void {
        if (!this.propBoolean('multi')) {
            return;
        }
        this.inputValue = '';
    }

    /** --- text 的 keydown 事件 --- */
    public async keydown(e: KeyboardEvent): Promise<void> {
        if (e.key === 'Backspace') {
            if (this.propBoolean('multi')) {
                // --- 判断是否删除其他 tag ---
                if ((e.target as HTMLInputElement).value === '' && this.propBoolean('multi') && this.value.length > 0) {
                    const index = this.value.length - 1;
                    const value = this.value[index];
                    // --- 判断是否可移除 ---
                    const event: types.ISelectRemoveEvent = {
                        'go': true,
                        preventDefault: function() {
                            this.go = false;
                        },
                        'detail': {
                            'index': index,
                            'value': value,
                            'mode': 'backspace'
                        }
                    };
                    this.emit('remove', event);
                    if (event.go) {
                        this.value.splice(-1);
                        this.label.splice(-1);
                        this.updateValue();
                        this.emit('removed', {
                            'detail': {
                                'index': index,
                                'value': value,
                                'mode': 'backspace'
                            }
                        });
                    }
                }
            }
            return;
        }
        if ((e.key === 'Enter') && (this.element.dataset.cgPopOpen === undefined) && (this.propBoolean('multi'))) {
            e.stopPropagation();
            if (!this.inputValue) {
                this.refs.gs.showPop();
                return;
            }
            if (this.value.includes(this.inputValue)) {
                this.inputValue = '';
                clickgo.form.hidePop();
                return;
            }
            // --- 判断是否允许新增项 ---
            const addIndex = this.value.length;
            const event: types.ISelectAddEvent = {
                'go': true,
                preventDefault: function() {
                    this.go = false;
                },
                'detail': {
                    'index': addIndex,
                    'value': this.inputValue
                }
            };
            this.emit('add', event);
            if (event.go) {
                this.value.push(this.inputValue);
                this.label.push(this.listLabel[0] || this.inputValue);
                this.updateValue({
                    'clearInput': true,
                    'clearList': true
                });
                this.emit('added', {
                    'detail': {
                        'index': addIndex,
                        'value': this.inputValue
                    }
                });
                if (this.propBoolean('search')) {
                    await this._search();
                }
            }
            return;
        }
        if ((e.key === 'ArrowDown' || e.key === 'Enter') && (this.element.dataset.cgPopOpen === undefined)) {
            e.stopPropagation();
            // --- 展开下拉菜单 ---
            this.refs.gs.showPop();
            return;
        }
        await this.textKeyDown(e);
    }

    /** --- search 和 input 的通用 keydown 事件 --- */
    public async textKeyDown(e: KeyboardEvent): Promise<void> {
        e.stopPropagation(); // --- 放置响应到 greatselect 的 mode:text enter 导致收不起来 ---
        if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && this.element.dataset.cgPopOpen !== undefined) {
            // --- 要键盘上下选择 ---
            e.preventDefault(); // --- 用来防止光标依浏览器原生要求移动 ---
            switch (e.key) {
                case 'ArrowUp': {
                    this.refs.list.arrowUp();
                    this.inputValue = this.listValue[0];
                    this.searchValue = this.listValue[0];
                    break;
                }
                default: {
                    this.refs.list.arrowDown();
                    this.inputValue = this.listValue[0];
                    this.searchValue = this.listValue[0];
                }
            }
            return;
        }
        if (e.key !== 'Enter') {
            return;
        }
        // --- enter ---
        // --- 选中的 list item ---
        const value = this.searchValue || this.inputValue;
        if (this.propBoolean('editable')) {
            // --- 可输入 ---
            if (this.propBoolean('multi')) {
                // --- 多选 ---
                if (!value) {
                    clickgo.form.hidePop();
                    return;
                }
                if (this.value.includes(value)) {
                    this.inputValue = '';
                    clickgo.form.hidePop();
                    return;
                }
                // --- 判断是否允许新增项 ---
                const addIndex = this.value.length;
                const event: types.ISelectAddEvent = {
                    'go': true,
                    preventDefault: function() {
                        this.go = false;
                    },
                    'detail': {
                        'index': addIndex,
                        'value': value
                    }
                };
                this.emit('add', event);
                if (event.go) {
                    this.value.push(value);
                    this.label.push(this.listLabel[0] || value);
                    this.updateValue({
                        'clearInput': true,
                        'clearList': true
                    });
                    this.emit('added', {
                        'detail': {
                            'index': addIndex,
                            'value': value
                        }
                    });
                    clickgo.form.hidePop();
                    if (this.propBoolean('search')) {
                        await this._search();
                    }
                }
            }
            else {
                // --- 单选 ---
                if (!value) {
                    clickgo.form.hidePop();
                    return;
                }
                this.value = [value];
                this.listValue = [value];
                await this.nextTick();
                this.label = [this.listLabel[0] || value];
                this.updateValue();
                clickgo.form.hidePop();
            }
        }
        else {
            // --- 不可输入，纯搜索 ---
            if (this.propBoolean('multi')) {
                // --- 多选 ---
                if (!value) {
                    return;
                }
                if (this.value.includes(value)) {
                    this.searchValue = '';
                    clickgo.form.hidePop();
                    await this._search();
                    return;
                }
                if (!this.listValue[0]) {
                    this.searchValue = '';
                    clickgo.form.hidePop();
                    await this._search();
                    return;
                }
                // --- 判断是否允许新增项 ---
                const addIndex = this.value.length;
                const event: types.ISelectAddEvent = {
                    'go': true,
                    preventDefault: function() {
                        this.go = false;
                    },
                    'detail': {
                        'index': addIndex,
                        'value': value
                    }
                };
                this.emit('add', event);
                if (event.go) {
                    this.value.push(value);
                    this.label.push(this.listLabel[0]);
                    this.searchValue = '';
                    this.updateValue();
                    this.emit('added', {
                        'detail': {
                            'index': addIndex,
                            'value': value
                        }
                    });
                    clickgo.form.hidePop();
                    await this._search();
                }
            }
            else {
                // --- 单选 ---
                if (!this.listValue[0]) {
                    this.searchValue = '';
                    clickgo.form.hidePop();
                    await this._search();
                    return;
                }
                this.value = [this.listValue[0]];
                this.label = [this.listLabel[0]];
                this.searchValue = '';
                this.updateValue();
                clickgo.form.hidePop();
                await this._search();
            }
        }
    }

    /** --- 当前需要发起请求的次数 --- */
    private _needSearch: number = 0;

    /** --- 当前搜索中的个数（远程） --- */
    public searching: number = 0;

    /** --- 私有搜索方法 --- */
    private async _search(success?: () => void | Promise<void>): Promise<void> {
        /** --- 当前要搜索的值 --- */
        const searchValue = (this.propBoolean('editable') ? this.inputValue : this.searchValue).trim().toLowerCase();
        if (this.propBoolean('remote')) {
            // --- 远程搜索 ---
            const delay = this.propInt('remoteDelay');
            ++this._needSearch;
            await clickgo.tool.sleep(delay);
            if (this._needSearch > 1) {
                --this._needSearch;
                return;
            }
            if (this._needSearch === 0) {
                return;
            }
            --this._needSearch;
            if (searchValue === '') {
                this.searchData = clickgo.tool.clone(this.props.data);
                await this.nextTick();
                await success?.();
                return;
            }
            ++this.searching;
            this.emit('remote', searchValue, async (data?: any[] | Record<string, string>): Promise<void> => {
                --this.searching;
                this.searchData = data ? clickgo.tool.clone(data) : [];
                await this.nextTick();
                await success?.();
            });
        }
        else {
            // --- 本地搜索 ---
            await this.nextTick();
            if (this._needSearch > 1) {
                --this._needSearch;
                return;
            }
            --this._needSearch;
            if (searchValue === '') {
                this.searchData = clickgo.tool.clone(this.props.data);
                await this.nextTick();
                await success?.();
                return;
            }
            /** --- 当前 data 是否是 array --- */
            const isArray = Array.isArray(this.props.data);
            this.searchData = isArray ? [] : {};
            for (const key in this.props.data) {
                const item = (this.props.data as any)[key];
                const val = (isArray ?
                    (typeof item === 'object' ? item.value ?? '' : item) :
                    key).toString().toLowerCase();
                const lab = (isArray ?
                    (typeof item === 'object' ? item.label ?? '' : '') : '').toLowerCase();
                let include = true;
                for (const char of searchValue) {
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
                    (this.searchData as any).push(item);
                }
                else {
                    (this.searchData as any)[key] = item;
                }
            }
            await success?.();
        }
    }

    // --- search 输入框值变更时 ---
    public async updateSearchValue(value: string): Promise<void> {
        // --- 只有 search 并且非 editable 时会触发 ---
        this.searchValue = value.trim();
        await this._search(() => {
            this.listValue = [this.searchValue];
        });
    }

    // --- text 的值变更事件（只有 editable 时会触发） ----
    public async updateInputValue(value: string): Promise<void> {
        this.inputValue = value.trim();

        // --- 判断当前是否是搜索模式 ---
        if (this.propBoolean('search')) {
            if (this.element.dataset.cgPopOpen === undefined) {
                // --- 显示列表 ---
                this.refs.gs.showPop();
            }
            await this._search(() => {
                this.listValue = [this.inputValue];
            });
        }

        // --- 判断是不是多选 ---
        if (this.propBoolean('multi')) {
            // --- 多选状态不处理，用户点选或回车后才处理 ---
            if (!this.propBoolean('search')) {
                this.listValue = [this.inputValue];
            }
            return;
        }
        // --- 单项 ---
        if (this.inputValue === '') {
            this.value = [];
            this.label = [];
            this.listValue = [];
        }
        else {
            this.value = [this.inputValue];
            this.label = [this.inputValue];
            this.listValue = [this.inputValue];
            await this.nextTick();
            if (this.listLabel[0]) {
                this.label = clickgo.tool.clone(this.listLabel);
            }
        }
        this.updateValue();
    }

    /** --- list 上的点击事件 --- */
    public async listItemClicked(): Promise<void> {
        if (this.propBoolean('editable')) {
            const v = this.listValue[0];
            // -- 可编辑 ---
            if (this.propBoolean('multi')) {
                // --- 多选 ---
                if (this.value.includes(v)) {
                    clickgo.form.hidePop();
                    return;
                }
                // --- 判断是否允许新增项 ---
                const addIndex = this.value.length;
                const event: types.ISelectAddEvent = {
                    'go': true,
                    preventDefault: function() {
                        this.go = false;
                    },
                    'detail': {
                        'index': addIndex,
                        'value': v
                    }
                };
                this.emit('add', event);
                if (event.go) {
                    this.value.push(v);
                    this.label.push(this.listLabel[0]);
                    this.updateValue({
                        'clearInput': true,
                        'clearList': true
                    });
                    this.emit('added', {
                        'detail': {
                            'index': addIndex,
                            'value': this.inputValue
                        }
                    });
                    if (this.propBoolean('search')) {
                        clickgo.form.hidePop();
                        await this._search();
                    }
                    else {
                        clickgo.form.hidePop();
                    }
                }
            }
            else {
                // --- 单选，可能已经实时添加了 ---
                if (this.inputValue !== v) {
                    this.inputValue = v;
                    this.value = [v];
                    this.label = [this.listLabel[0]];
                    this.updateValue();
                }
                clickgo.form.hidePop();
            }
        }
        else {
            // --- 不可编辑 ---
            if (this.propBoolean('multi')) {
                // --- 多选 ---
                if (this.propBoolean('search')) {
                    if (this.value.includes(this.listValue[0])) {
                        clickgo.form.hidePop();
                        this.searchValue = '';
                        await this._search();
                        return;
                    }
                    // --- 判断是否允许新增项 ---
                    const addIndex = this.value.length;
                    const event: types.ISelectAddEvent = {
                        'go': true,
                        preventDefault: function() {
                            this.go = false;
                        },
                        'detail': {
                            'index': addIndex,
                            'value': this.listValue[0]
                        }
                    };
                    this.emit('add', event);
                    if (event.go) {
                        this.value.push(this.listValue[0]);
                        this.label.push(this.listLabel[0]);
                        this.updateValue({
                            'clearInput': true,
                            'clearList': true
                        });
                        this.emit('added', {
                            'detail': {
                                'index': addIndex,
                                'value': this.inputValue
                            }
                        });
                        clickgo.form.hidePop();
                        await this._search();
                    }
                }
                else {
                    // --- 多选情况，可能有新增，可能有减少，现在交给 @add, @remove 处理了 ---
                    /*
                    const rtn = clickgo.tool.compar(this.value, this.listValue);
                    if (rtn.length.add || rtn.length.remove) {
                        // --- 有变化 ---
                        this.value = clickgo.tool.clone(this.listValue);
                        this.label = clickgo.tool.clone(this.listLabel);
                        if (rtn.length.add) {
                            for (const name in rtn.add) {
                                this.emit('add', rtn.add[name], name);
                            }
                        }
                        if (rtn.length.remove) {
                            for (const name in rtn.remove) {
                                this.emit('remove', rtn.remove[name], name);
                            }
                        }
                        this.updateValue();
                    }
                    */
                }
            }
            else {
                // --- 单选 ---
                this.value = [this.listValue[0]];
                this.label = [this.listLabel[0]];
                if (this.propBoolean('search')) {
                    this.updateValue({
                        'clearInput': true
                    });
                    clickgo.form.hidePop();
                    await this._search();
                }
                else {
                    this.updateValue();
                    clickgo.form.hidePop();
                }
            }
        }
    }

    // --- list 的相关事件 ---

    public onAdd(e: types.IListAddEvent): void {
        if (!this.propBoolean('multi')) {
            return;
        }
        if (this.propBoolean('search')) {
            return;
        }
        const addIndex = this.value.length;
        const event: types.ISelectAddEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'index': addIndex,
                'value': e.detail.value
            }
        };
        this.emit('add', event);
        if (!event.go) {
            e.preventDefault();
            return;
        }
        // --- 可添加 ---
        this.value.push(e.detail.value);
        const result = this.refs.list.findFormat(e.detail.value, false);
        this.label.push(result?.[e.detail.value].label ?? 'error');
        this.updateValue();
        this.emit('added', event);
    }

    public onRemove(e: types.IListAddEvent): void {
        if (!this.propBoolean('multi')) {
            return;
        }
        if (this.propBoolean('search')) {
            return;
        }
        const removeIndex = e.detail.index;
        const event: types.ISelectRemoveEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'index': removeIndex,
                'value': e.detail.value,
                'mode': 'list'
            }
        };
        this.emit('remove', event);
        if (!event.go) {
            e.preventDefault();
            return;
        }
        // --- 可移除 ---
        this.value.splice(e.detail.index, 1);
        this.label.splice(e.detail.index, 1);
        this.updateValue();
        this.emit('removed', {
            'detail': {
                'index': removeIndex,
                'value': e.detail.value,
                'mode': 'list'
            }
        });
    }

    // --- tag 的 label 的点击事件 ---
    public tagClick(index: number): void {
        const value = this.value[index];
        const event: types.ISelectTagclickEvent = {
            'detail': {
                'index': index,
                'value': value
            }
        };
        this.emit('tagclick', event);
    }

    // --- tag 的点击事件 ---
    public removeTag(index: number): void {
        if (this.isMust) {
            if (this.value.length === 1) {
                return;
            }
        }
        const value = this.value[index];
        // --- 判断是否可移除 ---
        const event: types.ISelectRemoveEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'index': index,
                'value': value,
                'mode': 'tag'
            }
        };
        this.emit('remove', event);
        if (!event.go) {
            return;
        }
        this.value.splice(index, 1);
        this.label.splice(index, 1);
        if (this.isMust) {
            this.listValue = clickgo.tool.clone(this.value);
        }
        this.updateValue();
        this.emit('removed', {
            'detail': {
                'index': index,
                'value': value,
                'mode': 'tag'
            }
        });
    }

    /** --- tags 的鼠标滚轮事件 --- */
    public tagsWheel(e: WheelEvent): void {
        if (e.deltaY === 0) {
            return;
        }
        e.preventDefault();
        this.refs.tags.scrollLeft += e.deltaY;
    }

    public tagdown(e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        e.stopPropagation();
        clickgo.form.doFocusAndPopEvent(e);
    }

    // --- async 模式的加载事件 ---
    public onLoad(value: string, resolve: (child?: any[]) => void): void {
        this.emit('load', value, resolve);
    }

    public onMounted(): void {
        let mvimmediate = true;
        this.watch('modelValue', async (): Promise<void> => {
            if (mvimmediate) {
                // --- 首次进入 ---
                mvimmediate = false;
            }
            else {
                if (JSON.stringify(this.value) === JSON.stringify(this.props.modelValue)) {
                    return;
                }
            }
            if (this.propBoolean('editable')) {
                // --- 可输入模式 ---
                if (this.props.modelValue.length) {
                    // --- 传入值了 ---
                    if (this.propBoolean('multi')) {
                        // --- 多值模式 ---
                        this.inputValue = '';
                        this.searchValue = '';
                        this.value.length = 0;
                        this.label.length = 0;
                        for (const item of this.props.modelValue) {
                            const items = item.toString();
                            const result = this.refs.list.findFormat(items, false);
                            if (result?.[items]) {
                                this.value.push(result[items].value);
                                this.label.push(result[items].label);
                            }
                            else {
                                this.value.push(items);
                                this.label.push(items);
                            }
                        }
                        this.updateValue();
                        return;
                    }
                    // --- 单条 ---
                    this.inputValue = (this.props.modelValue[0]).toString();
                    this.value = [this.inputValue];
                    const result = this.refs.list.findFormat(this.inputValue, false);
                    this.label = [result[this.inputValue] ? result[this.inputValue].label : this.inputValue];
                    this.updateValue();
                    this.listValue = [this.inputValue];
                    return;
                }
                // --- 没传值 ---
                this.inputValue = '';
                this.searchValue = '';
                this.value.length = 0;
                this.label.length = 0;
                this.updateValue();
                return;
            }
            // --- 不可输入模式 ---
            if (this.props.modelValue.length) {
                // --- 传入值了 ---
                if (this.propBoolean('multi')) {
                    // --- 多值模式 ---
                    this.value.length = 0;
                    this.label.length = 0;
                    for (const item of this.props.modelValue) {
                        const items = item.toString();
                        const result = this.refs.list.findFormat(items, false);
                        if (result?.[items]) {
                            this.value.push(result[items].value);
                            this.label.push(result[items].label);
                        }
                    }
                    this.updateValue();
                    this.listValue = this.value;
                    return;
                }
                // --- 单条 ---
                this.listValue = [this.props.modelValue[0].toString()];
                await this.nextTick();
                await clickgo.tool.sleep(0);
                this.value = clickgo.tool.clone(this.listValue);
                this.label = clickgo.tool.clone(this.listLabel);
                this.updateValue();
                return;
            }
            // --- 不可输入还没值 ---
            this.listValue = [];
            await this.nextTick();
            await clickgo.tool.sleep(0);
            this.value = clickgo.tool.clone(this.listValue);
            this.label = clickgo.tool.clone(this.listLabel);
            this.updateValue();
        }, {
            'immediate': true,
            'deep': true
        });
        this.watch('search', async () => {
            await this.nextTick();
            this.listValue = clickgo.tool.clone(this.value);
            if (!this.propBoolean('search')) {
                // --- 变成不可输入 ---
                return;
            }
            this.searchValue = '';
            await this._search();
        });
        this.watch('remote', async () => {
            if (!this.propBoolean('search')) {
                return;
            }
            await this._search();
        });
        this.watch('editable', async (): Promise<void> => {
            if (!this.propBoolean('editable')) {
                // --- 变成不可输入 ---
                if (this.propBoolean('multi')) {
                    await this.nextTick(); // --- 让 list 反应一下变成支持多选 ---
                    this.listValue = clickgo.tool.clone(this.value);
                    await this.nextTick();
                    if (JSON.stringify(this.value) === JSON.stringify(this.listValue)) {
                        return;
                    }
                    this.value = clickgo.tool.clone(this.listValue);
                    this.label = clickgo.tool.clone(this.listLabel);
                    this.updateValue();
                }
                return;
            }
            // --- 变成可输入 ---
            if (!this.propBoolean('multi')) {
                // --- 当前是单选 ---
                this.inputValue = (this.value[0] ?? '').toString();
            }
        });
        this.watch('multi', (): void => {
            if (!this.propBoolean('multi')) {
                // --- 多变单 ---
                if (this.value.length > 1) {
                    this.value.splice(1);
                    this.label.splice(1);
                    this.updateValue();
                    this.listValue = clickgo.tool.clone(this.value);
                }
                if (this.propBoolean('editable')) {
                    this.inputValue = (this.value[0] ?? '').toString();
                }
                return;
            }
            // --- 单变多 ---
            if (this.propBoolean('editable')) {
                this.inputValue = '';
            }
        });
        this.watch('data', async (): Promise<void> => {
            await this.nextTick();
            await clickgo.tool.sleep(0);
            if (JSON.stringify(this.value) !== JSON.stringify(this.listValue)) {
                this.value = clickgo.tool.clone(this.listValue);
                this.emit('update:modelValue', clickgo.tool.clone(this.value));
            }
            if (JSON.stringify(this.label) !== JSON.stringify(this.listLabel)) {
                this.label = clickgo.tool.clone(this.listLabel);
                this.emit('label', clickgo.tool.clone(this.label));
            }
        }, {
            'deep': true
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
