import * as native from './native';

/**
 * --- 本示例演示内容 ---
 * 默认状态，不显示实体窗体边框，首个任务结束后则软件进程结束
 * 网页运行多个 app
 * win: 沉浸式显示多个 app
 * 其他系统: 其他系统此模式会出错，调整为兼容 frame 模式
 */

class Boot extends native.AbstractBoot {

    public main(): void {
        this.run('../desktop/index.html', {
            'frame': this.platform === 'win32' ? false : true
        });
        //*/
    }

}
native.launcher(new Boot());
