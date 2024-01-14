import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public loading = false;

    /** --- 已经加载过的页面列表 --- */
    public loaded: Record<string, {
        'obj': string | (new () => clickgo.form.AbstractPanel);
        'vapp': any;
        'vroot': clickgo.form.AbstractPanel;
    }> = {};

    /** --- 当前 active 的 panel id --- */
    public activeId: number = 0;

    /** --- 隐藏老 panel --- */
    public async hideActive(): Promise<void> {
        if (!this.activeId) {
            return;
        }
        clickgo.form.removeActivePanel(this.activeId, this.formId);
        await this.loaded[this.activeId].vroot.onHide();
        const old: HTMLElement = this.element.querySelector('[data-panel-id="' + this.activeId.toString() + '"]')!;
        old.style.opacity = '0';
        old.style.pointerEvents = 'none';
    }

    /**
     * --- 供上层用户调用的，跳转页面 ---
     */
    public async go(
        cls: string | (new () => clickgo.form.AbstractPanel),
        data?: Record<string, any>
    ): Promise<boolean> {
        if (this.loading) {
            return false;
        }
        this.loading = true;
        if (typeof cls === 'string') {
            cls = clickgo.tool.urlResolve(this.path + '/', cls);
        }
        // --- 检测页面是否被加载过 ---
        for (const id in this.loaded) {
            const item = this.loaded[id];
            if (item.obj !== cls) {
                continue;
            }
            // --- 加载过要跳转的就是当前 item ---
            if (this.activeId.toString() === id) {
                // --- 同一个，什么都不处理 ---
                this.loading = false;
                return true;
            }
            // --- 不是同一个，跳转到现在设置的 ---
            await this.hideActive();
            // --- 显示新的 ---
            this.activeId = parseInt(id);
            clickgo.form.setActivePanel(this.activeId, this.formId);
            const n: HTMLElement = this.element.querySelector('[data-panel-id="' + id + '"]')!;
            n.style.opacity = '1';
            n.style.pointerEvents = '';
            await item.vroot.onShow(data ?? {});
            this.loading = false;
            return true;
        }
        // --- 要加载 ---
        try {
            const rtn = await clickgo.form.createPanel(cls, this.element, this.formId);
            // --- 隐藏老的 ---
            await this.hideActive();
            // --- 显示新的 ---
            this.activeId = rtn.id;
            clickgo.form.setActivePanel(this.activeId, this.formId);
            this.loaded[rtn.id] = {
                'obj': cls,
                'vapp': rtn.vapp,
                'vroot': rtn.vroot
            };
            const n: HTMLElement = this.element.querySelector('[data-panel-id="' + rtn.id.toString() + '"]')!;
            n.style.opacity = '1';
            n.style.pointerEvents = '';
            await rtn.vroot.onShow(data ?? {});
            this.loading = false;
            return true;
        }
        catch {
            this.loading = false;
            return false;
        }
    }

    /**
     * --- 供上层用户调用，发送给控件一段数据 ---
     * @param data 要发送的数据
     */
    public send(data: Record<string, any>): void {
        if (!this.activeId) {
            return;
        }
        this.loaded[this.activeId].vroot.onReceive(data) as any;
    }

    public onBeforeUnmount(): void | Promise<void> {
        for (const id in this.loaded) {
            clickgo.form.removePanel(parseInt(id), this.loaded[id].vapp, this.element);
            delete this.loaded[id];
        }
    }

}
