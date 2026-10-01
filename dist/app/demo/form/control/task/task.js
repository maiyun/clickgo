import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    mode = ['dock'];
    position = ['bottom'];
    showDate = false;
    opened = true;
    selected = true;
    multi = false;
    message = '';
    menu = [
        { 'id': 'show', 'label': 'Show' },
        { 'id': 'disabled', 'label': 'Disabled', 'disabled': true },
        { 'id': 'split', 'label': '', 'separator': true },
        { 'id': 'exit', 'label': 'Exit' }
    ];
    /**
     * --- 示例通过公共配置切换真实系统任务栏 ---
     * @returns 无返回值
     */
    apply() {
        clickgo.core.config['task.position'] = this.position[0];
        clickgo.core.config['task.mode'] = this.mode[0];
    }
}
