import * as clickgo from 'clickgo';
import * as types from '~/types/index';

export const props = {
    'adaptation': {
        'dafault': undefined
    },
    'disabled': {
        'default': undefined
    },
    'must': {
        'default': true
    },
    'multi': {
        'default': false,
    },

    'data': {
        'default': []
    },
    'modelValue': {
        'default': ''
    }
};

/**
 * --- 将用户数据格式化为 list 所能识别的格式 ---
 * @param data 用户传入数据
 */
function formatData(inData: any[], level: number = 0): any[] {
    let data: any[] = [];
    for (let k = 0; k < inData.length; ++k) {
        const item = inData[k];
        const type = typeof item;
        const over = {
            'label': '',
            'value': '',
            'title': false,
            'disabled': false,
            'control': 'item',
            'level': level
        };
        if (type === 'object') {
            over.label = item.label ?? item.value ?? k;
            over.value = item.value ?? item.label ?? k;
            over.title = item.children ? true : false;
            over.disabled = over.title ? true : (item.disabled ?? false);
            over.control = item.control ?? 'item';
            data.push(over);
            if (item.children) {
                data = data.concat(formatData(item.children, level + 1));
            }
        }
        else {
            over.label = item;
            over.value = item;
            data.push(over);
        }
    }
    return data;
}

export const computed = {
    'isMust': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.must);
    },
    'isMulti': function(this: types.IVControl): boolean {
        return clickgo.tool.getBoolean(this.multi);
    },

    'dataComp': function(this: types.IVControl): any[] {
        return formatData(this.data);
    },
    'value': function(this: types.IVControl): number | number[] {
        let change: boolean = false;
        // --- modelValue 的格式类似：['xx', 'xxx'], 或 'xxx'，只是 value，又不是 data ---
        let modelValue = this.modelValue;
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
                for (let i = 0; i < modelValue.length; ++i) {
                    let found = false;
                    // --- 先遍历输入的 value 数组 ---
                    for (let k = 0; k < this.dataComp.length; ++k) {
                        // --- 再遍历格式化后的数据，看看有没有 value 和输入的数组值匹配 ---
                        if (this.dataComp[k].value === modelValue[i]) {
                            // --- 匹配了 ---
                            if (!this.dataComp[k].disabled && !this.dataComp[k].title) {
                                // --- 并且未被禁用，才属于有效 ---
                                found = true;
                                value.push(k);
                                label.push(this.dataComp[k].label);
                            }
                            break;
                        }
                    }
                    if (!found) {
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
                for (let k = 0; k < this.dataComp.length; ++k) {
                    if (this.dataComp[k].value === modelValue) {
                        if (!this.dataComp[k].disabled && !this.dataComp[k].title) {
                            value = k;
                            label = this.dataComp[k].label;
                        }
                        break;
                    }
                }
                if (value === -1) {
                    change = true;
                    modelValue = '';
                }
            }
        }
        if (change) {
            this.$emit('update:modelValue', modelValue);
        }
        this.$emit('label', label);
        return value;
    }
};

export const methods = {
    updateModelValue: function(this: types.IVControl, value: number | number[]): void {
        if (typeof value === 'object') {
            const modelValue = [];
            const label = [];
            for (const item of value) {
                if (this.dataComp[item] && !this.dataComp[item].disabled && !this.dataComp[item].title) {
                    modelValue.push(this.dataComp[item].value);
                    label.push(this.dataComp[item].label);
                }
            }
            this.$emit('update:modelValue', modelValue);
            this.$emit('label', label);
        }
        else {
            this.$emit('update:modelValue', this.dataComp[value] ? this.dataComp[value].value : '');
            this.$emit('label', this.dataComp[value] ? this.dataComp[value].label : '');
        }
    }
};
