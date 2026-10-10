import * as native from './native.js';
/**
 * --- 本示例演示内容 ---
 * 默认状态，显示实体窗体边框，所有任务结束后则软件进程结束
 * 网页运行多个 app
 */
class Boot extends native.AbstractBoot {
    async main() {
        /*
        this.run('https://maiyun.github.io/clickgo/dist/test/desktop/', {
            'frame': false,
        });
        //*/
        this.run('../desktop/index.html', {
            'width': 1024,
            'height': 768,
            'stateMax': true,
            'background': '#222',
        });
        //*/
        // --- 本地命令服务与网页共用 App 执行入口 ---
        await native.startMcp({ 'id': 'clickgo-demo' });
    }
}
native.launcher(new Boot());
