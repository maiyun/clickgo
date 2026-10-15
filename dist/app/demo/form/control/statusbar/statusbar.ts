import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public border = true;

    public separator = true;

    public grow = false;

    public message = 'Ready';

    public online = true;

    public plain = false;

    public scroll = true;

    public showRight = true;

    public clickable = true;

    public disabled = false;

    public zoom = 100;

    public clickCount = 0;

    public type: Array<'default' | 'primary' | 'info' | 'warning' | 'danger' | 'cg'> = ['primary'];

    /**
     * --- 展示可点击状态项，鼠标与键盘共用同一反馈 ---
     * @returns 更新示例缩放值及激活次数
     */
    public activate(): void {
        this.zoom = this.zoom === 150 ? 100 : this.zoom + 25;
        ++this.clickCount;
    }

}
