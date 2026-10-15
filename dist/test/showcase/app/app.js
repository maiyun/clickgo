import * as clickgo from 'clickgo';
import mainFrm from './form/main';
export default class extends clickgo.core.AbstractApp {
    /**
     * --- 启动截图演示窗体 ---
     * @returns 启动完成
     */
    async main() {
        await this.run(await clickgo.form.create(this, mainFrm));
    }
}
