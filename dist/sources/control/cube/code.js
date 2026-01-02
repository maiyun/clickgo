import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'anistart': null,
        'aniend': null,
    };
    props = {
        'hue': '255',
        'size': 's',
    };
    /** --- top 的宽度 --- */
    width = 0;
    /** --- top 的高度 --- */
    height = 0;
    /** --- 变形后的宽度 --- */
    swidth = 0;
    /** --- 变形后的高度 --- */
    sheight = 0;
    aniTimer = 0;
    down(e) {
        clickgo.modules.pointer.hover(e, {
            enter: () => {
                if (!this.aniTimer) {
                    this.emit('anistart');
                }
                // --- 动画中重置动画时间/新设动画 ---
                if (this.aniTimer) {
                    clearTimeout(this.aniTimer);
                }
                this.aniTimer = window.setTimeout(() => {
                    this.aniTimer = 0;
                    this.emit('aniend');
                }, 350);
            },
            leave: () => {
                if (!this.aniTimer) {
                    this.emit('anistart');
                }
                // --- 动画中重置动画时间/新设动画 ---
                if (this.aniTimer) {
                    clearTimeout(this.aniTimer);
                }
                this.aniTimer = window.setTimeout(() => {
                    this.aniTimer = 0;
                    this.emit('aniend');
                }, 350);
            },
        });
    }
    onMounted() {
        clickgo.dom.watchSize(this, this.refs.top, () => {
            this.width = this.refs.top.offsetWidth;
            this.height = this.refs.top.offsetHeight;
            const bcr = this.refs.top.getBoundingClientRect();
            this.swidth = bcr.width;
            this.sheight = bcr.height;
        }, true);
    }
}
