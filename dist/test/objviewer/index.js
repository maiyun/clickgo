import * as clickgo from 'clickgo';
class Boot extends clickgo.AbstractBoot {
    /**
     * --- 启动 Demo 包内的独立节点空间，复用同一套演示源码 ---
     * @returns 启动完成
     */
    async main() {
        const query = new URLSearchParams(window.location.search);
        clickgo.core.config.locale = query.has('rtl') ? 'ar' : 'en';
        const taskId = await clickgo.task.run(this._sysId, '/clickgo/app/demo.cga', {
            'notify': false,
            'data': { 'demo': 'objviewer' }
        });
        const state = document.getElementById('state');
        if (typeof taskId !== 'string') {
            if (state) {
                state.textContent = `Unable to start node space (${taskId}).`;
            }
            return;
        }
        state?.remove();
    }
}
await clickgo.launcher(new Boot());
