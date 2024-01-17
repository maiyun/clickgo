import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

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

    /** --- 当前位置 --- */
    public get nowIndex(): number {
        if (this.props.modelValue === '#') {
            return this.dataComp.length;
        }
        for (let i = 0; i < this.dataComp.length; ++i) {
            const item = this.dataComp[i];
            if (item.value !== this.props.modelValue) {
                continue;
            }
            return i;
        }
        this.emit('update:modelValue', this.dataComp[0]?.value ?? '');
        return 0;
    }

}
