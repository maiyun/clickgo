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
        'clearbtn': false,
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
            'clear': 'Clear',
            'search': 'Search'
        },
        'sc': {
            'clear': '清除',
            'search': '搜索'
        },
        'tc': {
            'clear': '清除',
            'search': '搜尋'
        },
        'ja': {
            'clear': 'クリア',
            'search': '検索'
        },
        'ko': {
            'clear': '지우기',
            'search': '검색'
        },
        'th': {
            'clear': 'ล้าง',
            'search': 'ค้นหา'
        },
        'es': {
            'clear': 'Borrar',
            'search': 'buscar'
        },
        'de': {
            'clear': 'Leeren',
            'search': 'suchen'
        },
        'fr': {
            'clear': 'Effacer',
            'search': 'rechercher'
        },
        'pt': {
            'clear': 'Limpar',
            'search': 'pesquisar'
        },
        'ru': {
            'clear': 'Очистить',
            'search': 'поиск'
        },
        'vi': {
            'clear': 'Xóa',
            'search': 'tìm kiếm'
        },
        'ar': {
            'clear': 'مسح',
            'search': 'بحث'
        },
        'id': {
            'clear': 'Hapus',
            'search': 'cari'
        },
        'it': {
            'clear': 'Cancella',
            'search': 'cerca'
        },
        'tr': {
            'clear': 'Temizle',
            'search': 'ara'
        }
    };
    /** --- 已提交的选中值 --- */
    value = [];
    /** --- 已选值对应的显示标签 --- */
    label = [];
    /** --- 输入框 --- */
    inputValue = '';
    /** --- 搜索输入框 --- */
    searchValue = '';
    /** --- 远程或本地搜索的选项数据 --- */
    searchData = [];
    /** --- 当前远程查询是否等待回调，0 表示空闲，1 表示等待 --- */
    searching = 0;
    /** --- List 当前高亮或勾选的候选值 --- */
    listValue = [];
    /** --- List 候选项的原始标签，提交时统一转成字符串 --- */
    listLabel = [];
    /** --- list 的选中的 item 属性包列表 --- */
    listItem = [];
    /** --- 输入处理版本，等待期间只允许最新的输入提交值 --- */
    _inputVersion = 0;
    /** --- 搜索版本，仅允许最后一次搜索更新结果 --- */
    _searchVersion = 0;
    /** --- 卸载后不再接收延迟搜索或远程回调 --- */
    _unmounted = false;
    /** --- 上一次已同步的外部 modelValue 快照，用于区分外部更新与非受控内部状态 --- */
    _lastModelValue = [];
    /** --- list 是否为必须选择的模式 --- */
    get isMust() {
        return !this.propBoolean('clearbtn') && !this.propBoolean('editable') &&
            !this.propBoolean('search') && !this.propBoolean('multi');
    }
    /** --- list 是否多选 --- */
    get listMulti() {
        // --- 输入模式只高亮候选项；非输入模式的多选列表负责回显多个已选项 ---
        return !this.propBoolean('editable') && this.propBoolean('multi');
    }
    /** --- 判断是输入框模式还是 label 模式 --- */
    get labelMode() {
        return !this.propBoolean('multi') && !this.propBoolean('editable');
    }
    /** --- 传递给 List 的数据 --- */
    get dataComp() {
        if (!this.propBoolean('search')) {
            return this.props.data;
        }
        return this._searchText ? this.searchData : this.props.data;
    }
    /** --- 当前搜索文本，输入模式使用编辑框，其余模式使用搜索框 --- */
    get _searchText() {
        return (this.propBoolean('editable') ? this.inputValue : this.searchValue).trim();
    }
    // --- 公共操作 ---
    /**
     * --- 向上同步已选值和标签，并按需清空候选值或输入 ---
     * @param opt 清空列表选择或输入框的选项
     * @returns void
     */
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
     * --- 清空已选值、标签和输入，取消尚未完成的搜索或输入提交 ---
     * 禁用、必须选择或已卸载时不处理；change 可取消整次清除。
     * @returns void
     */
    clear() {
        if (this._unmounted || this.propBoolean('disabled') || this.isMust ||
            !this.value.length && !this.inputValue && !this.searchValue) {
            return;
        }
        const before = clickgo.tool.clone(this.value);
        if (before.length && !this._emitCancellable('change', {
            'value': []
        })) {
            return;
        }
        /** --- 按钮清除后会消失，把键盘焦点留在选择框 --- */
        const restoreFocus = this.element.contains(this.element.ownerDocument.activeElement);
        ++this._inputVersion;
        this._resetSearch();
        this.value = [];
        this.label = [];
        this.listValue = [];
        this.listLabel = [];
        this.inputValue = '';
        this.searchValue = '';
        if (before.length) {
            this.updateValue();
            this.emit('changed', {
                'detail': { 'before': before, 'value': [] }
            });
        }
        this.refs.gs.hidePop();
        if (restoreFocus) {
            this.refs.gs.element.focus();
        }
    }
    // --- 基础辅助与数据同步 ---
    /**
     * --- 比较有序的值或标签，保留数字与字符串的区别以完成绑定值规范化 ---
     * @param a 当前数组
     * @param b 对比数组
     * @returns 元素和顺序是否一致
     */
    _equalValues(a, b) {
        return a.length === b.length && a.every((value, index) => value === b[index]);
    }
    /**
     * --- 触发可取消的操作前事件 ---
     * @param name 事件名
     * @param detail 事件载荷
     * @returns 是否未被 preventDefault 阻止
     */
    _emitCancellable(name, detail) {
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': detail
        };
        this.emit(name, event);
        return event.go;
    }
    /**
     * --- 读取原始选项的值和标签；字典选项始终以键作为值 ---
     * @param item 原始选项
     * @param key 字典选项的键，数组选项不传
     * @returns 字符串形式的值和标签
     */
    _getOptionText(item, key) {
        if (typeof item !== 'object' || item === null) {
            const text = String(item);
            return {
                'value': key ?? text,
                'label': text
            };
        }
        const data = item;
        const mapLabel = this.props.map.label ?? 'label';
        const mapValue = this.props.map.value ?? 'value';
        const value = key ?? String(data[mapValue] ?? data[mapLabel] ?? '');
        return {
            'value': value,
            'label': String(data[mapLabel] ?? value)
        };
    }
    /**
     * --- 获取校验外部值所需的选项，搜索结果不能代替完整的本地数据 ---
     * @returns 格式化选项，远程模式优先使用当前结果中的标签
     */
    _getValueData() {
        const listData = this.refs.list.dataGl;
        if (!this.propBoolean('search') || !this._searchText) {
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
        if (this._equalValues(label, this.label)) {
            return;
        }
        this.label = label;
        this.emit('label', clickgo.tool.clone(this.label));
    }
    /**
     * --- 添加标签后将横向滚动位置移至末尾，确保新选标签立即可见 ---
     * @returns void
     */
    _scrollTagsToEnd() {
        this.nextTick().then(() => {
            const tags = this.refs.tags;
            if (!this._unmounted && tags && typeof clickgo.dom.setScrollInlineOffset === 'function') {
                clickgo.dom.setScrollInlineOffset(tags, tags.scrollWidth);
            }
        }).catch(() => { });
    }
    /**
     * --- 同步控件选择；仅在首次挂载或外部 modelValue 变化时采用外部值，其余属性切换保留当前内部选择 ---
     * @param fromModelValue 是否由初始挂载或 modelValue 变更触发
     * @returns void
     */
    _syncModelValue(fromModelValue = false) {
        const multi = this.propBoolean('multi');
        const remote = this.propBoolean('remote');
        const modelChanged = fromModelValue || !this._equalValues(this.props.modelValue, this._lastModelValue);
        const source = modelChanged ? this.props.modelValue : this.value;
        this._lastModelValue = clickgo.tool.clone(this.props.modelValue);
        const modelValue = source.map(item => item.toString());
        let value;
        let label;
        if (this.propBoolean('editable')) {
            const data = this._getValueData();
            value = multi ? modelValue : modelValue.slice(0, 1);
            label = value.map(item => {
                const row = data.find(d => d.value === item);
                return row?.label.toString() ?? this.label[this.value.indexOf(item)] ?? item;
            });
            this.inputValue = multi ? '' : value[0] ?? '';
            this.searchValue = '';
            // --- 初始值和外部赋值不会触发输入事件，本地搜索需同步重建候选项 ---
            if (this.propBoolean('search') && !remote) {
                this.searchData = this._searchText ? this._filterData(this._searchText) : [];
            }
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
            const selected = [];
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
        const valueChanged = !this._equalValues(value, this.value);
        const labelChanged = !this._equalValues(label, this.label);
        this.value = value;
        this.label = label;
        this.listValue = clickgo.tool.clone(this.value);
        // --- 仅在外部值被规范化/修正或内部值发生裁剪/回退时回写，避免普通数据刷新重复 emit ---
        if (modelChanged ? !this._equalValues(this.value, this.props.modelValue) : valueChanged) {
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
    _refreshSelection() {
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
    _resetSearch() {
        ++this._searchVersion;
        this.searching = 0;
        this.searchData = [];
    }
    // --- 统一选择变更 ---
    /**
     * --- 添加多选项，统一执行取消校验、值与标签更新、列表同步及完成通知 ---
     * @param value 要添加的值
     * @param label 对应显示标签，省略时回退为 value
     * @param opt 输入清空与候选列表同步策略
     * @returns 是否完成添加，false 表示操作被取消
     */
    _addValue(value, label, opt = {}) {
        const detail = {
            'index': this.value.length,
            'value': value
        };
        if (!this._emitCancellable('add', detail)) {
            return false;
        }
        this.value.push(value);
        this.label.push(label ?? value);
        if (opt.syncList === 'sync') {
            this.listValue = clickgo.tool.clone(this.value);
        }
        this.updateValue({
            'clearInput': opt.clearInput,
            'clearList': opt.syncList === 'clear'
        });
        this.emit('added', {
            'detail': detail
        });
        this._scrollTagsToEnd();
        return true;
    }
    /**
     * --- 移除已选项，统一执行取消校验、值和标签更新及完成通知 ---
     * @param index 已选项索引
     * @param mode 移除入口
     * @param value 移除的值，List 入口使用事件中的值
     * @param syncList 是否由 Select 主动把剩余已选项回写给 List
     * @returns 是否完成移除，false 表示操作被取消
     */
    _removeValue(index, mode, value = this.value[index], syncList = mode !== 'list') {
        const detail = {
            'index': index,
            'value': value,
            'mode': mode
        };
        if (!this._emitCancellable('remove', detail)) {
            return false;
        }
        this.value.splice(index, 1);
        this.label.splice(index, 1);
        if (syncList) {
            this.listValue = clickgo.tool.clone(this.value);
        }
        this.updateValue();
        this.emit('removed', {
            'detail': detail
        });
        return true;
    }
    /**
     * --- 提交单选值，统一校验并发送 change / changed ---
     * @param value 目标选项值
     * @param row 匹配到的选项行
     * @param fromList 是否来自 List 点击
     * @returns 是否允许后续收起弹出层
     */
    _selectSingle(value, row, fromList) {
        const editable = this.propBoolean('editable');
        const search = this.propBoolean('search');
        if (this.value.length === 1 && this.value[0] === value) {
            if (search && !editable) {
                this.searchValue = '';
            }
            return true;
        }
        const before = clickgo.tool.clone(this.value);
        // --- 普通 List 单选已在 onChange 校验，搜索与输入模式在提交时校验 ---
        if ((editable || search || !fromList) && !this._emitCancellable('change', {
            'value': [value]
        })) {
            return false;
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
        return true;
    }
    /**
     * --- 提交鼠标或回车选中的值，统一分派多选与单选 ---
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
            // --- 普通 List 多选由 onAdd/onRemove 处理；单选被 List 拒绝时不能从点击事件再次提交 ---
            if (multi || fromList && !this.listValue.includes(value)) {
                return;
            }
        }
        if (multi) {
            const existingIndex = this.value.indexOf(value);
            if (!editable) {
                // --- 多选+搜索与普通多选一致：支持点击切换勾选并保持下拉展开，保留当前搜索词便于连续挑选 ---
                if (existingIndex === -1) {
                    this._addValue(value, row?.label.toString(), { 'syncList': 'sync' });
                }
                else {
                    this._removeValue(existingIndex, 'list', value, true);
                }
                return;
            }
            if (existingIndex === -1) {
                if (!this._addValue(value, row?.label.toString(), { 'clearInput': true, 'syncList': 'clear' })) {
                    return;
                }
            }
            else {
                this.inputValue = '';
            }
            if (search) {
                await this._search();
            }
            return;
        }
        if (!this._selectSingle(value, row, fromList)) {
            return;
        }
        this.refs.gs.hidePop();
        if (search && !editable) {
            await this._search();
        }
    }
    // --- 搜索、输入与键盘交互 ---
    /**
     * --- 按字符集合匹配本地选项，保留原始选项结构和字典键 ---
     * @param searchValue 搜索文本
     * @returns 筛选后的原始数据
     */
    _filterData(searchValue) {
        const searchChars = [...new Set(searchValue.toLowerCase())];
        const matches = (item, key) => {
            const row = this._getOptionText(item, key);
            const value = row.value.toLowerCase();
            const label = row.label.toLowerCase();
            return searchChars.every(char => value.includes(char) || label.includes(char));
        };
        if (Array.isArray(this.props.data)) {
            return this.props.data.filter(item => matches(item));
        }
        const data = {};
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
    async _search(success) {
        if (this._unmounted) {
            return;
        }
        const searchValue = this._searchText;
        const searchVersion = ++this._searchVersion;
        const isCurrent = () => !this._unmounted && searchVersion === this._searchVersion;
        // --- 等待状态只属于当前查询，旧请求未回调不能阻塞新查询或清空输入 ---
        this.searching = 0;
        if (this.propBoolean('remote')) {
            this.searchData = [];
            await clickgo.tool.sleep(this.propInt('remoteDelay'));
            if (!isCurrent()) {
                return;
            }
            if (searchValue === '') {
                await this.nextTick();
                if (isCurrent()) {
                    await success?.();
                }
                return;
            }
            this.searching = 1;
            let completed = false;
            this.emit('remote', {
                'detail': {
                    'value': searchValue,
                    'callback': async (data) => {
                        if (completed) {
                            return;
                        }
                        completed = true;
                        if (!isCurrent()) {
                            return;
                        }
                        this.searching = 0;
                        this.searchData = data ? clickgo.tool.clone(data) : [];
                        await this.nextTick();
                        if (!isCurrent()) {
                            return;
                        }
                        this._refreshLabels();
                        await success?.();
                    }
                }
            });
            return;
        }
        await this.nextTick();
        if (!isCurrent()) {
            return;
        }
        this.searchData = searchValue === '' ? [] : this._filterData(searchValue);
        await this.nextTick();
        if (!isCurrent()) {
            return;
        }
        if (searchValue !== '') {
            this._refreshLabels();
        }
        await success?.();
    }
    /**
     * --- 更新非编辑模式的搜索文本，搜索结束后同步候选值 ---
     * @param value 搜索输入框的值
     * @returns void
     */
    async updateSearchValue(value) {
        if (this.propBoolean('disabled')) {
            return;
        }
        this.searchValue = value.trim();
        await this._search(() => {
            this.listValue = !this.propBoolean('multi') && this.searchValue
                ? [this.searchValue]
                : clickgo.tool.clone(this.value);
        });
    }
    /**
     * --- 校验编辑框输入，等待候选标签后提交仍有效的单选值 ---
     * @param value 编辑框的值
     * @returns void
     */
    async updateInputValue(value) {
        if (this._unmounted || this.propBoolean('disabled')) {
            return;
        }
        value = value.trim();
        const editable = this.propBoolean('editable');
        const multi = this.propBoolean('multi');
        if (editable && !multi && !this._emitCancellable('change', {
            'value': [value]
        })) {
            return;
        }
        const inputVersion = ++this._inputVersion;
        this.inputValue = value;
        if (this.propBoolean('search')) {
            if (this.element.dataset.cgPopOpen === undefined) {
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
        if (multi) {
            // --- 多选状态不立即提交，等待用户点选或回车 ---
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
            this.emit('changed', {
                'detail': {
                    'before': before,
                    'value': clickgo.tool.clone(this.value)
                }
            });
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
        if (this.propBoolean('multi')) {
            this.inputValue = '';
            return;
        }
        if (this.inputValue === this.listValue[0]) {
            return;
        }
        const input = this.inputValue.toLowerCase();
        const data = this.dataComp;
        const entries = Array.isArray(data)
            ? data.map(item => [item, undefined])
            : Object.entries(data).map(([key, item]) => [item, key]);
        for (const [item, key] of entries) {
            const row = this._getOptionText(item, key);
            if (row.value.toLowerCase() === input || row.label.toLowerCase() === input) {
                await this._selectValue(row.value);
                return;
            }
        }
    }
    /**
     * --- 编辑框的键盘事件，支持退格删除标签、回车新建与展开下拉 ---
     * @param e 键盘事件
     * @returns void
     */
    async keydown(e) {
        if (this.propBoolean('disabled')) {
            return;
        }
        if (e.key === 'Backspace') {
            if (e.target.value === '' && this.propBoolean('multi') && this.value.length > 0) {
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
    // --- 子控件与标签事件 ---
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
    /**
     * --- 接收普通多选 List 的添加请求并提交选择 ---
     * @param e List 添加事件
     * @returns void
     */
    onAdd(e) {
        if (!this.propBoolean('multi')) {
            return;
        }
        if (this.propBoolean('search')) {
            // --- 搜索模式下阻止 List 内部的多选切换，由 _selectValue 统一管理 ---
            e.preventDefault();
            return;
        }
        const result = this.refs.list.findFormat(e.detail.value, false);
        const label = result?.[e.detail.value]?.label?.toString();
        if (!this._addValue(e.detail.value, label, { 'syncList': 'keep' })) {
            e.preventDefault();
        }
    }
    /**
     * --- 处理 List 的取消选择，并将 Select 的取消结果传回 List ---
     * @param e List 移除事件
     * @returns void
     */
    onRemove(e) {
        if (!this.propBoolean('multi')) {
            return;
        }
        if (this.propBoolean('search')) {
            // --- 搜索模式下阻止 List 内部的多选切换，由 _selectValue 统一管理 ---
            e.preventDefault();
            return;
        }
        if (!this._removeValue(e.detail.index, 'list', e.detail.value, false)) {
            e.preventDefault();
        }
    }
    /**
     * --- 将普通单选 List 的操作前校验传递给 Select ---
     * @param e List 变更事件
     * @returns void
     */
    onChange(e) {
        if (this.propBoolean('multi') || this.propBoolean('search') || this.propBoolean('editable')) {
            return;
        }
        if (!this._emitCancellable('change', {
            'value': e.detail.value
        })) {
            e.preventDefault();
        }
    }
    /**
     * --- 通知已选标签被点击 ---
     * @param index 标签索引
     * @returns void
     */
    tagClick(index) {
        this.emit('tagclick', {
            'detail': {
                'index': index,
                'value': this.value[index]
            }
        });
    }
    /**
     * --- 关闭标签时移除对应已选项 ---
     * @param index 标签索引
     * @returns void
     */
    removeTag(index) {
        if (this.propBoolean('disabled') || this.isMust && this.value.length === 1) {
            return;
        }
        this._removeValue(index, 'tag');
    }
    /**
     * --- 将标签区域的纵向滚轮转换为横向滚动 ---
     * @param e 滚轮事件
     * @returns void
     */
    tagsWheel(e) {
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
    async tagdown(e) {
        e.stopPropagation();
        await clickgo.form.doFocusAndPopEvent(e);
    }
    /**
     * --- 转发树形列表的异步子项加载请求 ---
     * @param value 父项的值
     * @param resolve List 的加载回调，沿用支持自定义映射和附加字段的开放子项类型
     * @returns void
     */
    onLoad(value, resolve) {
        this.emit('load', value, resolve);
    }
    /**
     * --- 弹出时刷新列表位置，并回显搜索多选的已选项 ---
     * @returns void
     */
    onPop() {
        this.refs.list.refreshOffset();
        if (this.listMulti && this.propBoolean('search')) {
            this.listValue = clickgo.tool.clone(this.value);
        }
    }
    // --- 生命周期 ---
    /**
     * --- 监听外部值、完整数据和临时搜索结果，分别同步选择与标签 ---
     * @returns void
     */
    onMounted() {
        this.watch('modelValue', async () => {
            if (this._equalValues(this.value, this.props.modelValue)) {
                this._lastModelValue = clickgo.tool.clone(this.props.modelValue);
                return;
            }
            if (this.propBoolean('editable')) {
                // --- 外部值替换输入时，先取消等待中的输入提交和远程查询 ---
                ++this._inputVersion;
                this._resetSearch();
            }
            await this.nextTick();
            if (!this._unmounted && !this._equalValues(this.value, this.props.modelValue)) {
                this._syncModelValue(true);
            }
        }, {
            'deep': true
        });
        this._syncModelValue(true);
        this.watch('search', async () => {
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
        this.watch('remote', async () => {
            if (this.propBoolean('search')) {
                await this._search();
            }
            await this.nextTick();
            if (!this._unmounted) {
                this._refreshSelection();
            }
        });
        for (const prop of ['editable', 'multi', 'clearbtn']) {
            this.watch(prop, async () => {
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
        this.watch(() => JSON.stringify(this.props.data), async () => {
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
                this._refreshSelection();
            }
        }, {
            'deep': true
        });
    }
    /**
     * --- 卸载时使所有未完成的输入和搜索失效 ---
     * @returns void
     */
    onBeforeUnmount() {
        this._unmounted = true;
        ++this._inputVersion;
        this._resetSearch();
    }
}
