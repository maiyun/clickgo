import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    /** --- 应用模板的 @click 由框架统一转换为 tap --- */
    emits = { 'tap': null };
    props = {
        'grow': false,
        'type': 'default',
        'clickable': false,
        'disabled': false,
    };
    /** --- 空格按下后显示激活状态，释放时才执行 --- */
    isSpaceDown = false;
    /**
     * --- 鼠标及键盘共用激活通知，保留原事件供框架检查 ---
     * @param event 鼠标或键盘事件
     * @returns 无；普通项及禁用项不激活
     */
    activate(event) {
        if (!this.propBoolean('clickable') || this.propBoolean('disabled')) {
            return;
        }
        this.emit('tap', event);
    }
    /**
     * --- 回车激活，空格等待释放，阻止空格滚动页面 ---
     * @param event 键盘事件
     * @returns 无
     */
    keydown(event) {
        if (!this.formFocus || !this.propBoolean('clickable') || this.propBoolean('disabled')) {
            return;
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            if (!event.repeat) {
                this.activate(event);
            }
        }
        else if (event.key === ' ') {
            event.preventDefault();
            this.isSpaceDown = true;
        }
    }
    /**
     * --- 空格释放时激活；失焦后释放不再执行 ---
     * @param event 键盘事件
     * @returns 无
     */
    keyup(event) {
        if (event.key !== ' ' || !this.isSpaceDown) {
            return;
        }
        this.isSpaceDown = false;
        if (this.formFocus && this.propBoolean('clickable') && !this.propBoolean('disabled')) {
            this.activate(event);
        }
    }
}
