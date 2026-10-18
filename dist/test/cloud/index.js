import * as clickgo from 'clickgo';
class Boot extends clickgo.AbstractBoot {
    /**
     * --- 启动独立主题预览 ---
     * @returns 启动完成
     */
    async main() {
        clickgo.core.config.locale = new URLSearchParams(window.location.search).has('rtl') ? 'ar' : 'en';
        clickgo.theme.setMain('#2563eb');
        const appearance = new URLSearchParams(window.location.search).get('theme');
        const taskId = await clickgo.task.run(this._sysId, './app.cga', {
            'notify': false,
            'data': { 'appearance': appearance === 'dark' ? 'Dark' : 'Light' }
        });
        const state = document.getElementById('state');
        if (typeof taskId !== 'string') {
            if (state) {
                state.textContent = `Unable to start Cloud preview (${taskId}).`;
            }
            return;
        }
        state?.remove();
    }
    /**
     * --- 记录预览错误 ---
     * @param taskId 任务 ID
     * @param formId 窗体 ID
     * @param error 原始错误
     * @param info 错误上下文
     * @returns 记录完成
     */
    onError(taskId, formId, error, info) {
        // eslint-disable-next-line no-console
        console.error('Cloud preview', taskId, formId, info, error);
    }
}
await clickgo.launcher(new Boot());
