import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public val = 'test';

    public activating = false;

    /** --- 普通配置和敏感数据分开保存，同名键互不覆盖 --- */
    public persistenceKey = 'demo.preference';

    public persistenceResult = '';

    /**
     * --- 写入普通配置 ---
     * @returns 显示保存结果
     */
    public async setSetting(): Promise<void> {
        this.persistenceResult = JSON.stringify(await clickgo.native.storage.set(this, this.persistenceKey, this.val));
    }

    /**
     * --- 读取普通配置，包括未找到和失败结果 ---
     * @returns 显示配置结果
     */
    public async getSetting(): Promise<void> {
        this.persistenceResult = JSON.stringify(await clickgo.native.storage.get(this, this.persistenceKey));
    }

    /**
     * --- 删除普通配置 ---
     * @returns 显示删除结果
     */
    public async removeSetting(): Promise<void> {
        this.persistenceResult = JSON.stringify(await clickgo.native.storage.remove(this, this.persistenceKey));
    }

    /**
     * --- 检查系统密钥服务 ---
     * @returns 显示安全存储可用状态
     */
    public async secretAvailable(): Promise<void> {
        this.persistenceResult = await clickgo.native.secret.isAvailable(this) ? 'Secure storage is available.' :
            'Secure storage is unavailable in this environment.';
    }

    /**
     * --- 加密后保存示例字符串 ---
     * @returns 显示保存结果
     */
    public async setSecret(): Promise<void> {
        this.persistenceResult = JSON.stringify(await clickgo.native.secret.set(this, this.persistenceKey, this.val));
    }

    /**
     * --- 用户主动读取示例敏感字符串 ---
     * @returns 显示解密结果
     */
    public async getSecret(): Promise<void> {
        this.persistenceResult = JSON.stringify(await clickgo.native.secret.get(this, this.persistenceKey));
    }

    /**
     * --- 删除敏感字符串 ---
     * @returns 显示删除结果
     */
    public async removeSecret(): Promise<void> {
        this.persistenceResult = JSON.stringify(await clickgo.native.secret.remove(this, this.persistenceKey));
    }

    public async getListenerList(): Promise<void> {
        await clickgo.form.dialog(this, JSON.stringify(clickgo.native.getListenerList()));
    }

    public async max(): Promise<void> {
        await clickgo.native.max(this);
    }

    public async min(): Promise<void> {
        await clickgo.native.min(this);
    }

    public async activate(): Promise<void> {
        if (this.activating) {
            return;
        }
        this.activating = true;
        await clickgo.tool.sleep(2_000);
        await clickgo.native.activate(this);
        this.activating = false;
    }

    public async ping(): Promise<void> {
        await clickgo.form.dialog(this, await clickgo.native.ping(this.val) ?? 'undefined');
    }

    public async isMax(): Promise<void> {
        await clickgo.form.dialog(this, await clickgo.native.isMax() ? 'true' : 'false');
    }

    public async open(): Promise<void> {
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

    public async save(): Promise<void> {
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

    public async dialog(opts: {
        'title'?: string;
        'message'?: string;
        'type'?: 'info' | 'error' | 'question' | 'warning';
        'detail'?: string;
        'buttons'?: string[];
    }): Promise<void> {
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
