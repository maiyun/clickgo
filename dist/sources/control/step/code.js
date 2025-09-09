import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'update:modelValue': null
        };
        this.props = {
            'data': [],
            'plain': false,
            'modelValue': ''
        };
    }
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
    /** --- 当前位置 --- */
    get nowIndex() {
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
