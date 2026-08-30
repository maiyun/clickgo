import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractComponent {
    emits = {
        'update:modelValue': null,
        'select': null
    };
    props = {
        'modelValue': {
            'color': '#111827',
            'opacity': '1',
            'size': '3'
        }
    };
    /** --- 本组件实例首次挂载时间 --- */
    mountedAt = '';
    get colorData() {
        return this.props.modelValue.color;
    }
    set colorData(value) {
        this.update('color', value);
    }
    get opacityData() {
        return this.props.modelValue.opacity;
    }
    set opacityData(value) {
        this.update('opacity', value);
    }
    get sizeData() {
        return this.props.modelValue.size;
    }
    set sizeData(value) {
        this.update('size', value);
    }
    /**
     * --- 更新工具参数 ---
     * @param key 参数名
     * @param value 参数值
     */
    update(key, value) {
        this.emit('update:modelValue', {
            ...this.props.modelValue,
            [key]: value
        });
    }
    onMounted() {
        this.mountedAt = new Date().toLocaleTimeString();
    }
}
