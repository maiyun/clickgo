import * as clickgo from 'clickgo';

interface IItem {
    'id'?: string;
    /** --- 0: 文件夹, 1: 文件 --- */
    'type'?: -1 | 0 | 1;
    'name'?: string;
    'time'?: number;

    'icon'?: string;
    'path'?: string;
}

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'beforeselect': null,
        'select': null,
        'afterselect': null,
        'itemclicked': null,
        'open': null,
        'drop': null,
        'client': null,
        'gesture': null,

        'update:modelValue': null
    };

    public props: {
        'disabled': boolean | string;
        'plain': boolean | string;
        'must': boolean | string;
        'multi': boolean | string;
        /** --- 默认 true，多选时，PC 端为 true 时则按键盘 ctrl 才能多选，手机端无论如何都是点击自动多选 --- */
        'ctrl': boolean | string;
        'selection': boolean | string;
        'gesture': string[] | string;
        'scroll': 'auto' | 'hidden' | 'visible';
        'size': number | string;
        'name': boolean | string;

        'data': IItem[];
        'modelValue': number[];
    } = {
            'disabled': false,
            'plain': false,
            'must': false,
            'multi': true,
            'ctrl': true,
            'selection': true,
            'gesture': [],
            'scroll': 'auto',
            'size': 100,
            'name': true,

            'data': [],
            'modelValue': []
        };

    public rand = '';

    /** --- 当前控件是否有焦点 --- */
    public focus = false;

    /** --- 可视高度像素 --- */
    public client = 0;

    /** --- 总高度 --- */
    public length = 0;

    /** --- 滚动位置 --- */
    public offset = 0;

    /** --- client 宽度 --- */
    public cw: number = 0;

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

    /** --- 一行的图标个数 --- */
    public rowCount: number = 1;

    /** --- 所有图标读取后的结果 --- */
    public iconsData: Record<string, any> = [];

    /** --- data 变更次数 --- */
    public dataCount: number = 0;

    /** --- 判断值是否处于已经被选中的状态 --- */
    public get isSelected() {
        return (value: number): boolean => {
            return this.valueData.includes(value);
        };
    }

    /** --- 将时间戳转换为字符串 --- */
    public get timeFormat() {
        return (time: number): string => {
            const d = new Date(time * 1000);
            return (this.propInt('size') >= 128 ? d.getFullYear().toString() + '-' : '') +
                (d.getMonth() + 1).toString().padStart(2, '0') + '-' +
                d.getDate().toString().padStart(2, '0') + ' ' +
                d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
        };
    }

    /** --- 宽度改变时触发的事件 --- */
    public clientwidth(cw: number): void {
        this.cw = cw;
        this.rowCount = Math.floor(this.cw / (this.propInt('size') + 80));
        if (this.rowCount < 1) {
            this.rowCount = 1;
        }
    }

    /** --- 处理后的 data --- */
    public get dataComp(): IItem[][] {
        const data: IItem[][] = [];
        let rowNow = this.rowCount;
        const propData = clickgo.tool.clone(this.props.data);
        for (const item of propData) {
            ++rowNow;
            if (rowNow === this.rowCount + 1) {
                rowNow = 1;
                data.push([]);
            }
            item.type ??= 1;
            data[data.length - 1].push(item);
        }
        const remain = this.rowCount - rowNow;
        if (remain > 0) {
            for (let i = 0; i < remain; ++i) {
                data[data.length - 1].push({
                    'type': -1
                });
            }
        }
        return data;
    }

    /** --- 获取 icon 最终 data 字符串数据 --- */
    public get getIconData() {
        return (path: string): string => {
            const pre = path.slice(0, 6).toLowerCase();
            if (pre === 'file:/') {
                return path;
            }
            if (pre === 'http:/' || pre === 'https:' || pre.startsWith('data:')) {
                return path;
            }
            return this.iconsData[path] ?? '';
        };
    }

    // --- 外面可调用 ---

    public arrowUp(): void {
        // --- 选项向上移动 ---
        if (this.shiftStart === 0) {
            return;
        }
        /** --- 当前在第几行 --- */
        const row = Math.ceil((this.shiftStart + 1) / this.rowCount) - 1;
        /** --- 当前在第几列 --- */
        const rowNow = this.shiftStart % this.rowCount;
        if (row === 0) {
            return;
        }
        /** --- 不算本行之前的总 item --- */
        const prevRowCount = (row - 1) * this.rowCount;
        /** --- 新 item 位置 index --- */
        this.select(prevRowCount + rowNow);
    }

    public arrowDown(): void {
        // --- 选项向下移动 ---
        if (this.shiftStart === this.props.data.length - 1) {
            return;
        }
        /** --- 当前在第几行(index) --- */
        const row = Math.ceil((this.shiftStart + 1) / this.rowCount) - 1;
        /** --- 当前在第几列 --- */
        const rowNow = this.shiftStart % this.rowCount;
        /** --- 总行数(index) --- */
        const allRow = Math.ceil(this.props.data.length / this.rowCount) - 1;
        if (row === allRow) {
            return;
        }
        /** --- 算本行之前的总 item --- */
        const nowRowCount = (row + 1) * this.rowCount;
        /** --- 新 item 位置 index --- */
        const newRowNow = nowRowCount + rowNow;
        if (!this.props.data[newRowNow]) {
            this.select(this.props.data.length - 1);
            return;
        }
        this.select(newRowNow);
    }

    public arrowLeft(): void {
        if (this.shiftStart === 0) {
            return;
        }
        /** --- 当前在第几列 --- */
        const rowNow = this.shiftStart % this.rowCount;
        if (rowNow > 0) {
            this.select(this.shiftStart - 1);
            return;
        }
        /** --- 当前在第几行 --- */
        const row = Math.ceil((this.shiftStart + 1) / this.rowCount) - 1;
        if (row === 0) {
            return;
        }
        this.select(row * this.rowCount - 1);
    }

    public arrowRight(): void {
        if (this.shiftStart === this.props.data.length - 1) {
            return;
        }
        /** --- 当前在第几列 --- */
        const rowNow = this.shiftStart % this.rowCount;
        if (rowNow < this.rowCount - 1) {
            if (!this.props.data[this.shiftStart + 1]) {
                return;
            }
            this.select(this.shiftStart + 1);
            return;
        }
        /** --- 当前在第几行(index) --- */
        const row = Math.ceil((this.shiftStart + 1) / this.rowCount) - 1;
        /** --- 总行数(index) --- */
        const allRow = Math.ceil(this.props.data.length / this.rowCount) - 1;
        if (row === allRow) {
            return;
        }
        this.select((row + 1) * this.rowCount);
    }

    // --- method ---

    /**
     * --- 检测 value 是否合法 ---
     */
    public checkValue(): void {
        if (!this.props.data.length) {
            return;
        }

        let change: boolean = false;
        /** --- 当前数据最大的 index --- */
        const dataMaxIndex = this.props.data.length - 1;

        // --- 检测是否是单项，但却包含了多项值 ---
        if (!this.propBoolean('multi') && (this.valueData.length > 1)) {
            change = true;
            this.valueData.splice(1);
            this.shiftStart = this.valueData[0];
        }

        // --- 检测剔除超出的值 ---
        for (let i = 0; i < this.valueData.length; ++i) {
            if (this.valueData[i] > dataMaxIndex) {
                // --- 超出 ---
                change = true;
                if (this.shiftStart === this.valueData[i]) {
                    this.shiftStart = i > 0 ? (this.valueData[0] ?? 0) : 0;
                }
                this.valueData.splice(i, 1);
                --i;
            }
        }

        // --- 检测是否必须，但却没选择（或在上面被剔除了） ---
        if (this.propBoolean('must') && (this.valueData.length === 0)) {
            change = true;
            this.valueData = [0];
            this.shiftStart = this.valueData[0];
        }

        if (change) {
            this.emit('update:modelValue', this.valueData);
        }
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
        const canSelect = (i: number): boolean => {
            if (!this.props.data[i]) {
                return false;
            }
            return true;
        };

        if (!shift && !ctrl) {
            // --- 单选 ---
            if (value === -1) {
                // --- 清除 ---
                if (this.valueData.length > 0) {
                    change = true;
                    this.valueData = [];
                }
            }
            else {
                // --- 选择 ---
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
                            this.valueData[0] = value;
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
                        || !valueData.every((item: number) => this.valueData.includes(item))
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
                        if (!this.propBoolean('must') || (this.valueData.length > 1)) {
                            change = true;
                            this.valueData.splice(indexOf, 1);
                            this.shiftStart = value;
                        }
                    }
                    else {
                        // --- 选择不存在的值 ---
                        if (canSelect(value)) {
                            change = true;
                            this.shiftStart = value;
                            if (this.propBoolean('multi')) {
                                this.valueData.push(value);
                            }
                            else {
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

    // --- flow 的鼠标或手指 down 事件 ---
    public down(e: PointerEvent): void {
        // --- 若正在显示菜单则隐藏 ---
        if (this.refs.flow.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
        }
        // --- click 空白处取消选择 ---
        if (!this.propBoolean('must')) {
            if (((e.target as HTMLElement).dataset.cgItem === undefined) && !clickgo.dom.findParentByData(e.target as HTMLElement, 'cg-item')) {
                // --- 当前点击的是空白处 ---
                clickgo.modules.pointer.click(e, () => {
                    this.select(-1, e.shiftKey, e.ctrlKey);
                });
            }
        }
        // --- 长按触发 contextmenu ---
        clickgo.modules.pointer.menu(e, () => {
            if (!this.propBoolean('must')) {
                if (((e.target as HTMLElement).dataset.cgItem === undefined) && !clickgo.dom.findParentByData(e.target as HTMLElement, 'cg-item')) {
                    // --- 当前点击的是空白处 ---
                    this.select(-1);
                }
            }
            if (this.valueData.length > 0) {
                clickgo.form.showPop(this.refs.flow.$el, this.refs.itempop, e);
            }
            else {
                clickgo.form.showPop(this.refs.flow.$el, this.refs.pop, e);
            }
        });
    }

    // --- 长按 item 选中自己，和通用事件 ---
    public itemDown(e: PointerEvent, dindex: number, value: number): void {
        // --- 弹出菜单事件设定选中 ---
        const v = dindex * this.rowCount + value;
        clickgo.modules.pointer.menu(e, () => {
            if (this.isSelected(v)) {
                return;
            }
            this.select(v, e.shiftKey, (!this.propBoolean('ctrl') && this.propBoolean('multi')) ? true : e.ctrlKey);
        });
        clickgo.modules.pointer.click(e, () => {
            this.select(v, e.shiftKey, (!this.propBoolean('ctrl') && this.propBoolean('multi')) ? true : e.ctrlKey);
            // --- 上报点击事件 ---
            const event: clickgo.control.IIconviewItemclickedEvent = {
                'detail': {
                    'event': e,
                    'value': value
                }
            };
            this.emit('itemclicked', event);
        });
        // --- 拖拽 ---
        clickgo.modules.pointer.drag(e, e.currentTarget as HTMLElement, {
            'start': () => {
                if (!this.isSelected(v)) {
                    this.select(v);
                }
                const list: any[] = [];
                for (const v of this.valueData) {
                    list.push({
                        'index': v,
                        'type': this.props.data[v].type,
                        'path': this.props.data[v].path
                    });
                }
                clickgo.modules.pointer.setDragData({
                    'rand': this.rand,
                    'type': 'fs',
                    'list': list,
                });
            }
        });
        // --- 双击 ---
        clickgo.modules.pointer.dblClick(e, () => {
            const event: clickgo.control.IIconviewOpenEvent = {
                'detail': {
                    'value': [value]
                }
            };
            this.emit('open', event);
        });
    }

    // --- 整个控件的键盘事件 ---
    public keydown(e: KeyboardEvent): void {
        if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
            return;
        }
        e.preventDefault();
        if (e.key === 'ArrowUp') {
            this.arrowUp();
        }
        else if (e.key === 'ArrowDown') {
            this.arrowDown();
        }
        else if (e.key === 'ArrowLeft') {
            this.arrowLeft();
        }
        else if (e.key === 'ArrowRight') {
            this.arrowRight();
        }
        else {
            // --- Enter ---
            if (!this.valueData.length) {
                return;
            }
            const event: clickgo.control.IIconviewOpenEvent = {
                'detail': {
                    'value': clickgo.tool.clone(this.valueData)
                }
            };
            this.emit('open', event);
        }
    }

    /** --- 拖拽操作响应 --- */
    public drop(e: CustomEvent, dindex: number, index: number): void {
        if (typeof e.detail.value !== 'object') {
            return;
        }
        if (e.detail.value.type !== 'fs') {
            return;
        }
        const list: Array<{
            'index': number;
            'type': 0 | 1 | -1 | undefined;
            'path': string;
        }> = [];
        for (const item of e.detail.value.list) {
            list.push({
                'index': item.index ?? 0,
                'type': item.type ?? -1,
                'path': item.path ?? ''
            });
        }
        const tov = dindex * this.rowCount + index;
        const event: clickgo.control.IIconviewDropEvent = {
            'detail': {
                'self': e.detail.value.rand === this.rand ? true : false,
                'from': list,
                'to': {
                    'index': tov,
                    'type': this.props.data[tov].type,
                    'path': this.props.data[tov].path ?? ''
                }
            }
        };
        this.emit('drop', event);
    }

    // --- 当出现了选区 ---
    public onBeforeSelect(): void {
        this.isSelectStart = true;
        this.selectValues = [];
        this.beforeSelectValues = this.valueData;
        this.emit('beforeselect');
    }

    public onSelect(area: Record<string, any>): void {
        // --- 判断同行有哪些可能要被选中的 index ---
        /** --- 列宽度 --- */
        const cellw = this.cw / this.rowCount;
        const cellStart = Math.floor(area.x / cellw);
        const cellEnd = Math.floor((area.x + area.width) / cellw);
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
                        const before = i * this.rowCount;
                        for (let j = cellStart; j <= cellEnd; ++j) {
                            const v = before + j;
                            if (!this.props.data[v]) {
                                continue;
                            }
                            if (this.selectValues.includes(v)) {
                                // --- 已经选中了，不管 ---
                                continue;
                            }
                            if (this.beforeSelectValues.includes(v)) {
                                // --- 本来就选中状态，不管 ---
                                continue;
                            }
                            // --- 需要选中 ---
                            this.selectValues.push(v);
                            this.select(v, false, true);
                        }
                    }
                    // --- 再看有没有要减掉的 ---
                    for (let i = 0; i < this.selectValues.length; ++i) {
                        /** --- 当前在第几行 --- */
                        const row = Math.ceil((this.selectValues[i] + 1) / this.rowCount) - 1;
                        /** --- 当前在第几列 --- */
                        const rowNow = this.selectValues[i] % this.rowCount;
                        if (row >= area.start && row <= area.end) {
                            // --- 在行之中 ---
                            if (rowNow >= cellStart && rowNow <= cellEnd) {
                                // --- 在列之中，OK ---
                                continue;
                            }
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
                        const before = i * this.rowCount;
                        for (let j = cellStart; j <= cellEnd; ++j) {
                            const v = before + j;
                            if (!this.props.data[v]) {
                                continue;
                            }
                            if (this.selectValues.includes(v)) {
                                // --- 已经选中了，不管 ---
                                continue;
                            }
                            if (this.beforeSelectValues.includes(v)) {
                                // --- 本来是选中状态，则变为不选 ---
                                this.selectValues.push(v);
                                this.select(v, false, true);
                                continue;
                            }
                            // --- 需要选中 ---
                            this.selectValues.push(v);
                            this.select(v, false, true);
                        }
                    }
                    // --- 再看有没有要减掉的 ---
                    for (let i = 0; i < this.selectValues.length; ++i) {
                        /** --- 当前在第几行 --- */
                        const row = Math.ceil((this.selectValues[i] + 1) / this.rowCount) - 1;
                        /** --- 当前在第几列 --- */
                        const rowNow = this.selectValues[i] % this.rowCount;
                        if (row >= area.start && row <= area.end) {
                            // --- 在行之中 ---
                            if (rowNow >= cellStart && rowNow <= cellEnd) {
                                // --- 在列之中，OK ---
                                continue;
                            }
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
                    let change = false;
                    for (let i = area.start; i <= area.end; ++i) {
                        const before = i * this.rowCount;
                        for (let j = cellStart; j <= cellEnd; ++j) {
                            const v = before + j;
                            if (!this.props.data[v]) {
                                continue;
                            }
                            if (this.selectValues.includes(v)) {
                                // --- 已经选中了，不管 ---
                                continue;
                            }
                            // --- 需要选中 ---
                            this.selectValues.push(v);
                            change = true;
                        }
                    }
                    // --- 再看有没有要减掉的 ---
                    for (let i = 0; i < this.selectValues.length; ++i) {
                        /** --- 当前在第几行 --- */
                        const row = Math.ceil((this.selectValues[i] + 1) / this.rowCount) - 1;
                        /** --- 当前在第几列 --- */
                        const rowNow = this.selectValues[i] % this.rowCount;
                        if (row >= area.start && row <= area.end) {
                            // --- 在行之中 ---
                            if (rowNow >= cellStart && rowNow <= cellEnd) {
                                // --- 在列之中，OK ---
                                continue;
                            }
                        }
                        // --- 要剔除 ---
                        if (this.propBoolean('must') && this.selectValues.length === 1) {
                            break;
                        }
                        this.selectValues.splice(i, 1);
                        --i;
                        change = true;
                    }
                    if (change) {
                        this.valueData = this.selectValues;
                        this.emit('update:modelValue', this.valueData);
                    }
                    else {
                        if (!this.propBoolean('must') && this.selectValues.length === 0 && this.valueData.length > 0) {
                            this.valueData = [];
                            this.emit('update:modelValue', this.valueData);
                        }
                    }
                }
                else {
                    // --- 清空 ---
                    this.select(-1);
                    this.selectValues.length = 0;
                }
            }
        }
        else {
            // --- 单行 ---
            if (!area.empty) {
                this.select(area.start * this.rowCount + cellStart, area.shift, area.ctrl);
            }
        }
        const event: clickgo.control.IIconviewSelectEvent = {
            'detail': {
                'area': {
                    'x': area.x,
                    'y': area.y,
                    'width': area.width,
                    'height': area.height,
                    'shift': area.shift,
                    'ctrl': area.ctrl,
                    'start': area.start,
                    'end': area.end,
                    'empty': area.empty
                }
            }
        };
        this.emit('select', event);
    }

    public onAfterSelect(): void {
        this.isSelectStart = false;
        this.emit('afterselect');
    }

    /** --- 更新 icon data --- */
    public async refreshIconsData(): Promise<void> {
        const needIcon: string[] = [];
        for (const item of this.props.data) {
            if (!item.icon) {
                continue;
            }
            const pre = item.icon.slice(0, 6).toLowerCase();
            if (pre === 'file:/') {
                continue;
            }
            if (pre === 'http:/' || pre === 'https:' || pre.startsWith('data:')) {
                continue;
            }
            needIcon.push(item.icon);
        }
        // --- 剔除不存在的 ---
        for (const path in this.iconsData) {
            if (needIcon.includes(path)) {
                continue;
            }
            delete this.iconsData[path];
        }
        // --- 补充存在的 ---
        for (const path of needIcon) {
            if (this.iconsData[path] !== undefined) {
                continue;
            }
            this.iconsData[path] = '';
        }
        // --- 读取 icon ---
        const count = ++this.dataCount;
        for (const path in this.iconsData) {
            if (this.iconsData[path]) {
                continue;
            }
            // --- 本 app 包 ---
            const apath = clickgo.tool.urlResolve('/package' + this.path + '/', path);
            const blob = await clickgo.fs.getContent(this, apath);
            if (count !== this.dataCount) {
                return;
            }
            if (!blob || typeof blob === 'string') {
                this.iconsData[path] = '';
                continue;
            }
            const t = await clickgo.tool.blob2DataUrl(blob);
            if (count !== this.dataCount) {
                return;
            }
            if (t) {
                this.iconsData[path] = t;
                continue;
            }
            this.iconsData[path] = '';
        }
    }

    public onMounted(): void | Promise<void> {
        this.watch('must', (): void => {
            // --- 检测是否必须，但却没选择 ---
            if (this.propBoolean('must') && (this.valueData.length === 0)) {
                // --- 要默认选择一下，先判断 shiftStart 能不能被选择，若能的话，优先选择 ---
                if (this.props.data[this.shiftStart]) {
                    this.valueData = [this.shiftStart];
                }
                else {
                    this.valueData = [0];
                    this.shiftStart = this.valueData[0];
                }
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
        this.watch('size', () => {
            this.rowCount = Math.floor(this.cw / (this.propInt('size') + 80));
            if (this.rowCount < 1) {
                this.rowCount = 1;
            }
        });

        // --- shift 原点变了，要监听并移动 scroll ---
        this.watch('shiftStart', (): void => {
            const cb = (count: number = 0): void => {
                if (this.isSelectStart) {
                    // --- 框选过程中变了，不管 ---
                    return;
                }
                /** --- 当前在第几行(index) --- */
                const row = Math.ceil((this.shiftStart + 1) / this.rowCount) - 1;
                const pos = this.refs.flow.getPos(row);
                if (!pos) {
                    if (count === 0) {
                        clickgo.task.sleep(this, () => {
                            cb(count + 1);
                        }, 50);
                    }
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
            // --- 有可能 shiftStart 是正常的，但是 data 数据还没有响应到 vflow 导致获取不到 pos，所以用了 timer 再尝试一次 ---
        });

        // --- 监听 data 变动 ---
        this.watch('data', async (): Promise<void> => {
            this.checkValue();
            await this.refreshIconsData();
        }, {
            'deep': true
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
            if (this.valueData[0] !== undefined) {
                this.shiftStart = this.valueData[0];
            }
            this.checkValue();
        });

        // --- 设置相关值 ---
        this.valueData = this.props.modelValue;
        if (this.valueData[0]) {
            this.shiftStart = this.valueData[0];
        }
        this.checkValue();
        this.refreshIconsData() as any;

        this.rand = clickgo.tool.random(16);
    }

}
