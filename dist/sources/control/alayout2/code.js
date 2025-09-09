import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'direction': null
        };
        this.props = {
            'gutter': 0,
        };
        /** --- 当前的方向 --- */
        this.direction = 'h';
    }
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
