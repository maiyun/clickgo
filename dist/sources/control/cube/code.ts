import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'anistart': null,
        'aniend': null,
    };

    public props: {
        'hue': string;
        'size': 'xs' | 's' | 'm' | 'mh' | 'l' | 'lh' | 'xl' | 'xlh';
    } = {
            'hue': '255',
            'size': 's',
        };

    /** --- top 的宽度 --- */
    public width = 0;

    /** --- top 的高度 --- */
    public height = 0;

    /** --- 变形后的宽度 --- */
    public swidth = 0;

    /** --- 变形后的高度 --- */
    public sheight = 0;

    public aniTimer = 0;

    public down(e: PointerEvent): void {
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

    public onMounted(): void | Promise<void> {
        clickgo.dom.watchSize(this, this.refs.top, () => {
            this.width = this.refs.top.offsetWidth;
            this.height = this.refs.top.offsetHeight;
            const bcr = this.refs.top.getBoundingClientRect();
            this.swidth = bcr.width;
            this.sheight = bcr.height;
        }, true);
    }

}
