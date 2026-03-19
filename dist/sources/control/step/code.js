import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'update:modelValue': null,
        'clicked': null
    };
    props = {
        'data': [],
        'plain': false,
        'modelValue': ''
    };
    get dataComp() {
        const data = [];
        for (const item of this.props.data) {
            data.push({
                'icon': item.icon ?? '',
                'label': item.label ?? item.value ?? 'label',
                'value': item.value ?? item.label ?? 'value',
                'desc': item.desc ?? ''
            });
        }
        return data;
    }
    /** --- 当前步骤索引 --- */
    get nowIndex() {
        if (this.props.modelValue === '#') {
            return this.dataComp.length;
        }
        for (let i = 0; i < this.dataComp.length; ++i) {
            if (this.dataComp[i].value === this.props.modelValue) {
                return i;
            }
        }
        return 0;
    }
    /**
     * --- 点击步骤节点 ---
     * @param item 当前步骤数据
     * @param index 当前步骤索引
     */
    clickItem(item, index) {
        const event = {
            'detail': {
                'index': index,
                'value': item.value,
                'label': item.label
            }
        };
        this.emit('clicked', event);
    }
    onMounted() {
        /** --- 校验 modelValue 是否合法，不合法则自动纠正为第一项 --- */
        this.watch('modelValue', () => {
            if (this.props.modelValue === '#') {
                return;
            }
            for (const item of this.dataComp) {
                if (item.value === this.props.modelValue) {
                    return;
                }
            }
            this.emit('update:modelValue', this.dataComp[0]?.value ?? '');
        }, {
            'immediate': true
        });
    }
}
