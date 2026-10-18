import * as clickgo from 'clickgo';
class Boot extends clickgo.AbstractBoot {
    /**
     * --- 独立打开 Demo 包中的日期与年月示例 ---
     * @returns 启动完成
     */
    async main() {
        const query = new URLSearchParams(window.location.search);
        clickgo.core.config.locale = query.get('lang') ?? 'en';
        const taskId = await clickgo.task.run(this._sysId, '/clickgo/app/demo.cga', {
            'notify': false,
            'data': { 'demo': 'date' },
        });
        const state = document.getElementById('state');
        if (typeof taskId !== 'string') {
            if (state) {
                state.textContent = `Unable to start Date demo (${taskId}).`;
            }
            return;
        }
        state?.remove();
    }
}
await clickgo.launcher(new Boot());
