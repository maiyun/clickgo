import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    /** --- 可视高度像素 --- */
    public client = 0;

    /** --- 可视宽度像素 --- */
    public clientWidth = 0;

    /** --- 总高度 --- */
    public length = 0;

    /** --- 滚动位置 --- */
    public offset = 0;

    /** --- 选中的数据 */
    public valueData: number | number[] = -1;

    /** --- shift 多选框原点 index --- */
    public shiftStart = 0;

    /** --- 需要刷新一下 offset 但是刚刚没有找到 view 控件所以稍等一下后刷新 --- */
    public needResetOffsetOfShiftStartPos = false;

    /** --- 选中框当前已选中的序列列表 --- */
    public selectValues: number[] = [];

    /** --- 选择之前的数据列表 --- */
    public beforeSelectValues: number[] = [];

    /** --- 是否正在框选 --- */
    public isSelectStart = false;

    public props: {
        'same': boolean;
        'disabled': boolean;
        'must': boolean;
        'multi': boolean;
        'selection': boolean;
        'scroll': 'auto' | 'hidden' | 'visible';

        'data': Array<{
            'disabled': boolean;
            'control'?: 'split';
            [key: string]: any;
        }>;
        'modelValue': number | number[];
    } = {
            'same': false,
            'disabled': false,
            'must': true,
            'multi': false,
            'selection': false,
            'scroll': 'auto',

            'data': [],
            'modelValue': -1
        };

    public get isSame(): boolean {
        return clickgo.tool.getBoolean(this.props.same);
    }

    public get isSelection(): boolean {
        return clickgo.tool.getBoolean(this.props.selection);
    }

    public get isDisabled(): boolean {
        return clickgo.tool.getBoolean(this.props.disabled);
    }

    public get isMust(): boolean {
        return clickgo.tool.getBoolean(this.props.must);
    }

    public get isMulti(): boolean {
        return clickgo.tool.getBoolean(this.props.multi);
    }

    public get isSelected() {
        return (value: number): boolean => {
            return typeof this.valueData === 'number' ? (this.valueData === value) : this.valueData.includes(value);
        };
    }

    // --- method ---

    // --- 子元素的 pos 位置被刷新的事件 ---
    public onItemsPosChange(): void {
        if (!this.needResetOffsetOfShiftStartPos) {
            return;
        }
        this.needResetOffsetOfShiftStartPos = false;
        this.resetOffsetOfShiftStartPos();
    }

    /**
     * --- 重置滚动到 shiftStart 的位置 ---
     */
    public resetOffsetOfShiftStartPos(pos?: Record<string, any>): void {
        if (!pos) {
            pos = this.refs.view?.getPos(this.shiftStart);
        }
        if (!pos) {
            return;
        }
        if (pos.start < this.offset) {
            this.offset = pos.start;
            return;
        }
        if (pos.end > this.offset + this.client) {
            this.offset = pos.end - this.client;
        }
    }

    public checkValue(): void {
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
        const dataMaxIndex = this.props.data.length - 1;
        if (typeof this.valueData !== 'number') {
            // --- 多行要逐个判断，剔除超出的或 disabled 的 ---
            for (let i = 0; i < this.valueData.length; ++i) {
                if (
                    ((this.valueData[i] > 0) && (this.valueData[i] > dataMaxIndex)) ||
                    (this.props.data[this.valueData[i]]?.disabled || (this.props.data[this.valueData[i]]?.control === 'split'))
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
                (this.props.data[this.valueData]?.disabled || (this.props.data[this.valueData]?.control === 'split'))
            ) {
                change = true;
                if (this.shiftStart === this.valueData) {
                    this.shiftStart = notDisabledIndex;
                }
                this.valueData = this.isMust ? notDisabledIndex : -1;
            }
        }
        if (change) {
            this.emit('update:modelValue', this.valueData);
        }
    }

    public select(value: number, shift: boolean = false, ctrl: boolean = false): void {
        let change: boolean = false;
        if (value < -1) {
            value = -1;
        }
        if (this.isMust && value === -1) {
            value = 0;
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
            if (this.props.data[i].disabled || (this.props.data[i].control === 'split')) {
                return false;
            }
            return true;
        };
        if (typeof this.valueData !== 'number') {
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
                        if (canSelect(value)) {
                            change = true;
                            this.valueData = [value];
                            this.shiftStart = value;
                        }
                    }
                    else {
                        // --- 只有一个，看看是不是选择的 ---
                        if (this.valueData[0] !== value) {
                            if (canSelect(value)) {
                                change = true;
                                this.valueData = [value];
                                this.shiftStart = value;
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
                                change = true;
                                valueData.push(k);
                            }
                        }
                        else {
                            for (let k = this.shiftStart; k >= value; --k) {
                                if (!canSelect(k)) {
                                    continue;
                                }
                                change = true;
                                valueData.push(k);
                            }
                        }
                        if (
                            (valueData.length !== this.valueData.length)
                            || !valueData.every((item: number) => (this.valueData as number[]).includes(item))
                        ) {
                            change = true;
                            this.valueData = valueData;
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
                            if (canSelect(value)) {
                                change = true;
                                this.valueData.push(value);
                                this.shiftStart = value;
                            }
                        }
                    }
                }
            }
        }
        else {
            // --- 单行模式 ---
            if (this.valueData !== value) {
                if (value === -1) {
                    change = true;
                    this.valueData = -1;
                    this.shiftStart = 0;
                }
                else if (canSelect(value)) {
                    change = true;
                    this.valueData = value;
                    this.shiftStart = value;
                }
            }
        }
        if (change) {
            this.emit('update:modelValue', this.valueData);
        }
    }

    public innerDown(e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.refs.inner.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
        }
        this.isSelectStart = false;
        console.log('TODO', this.isSelectStart);
        if (e instanceof TouchEvent) {
            // --- 长按触发 contextmenu ---
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.refs.inner, this.refs.pop, e);
            });
        }
    }

    public context(e: MouseEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.refs.inner, this.refs.pop, e);
    }

    public click(e: MouseEvent): void {
        if (this.isSelection && this.isSelectStart) {
            return;
        }
        if (!this.isMust) {
            const gi = clickgo.dom.findParentByData(e.target as HTMLElement, 'cg-control-greatlist-item');
            if (!gi) {
                this.select(-1, e.shiftKey, e.ctrlKey);
            }
        }
    }

    public keydown(e: KeyboardEvent): void {
        if ((e.key === 'ArrowDown') || (e.key === 'ArrowUp')) {
            e.preventDefault();
            let nvalue: number = -1;
            if (typeof this.valueData !== 'number') {
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
                    if (!this.props.data[i]) {
                        continue;
                    }
                    if (this.props.data[i].disabled) {
                        continue;
                    }
                    if (this.props.data[i].control === 'split') {
                        continue;
                    }
                    this.select(i);
                    break;
                }
            }
            else {
                if (nvalue === this.props.data.length - 1) {
                    return;
                }
                for (let i = nvalue + 1; i < this.props.data.length; ++i) {
                    if (!this.props.data[i]) {
                        continue;
                    }
                    if (this.props.data[i].disabled) {
                        continue;
                    }
                    if (this.props.data[i].control === 'split') {
                        continue;
                    }
                    this.select(i);
                    break;
                }
            }
        }
    }

    // --- item 相关事件 ---
    public itemContext(e: MouseEvent, value: number): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.isSelected(value)) {
            return;
        }
        this.select(value, e.shiftKey, e.ctrlKey);
    }

    public itemTouch(e: TouchEvent, value: number): void {
        // --- 长按 item 选中自己 ---
        clickgo.dom.bindLong(e, () => {
            if (this.isSelected(value)) {
                return;
            }
            this.select(value, e.shiftKey, this.isMulti ? true : e.ctrlKey);
        });
    }

    public itemClick(e: MouseEvent, value: number): void {
        if (this.isSelection && this.isSelectStart) {
            return;
        }
        e.stopPropagation();
        const hasTouch = clickgo.dom.hasTouchButMouse(e);
        this.select(value, e.shiftKey, (hasTouch && this.isMulti) ? true : e.ctrlKey);
        // --- 上报点击事件，false: arrow click ---
        this.emit('itemclick', e, false);
    }

    public arrowClick(e: MouseEvent, value: number): void {
        e.stopPropagation();
        const hasTouch = clickgo.dom.hasTouchButMouse(e);
        this.select(value, e.shiftKey, (hasTouch && this.isMulti) ? true : e.ctrlKey);
        // --- 显示/隐藏 arrow menu ---
        const current = e.currentTarget as HTMLElement;
        if (current.dataset.cgPopOpen === undefined) {
            clickgo.form.showPop(current, this.refs.itempop, e);
        }
        else {
            clickgo.form.hidePop(current);
        }
        // --- 上报点击事件，true: arrow click ---
        this.emit('itemclick', e, true);
    }

    /**
     * --- 获取数据中第一个不是 disabled 的 index ---
     */
    public getFirstNotDisabledDataIndex(): number {
        let notDisabledIndex = 0;
        for (let i = 0; i < this.props.data.length; ++i) {
            if (this.props.data[i].disabled) {
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
    }

    public onSelect(area: Record<string, any>): void {
        if (this.isMulti) {
            // --- 多行 ---
            if (area.shift || area.ctrl) {
                if (area.start === -1) {
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
            // --- 单行 ---
            if (area.start !== -1) {
                this.select(area.start, area.shift, area.ctrl);
            }
        }
        this.emit('select', area);
    }

    public onAfterSelect(): void {
        // -- TODO ---
    }

    public onMounted(): void | Promise<void> {
        this.watch('data', (n, o): void => {
            if (o.length === 0 && n.length > 0) {
                // --- 用来强制使 checkValue 生效，因为有可能 data 还没传入，但是默认值已经设定为了 0，所以传入 data 后要再次设定为 0 并响应事件 ---
                this.valueData = this.props.modelValue;
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
        }, {
            'deep': true
        });
        this.watch('modelValue', (n, o): void => {
            if (Array.isArray(n) && Array.isArray(o)) {
                if (n.length === 0 && o.length === 0) {
                    // --- 不加这个循环可能会无限执行此方法 ---
                    // --- 在 data 数据缺失的时候 ---
                    return;
                }
            }
            if (typeof this.props.modelValue !== 'number') {
                // --- 传入的是多条选择数据 ---
                if (typeof this.valueData === 'number') {
                    // --- 但当前的是单条 ---
                    this.valueData = this.props.modelValue;
                    this.shiftStart = this.valueData[0] ?? 0;
                }
                else {
                    // --- 当前也是多条 ---
                    if (
                        (this.valueData.length === this.props.modelValue.length)
                        && this.valueData.every((ele: number) => (this.props.modelValue as number[]).includes(ele))
                    ) {
                        return;
                    }
                    this.valueData = this.props.modelValue;
                    this.shiftStart = this.valueData[0] ?? 0;
                }
            }
            else {
                // --- 传入的是单条数据 ---
                if (typeof this.valueData !== 'number') {
                    // --- 但当前是多条 ---
                    this.valueData = this.props.modelValue;
                    this.shiftStart = this.valueData === -1 ? 0 : this.valueData;
                }
                else {
                    // --- 也是单条 ---
                    if (this.valueData === this.props.modelValue) {
                        return;
                    }
                    this.valueData = this.props.modelValue;
                    this.shiftStart = this.valueData;
                }
            }
            this.checkValue();
        }, {
            'deep': true,
            'immediate': true
        });
        this.watch('must', (): void => {
            this.checkValue();
        });
        this.watch('multi', (): void => {
            this.checkValue();
        });
        // --- shift 原点变了，要监听 ---
        this.watch('shiftStart', (): void => {
            if (this.isSelectStart) {
                // --- 框选过程中变了，不管 ---
                return;
            }
            const pos = this.refs.view?.getPos(this.shiftStart);
            if (pos) {
                this.resetOffsetOfShiftStartPos(pos);
            }
            else {
                this.needResetOffsetOfShiftStartPos = true;
            }
        });

        // --- 加载后执行 ---

        this.checkValue();
    }

}
