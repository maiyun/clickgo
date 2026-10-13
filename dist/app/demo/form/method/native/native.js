import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    val = 'test';
    activating = false;
    /** --- 普通配置和敏感数据分开保存，同名键互不覆盖 --- */
    persistenceKey = 'demo.preference';
    persistenceResult = '';
    /**
     * --- 写入普通配置 ---
     * @returns 显示保存结果
     */
    async setSetting() {
        this.persistenceResult = JSON.stringify(await clickgo.native.storage.set(this, this.persistenceKey, this.val));
    }
    /**
     * --- 读取普通配置，包括未找到和失败结果 ---
     * @returns 显示配置结果
     */
    async getSetting() {
        this.persistenceResult = JSON.stringify(await clickgo.native.storage.get(this, this.persistenceKey));
    }
    /**
     * --- 删除普通配置 ---
     * @returns 显示删除结果
     */
    async removeSetting() {
        this.persistenceResult = JSON.stringify(await clickgo.native.storage.remove(this, this.persistenceKey));
    }
    /**
     * --- 检查系统密钥服务 ---
     * @returns 显示安全存储可用状态
     */
    async secretAvailable() {
        this.persistenceResult = await clickgo.native.secret.isAvailable(this) ? 'Secure storage is available.' :
            'Secure storage is unavailable in this environment.';
    }
    /**
     * --- 加密后保存示例字符串 ---
     * @returns 显示保存结果
     */
    async setSecret() {
        this.persistenceResult = JSON.stringify(await clickgo.native.secret.set(this, this.persistenceKey, this.val));
    }
    /**
     * --- 用户主动读取示例敏感字符串 ---
     * @returns 显示解密结果
     */
    async getSecret() {
        this.persistenceResult = JSON.stringify(await clickgo.native.secret.get(this, this.persistenceKey));
    }
    /**
     * --- 删除敏感字符串 ---
     * @returns 显示删除结果
     */
    async removeSecret() {
        this.persistenceResult = JSON.stringify(await clickgo.native.secret.remove(this, this.persistenceKey));
    }
    async getListenerList() {
        await clickgo.form.dialog(this, JSON.stringify(clickgo.native.getListenerList()));
    }
    async max() {
        await clickgo.native.max(this);
    }
    async min() {
        await clickgo.native.min(this);
    }
    async activate() {
        if (this.activating) {
            return;
        }
        this.activating = true;
        await clickgo.tool.sleep(2_000);
        await clickgo.native.activate(this);
        this.activating = false;
    }
    async ping() {
        await clickgo.form.dialog(this, await clickgo.native.ping(this.val) ?? 'undefined');
    }
    async isMax() {
        await clickgo.form.dialog(this, await clickgo.native.isMax() ? 'true' : 'false');
    }
    async open() {
        const rtn = await clickgo.native.open({
            'filters': [
                {
                    'name': 'Image',
                    'accept': ['jpg', 'png'],
                },
            ],
        });
        await clickgo.form.dialog(this, JSON.stringify(rtn));
    }
    async save() {
        const rtn = await clickgo.native.save({
            'filters': [
                {
                    'name': 'Image',
                    'accept': ['jpg', 'png'],
                },
            ],
        });
        await clickgo.form.dialog(this, JSON.stringify(rtn));
    }
    async dialog(opts) {
        const rtn = await clickgo.native.dialog({
            'title': opts.title,
            'message': opts.message,
            'type': opts.type,
            'detail': opts.detail,
            'buttons': opts.buttons,
        });
        await clickgo.form.dialog(this, JSON.stringify(rtn));
    }
}
