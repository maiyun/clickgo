import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    border = true;
    separator = true;
    grow = false;
    message = 'Ready';
    online = true;
    plain = false;
    scroll = true;
    showRight = true;
    clickable = true;
    disabled = false;
    zoom = 100;
    clickCount = 0;
    type = ['primary'];
    /**
     * --- 展示可点击状态项，鼠标与键盘共用同一反馈 ---
     * @returns 更新示例缩放值及激活次数
     */
    activate() {
        this.zoom = this.zoom === 150 ? 100 : this.zoom + 25;
        ++this.clickCount;
    }
}
