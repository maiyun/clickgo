import * as native from './native.js';

/**
 * --- 本示例演示内容 ---
 * 不显示实体窗体边框，任务结束后 Node 进程不会结束
 * 网页运行单个 app
 */

class Boot extends native.AbstractBoot {

    public async main(): Promise<void> {
        this.run('../desktop/index.html?single', {
            'frame': false,
            'quit': false,
            'background': '#222',
        });
        // --- 本地命令服务与网页共用 App 执行入口 ---
        await native.startMcp({ 'id': 'clickgo-demo' });
    }

}
native.launcher(new Boot());
