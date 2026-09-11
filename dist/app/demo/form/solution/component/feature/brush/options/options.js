import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractComponent {
    emits = {
        'update:modelValue': null,
        'select': null
    };
    props = {
        'modelValue': {
            'color': '#2563eb',
            'opacity': '.35',
            'size': '18'
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
    /** --- 供滑块使用的数值透明度 --- */
    get opacitySliderData() {
        return parseFloat(this.opacityData);
    }
    set opacitySliderData(value) {
        this.opacityData = value.toString();
    }
    get sizeData() {
        return this.props.modelValue.size;
    }
    set sizeData(value) {
        this.update('size', value);
    }
    /** --- 供滑块使用的数值笔刷大小 --- */
    get sizeSliderData() {
        return parseFloat(this.sizeData);
    }
    set sizeSliderData(value) {
        this.sizeData = value.toString();
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
