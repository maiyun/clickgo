import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'remove': null,
        'add': null,
        'change': null,
        'changed': null,
        'itemclicked': null,
        'itemdblclicked': null,
        'label': null,
        'item': null,
        'load': null,

        'update:modelValue': null
    };

    public props: {
        'disabled': boolean | string;
        'must': boolean | string;
        'multi': boolean | string;
        'ctrl': boolean | string;
        'selection': boolean | string;
        'gesture': string[] | string;
        'scroll': 'auto' | 'hidden' | 'visible';
        /** --- 是否开启虚拟 dom 模式，默认不开启，如果数据量超大的话才需要开启 --- */
        'virtual': boolean | string;
        'plain': boolean | string;

        'tree': boolean | string;
        /** --- -1: 不存在子项, 0: 关闭状态, 1: 存在子项打开状态, 2: 加载状态 --- */
        'treeDefault': number | string;
        'async': boolean | string;
        'icon': boolean | string;
        'iconDefault': string;
        /** --- check 选框模式，设置后选中项以控件勾选为准 --- */
        'check': boolean | string;
        /** --- 映射 label、value、children 的 key --- */
        'map': {
            'label'?: string;
            'value'?: string;
            'children'?: string;
            'title'?: string;

            'disabled'?: string;
            'control'?: string;
            'unavailable'?: string;
            'leftline'?: string;
        };
        /** --- 展现样式 --- */
        'mode': 'default' | 'view' | 'iview';

        'data': any[] | Record<string, string>;
        'disabledList': string[] | string;
        /** --- 不可用的列表（用户不能点击或键盘移动选择，但用代码可以选择） --- */
        'unavailableList': string[] | string;
        'modelValue': string[] | string;
    } = {
            'disabled': false,
            'must': true,
            'multi': false,
            'ctrl': true,
            'selection': false,
            'gesture': [],
            'scroll': 'auto',
            'virtual': false,
            'plain': false,

            'tree': false,
            'treeDefault': 0,
            'async': false,
            'icon': false,
            'iconDefault': '',
            'check': false,
            'map': {},
            'mode': 'default',

            'data': [],
            'disabledList': [],
            'unavailableList': [],
            'modelValue': []
        };

    /** --- 预先格式化用户传入后的数据为 greatlist 可以识别的结构 --- */
    public dataFormat: any[] = [];

    /** --- 传输给 greatlist 的 value --- */
    public get value(): number[] | undefined {
        if (this.propBoolean('check')) {
            return undefined;
        }

        /*
        // --- 以下代码交给 glist 处理，要不然可能 checkValue 不通过，空 data 时没法及时 updateModelValue ---
        if (!this.dataGl.length) {
            return [];
        }
        */

        let change: boolean = false;
        // --- modelValue 的格式类似：[0, 3]，是 value，不是 data ---
        const modelValue = clickgo.tool.clone(this.values);

        // --- 判断不是多选，但是却有多个数值 ---
        if (modelValue.length > 1 && !this.propBoolean('multi')) {
            change = true;
            modelValue.splice(1);
        }

        // --- must 必须存在的但是却为空的，交由 greatlist 处理 ---
        if (!modelValue.length && this.propBoolean('must')) {
            return [];
        }

        // --- 其他情况在这里处理 ---
        const value: number[] = [];
        const label: string[] = [];
        const items: any[] = [];

        if (modelValue.length > 0) {
            // --- 先遍历输入的 value 数组 ---
            for (let i = 0; i < modelValue.length; ++i) {
                const result = this.findFormat(modelValue[i]);
                if (result) {
                    const j = this.findGl(result[modelValue[i]].value)!;
                    value.push(j);
                    label.push(result[modelValue[i]].label);
                    items.push(this.dataGl[j]);
                }
                else {
                    // --- 没找到或被禁用 ---
                    change = true;
                    modelValue.splice(i, 1);
                    --i;
                }
            }
        }

        if (change) {
            this.emit('update:modelValue', modelValue);
        }
        this.emit('label', label);
        this.emit('item', items);

        return value;
    }

    /** --- 传输给 greatlist 的 data --- */
    public get dataGl(): any[] {
        return this.unpack(this.dataFormat);
    }

    /** --- 初始化后的 map 对象 --- */
    public get mapComp(): {
        'label': string;
        'value': string;
        'children': string;
        'title': string;

        'disabled': string;
        'control': string;
        'unavailable': string;
        'leftline': string;
    } {
        return {
            'children': this.props.map.children ?? 'children',
            'label': this.props.map.label ?? 'label',
            'value': this.props.map.value ?? 'value',
            'title': this.props.map.title ?? 'title',

            'disabled': this.props.map.disabled ?? 'disabled',
            'control': this.props.map.control ?? 'control',
            'unavailable': this.props.map.unavailable ?? 'unavailable',
            'leftline': this.props.map.leftline ?? 'leftline'
        };
    }

    // --- method ---

    /**
     * --- 根据 index 选中项目 ---
     */
    public select(index: number): void {
        this.refs.gl.select(index);
    }

    /** --- 更新定位，可用于 display：none 显示出来时调用 --- */
    public refreshOffset(): void {
        this.refs.gl.refreshOffset();
    }

    /**
     * --- 在 dataFormat 找 .value 值等于 value 的 item，包含子项，如果是 tree 没展开的将自动展开，用户可调用 ---
     */
    public findFormat(
        value: string | number | Array<string | number>,
        autoOpen: boolean = true,
        data?: any[],
        level?: number
    ): Record<string, any> | null {
        const rtn: Record<string, any> = {};
        level ??= 0;
        if (!Array.isArray(value)) {
            value = [value];
        }
        for (let i = 0; i < value.length; ++i) {
            if (typeof value[i] === 'string') {
                continue;
            }
            value[i] = value[i].toString();
        }
        data ??= this.dataFormat;
        for (const item of data) {
            if (value.includes(item.value)) {
                // --- 找到了 ---
                rtn[item.value] = item;
                if (Object.keys(rtn).length === value.length) {
                    // --- 全部找到 ---
                    return rtn;
                }
            }
            const result = this.findFormat(value, autoOpen, item.children, level + 1)!;
            if (Object.keys(result).length) {
                if (autoOpen && (item.tree === 0)) {
                    item.tree = 1;
                }
                Object.assign(rtn, result);
                if (Object.keys(rtn).length === value.length) {
                    return result;
                }
            }
        }
        return level ? rtn : (Object.keys(rtn).length ? rtn : null);
    }

    public arrowUp(): void {
        this.refs.gl.arrowUp();
    }

    public arrowDown(): void {
        this.refs.gl.arrowDown();
    }

    // --- 内部方法 ---

    /** --- greatlist 的更新 modelValue 的事件 --- */
    public updateModelValue(value: number[]): void {
        if (this.propBoolean('check')) {
            return;
        }
        const modelValue = [];
        const label = [];
        const items: any[] = [];
        for (const item of value) {
            if (!this.dataGl[item]) {
                continue;
            }
            modelValue.push(this.dataGl[item].value);
            label.push(this.dataGl[item].label);
            items.push(this.dataGl[item]);
        }
        this.values = modelValue;
        this.emit('update:modelValue', clickgo.tool.clone(modelValue));
        this.emit('label', label);
        this.emit('item', items);
    }

    /**
     * --- 格式化用户的数据为本控件所用的统一格式化数据 ---
     * @param nowData 当前层用户数据
     * @param oldData 老数据对比层，主要用来判断 tree 是否是打开状态
     */
    public formatData(
        nowData: Array<Record<string, any> | string> | Record<string, string | Record<string, any>>
        , oldData: any[]
    ): any[] {
        if (!Array.isArray(nowData)) {
            const newArray: Array<Record<string, string>> = [];
            for (const k in nowData) {
                const item = nowData[k];
                if (typeof item == 'string') {
                    newArray.push({
                        'value': k, 'label': item
                    });
                    continue;
                }
                item.value = k;
                newArray.push(item);
            }
            nowData = newArray;
        }
        /** --- 最终的返回数据 --- */
        const data: any[] = [];
        // --- oldData 是 format 后的数据，获取当层 values ---
        const oldValues: string[] = [];
        for (const item of oldData) {
            oldValues.push(item.value);
        }
        // --- 遍历新数据 ---
        for (let k = 0; k < nowData.length; ++k) {
            /** --- 用户单对象 --- */
            const item = nowData[k];
            /** --- 序列化后的单对象 --- */
            const over: Record<string, any> = {
                'label': '',
                'value': '',
                'title': false,
                'disabled': false,
                'color': undefined,
                'control': 'item',
                'tree': this.propInt('treeDefault'),
                'children': [],
                'data': item
            };
            /** --- 单对象的值 --- */
            let value = typeof item === 'object' ? (item[this.mapComp.value] ?? item[this.mapComp.label] ?? k) : item;
            if (typeof value === 'number') {
                value = value.toString();
            }
            /** --- 值是否在原来的 oldData 里能找到 --- */
            const oldIo = oldValues.indexOf(value);
            if (typeof item === 'object') {
                over.label = item[this.mapComp.label] ?? item[this.mapComp.value] ?? k;
                over.value = value;
                over.title = item[this.mapComp.title] !== undefined ? item[this.mapComp.title] : false;
                over.disabled = item[this.mapComp.disabled] !== undefined ?
                    item[this.mapComp.disabled] : (over.title ? true : false);
                over.control = item[this.mapComp.control];
                over.unavailable = item[this.mapComp.unavailable];
                over.leftline = item[this.mapComp.leftline];
                over.color = item.color ? (item.color === 'tip' ? 'var(--g-color-disabled)' : item.color) : undefined;
                over.control = item.control ?? 'item';
                if (item.icon) {
                    over.icon = item.icon;
                }
                if (item.openicon) {
                    over.openicon = item.openicon;
                }
                if (item.tree !== undefined) {
                    over.tree = item.tree;
                }
                if (item[this.mapComp.children]?.length > 0) {
                    over.children = this.formatData(
                        item[this.mapComp.children], oldIo !== -1 ? oldData[oldIo].children : []
                    );
                }
            }
            else {
                over.label = value;
                over.value = value;
            }
            if (oldIo !== -1) {
                over.tree = oldData[oldIo].tree;
            }
            // --- 是不是加载的结果出来了 ---
            if (over.tree === 2) {
                // --- 之前是加载中的 ---
                if (over.children.length === 0) {
                    over.tree = -1;
                }
                else {
                    over.tree = 1;
                }
            }
            else if (over.tree === 1) {
                // --- 之前可能是开启或关闭，但如果是开启，并且没有 children，children 可能是异步加载的，所以默认关起 ---
                if (over.children.length === 0) {
                    over.tree = 0;
                }
            }
            data.push(over);
        }
        return data;
    }

    /**
     * --- 将 format 数据解压为平整层，以传入给 greatlist 使用 ---
     * @param data format 数据
     * @param level 当前层级
     */
    public unpack(data: any[], level = 0): any[] {
        const result: any[] = [];
        const disabledList = this.propArray('disabledList');
        const unavailableList = this.propArray('unavailableList');
        for (const item of data) {
            /** --- -1: 不存在子项, 0: 关闭状态, 1: 存在子项打开状态, 2: 加载状态, */
            let tree = item.tree;
            if ((item.children.length === 0) && !this.propBoolean('async')) {
                // --- 没有子项，也不是异步加载，则直接 -1 ---
                tree = -1;
            }
            result.push({
                'label': item.label,
                'value': item.value,
                'title': item.title,
                'disabled': disabledList.includes(item.value) ? true : item.disabled,
                'unavailable': unavailableList.includes(item.value) ? true : item.unavailable,
                'leftline': item.leftline,
                'color': item.color,
                'control': item.control,
                'tree': tree,
                'icon': item.icon ?? this.props.iconDefault,
                'openicon': item.openicon ?? item.icon ?? this.props.iconDefault,
                'level': level,
                'format': item,
                'data': item.data
            });
            if (!this.propBoolean('tree') || (tree === 1)) {
                result.push(...this.unpack(item.children, level + 1));
            }
        }
        return result;
    }

    /**
     * --- 在 gl 数据中查找并获得 index ---
     * @param value 要查找的值
     */
    public findGl(value: string): number | null {
        // --- 在 comp 中找，返回 index ---
        for (let i = 0; i < this.dataGl.length; ++i) {
            if (this.dataGl[i].value === value) {
                return i;
            }
        }
        return null;
    }

    /** --- tree 标志点击事件 --- */
    public treeClick(e: MouseEvent, item: Record<string, any>): void {
        if (item.format.tree > -1) {
            e.stopPropagation();
        }
        // --- -1: 不存在子项, 0: 关闭状态, 1: 存在子项打开状态, 2: 加载状态 ---
        if (item.format.tree === 0) {
            // --- 关闭状态 ---
            if (this.propBoolean('async') && !item.format.children.length) {
                // --- 要异步加载子项 ---
                item.format.tree = 2;
                this.emit('load', item.value, (children?: any[]) => {
                    if (!children?.length) {
                        item.format.children = [];
                        item.format.tree = -1;
                        return;
                    }
                    item.format.children = this.formatData(children, []);
                    item.format.tree = 1;
                });
            }
            else {
                // --- 直接展开 ---
                item.format.tree = 1;
            }
        }
        else if (item.format.tree === 1) {
            // --- 在打开状态，直接变成关闭状态 ---
            item.format.tree = 0;
            if (!this.propBoolean('check')) {
                // --- 如果当前选择值在这个 child 之内，则收不上来，所以要检测是否在 child 之内，在的话就把值改成自己 ---
                for (const vitem of this.props.modelValue) {
                    if (!this.findFormat(vitem, false, item.format.children)) {
                        continue;
                    }
                    this.emit('update:modelValue', [item.value]);
                    this.emit('label', [item.label]);
                    this.emit('item', [item]);
                    const event: types.IListItemclickedEvent = {
                        'detail': {
                            'event': e,
                            'value': item.value,
                            'arrow': false
                        }
                    };
                    this.emit('itemclicked', event);
                    break;
                }
            }
        }
        // --- 其他不存在和加载状态不处理 ---
    }

    public onAdd(e: types.IGreatlistAddEvent): void {
        const event: types.IListAddEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'index': e.detail.index,
                'value': this.dataGl[e.detail.value].value
            }
        };
        this.emit('add', event);
        if (!event.go) {
            e.preventDefault();
        }
    }

    public onRemove(e: types.IGreatlistRemoveEvent): void {
        const event: types.IListRemoveEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'index': e.detail.index,
                'value': this.dataGl[e.detail.value].value
            }
        };
        this.emit('remove', event);
        if (!event.go) {
            e.preventDefault();
        }
    }

    public onChange(e: types.IGreatlistChangeEvent): void {
        const event: types.IListChangeEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'value': e.detail.value[0] === undefined ? [] : [this.dataGl[e.detail.value[0]].value]
            }
        };
        this.emit('change', event);
        if (!event.go) {
            e.preventDefault();
        }
    }

    public onChanged(e: types.IGreatlistChangedEvent): void {
        const event: types.IListChangedEvent = {
            'detail': {
                'value': e.detail.value[0] === undefined ? [] : [this.dataGl[e.detail.value[0]].value]
            }
        };
        this.emit('changed', event);
    }

    public onItemclicked(e: types.IGreatlistItemclickedEvent): void {
        const event: types.IListItemclickedEvent = {
            'detail': {
                'event': e.detail.event,
                'value': this.dataGl[e.detail.value].value,
                'arrow': e.detail.arrow
            }
        };
        this.emit('itemclicked', event);
    }

    public onItemdblclicked(e: types.IGreatlistItemdblclickedEvent): void {
        const event: types.IListItemdblclickedEvent = {
            'detail': {
                'event': e.detail.event,
                'value': this.dataGl[e.detail.value].value,
                'arrow': e.detail.arrow
            }
        };
        this.emit('itemdblclicked', event);
    }

    // --- 下面是 check 模式 ---

    /** --- 选中的项 --- */
    public values: string[] = [];

    public onCheckChange(e: types.ICheckChangeEvent, row: any): void {
        e.preventDefault();
        if (row.format.children.length) {
            // --- 有下级 ---
            const r = this.childrenTotal(row, {
                'check': e.detail.value ? (e.detail.indeterminate ? true : false) : true
            });
            if (r.change) {
                this.emit('update:modelValue', clickgo.tool.clone(this.values));
            }
            return;
        }
        // --- 无下级 ---
        const io = this.values.indexOf(row.value);
        if (io === -1) {
            // --- 没找到 ---
            this.values.push(row.value);
        }
        else {
            // --- 找到了 ---
            this.values.splice(io, 1);
        }
        this.emit('update:modelValue', clickgo.tool.clone(this.values));
    }

    /** --- 是否选中 --- */
    public get isChecked() {
        return (data: any): boolean => {
            if (data.format.children.length) {
                // --- 有下级 ---
                const r = this.childrenTotal(data);
                return r.check > 0 ? true : false;
            }
            // --- 无下级 ---
            return this.values.includes(data.value);
        };
    }

    /** --- 是否是半选 --- */
    public get isIndeterminate() {
        return (data: any): boolean => {
            if (data.format.children.length) {
                // --- 有下级 ---
                const r = this.childrenTotal(data);
                if (r.check === 0) {
                    return false;
                }
                return r.check < r.total ? true : false;
            }
            // --- 无下级 ---
            return false;
        };
    }

    /**
     * --- 获取子集所有的数量和已选中的数量 ---
     * @param data 对象
     * @param opt check: 设置旗下的选项为选中模式, checkValues: 设置后将检测 checkValues 的值是否正常
     */
    public get childrenTotal() {
        return (data: any, opt: {
            'check'?: boolean;
            'checkValues'?: {
                'wait': string[];
                'result': string[];
            };
        } = {}): {
            'total': number;
            'check': number;
            'change': boolean;
        } => {
            const rtn = {
                'total': 0,
                'check': 0,
                'change': false
            };
            if (Array.isArray(data)) {
                // --- array 模式 ---
                for (const item of data) {
                    const r = this.childrenTotal(item, opt);
                    if (r.change) {
                        rtn.change = true;
                    }
                }
                return rtn;
            }
            if (data.format) {
                data = data.format;
            }
            if (!data.children?.length) {
                // --- 没有下层，应该不会到这里，那么可能是 root 层 ---
                if (opt.checkValues) {
                    const io = opt.checkValues.wait.indexOf(data.value);
                    if (io > -1) {
                        opt.checkValues.result.push(opt.checkValues.wait[io]);
                    }
                }
                return rtn;
            }
            for (const item of data.children) {
                if (item.children?.length) {
                    const r = this.childrenTotal(item, opt);
                    rtn.total += r.total;
                    rtn.check += r.check;
                    if (r.change) {
                        rtn.change = true;
                    }
                    continue;
                }
                // --- 没有下级 ---
                if (opt.checkValues) {
                    const io = opt.checkValues.wait.indexOf(item.value);
                    if (io > -1) {
                        opt.checkValues.result.push(opt.checkValues.wait[io]);
                    }
                }
                ++rtn.total;
                if (opt.check !== undefined) {
                    if (opt.check) {
                        // --- 选中 ---
                        if (!this.values.includes(item.value)) {
                            this.values.push(item.value);
                            rtn.change = true;
                        }
                        ++rtn.check;
                    }
                    else {
                        // --- 取消选中 ---
                        const io = this.values.indexOf(item.value);
                        if (io > -1) {
                            this.values.splice(io, 1);
                            rtn.change = true;
                        }
                    }
                    continue;
                }
                if (!this.values.includes(item.value)) {
                    // --- 未勾选 ---
                    continue;
                }
                // --- 已勾选 ---
                ++rtn.check;
            }
            return rtn;
        };
    }

    /** --- 在 check 模式下检测 values 是否正常 --- */
    public refreshCheckValues(): void {
        const waitingCheck = clickgo.tool.clone(this.values);
        const result: string[] = [];
        this.childrenTotal(this.dataGl, {
            'checkValues': {
                'wait': waitingCheck,
                'result': result
            }
        });
        const r = clickgo.tool.compar(this.values, result);
        if (r.length.add || r.length.remove) {
            this.values = result;
            this.emit('update:modelValue', this.values);
        }
    }

    public onMounted(): void {
        this.watch('check', () => {
            if (!this.propBoolean('check')) {
                // --- check 变 普通 ---
                return;
            }
            // --- 普通 变 check ---
            this.refreshCheckValues();
        });
        // --- 监听 data 变动 ---
        this.watch(() => JSON.stringify(this.props.data), (n, o): void => {
            if (n === o) {
                return;
            }
            this.dataFormat =
                (Array.isArray(this.props.data) ? this.props.data.length : Object.keys(this.props.data).length) ?
                    this.formatData(this.props.data, this.dataFormat) : [];
            if (this.propBoolean('check')) {
                this.refreshCheckValues();
            }
        }, {
            'deep': true
        });
        this.watch('map', (): void => {
            this.dataFormat = this.formatData(this.props.data, this.dataFormat);
            if (this.propBoolean('check')) {
                this.refreshCheckValues();
            }
        }, {
            'deep': true
        });
        this.watch('modelValue', () => {
            if (
                (this.values.length === this.propArray('modelValue').length)
                && this.values.every((item: string) => this.propArray('modelValue').includes(item))
            ) {
                return;
            }
            this.values = clickgo.tool.clone(this.propArray('modelValue'));
            if (this.propBoolean('check')) {
                this.refreshCheckValues();
            }
        }, {
            'deep': true
        });
        this.dataFormat = this.formatData(this.props.data, this.dataFormat);
        this.values = clickgo.tool.clone(this.propArray('modelValue'));
        if (this.propBoolean('check')) {
            this.refreshCheckValues();
        }
    }

}
