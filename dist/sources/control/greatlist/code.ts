export const props = {
    'same': {
        'default': false
    },
    'disabled': {
        'default': false
    },
    'must': {
        'default': true
    },
    'multi': {
        'default': false,
    },
    'selection': {
        'default': false
    },
    'scroll': {
        'default': 'auto'
    },

    'data': {
        'default': []
    },
    'modelValue': {
        'default': -1
    }
};

export const data = {
    'client': 0,
    'clientWidth': 0,
    'length': 0,
    'offset': 0,

    'valueData': -1,
    'shiftStart': 0,
    'delayRefreshShiftStartPos': false,

    'selectValues': [],
    'beforeSelectValues': []
};

export const computed = {
    'isSame': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.same);
    },
    'isSelection': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.selection);
    },
    'isDisabled': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isMust': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.must);
    },
    'isMulti': function(this: IVControl): boolean {
        return clickgo.tool.getBoolean(this.multi);
    },

    'isSelected': function(this: IVControl) {
        return (value: number): boolean => {
            return this.multi ? this.valueData.includes(value) : (this.valueData === value);
        };
    },
};

export const watch = {
    'data': {
        handler: function(this: IVControl, n: any[], o: any[]): void {
            if (o.length === 0 && n.length > 0) {
                // --- 用来强制使 checkValue 生效，因为有可能 data 还没传入，但是默认值已经设定为了 0，所以传入 data 后要再次设定为 0 并响应事件 ---
                this.valueData = this.modelValue;
                if (typeof this.valueData === 'object') {
                    if (this.valueData[0] !== undefined) {
                        this.shiftStart = this.valueData[0];
                        this.valueData = [];
                    }
                }
                else {
                    this.shiftStart = this.valueData;
                    if (this.valueData === 0) {
                        this.valueData = -1;
                    }
                }
            }
            this.checkValue();
        },
        'deep': true
    },
    'modelValue': {
        handler: function(this: IVControl, n: any[] | number, o: any[] | number): void {
            if (Array.isArray(n) && Array.isArray(o)) {
                if (n.length === 0 && o.length === 0) {
                    // --- 不加这个循环可能会无限执行此方法 ---
                    // --- 在 data 数据缺失的时候 ---
                    return;
                }
            }
            if (typeof this.modelValue === 'object') {
                if (typeof this.valueData !== 'object') {
                    this.valueData = this.modelValue;
                    this.shiftStart = this.valueData[0] ?? 0;
                }
                else {
                    if (
                        (this.valueData.length === this.modelValue.length)
                        && this.valueData.every((ele: number) => this.modelValue.includes(ele))
                    ) {
                        return;
                    }
                    this.valueData = this.modelValue;
                    this.shiftStart = this.valueData[0] ?? 0;
                }
            }
            else {
                if (typeof this.valueData === 'object') {
                    this.valueData = this.modelValue;
                    this.shiftStart = this.valueData === -1 ? 0 : this.valueData;
                }
                else {
                    if (this.valueData === this.modelValue) {
                        return;
                    }
                    this.valueData = this.modelValue;
                    this.shiftStart = this.valueData;
                }
            }
            this.checkValue();
        },
        'deep': true,
        'immediate': true
    },
    'must': {
        handler: function(this: IVControl): void {
            this.checkValue();
        }
    },
    'multi': {
        handler: function(this: IVControl): void {
            this.checkValue();
        }
    },
    'shiftStart': {
        handler: function(this: IVControl): void {
            const pos = this.$refs.view?.getPos(this.shiftStart);
            if (pos) {
                this.refreshShiftStartPos(pos);
            }
            else {
                this.delayRefreshShiftStartPos = true;
            }
        }
    }
};

