import * as clickgo from 'clickgo';

/** --- List 格式化后的选项，用于同步选择和校验用户操作 --- */
interface ISelectRow {
    'value': string;
    'label': string | number;
    'disabled'?: boolean;
    'unavailable'?: boolean;
    'control'?: string;
    'color'?: string;
}

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'add': null,
        'added': null,
        'remove': null,
        'removed': null,
        'change': null,
        'changed': null,
        'tagclick': null,
        'itemclicked': null,

        'remote': null,
        'load': null,
        'label': null,

        'update:modelValue': null
    };

    public props: {
        'disabled': boolean | string;
        'editable': boolean | string;
        'multi': boolean | string;
        'plain': boolean | string;
        'virtual': boolean | string;

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
        /** --- 映射 label、value、children 的 key --- */
        'map': {
            'label'?: string;
            'value'?: string;
            'children'?: string;
        };
        /** --- 0, xs, s, m, l, xl --- */
        'padding': string;
        'leftlabel'?: boolean | string;
        /** --- 设置弹出层的最低宽度 --- */
        'minWidth'?: number;

        'modelValue': Array<string | number>;
        'placeholder': string;
        /** --- 选项支持自定义映射和附加字段，沿用 List 的开放数据类型 --- */
        'data': any[] | Record<string, string>;
        'disabledList': string[] | string;
        'unavailableList': string[] | string;
    } = {
            'disabled': false,
            'editable': false,
            'multi': false,
            'plain': false,
            'virtual': false,

            'search': false,
            'remote': false,
            'remoteDelay': 500,
            'tree': false,
            'treeDefault': 0,
            'async': false,
            'icon': false,
            'iconDefault': '',
            'map': {},
            'padding': 'm',
            'leftlabel': true,
            'minWidth': 0,

            'modelValue': [],
            'placeholder': '',
            'data': [],
            'disabledList': [],
            'unavailableList': []
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
        },
        'ar': {
            'search': 'بحث'
        },
        'id': {
            'search': 'cari'
        },
        'it': {
            'search': 'cerca'
        },
        'tr': {
            'search': 'ara'
        }
    };

    /** --- 已提交的选中值 --- */
    public value: string[] = [];

    /** --- 已选值对应的显示标签 --- */
    public label: string[] = [];

    /** --- 输入框 --- */
    public inputValue = '';

    /** --- 搜索输入框 --- */
    public searchValue = '';

    /** --- 远程或本地搜索的选项数据 --- */
    public searchData: typeof this.props.data = [];

    /** --- 当前远程查询是否等待回调，0 表示空闲，1 表示等待 --- */
    public searching = 0;

    /** --- List 当前高亮或勾选的候选值 --- */
    public listValue: string[] = [];

    /** --- List 候选项的原始标签，提交时统一转成字符串 --- */
    public listLabel: Array<string | number> = [];

    /** --- list 的选中的 item 属性包列表 --- */
    public listItem: ISelectRow[] = [];

    /** --- 输入处理版本，等待期间只允许最新的输入提交值 --- */
    private _inputVersion = 0;

    /** --- 搜索版本，仅允许最后一次搜索更新结果 --- */
    private _searchVersion = 0;

    /** --- 卸载后不再接收延迟搜索或远程回调 --- */
    private _unmounted = false;

    /** --- list 是否为必须选择的模式 --- */
    public get isMust(): boolean {
        return !this.propBoolean('editable') && !this.propBoolean('search') && !this.propBoolean('multi');
    }

    /** --- list 是否多选 --- */
    public get listMulti(): boolean {
        // --- 输入模式只高亮候选项；非输入模式的多选列表负责回显多个已选项 ---
        return !this.propBoolean('editable') && this.propBoolean('multi');
    }

    /** --- 判断是输入框模式还是 label 模式 --- */
    public get labelMode(): boolean {
        return !this.propBoolean('multi') && !this.propBoolean('editable');
    }

    /** --- 传递给 List 的数据 --- */
    public get dataComp(): typeof this.props.data {
        if (!this.propBoolean('search')) {
            // --- 非搜索模式直接使用传入的选项数据 ---
            return this.props.data;
        }
        return this._searchText ? this.searchData : this.props.data;
    }

    /** --- 当前搜索文本，输入模式使用编辑框，其余模式使用搜索框 --- */
    private get _searchText(): string {
        return (this.propBoolean('editable') ? this.inputValue : this.searchValue).trim();
    }

    /**
     * --- 比较有序的值或标签，保留数字与字符串的区别以完成绑定值规范化 ---
     * @param a 当前数组
     * @param b 对比数组
     * @returns 元素和顺序是否一致
     */
    private _equalValues(a: ReadonlyArray<string | number>, b: ReadonlyArray<string | number>): boolean {
        return a.length === b.length && a.every((value, index) => value === b[index]);
    }

    /**
     * --- 向上同步已选值和标签，并按需清空候选值或输入 ---
     * @param opt 清空列表选择或输入框的选项
     * @returns void
     */
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

    /**
     * --- 获取校验外部值所需的选项，搜索结果不能代替完整的本地数据 ---
     * @returns 格式化选项，远程模式优先使用当前结果中的标签
     */
    private _getValueData(): ISelectRow[] {
        const listData: ISelectRow[] = this.refs.list.dataGl;
        if (!this.propBoolean('search') || !this._searchText) {
            return listData;
        }
        const dataFormat = this.refs.list.formatData(clickgo.tool.clone(this.props.data), []);
        // --- 完整数据中的已选子项也要展开；筛选结果中可能根本没有它的父节点 ---
        this.refs.list.findFormat([...this.props.modelValue, ...this.value], true, dataFormat);
        const data: ISelectRow[] = this.refs.list.unpack(dataFormat);
        return this.propBoolean('remote') ? [...listData, ...data] : data;
    }

    /**
     * --- 为已选值补齐标签，不用搜索列表的临时选择覆盖已选值 ---
     * @returns void
     */
    private _refreshLabels(): void {
        const data = this._getValueData();
        if (!data.length && !this.propBoolean('editable') && !this.propBoolean('remote')) {
            return;
        }
        const label = this.value.map((value, index) => {
            const row = data.find(item => item.value === value);
            return row ? row.label.toString() : this.label[index] ?? value;
        });
        if (this._equalValues(label, this.label)) {
            return;
        }
        this.label = label;
        this.emit('label', clickgo.tool.clone(this.label));
    }

    /**
     * --- 提交鼠标或回车选中的值，统一执行操作前校验和操作后通知 ---
     * @param value 实际选项值，输入模式也可传入自定义值
     * @param fromList 是否由 List 的点击事件进入
     * @returns void
     */
    private async _selectValue(value: string, fromList: boolean = false): Promise<void> {
        if (this._unmounted || this.propBoolean('disabled')) {
            return;
        }
        const editable = this.propBoolean('editable');
        const multi = this.propBoolean('multi');
        const search = this.propBoolean('search');
        const data: ISelectRow[] = this.refs.list.dataGl;
        const row = data.find(item => item.value === value);
        if (row?.disabled || row?.unavailable || row?.control === 'split' || !row && (!editable || fromList)) {
            return;
        }
        if (!editable && !search) {
            // --- 普通 List 多选由 add/remove 处理；单选被 List 拒绝时不能从点击事件再次提交 ---
            if (multi || fromList && !this.listValue.includes(value)) {
                return;
            }
        }
        if (multi) {
            if (!this.value.includes(value)) {
                const event: clickgo.control.ISelectAddEvent = {
                    'go': true,
                    preventDefault: function() {
                        this.go = false;
                    },
                    'detail': {
                        'index': this.value.length,
                        'value': value
                    }
                };
                this.emit('add', event);
                if (!event.go) {
                    return;
                }
                this.value.push(value);
                this.label.push(row?.label.toString() ?? value);
                this.updateValue({
                    'clearInput': true,
                    'clearList': true
                });
                this.emit('added', {
                    'detail': event.detail
                });
            }
            else {
                this.inputValue = '';
                this.searchValue = '';
            }
        }
        else if (this.value.length !== 1 || this.value[0] !== value) {
            const before = clickgo.tool.clone(this.value);
            // --- 普通 List 单选已在 onChange 校验，搜索与输入模式在提交时校验 ---
            if (editable || search || !fromList) {
                const event: clickgo.control.ISelectChangeEvent = {
                    'go': true,
                    preventDefault: function() {
                        this.go = false;
                    },
                    'detail': {
                        'value': [value]
                    }
                };
                this.emit('change', event);
                if (!event.go) {
                    return;
                }
            }
            // --- 确认选择后，等待标签的旧输入不能再次提交同一个值 ---
            ++this._inputVersion;
            this.value = [value];
            this.label = [row?.label.toString() ?? value];
            this.listValue = [value];
            if (editable) {
                this.inputValue = value;
            }
            this.updateValue({
                'clearInput': search && !editable
            });
            this.emit('changed', {
                'detail': {
                    'before': before,
                    'value': clickgo.tool.clone(this.value)
                }
            });
        }
        else if (search && !editable) {
            this.searchValue = '';
        }
        this.refs.gs.hidePop();
        if (search && (multi || !editable)) {
            await this._search();
        }
    }

    /**
     * --- 移除已选项，统一执行取消校验、值和标签更新及完成通知 ---
     * @param index 已选项索引
     * @param mode 移除入口
     * @param value 移除的值，List 入口使用事件中的值
     * @returns 是否完成移除，false 表示操作被取消
     */
    private _removeValue(
        index: number, mode: clickgo.control.ISelectRemoveEvent['detail']['mode'], value: string = this.value[index]
    ): boolean {
        const event: clickgo.control.ISelectRemoveEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'index': index,
                'value': value,
                'mode': mode
            }
        };
        this.emit('remove', event);
        if (!event.go) {
            return false;
        }
        this.value.splice(index, 1);
        this.label.splice(index, 1);
        // --- List 入口由子控件在事件返回后提交选择，其余入口需要主动同步候选列表 ---
        if (mode !== 'list') {
            this.listValue = clickgo.tool.clone(this.value);
        }
        this.updateValue();
        this.emit('removed', {
            'detail': {
                'index': index,
                'value': value,
                'mode': mode
            }
        });
        return true;
    }

    /**
     * --- 读取原始选项的值和标签；字典选项始终以键作为值 ---
     * @param item 原始选项
     * @param key 字典选项的键，数组选项不传
     * @returns 字符串形式的值和标签
     */
    private _getOptionText(item: unknown, key?: string): {
        'value': string;
        'label': string;
    } {
        if (typeof item !== 'object' || item === null) {
            const text = String(item);
            return {
                'value': key ?? text,
                'label': text
            };
        }
        const data = item as Record<string, string | number | undefined>;
        const mapLabel = this.props.map.label ?? 'label';
        const mapValue = this.props.map.value ?? 'value';
        const value = key ?? String(data[mapValue] ?? data[mapLabel] ?? '');
        return {
            'value': value,
            'label': String(data[mapLabel] ?? value)
        };
    }

    /**
     * --- 输入失焦时按选项值或标签规范化，仍须通过选择校验 ---
     * @returns void
     */
    public async blur(): Promise<void> {
        if (this.propBoolean('disabled')) {
            return;
        }
        if (this.propBoolean('multi')) {
            this.inputValue = '';
            return;
        }
        if (this.inputValue === this.listValue[0]) {
            return;
        }
        const input = this.inputValue.toLowerCase();
        const data = this.dataComp;
        if (Array.isArray(data)) {
            for (const item of data) {
                const row = this._getOptionText(item);
                if (row.value.toLowerCase() === input || row.label.toLowerCase() === input) {
                    await this._selectValue(row.value);
                    return;
                }
            }
            return;
        }
        for (const key in data) {
            const row = this._getOptionText(data[key], key);
            if (row.value.toLowerCase() === input || row.label.toLowerCase() === input) {
                await this._selectValue(row.value);
                return;
            }
        }
    }

    /**
     * --- text 的 keydown 事件 ---
     * @param e 键盘事件
     * @returns void
     */
    public async keydown(e: KeyboardEvent): Promise<void> {
        if (this.propBoolean('disabled')) {
            return;
        }
        if (e.key === 'Backspace') {
            if ((e.target as HTMLInputElement).value === '' && this.propBoolean('multi') && this.value.length > 0) {
                this._removeValue(this.value.length - 1, 'backspace');
            }
            return;
        }
        if (this.element.dataset.cgPopOpen === undefined && (e.key === 'ArrowDown' || e.key === 'Enter')) {
            e.stopPropagation();
            e.preventDefault();
            if (e.key === 'Enter' && this.propBoolean('multi') && this.inputValue) {
                await this._selectValue(this.inputValue);
                return;
            }
            this.refs.gs.showPop();
            return;
        }
        await this.textKeyDown(e);
    }

    /**
     * --- 搜索输入框的键盘导航只移动候选项，回车才提交选择 ---
     * @param e 键盘事件
     * @returns void
     */
    public async textKeyDown(e: KeyboardEvent): Promise<void> {
        e.stopPropagation();
        if (this.propBoolean('disabled')) {
            return;
        }
        if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && this.element.dataset.cgPopOpen !== undefined) {
            e.preventDefault();
            if (e.key === 'ArrowUp') {
                this.refs.list.arrowUp();
            }
            else {
                this.refs.list.arrowDown();
            }
            return;
        }
        if (e.key !== 'Enter') {
            return;
        }
        e.preventDefault();
        const value = this.listValue[0] ?? (this.propBoolean('editable') ? this.inputValue : undefined);
        if (value === undefined || value === '') {
            this.refs.gs.hidePop();
            return;
        }
        await this._selectValue(value);
    }

    /**
     * --- 按字符集合匹配本地选项，保留原始选项结构和字典键 ---
     * @param searchValue 搜索文本
     * @returns 筛选后的原始数据
     */
    private _filterData(searchValue: string): typeof this.props.data {
        const searchChars = [...new Set(searchValue.toLowerCase())];
        const matches = (item: unknown, key?: string): boolean => {
            const row = this._getOptionText(item, key);
            const value = row.value.toLowerCase();
            const label = row.label.toLowerCase();
            return searchChars.every(char => value.includes(char) || label.includes(char));
        };
        if (Array.isArray(this.props.data)) {
            return this.props.data.filter(item => matches(item));
        }
        const data: Record<string, string> = {};
        for (const key in this.props.data) {
            const item = this.props.data[key];
            if (matches(item, key)) {
                data[key] = item;
            }
        }
        return data;
    }

    /**
     * --- 执行搜索，仅当前查询可更新结果或运行完成处理 ---
     * @param success 搜索数据更新并完成渲染后的处理
     * @returns void
     */
    private async _search(success?: () => void | Promise<void>): Promise<void> {
        if (this._unmounted) {
            return;
        }
        /** --- 当前要搜索的值 --- */
        const searchValue = this._searchText;
        /** --- 本次搜索版本 --- */
        const searchVersion = ++this._searchVersion;
        // --- 等待状态只属于当前查询，旧请求未回调不能阻塞新查询或清空输入 ---
        this.searching = 0;
        if (this.propBoolean('remote')) {
            // --- 远程搜索 ---
            this.searchData = [];
            const delay = this.propInt('remoteDelay');
            await clickgo.tool.sleep(delay);
            if (this._unmounted || searchVersion !== this._searchVersion) {
                return;
            }
            if (searchValue === '') {
                await this.nextTick();
                if (this._unmounted || searchVersion !== this._searchVersion) {
                    return;
                }
                await success?.();
                return;
            }
            this.searching = 1;
            let completed = false;
            const event: clickgo.control.ISelectRemoteEvent = {
                'detail': {
                    'value': searchValue,
                    'callback': async (data?: typeof this.props.data): Promise<void> => {
                        if (completed) {
                            return;
                        }
                        completed = true;
                        if (this._unmounted || searchVersion !== this._searchVersion) {
                            return;
                        }
                        this.searching = 0;
                        this.searchData = data ? clickgo.tool.clone(data) : [];
                        await this.nextTick();
                        if (this._unmounted || searchVersion !== this._searchVersion) {
                            return;
                        }
                        this._refreshLabels();
                        await success?.();
                    }
                }
            };
            this.emit('remote', event);
        }
        else {
            // --- 本地搜索 ---
            await this.nextTick();
            if (this._unmounted || searchVersion !== this._searchVersion) {
                return;
            }
            if (searchValue === '') {
                this.searchData = [];
                await this.nextTick();
                if (this._unmounted || searchVersion !== this._searchVersion) {
                    return;
                }
                await success?.();
                return;
            }
            this.searchData = this._filterData(searchValue);
            await this.nextTick();
            if (this._unmounted || searchVersion !== this._searchVersion) {
                return;
            }
            this._refreshLabels();
            await success?.();
        }
    }

    /**
     * --- 更新非编辑模式的搜索文本，搜索结束后同步候选值 ---
     * @param value 搜索输入框的值
     * @returns void
     */
    public async updateSearchValue(value: string): Promise<void> {
        if (this.propBoolean('disabled')) {
            return;
        }
        // --- 只有 search 并且非 editable 时会触发 ---
        this.searchValue = value.trim();
        if (this.propBoolean('multi')) {
            // --- 多选模式下，onPop 已同步 listValue，搜索数据变化后 list 的 checkValue 会自动按新数据过滤，无需额外处理 ---
            await this._search();
        }
        else {
            await this._search(() => {
                this.listValue = this.searchValue ? [this.searchValue] : clickgo.tool.clone(this.value);
            });
        }
    }

    /**
     * --- 校验编辑框输入，等待候选标签后提交仍有效的单选值 ---
     * @param value 编辑框的值
     * @returns void
     */
    public async updateInputValue(value: string): Promise<void> {
        if (this._unmounted || this.propBoolean('disabled')) {
            return;
        }
        value = value.trim();
        const editable = this.propBoolean('editable');
        const multi = this.propBoolean('multi');
        if (editable && !multi) {
            const event: clickgo.control.ISelectChangeEvent = {
                'go': true,
                preventDefault: function() {
                    this.go = false;
                },
                'detail': {
                    'value': [value]
                },
            };
            this.emit('change', event);
            if (!event.go) {
                return;
            }
        }
        const inputVersion = ++this._inputVersion;
        this.inputValue = value;
        // --- 判断当前是否是搜索模式 ---
        if (this.propBoolean('search')) {
            if (this.element.dataset.cgPopOpen === undefined) {
                // --- 显示列表 ---
                this.refs.gs.showPop();
            }
            await this._search(() => {
                this.listValue = this.inputValue ? [this.inputValue] : clickgo.tool.clone(this.value);
            });
        }
        if (this._unmounted || inputVersion !== this._inputVersion || this.inputValue !== value) {
            // --- 等待搜索时可能已有新输入或外部值，旧处理不能再提交或重复通知 ---
            return;
        }

        // --- 判断是不是多选 ---
        if (multi) {
            // --- 多选状态不处理，用户点选或回车后才处理 ---
            if (!this.propBoolean('search')) {
                this.listValue = [this.inputValue];
            }
            return;
        }

        // --- 先让 List 回传候选标签，等待结束前不改动已选值 ---
        const values = value === '' ? [] : [value];
        this.listValue = [...values];
        if (value !== '') {
            await this.nextTick();
            if (this._unmounted || inputVersion !== this._inputVersion || this.inputValue !== value) {
                return;
            }
        }

        const before = [...this.value];
        this.value = values;
        this.label = value !== '' && this.listLabel.length ? this.listLabel.map(item => item.toString()) : [...values];
        this.updateValue();
        if (editable) {
            const event: clickgo.control.ISelectChangedEvent = {
                'detail': {
                    'before': before,
                    'value': clickgo.tool.clone(this.value)
                }
            };
            this.emit('changed', event);
        }
    }

    /**
     * --- List 的点击事件，使用实际点击值，不能使用之前的高亮项 ---
     * @param e List 点击事件
     * @returns void
     */
    public async listItemClicked(e: clickgo.control.IListItemclickedEvent): Promise<void> {
        this.emit('itemclicked', e);
        if (e.detail.arrow) {
            return;
        }
        await this._selectValue(e.detail.value, true);
    }

    /**
     * --- 接收普通多选 List 的添加请求并提交选择 ---
     * @param e List 添加事件
     * @returns void
     */
    public onAdd(e: clickgo.control.IListAddEvent): void {
        if (!this.propBoolean('multi')) {
            return;
        }
        if (this.propBoolean('search')) {
            // --- 搜索模式下，阻止 list 内部的多选切换，由 select 自行管理 ---
            e.preventDefault();
            return;
        }
        const addIndex = this.value.length;
        const event: clickgo.control.ISelectAddEvent = {
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
        this.label.push(result?.[e.detail.value]?.label?.toString() ?? e.detail.value);
        this.updateValue();
        this.emit('added', event);
    }

    /**
     * --- 处理 List 的取消选择，并将 Select 的取消结果传回 List ---
     * @param e List 移除事件
     * @returns void
     */
    public onRemove(e: clickgo.control.IListRemoveEvent): void {
        if (!this.propBoolean('multi')) {
            return;
        }
        if (this.propBoolean('search')) {
            // --- 搜索模式下，阻止 list 内部的多选切换，由 select 自行管理 ---
            e.preventDefault();
            return;
        }
        if (!this._removeValue(e.detail.index, 'list', e.detail.value)) {
            e.preventDefault();
        }
    }

    /**
     * --- 将普通单选 List 的操作前校验传递给 Select ---
     * @param e List 变更事件
     * @returns void
     */
    public onChange(e: clickgo.control.IListChangeEvent): void {
        if (this.propBoolean('multi') || this.propBoolean('search') || this.propBoolean('editable')) {
            return;
        }
        const event: clickgo.control.ISelectChangeEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'value': e.detail.value
            }
        };
        this.emit('change', event);
        if (!event.go) {
            e.preventDefault();
        }
    }

    /**
     * --- 通知已选标签被点击 ---
     * @param index 标签索引
     * @returns void
     */
    public tagClick(index: number): void {
        const value = this.value[index];
        const event: clickgo.control.ISelectTagclickEvent = {
            'detail': {
                'index': index,
                'value': value
            }
        };
        this.emit('tagclick', event);
    }

    /**
     * --- 关闭标签时移除对应已选项 ---
     * @param index 标签索引
     * @returns void
     */
    public removeTag(index: number): void {
        if (this.propBoolean('disabled')) {
            return;
        }
        if (this.isMust && this.value.length === 1) {
            return;
        }
        this._removeValue(index, 'tag');
    }

    /**
     * --- 将标签区域的纵向滚轮转换为横向滚动 ---
     * @param e 滚轮事件
     * @returns void
     */
    public tagsWheel(e: WheelEvent): void {
        if (e.deltaY === 0) {
            return;
        }
        e.preventDefault();
        clickgo.dom.setScrollLeft(this.refs.tags, clickgo.dom.getScrollLeft(this.refs.tags) + e.deltaY);
    }

    /**
     * --- 点击标签时处理窗体焦点与浮层状态 ---
     * @param e 指针事件
     * @returns void
     */
    public async tagdown(e: PointerEvent): Promise<void> {
        e.stopPropagation();
        await clickgo.form.doFocusAndPopEvent(e);
    }

    /**
     * --- 转发树形列表的异步子项加载请求 ---
     * @param value 父项的值
     * @param resolve List 的加载回调，沿用支持自定义映射和附加字段的开放子项类型
     * @returns void
     */
    public onLoad(value: string, resolve: (child?: any[]) => void): void {
        this.emit('load', value, resolve);
    }

    /**
     * --- 弹出时刷新列表位置，并回显搜索多选的已选项 ---
     * @returns void
     */
    public onPop(): void {
        this.refs.list.refreshOffset();
        // --- 多选+搜索模式下，同步 listValue 以回显已选中项 ---
        if (this.propBoolean('multi') && this.propBoolean('search') && !this.propBoolean('editable')) {
            this.listValue = clickgo.tool.clone(this.value);
        }
    }

    /**
     * --- 根据外部值同步控件选择，不依赖子 List 的异步事件回传 ---
     * @returns void
     */
    private _syncModelValue(): void {
        const multi = this.propBoolean('multi');
        const remote = this.propBoolean('remote');
        const modelValue = this.props.modelValue.map(item => item.toString());
        let value: string[];
        let label: string[];
        if (this.propBoolean('editable')) {
            const data = this._getValueData();
            value = multi ? modelValue : modelValue.slice(0, 1);
            label = value.map(item => {
                const row = data.find(d => d.value === item);
                return row?.label.toString() ?? this.label[this.value.indexOf(item)] ?? item;
            });
            this.inputValue = multi ? '' : value[0] ?? '';
            this.searchValue = '';
        }
        else {
            // --- 先展开外部值所在的树节点，使 dataGl 包含对应项目 ---
            for (const item of modelValue) {
                this.refs.list.findFormat(item);
            }
            const data = this._getValueData();
            if (!data.length && !remote) {
                // --- 本地空列表尚不能判定外部值有效性；首批数据到达后再执行本地校验 ---
                this.value = multi ? modelValue : modelValue.slice(0, 1);
                if (this.label.length) {
                    this.label = [];
                    this.emit('label', []);
                }
                this.listValue = clickgo.tool.clone(this.value);
                this.listLabel = [];
                this.listItem = [];
                return;
            }
            const selected: ISelectRow[] = [];
            // --- 普通单选先过滤无效候选值，再截取首个有效项，不能提前截断外部数组 ---
            for (const item of modelValue) {
                const row = data.find(d => d.value === item);
                if (row?.disabled || row?.control === 'split') {
                    continue;
                }
                if (row) {
                    selected.push(row);
                }
                else if (remote) {
                    // --- 远程列表只有当前批次，缺少选项不代表外部值失效，保留已有标签等待补齐 ---
                    selected.push({
                        'value': item,
                        'label': this.label[this.value.indexOf(item)] ?? item
                    });
                }
                else {
                    continue;
                }
                if (!multi) {
                    break;
                }
            }
            if (!selected.length && this.isMust) {
                const row = data.find(d => !d.disabled && d.control !== 'split');
                if (row) {
                    selected.push(row);
                }
            }
            value = selected.map(item => item.value);
            label = selected.map(item => item.label.toString());
            this.listLabel = clickgo.tool.clone(label);
            this.listItem = selected;
        }
        const labelChanged = !this._equalValues(label, this.label);
        this.value = value;
        this.label = label;
        this.listValue = clickgo.tool.clone(this.value);
        // --- 普通数据刷新只补标签或修正无效值，不重复回写相同的绑定值 ---
        if (!this._equalValues(this.value, this.props.modelValue)) {
            this.emit('update:modelValue', clickgo.tool.clone(this.value));
        }
        if (labelChanged) {
            this.emit('label', clickgo.tool.clone(this.label));
        }
    }

    /**
     * --- 数据或模式变化时刷新选择，编辑模式只补标签以保留正在输入的文本 ---
     * @returns void
     */
    private _refreshSelection(): void {
        if (this.propBoolean('editable')) {
            this._refreshLabels();
        }
        else {
            this._syncModelValue();
        }
    }

    /**
     * --- 输入来源或模式改变时，使旧搜索失效并清除其结果与等待状态 ---
     * @returns void
     */
    private _resetSearch(): void {
        ++this._searchVersion;
        this.searching = 0;
        this.searchData = [];
    }

    /**
     * --- 监听外部值、完整数据和临时搜索结果，分别同步选择与标签 ---
     * @returns void
     */
    public onMounted(): void {
        this.watch('modelValue', async (): Promise<void> => {
            if (this._equalValues(this.value, this.props.modelValue)) {
                return;
            }
            if (this.propBoolean('editable')) {
                // --- 外部值替换输入时，先取消等待中的输入提交和远程查询 ---
                ++this._inputVersion;
                this._resetSearch();
            }
            await this.nextTick();
            if (!this._unmounted && !this._equalValues(this.value, this.props.modelValue)) {
                this._syncModelValue();
            }
        }, {
            'deep': true
        });
        this._syncModelValue();
        this.watch('search', async (): Promise<void> => {
            this._resetSearch();
            this.searchValue = '';
            await this.nextTick();
            if (this._unmounted) {
                return;
            }
            this._refreshSelection();
            if (this.propBoolean('search')) {
                await this._search();
            }
        });
        this.watch('remote', async (): Promise<void> => {
            if (this.propBoolean('search')) {
                await this._search();
            }
            await this.nextTick();
            if (!this._unmounted) {
                this._refreshSelection();
            }
        });
        for (const prop of ['editable', 'multi'] as const) {
            this.watch(prop, async (): Promise<void> => {
                ++this._inputVersion;
                this._resetSearch();
                await this.nextTick();
                if (this._unmounted) {
                    return;
                }
                this._syncModelValue();
                if (this.propBoolean('search')) {
                    await this._search();
                }
            });
        }
        this.watch(() => JSON.stringify(this.props.data), async (): Promise<void> => {
            if (this.propBoolean('search') && !this.propBoolean('remote')) {
                await this._search();
            }
            await this.nextTick();
            // --- List 的数据和绑定值也由 watcher 刷新，本轮处理结束后再校验选择 ---
            await clickgo.tool.sleep(0);
            if (this._unmounted) {
                return;
            }
            this._refreshSelection();
        });
        this.watch(() => this.refs.list.dataGl, (): void => {
            if (!this._unmounted) {
                this._refreshLabels();
            }
        }, {
            'deep': true
        });
        this.watch(() => [this.props.map, this.props.disabledList], async (): Promise<void> => {
            await this.nextTick();
            if (!this._unmounted) {
                this._refreshSelection();
            }
        }, {
            'deep': true
        });
    }

    /**
     * --- 卸载时使所有未完成的搜索失效 ---
     * @returns void
     */
    public onBeforeUnmount(): void {
        this._unmounted = true;
        ++this._searchVersion;
        this.searching = 0;
    }

}
