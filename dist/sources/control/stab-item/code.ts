import * as clickgo from 'clickgo';
import type Stab from '../stab/code.js';

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
    public stab: Stab | null = null;

    /** --- 不参与响应式处理的尺寸监听回调 --- */
    public access: {
        'resizeHandler': (() => void) | null;
    } = {
            'resizeHandler': null
        };

    /** --- 是否处于选中状态（优先按 value 比较，回退到 index） --- */
    public get isSelected(): boolean {
        return this.stab?.selected === this.itemValue;
    }

    /** --- 父级 stab 的显示类型 --- */
    public get type(): string {
        return this.stab?.props.type ?? 'default';
    }

    /**
     * --- 更新 rect 模式下的滑块位置到父级 stab ---
     * @returns 无返回值
     */
    public resize(): void {
        this.stab?.resize();
    }

    /**
     * --- 点击 item 选中 ---
     * @returns 无返回值
     */
    public click(): void {
        if (this.propBoolean('disabled') || !this.stab) {
            return;
        }
        this.stab.select(this.itemValue);
    }

    public onMounted(): void | Promise<void> {
        this.stab = this.parentByName('stab') as Stab | null;
        if (!this.stab) {
            return;
        }
        this.index = clickgo.dom.index(this.element);
        // --- 选中时更新 rect 滑块位置 ---
        this.watch('isSelected', async () => {
            await this.nextTick();
            this.resize();
        }, {
            'immediate': true
        });
        // --- 任意子项变宽都会影响居中布局和后续选中项的偏移 ---
        this.access.resizeHandler = () => {
            this.resize();
        };
        clickgo.dom.watchSizeMulti(this, this.element, this.access.resizeHandler);
    }

    public onBeforeUnmount(): void {
        if (this.access.resizeHandler) {
            clickgo.dom.unwatchSizeMulti(this, this.element, this.access.resizeHandler);
        }
    }

}
