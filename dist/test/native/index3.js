import * as native from './native.js';
/**
 * --- 本示例演示内容 ---
 * 不显示实体窗体边框，任务结束后 Node 进程不会结束
 * 网页运行单个 app
 */
class Boot extends native.AbstractBoot {
    main() {
        this.run('../desktop/index.html?single', {
            'frame': false,
            'quit': false,
            'background': '#222',
        });
    }
}
native.launcher(new Boot());
