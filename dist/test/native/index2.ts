import * as native from './native';

/**
 * --- 本示例演示内容 ---
 * 默认状态，不显示实体窗体边框，单任务结束后则软件进程结束
 * 网页只运行一个 app
 * win: 沉浸式显示 app
 * 其他系统: 以主窗体为准调整大小
 */

class Boot extends native.AbstractBoot {

    public main(): void {
        this.run('../desktop/index.html?single');
    }

}
native.launcher(new Boot());
