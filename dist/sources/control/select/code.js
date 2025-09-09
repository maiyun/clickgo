import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
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
        this.props = {
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
            'padding': undefined,
            'leftlabel': true,
            'modelValue': [],
            'placeholder': '',
            'data': [],
            'disabledList': [],
            'unavailableList': []
        };
        /** --- 语言包 --- */
        this.localeData = {
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
        this.value = [];
        this.label = [];
        /** --- 输入框 --- */
        this.inputValue = '';
        /** --- 搜索输入框 --- */
        this.searchValue = '';
        /** --- 远程或本地 search 结果的 list --- */
        this.searchData = [];
        /** --- list 的选中值 --- */
        this.listValue = [];
        /** --- list 的选中的 label --- */
        this.listLabel = [];
        /** --- list 的选中的 item 属性包列表 --- */
        this.listItem = [];
        /** --- pop 的 loading --- */
        this.loading = 0;
        /** --- 当前需要发起请求的次数 --- */
        this._needSearch = 0;
        /** --- 当前搜索中的个数（远程） --- */
        this.searching = 0;
    }
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
            // --- 输入模式的 list 必定不是 must ---
            return false;
        }
        if (this.propBoolean('search')) {
            // --- 搜索模式的 list 必定不是 must ---
            return false;
        }
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
    /** --- text 的失去焦点事件 --- */
    blur() {
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
                    if (typeof item === 'string') {
                        label = item;
                        value = item;
                    }
                    else {
                        label = item.label ?? item.value ?? '';
                        value = item.value ?? item.label ?? '';
                    }
                    // --- 判断是否在忽略大小写的情况下 value 相等 ---
                    if ((value.toLowerCase() === this.inputValue.toLowerCase()) ||
                        (label.toLowerCase() === this.inputValue.toLowerCase())) {
                        this.inputValue = value;
                        this.value = [value];
                        this.label = [label];
                        this.listValue = [this.inputValue];
                        this.updateValue();
                        return;
                    }
                }
            }
            else {
                for (const key in this.dataComp) {
                    const label = typeof this.dataComp[key] === 'string' ? this.dataComp[key] :
                        (this.dataComp[key].label ?? key ?? '');
                    const value = key;
                    if ((value.toLowerCase() === this.inputValue.toLowerCase()) ||
                        (label.toLowerCase() === this.inputValue.toLowerCase())) {
                        this.inputValue = value;
                        this.value = [value];
                        this.label = [label];
                        this.listValue = [this.inputValue];
                        this.updateValue();
                        return;
                    }
                }
            }
            return;
        }
        // --- 多选状态 ---
        this.inputValue = '';
    }
    /** --- text 的 keydown 事件 --- */
    async keydown(e) {
        if (e.key === 'Backspace') {
            if (this.propBoolean('multi')) {
                // --- 判断是否删除其他 tag ---
                if (e.target.value === '' && this.propBoolean('multi') && this.value.length > 0) {
                    const index = this.value.length - 1;
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
                this.refs.gs.hidePop();
                return;
            }
            // --- 判断是否允许新增项 ---
            const addIndex = this.value.length;
            const event = {
                'go': true,
                preventDefault: function () {
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
                this.label.push(this.listLabel[0] ?? this.inputValue);
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
    async textKeyDown(e) {
        e.stopPropagation(); // --- 放置响应到 greatselect 的 mode:text enter 导致收不起来 ---
        if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && this.element.dataset.cgPopOpen !== undefined) {
            // --- 要键盘上下选择 ---
            e.preventDefault(); // --- 用来防止光标依浏览器原生要求移动 ---
            switch (e.key) {
                case 'ArrowUp': {
                    this.refs.list.arrowUp();
                    this.inputValue = this.listValue[0] ?? '';
                    this.searchValue = this.listValue[0] ?? '';
                    break;
                }
                default: {
                    this.refs.list.arrowDown();
                    this.inputValue = this.listValue[0] ?? '';
                    this.searchValue = this.listValue[0] ?? '';
                }
            }
            await this.updateInputValue(this.propBoolean('editable') ? this.inputValue : this.searchValue);
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
                    this.refs.gs.hidePop();
                    return;
                }
                if (this.value.includes(value)) {
                    this.inputValue = '';
                    this.refs.gs.hidePop();
                    return;
                }
                // --- 判断是否允许新增项 ---
                const addIndex = this.value.length;
                const event = {
                    'go': true,
                    preventDefault: function () {
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
                    this.label.push(this.listLabel[0] ?? value);
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
                    this.refs.gs.hidePop();
                    if (this.propBoolean('search')) {
                        await this._search();
                    }
                }
            }
            else {
                // --- 单选 ---
                if (!value) {
                    this.refs.gs.hidePop();
                    return;
                }
                this.value = [value];
                this.listValue = [value];
                await this.nextTick();
                this.label = [this.listLabel[0] ?? value];
                this.updateValue();
                this.refs.gs.hidePop();
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
                    this.refs.gs.hidePop();
                    await this._search();
                    return;
                }
                if (!this.listValue[0]) {
                    this.searchValue = '';
                    this.refs.gs.hidePop();
                    await this._search();
                    return;
                }
                // --- 判断是否允许新增项 ---
                const addIndex = this.value.length;
                const event = {
                    'go': true,
                    preventDefault: function () {
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
                    this.label.push(this.listLabel[0] ?? '');
                    this.searchValue = '';
                    this.updateValue();
                    this.emit('added', {
                        'detail': {
                            'index': addIndex,
                            'value': value
                        }
                    });
                    this.refs.gs.hidePop();
                    await this._search();
                }
            }
            else {
                // --- 单选 ---
                if (!this.listValue[0]) {
                    this.searchValue = '';
                    this.refs.gs.hidePop();
                    await this._search();
                    return;
                }
                this.value = [this.listValue[0] ?? ''];
                this.label = [this.listLabel[0] ?? ''];
                this.searchValue = '';
                this.updateValue();
                this.refs.gs.hidePop();
                await this._search();
            }
        }
    }
    /** --- 私有搜索方法 --- */
    async _search(success) {
        /** --- 当前要搜索的值 --- */
        const searchValue = (this.propBoolean('editable') ? this.inputValue : this.searchValue).trim();
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
                this.searchData = [];
                await this.nextTick();
                await success?.();
                return;
            }
            ++this.searching;
            const event = {
                'detail': {
                    'value': searchValue,
                    'callback': async (data) => {
                        --this.searching;
                        this.searchData = data ? clickgo.tool.clone(data) : [];
                        await this.nextTick();
                        await success?.();
                    }
                }
            };
            this.emit('remote', event);
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
                this.searchData = [];
                await this.nextTick();
                await success?.();
                return;
            }
            if (Array.isArray(this.props.data)) {
                // --- Array ---
                this.searchData = [];
                for (const item of this.props.data) {
                    const val = (typeof item === 'object' ? item.value ?? '' : item).toString().toLowerCase();
                    const lab = (typeof item === 'object' ? item.label ?? '' : '').toLowerCase();
                    let include = true;
                    for (const char of searchValue) {
                        const c = char.toLowerCase();
                        if (val.includes(c) || lab.includes(c)) {
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
                    const lab = '';
                    let include = true;
                    for (const char of searchValue) {
                        const c = char.toLowerCase();
                        if (val.includes(c) || lab.includes(c)) {
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
            await success?.();
        }
    }
    // --- search 输入框值变更时 ---
    async updateSearchValue(value) {
        // --- 只有 search 并且非 editable 时会触发 ---
        this.searchValue = value.trim();
        await this._search(() => {
            this.listValue = [this.searchValue];
        });
    }
    // --- text 的值变更事件（只有 editable 时会触发） ----
    async updateInputValue(value) {
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
                    'value': [value]
                }
            };
            this.emit('changed', event);
        }
    }
    /** --- list 上的点击事件 --- */
    async listItemClicked(e) {
        const event = {
            'detail': {
                'event': e.detail.event,
                'value': e.detail.value,
                'arrow': e.detail.arrow
            }
        };
        this.emit('itemclicked', event);
        if (this.propBoolean('editable')) {
            const v = this.listValue[0] ?? '';
            // -- 可编辑 ---
            if (this.propBoolean('multi')) {
                // --- 多选 ---
                if (this.value.includes(v)) {
                    this.refs.gs.hidePop();
                    return;
                }
                // --- 判断是否允许新增项 ---
                const addIndex = this.value.length;
                const event = {
                    'go': true,
                    preventDefault: function () {
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
                    this.label.push(this.listLabel[0] ?? '');
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
                        this.refs.gs.hidePop();
                        await this._search();
                    }
                    else {
                        this.refs.gs.hidePop();
                    }
                }
            }
            else {
                // --- 单选，可能已经实时添加了 ---
                if (this.inputValue !== v) {
                    const event = {
                        'go': true,
                        preventDefault: function () {
                            this.go = false;
                        },
                        'detail': {
                            'value': [v]
                        }
                    };
                    this.emit('change', event);
                    if (event.go) {
                        this.inputValue = v;
                        const before = clickgo.tool.clone(this.value);
                        this.value = [v];
                        this.label = [this.listLabel[0] ?? ''];
                        this.updateValue();
                        if (this.propBoolean('search')) {
                            await this._search();
                        }
                        const event = {
                            'detail': {
                                'before': before,
                                'value': [v]
                            }
                        };
                        this.emit('changed', event);
                    }
                }
                this.refs.gs.hidePop();
            }
        }
        else {
            // --- 不可编辑 ---
            if (this.propBoolean('multi')) {
                // --- 多选 ---
                if (this.propBoolean('search')) {
                    if (this.value.includes(this.listValue[0] ?? '')) {
                        this.refs.gs.hidePop();
                        this.searchValue = '';
                        await this._search();
                        return;
                    }
                    // --- 判断是否允许新增项 ---
                    const addIndex = this.value.length;
                    const event = {
                        'go': true,
                        preventDefault: function () {
                            this.go = false;
                        },
                        'detail': {
                            'index': addIndex,
                            'value': this.listValue[0] ?? ''
                        }
                    };
                    this.emit('add', event);
                    if (event.go) {
                        this.value.push(this.listValue[0] ?? '');
                        this.label.push(this.listLabel[0] ?? '');
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
                        this.refs.gs.hidePop();
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
                const before = clickgo.tool.clone(this.value);
                this.value = [this.listValue[0] ?? ''];
                this.label = [this.listLabel[0] ?? ''];
                if (this.propBoolean('search')) {
                    this.updateValue({
                        'clearInput': true
                    });
                    this.refs.gs.hidePop();
                    await this._search();
                }
                else {
                    this.updateValue();
                    this.refs.gs.hidePop();
                }
                const event = {
                    'detail': {
                        'before': before,
                        'value': this.value
                    }
                };
                this.emit('changed', event);
            }
        }
    }
    // --- list 的相关事件 ---
    onAdd(e) {
        if (!this.propBoolean('multi')) {
            return;
        }
        if (this.propBoolean('search')) {
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
        this.label.push(result?.[e.detail.value].label ?? 'error');
        this.updateValue();
        this.emit('added', event);
    }
    onRemove(e) {
        if (!this.propBoolean('multi')) {
            return;
        }
        if (this.propBoolean('search')) {
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
        this.refs.tags.scrollLeft += e.deltaY;
    }
    async tagdown(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
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
    }
    onMounted() {
        let mvimmediate = true;
        this.watch('modelValue', async () => {
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
                    this.label = [result?.[this.inputValue] ? result[this.inputValue].label : this.inputValue];
                    this.listValue = [this.inputValue];
                    this.updateValue();
                    return;
                }
                // --- 没传值 ---
                this.value.length = 0;
                this.label.length = 0;
                this.updateValue({
                    'clearInput': true,
                    'clearList': true
                });
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
        this.watch('editable', async () => {
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
        // --- 监听 mulit ---
        this.watch('multi', () => {
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
        // --- 监听 data 变动 ---
        this.watch(() => JSON.stringify(this.props.data), async (n, o) => {
            if (n === o) {
                return;
            }
            if (this.propBoolean('editable')) {
                // --- 当前是输入模式 ---
                await this._search();
                if (this.propBoolean('multi')) {
                    // --- 多选模式，不管 ---
                    return;
                }
                this.listValue = this.value;
                await this.nextTick();
                // --- 单选模式 ---
                // if (this.value[0] !== this.listValue[0]) {
                //     return;
                // }
                if (this.label[0] === this.listLabel[0]) {
                    return;
                }
                if (this.listValue.length) {
                    this.label = clickgo.tool.clone(this.listLabel);
                }
                else {
                    this.label[0] = this.value[0];
                }
                this.emit('label', clickgo.tool.clone(this.label));
                return;
            }
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
        });
    }
}
