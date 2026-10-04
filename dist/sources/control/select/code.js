import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
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
    props = {
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
    localeData = {
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
    value = [];
    label = [];
    /** --- 输入框 --- */
    inputValue = '';
    /** --- 搜索输入框 --- */
    searchValue = '';
    /** --- 远程或本地 search 结果的 list --- */
    searchData = [];
    /** --- list 的选中值 --- */
    listValue = [];
    /** --- list 的选中的 label --- */
    listLabel = [];
    /** --- list 的选中的 item 属性包列表 --- */
    listItem = [];
    /** --- 卸载后不再接收延迟搜索或远程回调 --- */
    _unmounted = false;
    /** --- pop 的 loading --- */
    loading = 0;
    /** --- list 是否为必须选择的模式 --- */
    get isMust() {
        if (this.propBoolean('editable')) {
            // --- 输入模式的 list 必定不是 must ---
            return false;
        }
        if (this.propBoolean('search')) {
            // --- 搜索模式的 list 必定不是 must ---
            return false;
        }
        if (this.propBoolean('multi')) {
            // --- 多选模式，可移除 tag ---
            return false;
        }
        // --- 非输入模式、非搜索模式、单选模式 ---
        return true;
    }
    /** --- list 是否多选 --- */
    get listMulti() {
        if (this.propBoolean('editable')) {
            // --- 输入模式的 list 不支持多选 ---
            return false;
        }
        // --- 搜索模式下也需要 list 为多选，以回显已选中的多个项 ---
        return this.propBoolean('multi');
    }
    /** --- 判断是输入框模式还是 label 模式 --- */
    get labelMode() {
        return !this.propBoolean('multi') && !this.propBoolean('editable');
    }
    // --- 传递给 list 的 data ---
    get dataComp() {
        if (!this.propBoolean('search')) {
            // --- 不搜索，data 数据恒定不变 ---
            return this.props.data;
        }
        const searchValue = (this.propBoolean('editable') ? this.inputValue : this.searchValue).trim();
        return searchValue ? this.searchData : this.props.data;
    }
    /** --- 向上更新值 --- */
    updateValue(opt = {}) {
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
    _getValueData() {
        const listData = this.refs.list.dataGl;
        const searchValue = (this.propBoolean('editable') ? this.inputValue : this.searchValue).trim();
        if (!this.propBoolean('search') || !searchValue) {
            return listData;
        }
        const dataFormat = this.refs.list.formatData(clickgo.tool.clone(this.props.data), []);
        // --- 完整数据中的已选子项也要展开；筛选结果中可能根本没有它的父节点 ---
        this.refs.list.findFormat([...this.props.modelValue, ...this.value], true, dataFormat);
        const data = this.refs.list.unpack(dataFormat);
        return this.propBoolean('remote') ? [...listData, ...data] : data;
    }
    /**
     * --- 为已选值补齐标签，不用搜索列表的临时选择覆盖已选值 ---
     * @returns void
     */
    _refreshLabels() {
        const data = this._getValueData();
        if (!data.length && !this.propBoolean('editable') && !this.propBoolean('remote')) {
            return;
        }
        const label = this.value.map((value, index) => {
            const row = data.find(item => item.value === value);
            return row ? row.label.toString() : this.label[index] ?? value;
        });
        if (JSON.stringify(label) === JSON.stringify(this.label)) {
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
    async _selectValue(value, fromList = false) {
        if (this._unmounted || this.propBoolean('disabled')) {
            return;
        }
        const editable = this.propBoolean('editable');
        const multi = this.propBoolean('multi');
        const search = this.propBoolean('search');
        const data = this.refs.list.dataGl;
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
        const before = clickgo.tool.clone(this.value);
        if (multi) {
            if (!this.value.includes(value)) {
                const event = {
                    'go': true,
                    preventDefault: function () {
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
            // --- 普通 List 单选已在 onChange 校验，搜索与输入模式在提交时校验 ---
            if (editable || search || !fromList) {
                const event = {
                    'go': true,
                    preventDefault: function () {
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
     * --- 输入失焦时按选项值或标签规范化，仍须通过选择校验 ---
     * @returns void
     */
    async blur() {
        if (this.propBoolean('disabled')) {
            return;
        }
        if (!this.propBoolean('multi')) {
            // --- 单选状态 ---
            // --- 如果 value 大小写无视相等、或 label 相等，也可以 ---
            if (this.inputValue === this.listValue[0]) {
                return;
            }
            if (Array.isArray(this.dataComp)) {
                for (const item of this.dataComp) {
                    let label = '';
                    let value = '';
                    if (typeof item !== 'object') {
                        label = item.toString();
                        value = label;
                    }
                    else {
                        const mapLabel = this.props.map.label ?? 'label';
                        const mapValue = this.props.map.value ?? 'value';
                        label = (item[mapLabel] ?? item[mapValue] ?? '').toString();
                        value = (item[mapValue] ?? item[mapLabel] ?? '').toString();
                    }
                    // --- 判断是否在忽略大小写的情况下 value 相等 ---
                    if ((value.toLowerCase() === this.inputValue.toLowerCase()) ||
                        (label.toLowerCase() === this.inputValue.toLowerCase())) {
                        await this._selectValue(value);
                        return;
                    }
                }
            }
            else {
                const mapLabel = this.props.map.label ?? 'label';
                for (const key in this.dataComp) {
                    const label = (typeof this.dataComp[key] === 'string' ? this.dataComp[key] :
                        (this.dataComp[key][mapLabel] ?? key)).toString();
                    const value = key;
                    if ((value.toLowerCase() === this.inputValue.toLowerCase()) ||
                        (label.toLowerCase() === this.inputValue.toLowerCase())) {
                        await this._selectValue(value);
                        return;
                    }
                }
            }
            return;
        }
        // --- 多选状态 ---
        this.inputValue = '';
    }
    /**
     * --- text 的 keydown 事件 ---
     * @param e 键盘事件
     * @returns void
     */
    async keydown(e) {
        if (this.propBoolean('disabled')) {
            return;
        }
        if (e.key === 'Backspace') {
            if (e.target.value === '' && this.propBoolean('multi') && this.value.length > 0) {
                const index = this.value.length - 1;
                const value = this.value[index];
                const event = {
                    'go': true,
                    preventDefault: function () {
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
                    this.value.splice(index, 1);
                    this.label.splice(index, 1);
                    this.listValue = clickgo.tool.clone(this.value);
                    this.updateValue();
                    this.emit('removed', {
                        'detail': event.detail
                    });
                }
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
    async textKeyDown(e) {
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
    /** --- 搜索版本，仅允许最后一次搜索更新结果 --- */
    _searchVersion = 0;
    /** --- 当前搜索中的个数（远程） --- */
    searching = 0;
    /** --- 私有搜索方法 --- */
    async _search(success) {
        if (this._unmounted) {
            return;
        }
        /** --- 当前要搜索的值 --- */
        const searchValue = (this.propBoolean('editable') ? this.inputValue : this.searchValue).trim();
        /** --- 本次搜索版本 --- */
        const searchVersion = ++this._searchVersion;
        // --- loading 只表示当前查询，旧请求未回调不能阻塞新查询或清空输入 ---
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
                this.searchData = [];
                await this.nextTick();
                if (this._unmounted || searchVersion !== this._searchVersion) {
                    return;
                }
                await success?.();
                return;
            }
            ++this.searching;
            let completed = false;
            const event = {
                'detail': {
                    'value': searchValue,
                    'callback': async (data) => {
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
            const mapLabel = this.props.map.label ?? 'label';
            const mapValue = this.props.map.value ?? 'value';
            const searchChars = new Set(searchValue.toLowerCase());
            if (Array.isArray(this.props.data)) {
                // --- Array ---
                this.searchData = [];
                for (const item of this.props.data) {
                    const val = (typeof item === 'object' ? (item[mapValue] ?? item[mapLabel] ?? '') : item).toString().toLowerCase();
                    const lab = (typeof item === 'object' ? (item[mapLabel] ?? '') : '').toString().toLowerCase();
                    let include = true;
                    for (const char of searchChars) {
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
                    this.searchData.push(item);
                }
            }
            else {
                // --- 普通对象 ---
                this.searchData = {};
                for (const key in this.props.data) {
                    const item = this.props.data[key];
                    const val = key.toLowerCase();
                    const lab = (typeof item === 'object' ? (item[mapLabel] ?? '') : item).toString().toLowerCase();
                    let include = true;
                    for (const char of searchChars) {
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
                    this.searchData[key] = item;
                }
            }
            await this.nextTick();
            if (this._unmounted || searchVersion !== this._searchVersion) {
                return;
            }
            this._refreshLabels();
            await success?.();
        }
    }
    // --- search 输入框值变更时 ---
    async updateSearchValue(value) {
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
    // --- text 的值变更事件（只有 editable 时会触发） ----
    async updateInputValue(value) {
        if (this.propBoolean('disabled')) {
            return;
        }
        value = value.trim();
        if (this.propBoolean('editable') && !this.propBoolean('multi')) {
            const event = {
                'go': true,
                preventDefault: function () {
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
        if (this._unmounted || this.inputValue !== value) {
            // --- 等待搜索节流时可能已有更新的输入，旧处理不能再提交当前值或重复通知 ---
            return;
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
        const before = clickgo.tool.clone(this.value);
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
        if (this.propBoolean('editable') && !this.propBoolean('multi')) {
            const event = {
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
    async listItemClicked(e) {
        this.emit('itemclicked', e);
        if (e.detail.arrow) {
            return;
        }
        await this._selectValue(e.detail.value, true);
    }
    // --- list 的相关事件 ---
    onAdd(e) {
        if (!this.propBoolean('multi')) {
            return;
        }
        if (this.propBoolean('search')) {
            // --- 搜索模式下，阻止 list 内部的多选切换，由 select 自行管理 ---
            e.preventDefault();
            return;
        }
        const addIndex = this.value.length;
        const event = {
            'go': true,
            preventDefault: function () {
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
    onRemove(e) {
        if (!this.propBoolean('multi')) {
            return;
        }
        if (this.propBoolean('search')) {
            // --- 搜索模式下，阻止 list 内部的多选切换，由 select 自行管理 ---
            e.preventDefault();
            return;
        }
        const removeIndex = e.detail.index;
        const event = {
            'go': true,
            preventDefault: function () {
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
    onChange(e) {
        if (this.propBoolean('multi')) {
            return;
        }
        if (this.propBoolean('search')) {
            return;
        }
        if (this.propBoolean('editable')) {
            return;
        }
        const event = {
            'go': true,
            preventDefault: function () {
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
    // --- tag 的 label 的点击事件 ---
    tagClick(index) {
        const value = this.value[index];
        const event = {
            'detail': {
                'index': index,
                'value': value
            }
        };
        this.emit('tagclick', event);
    }
    // --- tag 的点击事件 ---
    removeTag(index) {
        if (this.propBoolean('disabled')) {
            return;
        }
        if (this.isMust) {
            if (this.value.length === 1) {
                return;
            }
        }
        const value = this.value[index];
        // --- 判断是否可移除 ---
        const event = {
            'go': true,
            preventDefault: function () {
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
        this.listValue = clickgo.tool.clone(this.value);
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
    tagsWheel(e) {
        if (e.deltaY === 0) {
            return;
        }
        e.preventDefault();
        clickgo.dom.setScrollLeft(this.refs.tags, clickgo.dom.getScrollLeft(this.refs.tags) + e.deltaY);
    }
    async tagdown(e) {
        e.stopPropagation();
        await clickgo.form.doFocusAndPopEvent(e);
    }
    // --- async 模式的加载事件 ---
    onLoad(value, resolve) {
        this.emit('load', value, resolve);
    }
    /** --- 只要 pop 弹出，就要刷新一下 --- */
    onPop() {
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
    _syncModelValue() {
        if (this.propBoolean('editable')) {
            const data = this._getValueData();
            const value = this.props.modelValue.map(item => item.toString());
            if (!this.propBoolean('multi')) {
                value.splice(1);
            }
            const label = value.map(item => {
                const row = data.find(d => d.value === item);
                return row?.label.toString() ?? this.label[this.value.indexOf(item)] ?? item;
            });
            const labelChanged = JSON.stringify(label) !== JSON.stringify(this.label);
            this.value = value;
            this.label = label;
            this.inputValue = this.propBoolean('multi') ? '' : this.value[0] ?? '';
            this.searchValue = '';
            this.listValue = clickgo.tool.clone(this.value);
            if (JSON.stringify(this.value) !== JSON.stringify(this.props.modelValue)) {
                this.emit('update:modelValue', clickgo.tool.clone(this.value));
            }
            if (labelChanged) {
                this.emit('label', clickgo.tool.clone(this.label));
            }
            return;
        }
        // --- 先展开外部值所在的树节点，使 dataGl 包含对应项目 ---
        for (const item of this.props.modelValue) {
            this.refs.list.findFormat(item.toString());
        }
        const data = this._getValueData();
        if (!data.length && !this.propBoolean('remote')) {
            // --- 本地空列表尚不能判定外部值有效性；首批数据到达后再执行本地校验 ---
            this.value = this.props.modelValue.map(item => item.toString());
            if (!this.propBoolean('multi')) {
                this.value.splice(1);
            }
            if (this.label.length) {
                this.label = [];
                this.emit('label', []);
            }
            this.listValue = clickgo.tool.clone(this.value);
            this.listLabel = [];
            this.listItem = [];
            return;
        }
        const selected = [];
        for (const item of this.props.modelValue) {
            const value = item.toString();
            const row = data.find(d => d.value === value);
            if (!row) {
                if (!this.propBoolean('remote')) {
                    continue;
                }
                // --- 远程列表只有当前批次，缺少选项不代表外部值失效，保留已有标签等待补齐 ---
                selected.push({
                    'value': value,
                    'label': this.label[this.value.indexOf(value)] ?? value
                });
            }
            else {
                if (row.disabled || row.control === 'split') {
                    continue;
                }
                selected.push(row);
            }
            if (!this.propBoolean('multi')) {
                break;
            }
        }
        if (!selected.length && this.isMust) {
            const row = data.find(d => !d.disabled && d.control !== 'split');
            if (row) {
                selected.push(row);
            }
        }
        const label = selected.map(item => item.label.toString());
        const labelChanged = JSON.stringify(label) !== JSON.stringify(this.label);
        this.value = selected.map(item => item.value);
        this.label = label;
        this.listValue = clickgo.tool.clone(this.value);
        this.listLabel = clickgo.tool.clone(this.label);
        this.listItem = selected;
        // --- 普通数据刷新只补标签或修正无效值，不重复回写相同的绑定值 ---
        if (JSON.stringify(this.value) !== JSON.stringify(this.props.modelValue)) {
            this.emit('update:modelValue', clickgo.tool.clone(this.value));
        }
        if (labelChanged) {
            this.emit('label', clickgo.tool.clone(this.label));
        }
    }
    /**
     * --- 监听外部值、完整数据和临时搜索结果，分别同步选择与标签 ---
     * @returns void
     */
    onMounted() {
        this.watch('modelValue', async () => {
            if (JSON.stringify(this.value) === JSON.stringify(this.props.modelValue)) {
                return;
            }
            if (this.propBoolean('editable')) {
                // --- 外部值替换输入时，之前按旧输入发出的远程查询已不适用 ---
                ++this._searchVersion;
                this.searching = 0;
                this.searchData = [];
            }
            await this.nextTick();
            if (!this._unmounted && JSON.stringify(this.value) !== JSON.stringify(this.props.modelValue)) {
                this._syncModelValue();
            }
        }, {
            'deep': true
        });
        this._syncModelValue();
        this.watch('search', async () => {
            ++this._searchVersion;
            this.searching = 0;
            this.searchData = [];
            this.searchValue = '';
            await this.nextTick();
            if (this._unmounted) {
                return;
            }
            if (this.propBoolean('editable')) {
                this._refreshLabels();
            }
            else {
                this._syncModelValue();
            }
            if (this.propBoolean('search')) {
                await this._search();
            }
        });
        this.watch('remote', async () => {
            if (this.propBoolean('search')) {
                await this._search();
            }
            await this.nextTick();
            if (!this._unmounted) {
                if (this.propBoolean('editable')) {
                    this._refreshLabels();
                }
                else {
                    this._syncModelValue();
                }
            }
        });
        for (const prop of ['editable', 'multi']) {
            this.watch(prop, async () => {
                ++this._searchVersion;
                this.searching = 0;
                this.searchData = [];
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
        this.watch(() => JSON.stringify(this.props.data), async () => {
            if (this.propBoolean('search') && !this.propBoolean('remote')) {
                await this._search();
            }
            await this.nextTick();
            await clickgo.tool.sleep(0);
            if (this._unmounted) {
                return;
            }
            if (this.propBoolean('editable')) {
                this._refreshLabels();
            }
            else {
                this._syncModelValue();
            }
        });
        this.watch(() => this.refs.list.dataGl, () => {
            if (!this._unmounted) {
                this._refreshLabels();
            }
        }, {
            'deep': true
        });
        this.watch(() => [this.props.map, this.props.disabledList], async () => {
            await this.nextTick();
            if (!this._unmounted) {
                if (this.propBoolean('editable')) {
                    this._refreshLabels();
                }
                else {
                    this._syncModelValue();
                }
            }
        }, {
            'deep': true
        });
    }
    /**
     * --- 卸载时使所有未完成的搜索失效 ---
     * @returns void
     */
    onBeforeUnmount() {
        this._unmounted = true;
        ++this._searchVersion;
        this.searching = 0;
    }
}
