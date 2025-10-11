import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {};
        this.props = {
            'direction': 'h',
            'gutter': '',
            'alignH': undefined,
            'alignV': undefined,
            'plain': false
        };
        this.scaleS = 1;
        this.scaleX = 0;
        this.scaleY = 0;
    }
    /** --- 绑定缩放事件 --- */
    scale(oe) {
        clickgo.dom.bindScale(oe, (e, scale, cpos) => {
            e.preventDefault();
            this.scaleX += cpos.x;
            this.scaleY += cpos.y;
            this.scaleS *= scale;
            if (this.scaleS > 5) {
                this.scaleS = 5;
            }
            else if (this.scaleS < 0.3) {
                this.scaleS = 0.3;
            }
        });
    }
    /** --- 重置缩放/定位 --- */
    refresh() {
        this.scaleS = 1;
        this.scaleX = (this.element.offsetWidth - this.refs.content.offsetWidth) / 2;
        this.scaleY = (this.element.offsetHeight - this.refs.content.offsetHeight) / 2;
    }
    async onMounted() {
        await clickgo.tool.sleep(34);
        this.refresh();
    }
}
