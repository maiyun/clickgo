import * as clickgo from 'clickgo';

/** --- 独立后台演示的启动状态 --- */
const state = document.getElementById('state');

class Boot extends clickgo.AbstractBoot {

    /**
     * --- 在独立宿主中启动英文后台 CGA ---
     * @returns 启动完成
     */
    public async main(): Promise<void> {
        clickgo.core.config.locale = 'en';
        clickgo.theme.setMain('#087f72');
        const taskId = await clickgo.task.run(this._sysId, './app.cga', {
            'notify': false,
        });
        if (typeof taskId !== 'string') {
            if (state) {
                state.textContent = `Unable to start ClickGo Commerce (${taskId}).`;
            }
            return;
        }
        state?.remove();
    }

    /**
     * --- 保留可诊断的演示运行错误 ---
     * @param taskId 任务 ID
     * @param formId 窗体 ID
     * @param error 原始错误
     * @param info 错误上下文
     * @returns 记录完成
     */
    public onError(taskId: string, formId: string, error: Error, info: string): void {
        console.error('ClickGo Commerce', taskId, formId, info, error);
        if (state?.isConnected) {
            state.textContent = 'Unable to load ClickGo Commerce. See the console for details.';
        }
    }

}

await clickgo.launcher(new Boot());
