import * as native from './native';

/**
 * --- 本示例演示内容 ---
 * 显示实体窗体边框，网页所有任务结束后则软件进程结束
 * 网页运行多个 app
 * 此模式下所有系统效果相同
 */

class Boot extends native.AbstractBoot {

    public main(): void {
        this.run('../desktop/index.html', {
            'frame': true
        });
    }

}
native.launcher(new Boot());
