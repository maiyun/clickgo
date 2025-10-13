import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'anistart': null,
            'aniend': null,
        };
        this.props = {
            'hue': '255',
            'size': 's',
        };
        /** --- top 的宽度 --- */
        this.width = 0;
        /** --- top 的高度 --- */
        this.height = 0;
        /** --- 变形后的宽度 --- */
        this.swidth = 0;
        /** --- 变形后的高度 --- */
        this.sheight = 0;
        this.aniTimer = 0;
    }
    hoverstart(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
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
    }
    hoverend(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
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
