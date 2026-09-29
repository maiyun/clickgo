import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    /** --- 当前 item 在父容器中的索引（DOM 位置） --- */
    index = 0;
    /** --- 实际标识：有 value 用 value，否则回退到 DOM 索引（向后兼容） --- */
    get itemValue() {
        return this.props.value ?? this.index;
    }
    props = {
        'disabled': false,
        'value': undefined,
    };
    /** --- 父级 stab 控件实例 --- */
    stab = null;
    /** --- 不参与响应式处理的尺寸监听回调 --- */
    access = {
        'resizeHandler': null
    };
    /** --- 是否处于选中状态（优先按 value 比较，回退到 index） --- */
    get isSelected() {
        return this.stab?.selected === this.itemValue;
    }
    /** --- 父级 stab 的显示类型 --- */
    get type() {
        return this.stab?.props.type ?? 'default';
    }
    /**
     * --- 更新 rect 模式下的滑块位置到父级 stab ---
     * @returns 无返回值
     */
    resize() {
        this.stab?.resize();
    }
    /**
     * --- 点击 item 选中 ---
     * @returns 无返回值
     */
    click() {
        if (this.propBoolean('disabled') || !this.stab) {
            return;
        }
        this.stab.select(this.itemValue);
    }
    onMounted() {
        this.stab = this.parentByName('stab');
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
    onBeforeUnmount() {
        if (this.access.resizeHandler) {
            clickgo.dom.unwatchSizeMulti(this, this.element, this.access.resizeHandler);
        }
    }
}
