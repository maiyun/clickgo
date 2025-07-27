import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'remove': null,
        'add': null,
        'change': null,
        'changed': null,
        'itemclicked': null,
        'itemdblclicked': null,
        'beforeselect': null,
        'select': null,
        'afterselect': null,
        'clientwidth': null,
        'client': null,
        'gesture': null,
        'scrollheight': null,
        'scrollwidth': null,

        'update:modelValue': null,
        'update:scrollLeft': null,
        'update:scrollTop': null
    };

    public props: {
        'disabled': boolean | string;
        'must': boolean | string;
        'multi': boolean | string;
        /** --- 默认 true，多选时，PC 端为 true 时则按键盘 ctrl 才能多选，手机端无论如何都是点击自动多选 --- */
        'ctrl': boolean | string;
        'selection': boolean | string;
        'gesture': string[] | string;
        'scroll': 'auto' | 'hidden' | 'visible';
        /** --- 超出的内容是否顶开宽度，默认 fill，不顶开 --- */
        'contentWidth': 'fill' | 'max';
        /** --- 是否开启虚拟 dom 模式，默认不开启，如果数据量超大的话才需要开启 --- */
        'virtual': boolean | string;
        'plain': boolean | string;
        /** --- 展现样式 --- */
        'mode': 'default' | 'view' | 'iview';

        /** --- 映射 disabled、control 的 key --- */
        'map': {
            'disabled'?: string;
            'control'?: string;
            'unavailable'?: string;
            'leftline'?: string;
        };
        'data': Array<{
            'disabled': boolean;
            'control'?: 'split';
            [key: string]: any;
        }>;
        'sizes': Record<string, number | undefined>;
        'modelValue': number[];

        'scrollLeft': number | string;
        'scrollTop': number | string;
    } = {
            'disabled': false,
            'must': true,
            'multi': false,
            'ctrl': true,
            'selection': false,
            'gesture': [],
            'scroll': 'auto',
            'contentWidth': 'fill',
            'virtual': false,
            'plain': false,
            'mode': 'default',

            'map': {},
            'data': [],
            'sizes': {},
            'modelValue': [],

            'scrollLeft': 0,
            'scrollTop': 0
        };

    /** --- 最近的 table 控件，如果是 table 内部的本控件，才会有此控件 --- */
    public table: any = null;

    /** --- 如果是嵌套在 table 里的，那么要获取 table 内容的最大宽度（仅 split 模式），不获取的话，split 横线在横向内容内部超出时无法充满整个宽度 --- */
    public get tableContentWidth(): number {
        if (!this.table) {
            return 0;
        }
        if (!this.table.split) {
            return 0;
        }
        let w: number = 0;
        for (const key in this.table.widthMap) {
            w += this.table.widthMap[key];
        }
        return w;
    }

    /** --- 初始化后的 map 对象 --- */
    public get mapComp(): {
        'disabled': string;
        'control': string;
        'unavailable': string;
        'leftline': string;
    } {
        return {
            'disabled': this.props.map.disabled ?? 'disabled',
            'control': this.props.map.control ?? 'control',
            'unavailable': this.props.map.unavailable ?? 'unavailable',
            'leftline': this.props.map.leftline ?? 'leftline',
        };
    }

    /** --- 左侧线的颜色 format --- */
    public get leftlinecolor() {
        return (text?: string) => {
            if (!text) {
                return undefined;
            }
            if (['primary', 'info', 'warning', 'danger'].includes(text)) {
                return 'var(--' + (text === 'primary' ? 'success' : text) + ')';
            }
            return text;
        };
    }

    /** --- clientWidth --- */
    public cw = 0;

    /** --- 可视高度像素 --- */
    public client = 0;

    /** --- 总高度 --- */
    public length = 0;

    /** --- scrollWidth --- */
    public sw = 0;

    /** --- scrollLeft --- */
    public sl = 0;

    /** --- 滚动位置 --- */
    public offset = 0;

    /** --- 选中的数据 --- */
    public valueData: number[] = [];

    /** --- shift 多选框原点 index --- */
    public shiftStart = 0;

    /** --- 选中框当前已选中的序列列表 --- */
    public selectValues: number[] = [];

    /** --- 选择之前的数据列表 --- */
    public beforeSelectValues: number[] = [];

    /** --- 是否正在框选 --- */
    public isSelectStart = false;

    /** --- 右侧的 scroll 是否在显示状态 --- */
    public scrollShow = true;

    /** --- 判断值是否处于已经被选中的状态 --- */
    public get isSelected() {
        return (value: number): boolean => {
            return this.valueData.includes(value);
        };
    }

    // --- 外面可调用 ---

    public arrowUp(): void {
        // --- 选项向上移动 ---
        if (!this.valueData.length) {
            this.select(this.shiftStart);
            return;
        }
        if (this.shiftStart === 0) {
            return;
        }
        for (let i = this.shiftStart - 1; i >= 0; --i) {
            if (!this.props.data[i]) {
                continue;
            }
            if (this.props.data[i][this.mapComp.disabled] || this.props.data[i][this.mapComp.unavailable]) {
                continue;
            }
            if (this.props.data[i][this.mapComp.control] === 'split') {
                continue;
            }
            this.select(i);
            break;
        }
    }

    public arrowDown(): void {
        // --- 选项向下移动 ---
        if (!this.valueData.length) {
            this.select(this.shiftStart);
            return;
        }
        if (this.shiftStart === this.props.data.length - 1) {
            return;
        }
        for (let i = this.shiftStart + 1; i < this.props.data.length; ++i) {
            if (!this.props.data[i]) {
                continue;
            }
            if (this.props.data[i][this.mapComp.disabled] || this.props.data[i][this.mapComp.unavailable]) {
                continue;
            }
            if (this.props.data[i][this.mapComp.control] === 'split') {
                continue;
            }
            this.select(i);
            break;
        }
    }

    /** --- 重复调用刷新 Offset，只会最后一次生效 --- */
    public refreshOffsetCount: number = 0;

    /** --- 更新定位，可用于 display：none 显示出来时调用 --- */
    public refreshOffset(): void {
        /** --- 当前 shiftStart 是第几次 --- */
        const count = ++this.refreshOffsetCount;
        const cb = (c: number = 0): void => {
            if (count < this.refreshOffsetCount) {
                // --- 已经是下一次的了，不管 ---
                return;
            }
            if (c > 3) {
                // --- 重试次数太多 ---
                return;
            }
            if (!this.element.offsetParent || !this.client) {
                // --- 隐藏状态，要等等 ---
                clickgo.task.sleep(() => {
                    cb(c + 1);
                }, 100);
                return;
            }
            const pos = this.refs.flow.getPos(this.shiftStart);
            if (!pos) {
                clickgo.task.sleep(() => {
                    cb(c + 1);
                }, 100);
                return;
            }
            if (pos.start < this.offset) {
                this.offset = pos.start;
                return;
            }
            if (pos.end > this.offset + this.client) {
                this.offset = pos.end - this.client;
            }
        };
        cb();
    }

    // --- method ---

    /** --- 当前队列中的需要 checkValue 的次数 --- */
    private _needCheckValue: number = 0;

    /**
     * --- 检测 value 是否合法 ---
     */
    public async checkValue(): Promise<void> {
        if (!this.props.data.length) {
            return;
        }
        ++this._needCheckValue;
        await this.nextTick();
        if (this._needCheckValue > 1) {
            --this._needCheckValue;
            return;
        }
        --this._needCheckValue;

        let change: boolean = false;
        /** --- 获取一个正常值，作为实在没办法的替补值 --- */
        const notDisabledIndex = this.getFirstNotDisabledIndex();
        /** --- 当前数据最大的 index --- */
        const dataMaxIndex = this.props.data.length - 1;

        /** --- 修改前的 value 数据 --- */
        const oldValueData = clickgo.tool.clone(this.valueData);

        // --- 检测是否是单项，但却包含了多项值 ---
        if (!this.propBoolean('multi') && (this.valueData.length > 1)) {
            change = true;
            this.valueData.splice(1);
            this.shiftStart = this.valueData[0];
        }

        // --- 检测剔除 disabled 或 split 的值 ---
        for (let i = 0; i < this.valueData.length; ++i) {
            if (
                (this.valueData[i] > dataMaxIndex) ||
                (this.props.data[this.valueData[i]]?.[this.mapComp.disabled] || (this.props.data[this.valueData[i]]?.[this.mapComp.control] === 'split'))
            ) {
                // --- 超出/不可选 ---
                change = true;
                if (this.shiftStart === this.valueData[i]) {
                    this.shiftStart = i > 0 ? (this.valueData[0] ?? notDisabledIndex) : notDisabledIndex;
                    if (this.shiftStart < 0) {
                        this.shiftStart = 0;
                    }
                }
                this.valueData.splice(i, 1);
                --i;
            }
        }

        // --- 检测是否必须，但却没选择（或在上面被剔除了） ---
        if (this.propBoolean('must') && (this.valueData.length === 0)) {
            change = true;
            this.valueData = notDisabledIndex < 0 ? [] : [notDisabledIndex];
            this.shiftStart = this.valueData.length ? this.valueData[0] : 0;
        }

        if (change) {
            if (this.propBoolean('multi')) {
                // --- 多选模式 ---
                const res = clickgo.tool.compar(oldValueData, this.valueData);
                for (const key in res.remove) {
                    const event: types.IGreatlistRemoveEvent = {
                        'go': true,
                        preventDefault: function() {
                            this.go = false;
                        },
                        'detail': {
                            'index': res.remove[key],
                            'value': parseInt(key)
                        }
                    };
                    this.emit('remove', event);
                }
                for (const key in res.add) {
                    const event: types.IGreatlistAddEvent = {
                        'go': true,
                        preventDefault: function() {
                            this.go = false;
                        },
                        'detail': {
                            'index': res.add[key],
                            'value': parseInt(key)
                        }
                    };
                    this.emit('add', event);
                }
            }
            else {
                // --- 单选模式 ---
                const event: types.IGreatlistChangeEvent = {
                    'go': true,
                    preventDefault: function() {
                        this.go = false;
                    },
                    'detail': {
                        'value': this.valueData,
                    }
                };
                this.emit('change', event);
                const event2: types.IGreatlistChangedEvent = {
                    'detail': {
                        'value': this.valueData,
                    }
                };
                this.emit('changed', event2);
            }
            this.emit('update:modelValue', this.valueData);
        }
    }

    public onScrollHeight(sh: number): void {
        this.length = sh;
        this.emit('scrollheight', sh);
    }

    public onScrollWidth(sw: number): void {
        this.sw = sw;
        this.emit('scrollwidth', sw);
    }

    /**
     * --- 选择一个值 ---
     * @param value 值
     * @param shift 是否 shift
     * @param ctrl 是否 ctrl
     */
    public select(value: number, shift: boolean = false, ctrl: boolean = false): void {
        let change: boolean = false;
        if (value < -1) {
            value = -1;
        }
        if (this.propBoolean('must') && value === -1) {
            // --- 必须选择，但是却传入了 -1，则什么也不干 ---
            return;
        }
        /*
        // --- 即使是 disabled 也能继续执行，只是 disabled 的项无法被选中，因此注释本段 ---
        if (this.data[value]) {
            if (this.data[value].disabled || (this.data[value].control === 'split')) {
                return;
            }
        }
        */
        const canSelect = (i: number): boolean => {
            if (!this.props.data[i] || this.props.data[i][this.mapComp.disabled] || (this.props.data[i][this.mapComp.control] === 'split')) {
                return false;
            }
            return true;
        };

        if (!this.propBoolean('multi') || (!shift && !ctrl)) {
            // --- 选择单项 ---
            if (value === -1) {
                // --- 清除 ---
                if (this.valueData.length > 0) {
                    if (this.propBoolean('multi')) {
                        // --- 多选模式 ---
                        change = true;
                        for (let i = 0; i < this.valueData.length; ++i) {
                            const event: types.IGreatlistRemoveEvent = {
                                'go': true,
                                preventDefault: function() {
                                    this.go = false;
                                },
                                'detail': {
                                    'index': i,
                                    'value': this.valueData[i]
                                }
                            };
                            this.emit('remove', event);
                        }
                        this.valueData = [];
                    }
                    else {
                        // --- 单选模式 ---
                        const event: types.IGreatlistChangeEvent = {
                            'go': true,
                            preventDefault: function() {
                                this.go = false;
                            },
                            'detail': {
                                'value': []
                            }
                        };
                        this.emit('change', event);
                        if (event.go) {
                            change = true;
                            this.valueData = [];
                            const event: types.IGreatlistChangedEvent = {
                                'detail': {
                                    'value': []
                                }
                            };
                            this.emit('changed', event);
                        }
                    }
                }
            }
            else {
                // --- 选择单项 ---
                if (this.valueData.length > 1 || this.valueData.length === 0) {
                    // --- 只选择一个，但现在有多个或一个都没有，则重置为一个 ---
                    if (canSelect(value)) {
                        if (this.propBoolean('multi')) {
                            // --- 多选模式 ---
                            change = true;
                            const oldValueData = clickgo.tool.clone(this.valueData);
                            this.valueData = [value];
                            const res = clickgo.tool.compar(oldValueData, this.valueData);
                            for (const key in res.remove) {
                                const event: types.IGreatlistRemoveEvent = {
                                    'go': true,
                                    preventDefault: function() {
                                        this.go = false;
                                    },
                                    'detail': {
                                        'index': res.remove[key],
                                        'value': parseInt(key)
                                    }
                                };
                                this.emit('remove', event);
                            }
                            for (const key in res.add) {
                                const event: types.IGreatlistAddEvent = {
                                    'go': true,
                                    preventDefault: function() {
                                        this.go = false;
                                    },
                                    'detail': {
                                        'index': res.add[key],
                                        'value': parseInt(key)
                                    }
                                };
                                this.emit('add', event);
                            }
                            this.shiftStart = value;
                        }
                        else {
                            // --- 单选模式 ---
                            const event: types.IGreatlistChangeEvent = {
                                'go': true,
                                preventDefault: function() {
                                    this.go = false;
                                },
                                'detail': {
                                    'value': [value]
                                }
                            };
                            this.emit('change', event);
                            if (event.go) {
                                change = true;
                                this.valueData = [value];
                                this.shiftStart = value;
                                const event: types.IGreatlistChangedEvent = {
                                    'detail': {
                                        'value': [value]
                                    }
                                };
                                this.emit('changed', event);
                            }
                        }
                    }
                }
                else {
                    // --- 只有一个，看看是不是选择的 ---
                    if (this.valueData[0] !== value) {
                        if (canSelect(value)) {
                            if (this.propBoolean('multi')) {
                                // --- 多选模式 ---
                                change = true;
                                const oldValueData = clickgo.tool.clone(this.valueData);
                                this.valueData[0] = value;
                                const res = clickgo.tool.compar(oldValueData, this.valueData);
                                for (const key in res.remove) {
                                    const event: types.IGreatlistRemoveEvent = {
                                        'go': true,
                                        preventDefault: function() {
                                            this.go = false;
                                        },
                                        'detail': {
                                            'index': res.remove[key],
                                            'value': parseInt(key)
                                        }
                                    };
                                    this.emit('remove', event);
                                }
                                for (const key in res.add) {
                                    const event: types.IGreatlistAddEvent = {
                                        'go': true,
                                        preventDefault: function() {
                                            this.go = false;
                                        },
                                        'detail': {
                                            'index': res.add[key],
                                            'value': parseInt(key)
                                        }
                                    };
                                    this.emit('add', event);
                                }
                                this.shiftStart = value;
                            }
                            else {
                                // --- 单选模式 ---
                                const event: types.IGreatlistChangeEvent = {
                                    'go': true,
                                    preventDefault: function() {
                                        this.go = false;
                                    },
                                    'detail': {
                                        'value': [value]
                                    }
                                };
                                this.emit('change', event);
                                if (event.go) {
                                    change = true;
                                    this.valueData[0] = value;
                                    this.shiftStart = value;
                                    const event: types.IGreatlistChangedEvent = {
                                        'detail': {
                                            'value': [value]
                                        }
                                    };
                                    this.emit('changed', event);
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            // --- 多选 ---
            if (value === -1) {
                // --- 按住 shift 或 ctrl 时则什么也不处理 ---
            }
            else {
                // --- 选择值了 ---
                if (shift) {
                    // --- 判断要不要改值 ---
                    const valueData = [];
                    if (value > this.shiftStart) {
                        for (let k = this.shiftStart; k <= value; ++k) {
                            if (!canSelect(k)) {
                                continue;
                            }
                            valueData.push(k);
                        }
                    }
                    else {
                        for (let k = this.shiftStart; k >= value; --k) {
                            if (!canSelect(k)) {
                                continue;
                            }
                            valueData.push(k);
                        }
                    }
                    if (
                        (valueData.length !== this.valueData.length)
                        || !valueData.every((item: number) => this.valueData.includes(item))
                    ) {
                        // --- 比对 ---
                        const rtn = clickgo.tool.compar(this.valueData, valueData);
                        if (rtn.length.add) {
                            for (const name in rtn.add) {
                                const event: types.IGreatlistAddEvent = {
                                    'go': true,
                                    preventDefault: function() {
                                        this.go = false;
                                    },
                                    'detail': {
                                        // --- 当前数组的 index ---
                                        'index': rtn.add[name],
                                        // --- 原始 data 的 index ---
                                        'value': parseInt(name)
                                    }
                                };
                                this.emit('add', event);
                                if (event.go) {
                                    change = true;
                                }
                            }
                        }
                        if (rtn.length.remove) {
                            for (const name in rtn.remove) {
                                const event: types.IGreatlistRemoveEvent = {
                                    'go': true,
                                    preventDefault: function() {
                                        this.go = false;
                                    },
                                    'detail': {
                                        'index': rtn.add[name],
                                        'value': parseInt(name)
                                    }
                                };
                                this.emit('remove', event);
                                if (event.go) {
                                    change = true;
                                }
                            }
                        }
                        if (change) {
                            this.valueData = valueData;
                        }
                    }
                }
                else {
                    // --- ctrl ---
                    const indexOf = this.valueData.indexOf(value);
                    if (indexOf > -1) {
                        // --- 选择已经存在的值 ---
                        if (!this.propBoolean('must') || (this.valueData.length > 1)) {
                            if (this.propBoolean('multi')) {
                                const event: types.IGreatlistRemoveEvent = {
                                    'go': true,
                                    preventDefault: function() {
                                        this.go = false;
                                    },
                                    'detail': {
                                        'index': indexOf,
                                        'value': value
                                    }
                                };
                                this.emit('remove', event);
                                if (event.go) {
                                    change = true;
                                    this.valueData.splice(indexOf, 1);
                                    this.shiftStart = value;
                                }
                            }
                            else {
                                change = true;
                                this.valueData.splice(indexOf, 1);
                                this.shiftStart = value;
                            }
                        }
                    }
                    else {
                        // --- 选择不存在的值 ---
                        if (canSelect(value)) {
                            if (this.propBoolean('multi')) {
                                const event: types.IGreatlistAddEvent = {
                                    'go': true,
                                    preventDefault: function() {
                                        this.go = false;
                                    },
                                    'detail': {
                                        'index': this.valueData.length,
                                        'value': value
                                    }
                                };
                                this.emit('add', event);
                                if (event.go) {
                                    change = true;
                                    this.shiftStart = value;
                                    this.valueData.push(value);
                                }
                            }
                            else {
                                change = true;
                                this.shiftStart = value;
                                this.valueData = [value];
                            }
                        }
                    }
                }
            }
        }

        if (change) {
            this.emit('update:modelValue', this.valueData);
        }
    }

    // --- arrow 的 click 事件 ---
    public arrowDownClick(e: MouseEvent | TouchEvent, value: number): void {
        clickgo.dom.bindClick(e, () => {
            const hasTouch = clickgo.dom.hasTouchButMouse(e);
            this.select(value, e.shiftKey, ((!this.propBoolean('ctrl') || hasTouch) && this.propBoolean('multi')) ? true : e.ctrlKey);
            // --- 显示/隐藏 arrow menu ---
            const current = e.target as HTMLElement;
            if (current.dataset.cgPopOpen === undefined) {
                clickgo.form.showPop(current, this.refs.itempop, e);
            }
            else {
                clickgo.form.hidePop(current);
            }
            // --- 上报点击事件，true: arrow click ---
            const clickevent: types.IGreatlistItemclickedEvent = {
                'detail': {
                    'event': e,
                    'value': value,
                    'arrow': true
                }
            };
            this.emit('itemclicked', clickevent);
            // --- 上报双击时间，true: arrow click ---
            const dblevent: types.IGreatlistItemdblclickedEvent = {
                'detail': {
                    'event': e,
                    'value': value,
                    'arrow': true
                }
            };
            this.emit('itemdblclicked', dblevent);
        });
    }

    /** --- 最后一次响应 cg-glno 标签的时间 --- */
    public lastGlno = 0;

    // --- item inner 的 click 事件 ---
    public innerDown(e: MouseEvent | TouchEvent, value: number): void {
        const el = e.target as HTMLElement;
        if (el.dataset.cgGlno !== undefined) {
            this.lastGlno = Date.now();
            return;
        }
        if (clickgo.dom.findParentByData(el, 'cg-glno')) {
            this.lastGlno = Date.now();
            return;
        }
        clickgo.dom.bindClick(e, () => {
            this.select(value, e.shiftKey, ((!this.propBoolean('ctrl') || e instanceof TouchEvent) && this.propBoolean('multi')) ? true : e.ctrlKey);
            // --- 上报点击事件，false: arrow click ---
            const clickevent: types.IGreatlistItemclickedEvent = {
                'detail': {
                    'event': e,
                    'value': value,
                    'arrow': false
                }
            };
            this.emit('itemclicked', clickevent);
            // --- 上报双击时间，false: arrow click ---
            const dblevent: types.IGreatlistItemdblclickedEvent = {
                'detail': {
                    'event': e,
                    'value': value,
                    'arrow': false
                }
            };
            this.emit('itemdblclicked', dblevent);
        });
    }

    // --- flow 的鼠标或手指 down 事件 ---
    public down(e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        // --- 若正在显示菜单则隐藏 ---
        if (this.refs.flow.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
        }
        // --- click 空白处取消选择 ---
        if (!this.propBoolean('must') && this.propBoolean('ctrl') && !(e instanceof TouchEvent)) {
            const gi = clickgo.dom.findParentByData(e.target as HTMLElement, 'cg-size');
            if (((e.target as HTMLElement).dataset.cgSize === undefined) && !gi) {
                // --- 空白处 ---
                clickgo.dom.bindClick(e, () => {
                    this.select(-1, e.shiftKey, e.ctrlKey);
                });
            }
        }
        // --- 手指长安触发菜单 ---
        if (e instanceof TouchEvent) {
            // --- 长按触发 contextmenu ---
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.refs.flow.$el, this.refs.pop, e);
            });
        }
    }

    // --- （仅手指）长按 item 选中自己 ---
    public itemTouch(e: TouchEvent, value: number): void {
        clickgo.dom.bindLong(e, () => {
            if (this.isSelected(value)) {
                return;
            }
            this.select(value, e.shiftKey, this.propBoolean('multi') ? true : e.ctrlKey);
        });
    }

    // --- （仅鼠标）弹出菜单事件设定选中 ---
    public itemContext(e: MouseEvent, value: number): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.isSelected(value)) {
            return;
        }
        this.select(value, e.shiftKey, e.ctrlKey);
    }

    // --- （仅鼠标）flow 整体的 contextmenu 事件 ---
    public context(e: MouseEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.refs.flow.$el, this.refs.pop, e);
    }

    // --- 整个控件的键盘事件 ---
    public keydown(e: KeyboardEvent): void {
        if ((e.key !== 'ArrowDown')  && (e.key !== 'ArrowUp')) {
            return;
        }
        e.preventDefault();
        if (e.key === 'ArrowUp') {
            this.arrowUp();
        }
        else {
            this.arrowDown();
        }
    }

    /**
     * --- 获取数据中第一个不是 disabled 的 index（data 没值将返回 -1，即使是 must 状态） ---
     */
    public getFirstNotDisabledIndex(): number {
        let notDisabledIndex = -1;
        for (let i = 0; i < this.props.data.length; ++i) {
            if (this.props.data[i][this.mapComp.disabled]) {
                continue;
            }
            if (this.props.data[i][this.mapComp.control] === 'split') {
                continue;
            }
            notDisabledIndex = i;
            break;
        }
        return notDisabledIndex;
    }

    // --- 当出现了选区 ---
    public onBeforeSelect(): void {
        this.isSelectStart = true;
        this.selectValues = [];
        this.beforeSelectValues = typeof this.valueData !== 'number' ? this.valueData : (this.valueData > 0 ? [this.valueData] : []);
        this.emit('beforeselect');
    }

    public onSelect(area: Record<string, any>): void {
        if (this.propBoolean('multi')) {
            // --- 多行 ---
            if (area.shift || area.ctrl) {
                if (area.empty) {
                    // --- 本次选中的先取消掉 ---
                    for (const item of this.selectValues) {
                        this.select(item, false, true);
                    }
                    this.selectValues = [];
                }
                else if (area.shift) {
                    // --- 先检查要加的 ---
                    for (let i = area.start; i <= area.end; ++i) {
                        if (this.selectValues.includes(i)) {
                            // --- 已经选中了，不管 ---
                            continue;
                        }
                        if (this.beforeSelectValues.includes(i)) {
                            // --- 本来就选中状态，不管 ---
                            continue;
                        }
                        // --- 需要选中 ---
                        this.selectValues.push(i);
                        this.select(i, false, true);
                    }
                    // --- 再看有没有要减掉的 ---
                    for (let i = 0; i < this.selectValues.length; ++i) {
                        if (this.selectValues[i] >= area.start && this.selectValues[i] <= area.end) {
                            // --- 正常 ---
                            continue;
                        }
                        // --- 要剔除 ---
                        this.select(this.selectValues[i], false, true);
                        this.selectValues.splice(i, 1);
                        --i;
                    }
                }
                else {
                    // --- ctrl ---
                    // --- 先检查要加的 ---
                    for (let i = area.start; i <= area.end; ++i) {
                        if (this.selectValues.includes(i)) {
                            // --- 已经选中了，不管 ---
                            continue;
                        }
                        if (this.beforeSelectValues.includes(i)) {
                            // --- 本来是选中状态，则变为不选 ---
                            this.selectValues.push(i);
                            this.select(i, false, true);
                            continue;
                        }
                        // --- 需要选中 ---
                        this.selectValues.push(i);
                        this.select(i, false, true);
                    }
                    // --- 再看有没有要减掉的 ---
                    for (let i = 0; i < this.selectValues.length; ++i) {
                        if (this.selectValues[i] >= area.start && this.selectValues[i] <= area.end) {
                            // --- 正常 ---
                            continue;
                        }
                        // --- 要剔除/还原 ---
                        this.select(this.selectValues[i], false, true);
                        this.selectValues.splice(i, 1);
                        --i;
                    }
                }
            }
            else {
                // --- 没有 ctrl 和 shift ---
                if (!area.empty) {
                    this.shiftStart = area.start;
                    this.select(area.end, true);
                }
                else {
                    // --- 清空 ---
                    this.select(-1);
                }
            }
        }
        else {
            // --- 单行 ---
            if (!area.empty) {
                this.select(area.start, area.shift, area.ctrl);
            }
        }
        this.emit('select', area);
    }

    public onAfterSelect(): void {
        this.isSelectStart = false;
        this.emit('afterselect');
    }

    public onMounted(): void | Promise<void> {
        const table = this.parentByName('table');
        if (table) {
            this.table = table;
        }

        this.watch('must', (): void => {
            // --- 检测是否必须，但却没选择 ---
            if (this.propBoolean('must') && (this.valueData.length === 0)) {
                // --- 要默认选择一下，先判断 shiftStart 能不能被选择，若能的话，优先选择 ---
                if (this.props.data[this.shiftStart] &&
                    !this.props.data[this.shiftStart][this.mapComp.disabled] &&
                    (this.props.data[this.shiftStart][this.mapComp.control] !== 'split')) {
                    this.valueData = [this.shiftStart];
                }
                else {
                    const notDisabledIndex = this.getFirstNotDisabledIndex();
                    this.valueData = notDisabledIndex > -1 ? [notDisabledIndex] : [];
                    this.shiftStart = this.valueData.length ? this.valueData[0] : 0;
                }
                const event: types.IGreatlistChangedEvent = {
                    'detail': {
                        'value': [this.valueData[0]]
                    }
                };
                this.emit('changed', event);
                this.emit('update:modelValue', this.valueData);
            }
        });
        this.watch('multi', (): void => {
            // --- 检测是否是单项，但却包含了多项值 ---
            if (!this.propBoolean('multi') && (this.valueData.length > 1)) {
                this.valueData.splice(1);
                this.shiftStart = this.valueData[0];
                this.emit('update:modelValue', this.valueData);
            }
        });

        // --- shift 原点变了，要监听并移动 scroll ---
        this.watch('shiftStart', (): void => {
            if (Date.now() - this.lastGlno <= 300) {
                // --- 鼠标或者点击禁止区域后操作的，不管，不需要移动，例如点击了 tree 的控制按钮 ---
                return;
            }
            if (this.isSelectStart) {
                // --- 框选过程中变了，不管 ---
                return;
            }
            this.refreshOffset();
            // --- 有可能 shiftStart 是正常的，但是 data 数据还没有响应到 vflow 导致获取不到 pos，所以循环尝试几次 ---
        });

        // --- 监听 data 变动 ---
        this.watch(() => JSON.stringify(this.props.data), async () => {
            await this.checkValue();
        }, {
            'deep': true
        });

        // --- 向上更新 scroll top 和 scroll left ---
        this.watch('sl', () => {
            this.emit('update:scrollLeft', this.sl);
        });
        this.watch('offset', () => {
            this.emit('update:scrollTop', this.offset);
        });
        // --- 监听上级 scroll top 和 scroll left 变化 ---
        this.watch('scrollLeft', () => {
            const sl = this.propNumber('scrollLeft');
            if (sl === this.sl) {
                return;
            }
            this.sl = sl;
        });
        this.watch('scrollTop', () => {
            const offset = this.propNumber('scrollTop');
            if (offset === this.offset) {
                return;
            }
            this.client = offset;
        });

        // --- 监听用户设定的值的变更事件 ---
        this.watch('modelValue', (): void => {
            if (
                (this.valueData.length === this.props.modelValue.length)
                && this.valueData.every((item: number) => this.props.modelValue.includes(item))
            ) {
                return;
            }
            this.valueData = this.props.modelValue;
            this.shiftStart = this.valueData[0] ?? 0;
            this.checkValue().catch(() => {
                //
            });
        });
        this.valueData = this.props.modelValue;
        if (this.valueData[0]) {
            this.shiftStart = this.valueData[0];
        }
        this.checkValue().catch(() => {
            //
        });
    }

}
