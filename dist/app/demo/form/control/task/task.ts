import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public mode = ['dock'];

    public position = ['bottom'];

    public showDate = false;

    public startShown = true;

    public startOpened = false;

    public startDisabled = false;

    public startLabel = ['auto'];

    public opened = true;

    public selected = true;

    public multi = false;

    public message = '';

    public menu: clickgo.task.ITrayMenuItem[] = [
        { 'id': 'show', 'label': 'Show' },
        { 'id': 'disabled', 'label': 'Disabled', 'disabled': true },
        { 'id': 'split', 'label': '', 'separator': true },
        { 'id': 'exit', 'label': 'Exit' }
    ];

    /**
     * --- 示例通过公共配置切换真实系统任务栏 ---
     * @returns 无返回值
     */
    public apply(): void {
        clickgo.core.config['task.position'] = this.position[0] as clickgo.core.IConfig['task.position'];
        clickgo.core.config['task.mode'] = this.mode[0] as clickgo.core.IConfig['task.mode'];
    }

}
