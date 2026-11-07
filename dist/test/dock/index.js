import * as clickgo from 'clickgo';
class Boot extends clickgo.AbstractBoot {
    /**
     * --- 独立启动 Demo 中的 Dock 示例，支持深色及 RTL 验收 ---
     * @returns 启动完成
     */
    async main() {
        const query = new URLSearchParams(window.location.search);
        clickgo.core.config.locale = query.has('rtl') ? 'ar' : 'en';
        const theme = query.get('theme');
        if (theme && /^[a-z]+(?:-[a-z]+)*$/.test(theme)) {
            await clickgo.theme.setGlobal(`/clickgo/theme/${theme}`, this._sysId);
        }
        // --- 开发预览先刷新同址控件缓存，确保使用刚生成的包 ---
        await fetch('../../control/common.cgc', { 'cache': 'reload' });
        const taskId = await clickgo.task.run(this._sysId, '../../app/demo.cga', {
            'notify': false,
            'after': `?${Date.now()}`,
            'data': { 'demo': 'dock' },
        });
        const state = document.getElementById('state');
        if (typeof taskId !== 'string') {
            if (state) {
                state.textContent = `Unable to start Dock demo (${taskId}).`;
            }
            return;
        }
        state?.remove();
    }
}
await clickgo.launcher(new Boot());
