import * as clickgo from 'clickgo';
class Boot extends clickgo.AbstractBoot {
    /**
     * --- 独立打开日期示例，支持主题、语言及控件选择 ---
     * @returns 启动完成
     */
    async main() {
        const query = new URLSearchParams(window.location.search);
        clickgo.core.config.locale = query.get('lang') ?? 'en';
        const theme = query.get('theme');
        if (theme && /^[a-z]+(?:-[a-z]+)*$/.test(theme)) {
            await clickgo.theme.setGlobal(`/clickgo/theme/${theme}`, this._sysId);
        }
        const control = query.get('control');
        const demo = control === 'daterange' || control === 'datepanel' ? control : 'date';
        // --- 开发预览刷新同址控件和应用缓存 ---
        await fetch('../../control/common.cgc', { 'cache': 'reload' });
        await fetch('../../app/demo.cga', { 'cache': 'reload' });
        const taskId = await clickgo.task.run(this._sysId, '/clickgo/app/demo.cga', {
            'notify': false,
            'data': { 'demo': demo },
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
