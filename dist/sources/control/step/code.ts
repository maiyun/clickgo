import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'update:modelValue': null,
        'clicked': null
    };

    public props: {
        'data': Array<{
            'icon'?: string;
            'label'?: string;
            'value'?: string;
            'desc'?: string;
        }>;
        'plain': boolean | string;
        'modelValue': string;
    } = {
            'data': [],
            'plain': false,
            'modelValue': ''
        };

    public get dataComp(): Array<{
        'icon': string;
        'label': string;
        'value': string;
        'desc': string;
    }> {
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
    public get nowIndex(): number {
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
    public clickItem(item: { 'icon': string; 'label': string; 'value': string; 'desc': string; }, index: number): void {
        const event: clickgo.control.IStepClickedEvent = {
            'detail': {
                'index': index,
                'value': item.value,
                'label': item.label
            }
        };
        this.emit('clicked', event);
    }

    public onMounted(): void {
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
