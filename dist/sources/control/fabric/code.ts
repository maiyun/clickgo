import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'init': null
    };

    public props: {
        'disabled': boolean | string;
    } = {
            'disabled': false,
        };

    public notInit = false;

    public isLoading = true;

    public access: {
        /** --- fabric Canvas 对象 --- */
        'canvas': any;
    } = {
            'canvas': undefined,
        };

    public async onMounted(): Promise<void> {
        const fabric = await clickgo.core.getModule('fabric');
        if (!fabric) {
            // --- 没有成功 ---
            this.isLoading = false;
            this.notInit = true;
            return;
        }

        // --- 获取元素实际宽高 ---
        const cw = this.refs.content.clientWidth;
        const ch = this.refs.content.clientHeight;

        // --- 初始化 fabric canvas ---
        this.access.canvas = new fabric.Canvas(this.refs.content, {
            'width': cw,
            'height': ch,
        });

        // --- 自适应大小 ---
        clickgo.dom.watchSize(this, this.element, () => {
            if (!this.access.canvas) {
                return;
            }
            this.access.canvas.setDimensions({
                'width': this.element.clientWidth,
                'height': this.element.clientHeight,
            });
            // this.access.canvas.renderAll();
        }, true);

        // --- 初始化成功 ---
        this.isLoading = false;
        this.emit('init', this.access.canvas);
    }

    public onUnmounted(): void {
        if (this.access.canvas) {
            this.access.canvas.dispose();
            this.access.canvas = undefined;
        }
    }

}