export const methods = {
    onItemsPosChange: function(this: IVControl): void {
        if (!this.delayRefreshShiftStartPos) {
            return;
        }
        this.delayRefreshShiftStartPos = false;
        this.refreshShiftStartPos(this.$refs.view?.getPos(this.shiftStart));
    },
    refreshShiftStartPos: function(this: IVControl): void {
        const pos = this.$refs.view?.getPos(this.shiftStart);
        if (!pos) {
            return;
        }
        if (pos.start < this.offset) {
            this.offset = pos.start;
            return;
        }
        if (pos.end > (this.offset as number) + (this.client as number)) {
            this.offset = pos.end - this.client;
        }
    },
    checkValue: function(this: IVControl): void {
        let change: boolean = false;
        const notDisabledIndex = this.getFirstNotDisabledDataIndex();
        if (typeof this.valueData === 'object') {
            if (this.isMulti) {
                // --- 多行 ---
                if (this.isMust && (this.valueData.length === 0)) {
                    change = true;
                    this.valueData = [notDisabledIndex];
                    this.shiftStart = this.valueData[0];
                }
            }
            else {
                // --- 不是多行模式，应该改为单行值 ---
                change = true;
                this.valueData = this.valueData[0] ?? -1;
                this.shiftStart = (this.valueData === -1) ? notDisabledIndex : this.valueData;
                if (this.isMust && (this.valueData === -1)) {
                    this.valueData = notDisabledIndex;
                }
            }
        }
        else {
            // --- 当前单行值 ---
            if (this.isMulti) {
                // --- 应该变为多行值 ---
                change = true;
                this.valueData = this.valueData === -1 ? [] : [this.valueData];
                this.shiftStart = this.valueData.length === 0 ? notDisabledIndex : this.valueData[0];
                if (this.isMust && (this.valueData.length === 0)) {
                    this.valueData = [notDisabledIndex];
                }
            }
            else {
                // --- 单行 ---
                if (this.isMust && (this.valueData === -1)) {
                    change = true;
                    this.valueData = notDisabledIndex;
                    this.shiftStart = notDisabledIndex;
                }
            }
        }
        // --- 检测单行/多行的值有没有超出 data 的长度 ---
        // --- 检测当前 valueData 是不是 disabled 或 split ---
        const dataMaxIndex = this.data.length - 1;
        if (this.isMulti) {
            // --- 多行要逐个判断，剔除超出的或 disabled 的 ---
            for (let i = 0; i < this.valueData.length; ++i) {
                if (
                    ((this.valueData[i] > 0) && (this.valueData[i] > dataMaxIndex)) ||
                    (this.data[this.valueData[i]]?.disabled || (this.data[this.valueData[i]]?.control === 'split'))
                ) {
                    // --- 超出/不可选 ---
                    change = true;
                    if (this.shiftStart === this.valueData[i]) {
                        this.shiftStart = i > 0 ? (this.valueData[0] ?? notDisabledIndex) : notDisabledIndex;
                    }
                    this.valueData.splice(i, 1);
                    --i;
                }
            }
            if (change) {
                if (this.isMust && this.valueData.length === 0) {
                    this.valueData = [notDisabledIndex];
                }
            }
        }
        else {
            // --- 检测值是否大于 data 长度或 disabled 的 ---
            if (
                ((this.valueData > 0) && (this.valueData > dataMaxIndex)) ||
                (this.data[this.valueData]?.disabled || (this.data[this.valueData]?.control === 'split'))
            ) {
                change = true;
                if (this.shiftStart === this.valueData) {
                    this.shiftStart = notDisabledIndex;
                }
                this.valueData = this.isMust ? notDisabledIndex : -1;
            }
        }
        if (change) {
            this.$emit('update:modelValue', this.valueData);
        }
    },
    select: function(this: IVControl, value: number, shift: boolean = false, ctrl: boolean = false): void {
        let change: boolean = false;
        if (value < -1) {
            value = -1;
        }
        if (this.isMust && value === -1) {
            value = 0;
        }
        if (this.data[value]) {
            if (this.data[value].disabled || (this.data[value].control === 'split')) {
                return;
            }
        }
        if (this.isMulti) {
            if (!shift && !ctrl) {
                // --- 单选 ---
                if (value === -1) {
                    if (this.valueData.length > 0) {
                        change = true;
                        this.valueData = [];
                    }
                }
                else {
                    // --- 要选择 ---
                    if (this.valueData.length > 1 || this.valueData.length === 0) {
                        // --- 只选择一个，但现在有多个，则重置为一个 ---
                        change = true;
                        this.valueData = [value];
                        this.shiftStart = value;
                    }
                    else {
                        // --- 只有一个，看看是不是选择的 ---
                        if (this.valueData[0] !== value) {
                            change = true;
                            this.valueData = [value];
                            this.shiftStart = value;
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
                                if (this.data[k].disabled || (this.data[k].control === 'split')) {
                                    continue;
                                }
                                valueData.push(k);
                                change = true;
                            }
                        }
                        else {
                            for (let k = this.shiftStart; k >= value; --k) {
                                if (this.data[k].disabled === true) {
                                    continue;
                                }
                                if (this.data[k].control === 'split') {
                                    continue;
                                }
                                valueData.push(k);
                                change = true;
                            }
                        }
                        if (
                            (valueData.length !== this.valueData.length)
                            || !valueData.every((item: number) => this.valueData.includes(item))
                        ) {
                            this.valueData = valueData;
                            change = true;
                        }
                    }
                    else {
                        // --- ctrl ---
                        const indexOf = this.valueData.indexOf(value);
                        if (indexOf > -1) {
                            // --- 选择已经存在的值 ---
                            if (!this.isMust || (this.valueData.length > 1)) {
                                change = true;
                                this.valueData.splice(indexOf, 1);
                                this.shiftStart = value;
                            }
                        }
                        else {
                            // --- 选择不存在的值 ---
                            change = true;
                            this.valueData.push(value);
                            this.shiftStart = value;
                        }
                    }
                }
            }
        }
        else {
            // --- 单行模式 ---
            if (this.valueData !== value) {
                this.valueData = value;
                if (value !== -1) {
                    this.shiftStart = value;
                }
                change = true;
            }
        }
        if (change) {
            this.$emit('update:modelValue', this.valueData);
        }
    },
    innerDown: function(this: IVControl, e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.$refs.inner.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
        }
        if (e instanceof TouchEvent) {
            // --- 长按触发 contextmenu ---
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.$refs.inner, this.$refs.pop, e);
            });
        }
    },
    context: function(this: IVControl, e: MouseEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.$refs.inner, this.$refs.pop, e);
    },
    click: function(this: IVControl, e: MouseEvent): void {
        if (!this.isMust) {
            const gi = clickgo.dom.findParentByData(e.target as HTMLElement, 'cg-control-greatlist-item');
            if (!gi) {
                this.select(-1, e.shiftKey, e.ctrlKey);
            }
        }
    },
    keydown: function(this: IVControl, e: KeyboardEvent): void {
        if ((e.key === 'ArrowDown') || (e.key === 'ArrowUp')) {
            e.preventDefault();
            let nvalue: number = -1;
            if (this.isMulti) {
                if (this.valueData.length > 0) {
                    if (e.key === 'ArrowDown') {
                        for (const i of this.valueData) {
                            if (nvalue === -1) {
                                nvalue = i;
                                continue;
                            }
                            if (i < nvalue) {
                                continue;
                            }
                            nvalue = i;
                        }
                    }
                    else {
                        for (const i of this.valueData) {
                            if (nvalue === -1) {
                                nvalue = i;
                                continue;
                            }
                            if (i > nvalue) {
                                continue;
                            }
                            nvalue = i;
                        }
                    }
                }
                else {
                    this.select(0);
                    return;
                }
            }
            else {
                if (this.valueData === -1) {
                    this.select(0);
                    return;
                }
                nvalue = this.valueData;
            }
            if (e.key === 'ArrowUp') {
                if (nvalue === 0) {
                    return;
                }
                for (let i = nvalue - 1; i >= 0; --i) {
                    if (!this.data[i]) {
                        continue;
                    }
                    if (this.data[i].disabled === true) {
                        continue;
                    }
                    if (this.data[i].control === 'split') {
                        continue;
                    }
                    this.select(i);
                    break;
                }
            }
            else {
                if (nvalue === this.data.length - 1) {
                    return;
                }
                for (let i = nvalue + 1; i < this.data.length; ++i) {
                    if (!this.data[i]) {
                        continue;
                    }
                    if (this.data[i].disabled === true) {
                        continue;
                    }
                    if (this.data[i].control === 'split') {
                        continue;
                    }
                    this.select(i);
                    break;
                }
            }
        }
    },
    // --- item 相关事件 ---
    itemContext: function(this: IVControl, e: MouseEvent, value: number): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.isSelected(value)) {
            return;
        }
        this.select(value, e.shiftKey, e.ctrlKey);
    },
    itemTouch: function(this: IVControl, e: TouchEvent, value: number): void {
        // --- 长按 item 选中自己 ---
        clickgo.dom.bindLong(e, () => {
            if (this.isSelected(value)) {
                return;
            }
            this.select(value, e.shiftKey, this.multi ? true : e.ctrlKey);
        });
    },
    itemClick: function(this: IVControl, e: MouseEvent, value: number): void {
        e.stopPropagation();
        const hasTouch = clickgo.dom.hasTouchButMouse(e);
        this.select(value, e.shiftKey, (hasTouch && this.multi) ? true : e.ctrlKey);
        // --- 上报点击事件，false: arrow click ---
        this.$emit('itemclick', e, false);
    },
    arrowClick: function(this: IVControl, e: MouseEvent, value: number): void {
        e.stopPropagation();
        const hasTouch = clickgo.dom.hasTouchButMouse(e);
        this.select(value, e.shiftKey, (hasTouch && this.multi) ? true : e.ctrlKey);
        // --- 显示/隐藏 arrow menu ---
        const current = e.currentTarget as HTMLElement;
        if (current.dataset.cgPopOpen === undefined) {
            clickgo.form.showPop(current, this.$refs.itempop, e);
        }
        else {
            clickgo.form.hidePop(current);
        }
        // --- 上报点击事件，true: arrow click ---
        this.$emit('itemclick', e, true);
    },
    // --- 获取数据中第一个不是 disabled 的 index ---
    getFirstNotDisabledDataIndex: function(this: IVControl): number {
        let notDisabledIndex = 0;
        for (let i = 0; i < this.data.length; ++i) {
            if (this.data[i].disabled === true) {
                continue;
            }
            notDisabledIndex = i;
            break;
        }
        return notDisabledIndex;
    },
    // --- 当出现了选区 ---
    onBeforeSelect: function(this: IVControl): void {
        this.selectValues = [];
        this.beforeSelectValues = Array.isArray(this.valueData) ? this.valueData : [this.valueData];
    },
    onSelect: function(this: IVControl, area: Record<string, any>): void {
        if (this.isMulti) {
            // --- 多行 ---
            if (area.shift) {
                // -- TODO ---
            }
            else if (area.ctrl) {
                for (let i = area.start; i <= area.end; ++i) {
                    // --- TODO ---
                }
            }
            else {
                // --- 没有 ctrl 和 shift ---
                if (area.start !== -1) {
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
            if (area.start !== -1) {
                this.select(area.start, area.shift, area.ctrl);
            }
        }
        this.$emit('select', area);
    },
    onAfterSelect: function(): void {
        // -- TODO ---
    }
};

export const mounted = function(this: IVControl): void {
    this.checkValue();
};
