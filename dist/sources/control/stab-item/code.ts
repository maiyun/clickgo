import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    /** --- 当前 item 在父容器中的索引（DOM 位置） --- */
    public index: number = 0;

    /** --- 实际标识：有 value 用 value，否则回退到 DOM 索引（向后兼容） --- */
    public get itemValue(): number | string {
        return this.props.value ?? this.index;
    }

    public props: {
        'disabled': boolean | string;
        /** --- 选项标识，支持字符串 key，未设置时回退到 DOM 索引 --- */
        'value'?: number | string;
    } = {
            'disabled': false,
            'value': undefined,
        };

    /** --- 父级 stab 控件实例 --- */
    public stab: (clickgo.control.AbstractControl & Record<string, any>) | null = null;

    /** --- 是否处于选中状态（优先按 value 比较，回退到 index） --- */
    public get isSelected(): boolean {
        return this.stab?.selected === this.itemValue;
    }

    /** --- 父级 stab 的显示类型 --- */
    public get type(): string {
        return (this.stab?.props as any)?.type ?? 'default';
    }

    /**
     * --- 更新 rect 模式下的滑块位置到父级 stab ---
     */
    public resize(): void {
        if ((this.stab?.props as any)?.type !== 'rect') {
            return;
        }
        this.stab?.select(this.itemValue, this.element.offsetWidth, this.element.offsetLeft);
    }

    /**
     * --- 点击 item 选中 ---
     */
    public click(): void {
        if (this.propBoolean('disabled') || !this.stab) {
            return;
        }
        this.stab.select(this.itemValue);
        this.resize();
    }

    public onMounted(): void | Promise<void> {
        this.stab = this.parentByName('stab');
        if (!this.stab) {
            return;
        }
        this.index = clickgo.dom.index(this.element);
        // --- 选中时更新 rect 滑块位置 ---
        this.watch('isSelected', () => {
            if (!this.isSelected) {
                return;
            }
            this.resize();
        }, {
            'immediate': true
        });
    }

}
