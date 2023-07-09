import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'disabled': boolean | string;
        'must': boolean | string;
        'multi': boolean | string;
        'ctrl': boolean | string;
        'selection': boolean | string;
        'gesture': string[] | string;
        'scroll': 'auto' | 'hidden' | 'visible';

        'tree': boolean | string;
        /** --- -1: 不存在子项, 0: 关闭状态, 1: 存在子项打开状态, 2: 加载状态 --- */
        'treeDefault': number | string;
        'async': boolean | string;
        'icon': boolean | string;
        'iconDefault': string;

        'data': any[] | Record<string, string>;
        'modelValue': Array<string | number>;
    } = {
            'disabled': false,
            'must': true,
            'multi': false,
            'ctrl': true,
            'selection': false,
            'gesture': [],
            'scroll': 'auto',

            'tree': false,
            'treeDefault': 0,
            'async': false,
            'icon': false,
            'iconDefault': '',

            'data': [],
            'modelValue': []
        };

    /** --- 预先格式化用户传入后的数据为 greatlist 可以识别的结构 --- */
    public dataFormat: any[] = [];

    /** --- 传输给 greatlist 的 value --- */
    public get value(): number[] {
        if (!this.dataGl.length) {
            return [];
        }

        let change: boolean = false;
        // --- modelValue 的格式类似：[0, 3]，是 value，不是 data ---
        const modelValue = clickgo.tool.clone(this.props.modelValue);

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

        if (modelValue.length > 0) {
            // --- 先遍历输入的 value 数组 ---
            for (let i = 0; i < modelValue.length; ++i) {
                const result = this.findFormat(modelValue[i]);
                if (result) {
                    const j = this.findGl(result[modelValue[i]].value)!;
                    value.push(j);
                    label.push(result[modelValue[i]].label);
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

        return value;
    }

    /** --- 传输给 greatlist 的 data --- */
    public get dataGl(): any[] {
        return this.unpack(this.dataFormat);
    }

    // --- method ---

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
        if (level === undefined) {
            level = 0;
        }
        if (!Array.isArray(value)) {
            value = [value];
        }
        if (!data) {
            data = this.dataFormat;
        }
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
        const modelValue = [];
        const label = [];
        for (const item of value) {
            if (!this.dataGl[item]) {
                continue;
            }
            modelValue.push(this.dataGl[item].value);
            label.push(this.dataGl[item].label);
        }
        this.emit('update:modelValue', modelValue);
        this.emit('label', label);
    }

    /**
     * --- 格式化用户的数据为本控件所用的统一格式化数据 ---
     * @param nowData 当前层用户数据
     * @param oldData 老数据对比层，主要用来判断 tree 是否是打开状态
     */
    public formatData(nowData: Array<Record<string, any> | string> | Record<string, string>, oldData: any[]): any[] {
        if (!Array.isArray(nowData)) {
            const newArray: Array<Record<string, string>> = [];
            for (const k in nowData) {
                newArray.push({
                    'value': k, 'label': nowData[k]
                });
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
            /** --- 序列化后的单对象 --- */
            const over: Record<string, any> = {
                'label': '',
                'value': '',
                'title': false,
                'disabled': false,
                'control': 'item',
                'tree': this.props.treeDefault,
                'children': []
            };
            /** --- 用户单对象 --- */
            const item = nowData[k];
            /** --- 单对象的值 --- */
            const value = typeof item === 'object' ? (item.value ?? item.label ?? k) : item;
            /** --- 值是否在原来的 oldData 里能找到 --- */
            const oldIo = oldValues.indexOf(value);
            if (typeof item === 'object') {
                over.label = item.label ?? item.value ?? k;
                over.value = value;
                over.title = item.title !== undefined ? item.title : false;
                over.disabled = item.disabled !== undefined ? item.disabled : (over.title ? true : false);
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
                if (item.children?.length > 0) {
                    over.children = this.formatData(item.children, oldIo !== -1 ? oldData[oldIo].children : []);
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
                if (over.children.length === 0) {
                    over.tree = -1;
                }
                else {
                    over.tree = 1;
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
                'disabled': item.disabled,
                'control': item.control,
                'tree': tree,
                'icon': item.icon ?? this.props.iconDefault,
                'openicon': item.openicon ?? item.icon ?? this.props.iconDefault,
                'level': level,
                'format': item
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
            // --- 如果当前选择值在这个 child 之内，则收不上来，所以要检测是否在 child 之内，在的话就把值改成自己 ---
            for (const vitem of this.props.modelValue) {
                if (!this.findFormat(vitem, false, item.format.children)) {
                    continue;
                }
                this.emit('update:modelValue', [item.value]);
                this.emit('label', item.label);
                break;
            }
        }
        // --- 其他不存在和加载状态不处理 ---
    }

    public onMounted(): void {
        this.watch('data', (): void => {
            this.dataFormat = this.formatData(this.props.data, this.dataFormat);
        }, {
            'immediate': true,
            'deep': true
        });
    }

}
