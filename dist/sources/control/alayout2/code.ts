import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'direction': null
    };

    public props: {
        'gutter': number | string;
        'stripe': boolean | string;
        /** --- breakpoint，切换为纵向布局的宽度断点 --- */
        'breakpoint': number | string;
    } = {
            'gutter': 0,
            'stripe': false,
            'breakpoint': 600,
        };

    /** --- 当前的方向 --- */
    public direction = 'h';

    public onMounted(): void {
        clickgo.dom.watchSize(this, this.element, () => {
            const w = this.element.offsetWidth;
            if (w >= Math.max(0, this.propNumber('breakpoint'))) {
                // --- 应为横向 ---
                if (this.direction === 'v') {
                    this.direction = 'h';
                }
            }
            else {
                if (this.direction === 'h') {
                    this.direction = 'v';
                }
            }
            this.emit('direction', this.direction);
        }, true);
    }

}
