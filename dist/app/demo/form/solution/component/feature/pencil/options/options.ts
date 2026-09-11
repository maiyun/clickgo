import * as clickgo from 'clickgo';

import type { IToolOptions } from '../../../model';

export default class extends clickgo.form.AbstractComponent {

    public emits = {
        'update:modelValue': null,
        'select': null
    };

    public props: {
        'modelValue': IToolOptions;
    } = {
            'modelValue': {
                'color': '#111827',
                'opacity': '1',
                'size': '3'
            }
        };

    /** --- 本组件实例首次挂载时间 --- */
    public mountedAt = '';

    public get colorData(): string {
        return this.props.modelValue.color;
    }

    public set colorData(value: string) {
        this.update('color', value);
    }

    public get opacityData(): string {
        return this.props.modelValue.opacity;
    }

    public set opacityData(value: string) {
        this.update('opacity', value);
    }

    /** --- 供滑块使用的数值透明度 --- */
    public get opacitySliderData(): number {
        return parseFloat(this.opacityData);
    }

    public set opacitySliderData(value: number) {
        this.opacityData = value.toString();
    }

    public get sizeData(): string {
        return this.props.modelValue.size;
    }

    public set sizeData(value: string) {
        this.update('size', value);
    }

    /** --- 供滑块使用的数值铅笔大小 --- */
    public get sizeSliderData(): number {
        return parseFloat(this.sizeData);
    }

    public set sizeSliderData(value: number) {
        this.sizeData = value.toString();
    }

    /**
     * --- 更新工具参数 ---
     * @param key 参数名
     * @param value 参数值
     */
    public update(key: keyof IToolOptions, value: string): void {
        this.emit('update:modelValue', {
            ...this.props.modelValue,
            [key]: value
        });
    }

    public onMounted(): void {
        this.mountedAt = new Date().toLocaleTimeString();
    }

}
