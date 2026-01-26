import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'direction': null
    };
    props = {
        'gutter': 0,
        'stripe': false,
    };
    /** --- 当前的方向 --- */
    direction = 'h';
    onMounted() {
        clickgo.dom.watchSize(this, this.element, () => {
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
            this.emit('direction', this.direction);
        }, true);
    }
}
