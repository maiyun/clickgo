import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public props: {
        'gutter': number | string;
    } = {
            'gutter': 0,
        };

    /** --- 当前的方向 --- */
    public direction = 'h';

    public onMounted(): void {
        clickgo.dom.watchSize(this.element, () => {
            const w = this.element.offsetWidth;
            if (w >= 600) {
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
        }, true);
    }

}
