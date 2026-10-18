import * as clickgo from 'clickgo';
import mainFrm from './form/main';
export default class extends clickgo.core.AbstractApp {
    /**
     * --- 打开主题预览 ---
     * @param data 启动外观，appearance 为 Light 或 Dark
     * @returns 启动完成
     */
    async main(data) {
        const form = await clickgo.form.create(this, mainFrm);
        if (data['appearance'] === 'Dark') {
            form.appearance = ['Dark'];
            await form.changeAppearance();
        }
        await this.run(form);
    }
}
