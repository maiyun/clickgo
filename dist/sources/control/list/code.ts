import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'adaptation': boolean;
        'disabled': boolean;
        'must': boolean;
        'multi': boolean;
        'tree': boolean;
        'treeDefault': number;
        'async': boolean;
        'icon': boolean;
        'iconDefault': string;

        'data': any[];
        'modelValue': string | string[];
    } = {
            'adaptation': false,
            'disabled': false,
            'must': true,
            'multi': false,
            'tree': false,
            'treeDefault': 0,
            'async': false,
            'icon': false,
            'iconDefault': '',

            'data': [],
            'modelValue': ''
        };

    /** --- 预先格式化用户传入后的数据为 greatlist 可以识别的结构 --- */
    public dataFormat: any[] = [];

    public get isMust(): boolean {
        return clickgo.tool.getBoolean(this.props.must);
    }

    public get isMulti(): boolean {
        return clickgo.tool.getBoolean(this.props.multi);
    }

    public get isTree(): boolean {
        return clickgo.tool.getBoolean(this.props.tree);
    }

    public get isAsync(): boolean {
        return clickgo.tool.getBoolean(this.props.async);
    }

    public get isIcon(): boolean {
        return clickgo.tool.getBoolean(this.props.icon);
    }

    public get value(): number | number[] {
        let change: boolean = false;
        // --- modelValue 的格式类似：['xx', 'xxx'], 或 'xxx'，只是 value，又不是 data ---
        let modelValue = this.props.modelValue;
        if (typeof modelValue === 'object') {
            // --- 当前是数组 ---
            if (!this.isMulti) {
                // --- 但是不应该是数组 ---
                change = true;
                modelValue = modelValue[0] ?? '';
            }
        }
        else {
            if (this.isMulti) {
                // --- 但是应该是数组 ---
                change = true;
                modelValue = modelValue === '' ? [] : [modelValue];
            }
        }
        // --- 这样 modelValue 的格式就是正确的了，但是不知道是否 must 正确 ---
        // --- must 必须存在的但是却为空的，交由 greatlist 处理 ---
        if (this.isMust) {
            if (typeof modelValue === 'object') {
                if (modelValue.length === 0) {
                    return [];
                }
            }
            else {
                if (modelValue === '') {
                    return -1;
                }
            }
        }
        // --- 其他情况在这里处理 ---
        let value: number | number[];
        let label: string | string[];
        if (typeof modelValue === 'object') {
            value = [];
            label = [];
            if (modelValue.length > 0) {
                // --- 先遍历输入的 value 数组 ---
                for (let i = 0; i < modelValue.length; ++i) {
                    const item = this.find(modelValue[i], this.dataFormat);
                    if (item) {
                        const j = this.findComp(item.value);
                        value.push(j);
                        label.push(item.label);
                    }
                    else {
                        // --- 没找到或被禁用 ---
                        change = true;
                        modelValue.splice(i, 1);
                        --i;
                    }
                }
            }
        }
        else {
            value = -1;
            label = '';
            if (modelValue !== '') {
                const item = this.find(modelValue, this.dataFormat);
                if (item) {
                    const j = this.findComp(item.value);
                    value = j;
                    label = item.label;
                }
                else {
                    change = true;
                    modelValue = '';
                }
            }
        }
        if (change) {
            this.emit('update:modelValue', modelValue);
        }
        this.emit('label', label);
        return value;
    }

    public get dataComp(): any[] {
        return this.unpack(this.dataFormat);
    }

    // --- method ---

    public updateModelValue(value: number | number[]): void {
        if (typeof value === 'object') {
            const modelValue = [];
            const label = [];
            for (const item of value) {
                if (this.dataComp[item] && !this.dataComp[item].disabled) {
                    modelValue.push(this.dataComp[item].value);
                    label.push(this.dataComp[item].label);
                }
            }
            this.emit('update:modelValue', modelValue);
            this.emit('label', label);
        }
        else {
            this.emit('update:modelValue', this.dataComp[value] ? this.dataComp[value].value : '');
            this.emit('label', this.dataComp[value] ? this.dataComp[value].label : '');
        }
    }

    public formatData(newData: any[], oldData: any[]): any[] {
        const data: any[] = [];
        // --- old 是序列化后的数据，获取当层 values ---
        const oldValues: string[] = [];
        for (const item of oldData) {
            if (oldValues.includes(item.value)) {
                continue;
            }
            oldValues.push(item.value);
        }
        // --- 遍历新数据 ---
        for (let k = 0; k < newData.length; ++k) {
            const item = newData[k];
            const type = typeof item;
            const over: Record<string, any> = {
                'label': '',
                'value': '',
                'title': false,
                'disabled': false,
                'control': 'item',
                'tree': this.props.treeDefault,
                'children': []
            };
            const value = type === 'object' ? (item.value ?? item.label ?? k) : item;
            const oldIo = oldValues.indexOf(value);
            if (type === 'object') {
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

    public unpack(data: any[], level = 0): any[] {
        const result: any[] = [];
        for (const item of data) {
            let tree = item.tree;
            if ((item.children.length === 0) && !this.isAsync) {
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
            if (!this.isTree || (tree === 1)) {
                result.push(...this.unpack(item.children, level + 1));
            }
        }
        return result;
    }

    public find(value: string, data: any[]): any {
        // --- 在 format 中找 ---
        for (const item of data) {
            if ((item.value === value) && !item.disabled) {
                return item;
            }
            const result = this.find(value, item.children);
            if (result) {
                // --- 找到 ---
                if (item.tree === 0) {
                    item.tree = 1;
                }
                return result;
            }
        }
        return null;
    }

    public findComp(value: string): any {
        // --- 在 comp 中找，返回 index ---
        for (let i = 0; i < this.dataComp.length; ++i) {
            if (this.dataComp[i].value === value) {
                return i;
            }
        }
        return null;
    }

    public treeClick(item: Record<string, any>): void {
        if (item.format.tree === 0) {
            if (this.isAsync && item.format.children.length === 0) {
                // --- 异步加载子项 ---
                item.format.tree = 2;
                this.emit('load', item.value, (children?: any[]) => {
                    if (children) {
                        if (children.length === 0) {
                            item.format.children = [];
                            item.format.tree = -1;
                        }
                        else {
                            item.format.children = this.formatData(children, []);
                            item.format.tree = 1;
                        }
                    }
                    else {
                        item.format.tree = -1;
                    }
                });
            }
            else {
                item.format.tree = 1;
            }
        }
        else if (item.format.tree === 1) {
            item.format.tree = 0;
        }
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
