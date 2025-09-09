import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'label': null,
            'load': null,
            'loaded': null,
            /** --- modelValue 变更时同步提交所有层级的 level value/label 值 --- */
            'level': null,
            'update:modelValue': null
        };
        this.props = {
            'disabled': false,
            'async': false,
            'plain': false,
            'virtual': false,
            'map': {},
            'padding': undefined,
            'modelValue': '',
            'placeholder': '',
            'data': []
        };
        // --- 本地使用 ---
        this.localeData = {
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
        this.level = 0;
        this.value = [];
        this.label = [];
        /** --- 输入框 --- */
        this.inputValue = '';
        /** --- list 的选中值 --- */
        this.listValue = [];
        /** --- list 的选中的 label --- */
        this.listLabel = [];
        /** --- select 框框的 loading --- */
        this.oploading = false;
        /** --- pop 的 loading --- */
        this.loading = false;
        /** --- 已经装载的每层的数据列表 --- */
        this.lists = [
            []
        ];
        /** --- 当前层级的 list，含 children --- */
        this.nowlist = [];
        /** --- 要提交的 level data --- */
        this.levelData = [
            {
                'label': '',
                'value': ''
            }
        ];
        this._fvid = {
            'level': 0,
            'value': [],
            'label': [],
            'lists': [],
            'levelData': []
        };
    }
    // --- 传递给 list 的 data ---
    get nowlistComp() {
        if (this.inputValue === '') {
            return this.nowlist;
        }
        const inputValue = this.inputValue.toLowerCase();
        const searchData = [];
        for (const item of this.nowlist) {
            const val = (typeof item === 'object' ? item.value ?? '' : item).toString().toLowerCase();
            const lab = (typeof item === 'object' ? item.label ?? '' : '').toLowerCase();
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
            searchData.push(item);
        }
        return searchData;
    }
    /** --- 向上更新值 --- */
    updateValue() {
        const event = {
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
        const newval = this.value[this.value.length - 2];
        if (this.props.modelValue === newval) {
            return;
        }
        this.emit('update:modelValue', newval);
    }
    /** --- 两个函数共用的处理函数，返回 false 代表确实没有下级 --- */
    async _findValueInDataAndSelectValueCheckChildren(nextChildren, autoUpdate = true, hidePop = false) {
        if (!nextChildren) {
            // --- 选中但无下级 ---
            if (!this.propBoolean('async')) {
                // --- 无下层，啥也不管 ---
                if (hidePop) {
                    clickgo.form.hidePop();
                }
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
            const children = await new Promise((resolve) => {
                this.emit('load', this.value[this.level], (children) => {
                    resolve(children);
                    this.emit('loaded');
                });
            });
            this.loading = false;
            if (!children?.length) {
                // --- 真的没下层，结束 ---
                if (hidePop) {
                    clickgo.form.hidePop();
                }
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
    /** --- 搜索所有层级中，value 在哪里 --- */
    async findValueInData(value, data) {
        if (!data) {
            data = this.props.data;
            this._fvid.level = 0;
            this._fvid.value = [''];
            this._fvid.label = [''];
            this._fvid.lists = [data];
            this._fvid.levelData = [{
                    'label': '',
                    'value': ''
                }];
        }
        /** --- 已选 item 的下一层 list --- */
        let nextChildren = null;
        const isArray = Array.isArray(data);
        for (const key in data) {
            const item = data[key];
            const val = (isArray ?
                (typeof item === 'object' ? (item.value ?? item.label ?? '') : item) :
                key).toString();
            if (value !== val) {
                if (!item.children) {
                    continue;
                }
                this._fvid.value[this._fvid.level] = val;
                this._fvid.label[this._fvid.level] = item.label ?? val;
                this._fvid.lists[this._fvid.level] = data;
                this._fvid.levelData[this._fvid.level] = {
                    'value': this._fvid.value[this._fvid.level],
                    'label': this._fvid.label[this._fvid.level]
                };
                ++this._fvid.level;
                if (await this.findValueInData(value, item.children)) {
                    return true;
                }
                this._fvid.value.splice(-1);
                this._fvid.label.splice(-1);
                this._fvid.lists.splice(-1);
                this._fvid.levelData.splice(-1);
                --this._fvid.level;
                continue;
            }
            // --- 找到了 ---
            nextChildren = item.children ?? null;
            this.level = this._fvid.level;
            this._fvid.value[this._fvid.level] = val;
            this._fvid.label[this._fvid.level] = item.label ?? val;
            this._fvid.lists[this._fvid.level] = data;
            this._fvid.levelData[this._fvid.level] = {
                'value': this._fvid.value[this._fvid.level],
                'label': this._fvid.label[this._fvid.level]
            };
            this.value = this._fvid.value;
            this.label = this._fvid.label;
            this.lists = this._fvid.lists;
            this.levelData = this._fvid.levelData;
            await this._findValueInDataAndSelectValueCheckChildren(nextChildren);
            return true;
        }
        return false;
    }
    /** --- text 的失去焦点事件 --- */
    async blur() {
        await clickgo.tool.sleep(350);
        this.inputValue = '';
    }
    /** --- text 的 keydown 事件 --- */
    async keydown(e) {
        if (e.key === 'Backspace') {
            if (this.level > 0) {
                // --- 判断是否返回上级 ---
                if (e.target.value === '') {
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
    updateInputValue(value) {
        this.inputValue = value.trim();
        this.listValue = [this.inputValue];
        if ((this.inputValue !== '') && (this.element.dataset.cgPopOpen === undefined)) {
            this.refs.gs.showPop();
            return;
        }
    }
    /** --- 将一个对象克隆，并设置到 nowlist --- */
    setNowList(list) {
        this.nowlist.length = 0;
        const nowlist = clickgo.tool.clone(list);
        if (Array.isArray(nowlist)) {
            this.nowlist = nowlist;
        }
        else {
            for (const key in nowlist) {
                nowlist[key].value = key;
                this.nowlist.push(nowlist[key]);
            }
        }
        for (const item of this.nowlist) {
            delete item.children;
        }
    }
    // --- list 的点击事件 ---
    async listItemClicked() {
        this.inputValue = '';
        /** --- 已选 item 的下一层 list --- */
        let nextChildren = null;
        /** --- 当前层是否有选择 --- */
        let isSelected = false;
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
        await this._findValueInDataAndSelectValueCheckChildren(nextChildren, true, true);
    }
    // --- 返回上级 ---
    back() {
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
    async selectLevelValue(list) {
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
            if (!list[i]) {
                break;
            }
            const r = await this._selectValue(list[i]);
            await this.nextTick();
            if (!r) {
                break;
            }
        }
        // --- 结束更新 ---
        this.updateValue();
    }
    /** --- 选择一个值的内部方法，返回 false 代表当前没选中或选中但没有下级了--- */
    async _selectValue(value) {
        /** --- 已选 item 的下一层 list --- */
        let nextChildren = null;
        let isSelected = false;
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
            return false;
        }
        // --- 选中 ---
        return this._findValueInDataAndSelectValueCheckChildren(nextChildren, false);
    }
    onMounted() {
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
        this.watch('modelValue', async () => {
            const value = this.props.modelValue.toString();
            if (value === '') {
                if (this.value.length === 1) {
                    return;
                }
                this.level = 0;
                this.value = [''];
                this.label = [''];
                this.setNowList(this.props.data);
                this.lists = [this.props.data];
                this.levelData = [{
                        'label': '',
                        'value': ''
                    }];
                this.updateValue();
                return;
            }
            if (this.value.length > 1 && (value === this.value[this.level - 1])) {
                // --- 当前值和本层的上级值一样，可能仅仅是刚刚 update 的 ---
                return;
            }
            if (await this._selectValue(value)) {
                this.updateValue();
                return;
            }
            if (await this.findValueInData(value)) {
                return;
            }
            if (this.value.length === 1) {
                return;
            }
            this.level = 0;
            this.value = [''];
            this.label = [''];
            this.setNowList(this.props.data);
            this.lists = [this.props.data];
            this.levelData = [{
                    'label': '',
                    'value': ''
                }];
            this.updateValue();
        });
        this.setNowList(this.props.data);
        this.lists[0] = this.props.data;
    }
}
