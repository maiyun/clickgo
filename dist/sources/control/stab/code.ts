import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'update:modelValue': null,
        'change': null
    };

    public props: {
        'modelValue': number | string;
        'type': 'default' | 'plain' | 'light' | 'rect';
    } = {
            'modelValue': 0,
            'type': 'default'
        };

    /** --- 当前选中值（支持字符串 key 或数字索引） --- */
    public selected: number | string = 0;

    /** --- rect 模式下滑块宽度 --- */
    public tabItemWidth: number = 0;

    /** --- rect 模式下滑块左偏移 --- */
    public tabItemLeft: number = 0;

    /** --- rect 模式下滑块高度 --- */
    public tabItemHeight: number = 0;

    /** --- rect 模式下滑块上偏移 --- */
    public tabItemTop: number = 0;

    /** --- 不参与响应式处理的尺寸监听回调 --- */
    public access: {
        'resizeHandler': (() => void) | null;
    } = {
            'resizeHandler': null
        };

    /**
     * --- 由 stab-item 调用，设置选中值 ---
     * @param v 要选中的标识（优先为 stab-item 的 value prop，回退到 DOM 索引）
     * @returns 无返回值
     */
    public select(v: number | string): void {
        if (this.selected !== v) {
            const event: clickgo.control.IStabChangeEvent = {
                'go': true,
                preventDefault: function() {
                    this.go = false;
                },
                'detail': {
                    'value': v
                },
            };
            this.emit('change', event);
            if (!event.go) {
                return;
            }
            this.selected = v;
            this.emit('update:modelValue', this.selected);
        }
    }

    /**
     * --- 根据当前选中项的实际布局更新滑块，不触发选项切换 ---
     * @returns 无返回值
     */
    public resize(): void {
        if ((this.props.type !== 'rect') || !this.element.isConnected) {
            return;
        }
        const item = this.element.querySelector<HTMLElement>(':scope > [data-stab-item-selected]');
        this.tabItemWidth = item?.offsetWidth ?? 0;
        this.tabItemLeft = item?.offsetLeft ?? 0;
        this.tabItemHeight = item?.offsetHeight ?? 0;
        this.tabItemTop = item?.offsetTop ?? 0;
    }

    public onMounted(): void | Promise<void> {
        this.watch('modelValue', () => {
            const v = this.props.modelValue;
            if (this.selected === v) {
                return;
            }
            this.selected = v;
        }, {
            'immediate': true
        });

        this.watch('selected', async () => {
            await this.nextTick();
            this.resize();
        });
        this.watch('type', async () => {
            await this.nextTick();
            this.resize();
        }, {
            'immediate': true
        });
        this.access.resizeHandler = () => {
            this.resize();
        };
        clickgo.dom.watchSizeMulti(this, this.element, this.access.resizeHandler);
        // --- 固定宽度下 padding、居中方式或 RTL 改变也可能只移动子项而不改变尺寸 ---
        clickgo.dom.watchStyle(this.element, [
            'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
            'columnGap', 'justifyContent', 'direction', 'borderLeftWidth', 'borderTopWidth'
        ], this.access.resizeHandler);
    }

    public onBeforeUnmount(): void {
        if (this.access.resizeHandler) {
            clickgo.dom.unwatchSizeMulti(this, this.element, this.access.resizeHandler);
        }
    }

}
