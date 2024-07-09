import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'go': null,
        'went': null
    };

    public props: {
        'modelValue': string;
        'plain': boolean | string;
        /** --- 传入 map 后，则 modelValue 会生效，可根据 modelValue 自动跳转到相应面板（这种模式无法带 data 参数，如果和 nav 合用，则 modelValue 失效，以 nav 的选中的 name 为准） */
        'map': Record<string, string | (new () => clickgo.form.AbstractPanel)> | null;
    } = {
            'modelValue': '',
            'plain': false,
            'map': null
        };

    /** --- 如果有 map，要看当前真实选中的 key 是谁 --- */
    public mapSelected = '';

    public loading = false;

    /** --- 已经加载过的页面列表 --- */
    public loaded: Record<string, {
        'obj': string | (new () => clickgo.form.AbstractPanel);
        'vapp': any;
        'vroot': clickgo.form.AbstractPanel;
    }> = {};

    public access: {
        'nav': (clickgo.control.AbstractControl & Record<string, any>) | null;
    } = {
            /** --- nav 控件 --- */
            'nav': null
        };

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
        old.style.display = 'none';
        /*
        old.style.opacity = '0';
        old.style.pointerEvents = 'none';
        */
    }

    /**
     * --- 供上层用户调用的，跳转页面 ---
     */
    public async go(
        cls: string | (new () => clickgo.form.AbstractPanel),
        data: Record<string, any> = {},
        opt: {
            'nav'?: boolean;
            'action'?: 'forword' | 'back';
            'previous'?: string;
        } = {}
    ): Promise<boolean> {
        if (this.loading) {
            return false;
        }
        const showEvent: types.IAbstractPanelShowEvent = {
            'detail': {
                'data': data,
                'nav': opt.nav ?? false,
                'action': opt.action ?? 'forword',
                'previous': opt.previous ?? '',
                'qsChange': false
            }
        };
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
                // --- 同一个，也就是仅仅是 qs 变了（也可能就是用户 go 了两次相同的） ---
                if (this.access.nav) {
                    // --- 有 nav 的话，就大概率不是用户来 go 的了 ---
                    item.vroot.qs = clickgo.tool.clone(this.access.nav.qs);
                    await item.vroot.onQsChange();
                }
                this.loading = false;
                return true;
            }
            // --- 不是同一个，跳转到现在设置的 ---
            await this.hideActive();
            // --- 显示新的 ---
            this.activeId = parseInt(id);
            clickgo.form.setActivePanel(this.activeId, this.formId);
            const n: HTMLElement = this.element.querySelector('[data-panel-id="' + id + '"]')!;
            n.style.display = 'flex';
            /*
            n.style.opacity = '1';
            n.style.pointerEvents = '';
            */
            if (this.access.nav && (JSON.stringify(item.vroot.qs) !== JSON.stringify(this.access.nav.qs))) {
                item.vroot.qs = clickgo.tool.clone(this.access.nav.qs);
                await item.vroot.onQsChange();
                showEvent.detail.qsChange = true;
            }
            await item.vroot.onShow(showEvent);
            this.loading = false;
            return true;
        }
        // --- 要加载 ---
        try {
            const rtn = await clickgo.form.createPanel(this, cls);
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
            n.style.display = 'flex';
            /*
            n.style.opacity = '1';
            n.style.pointerEvents = '';
            */
            if (this.access.nav) {
                rtn.vroot.qs = clickgo.tool.clone(this.access.nav.qs);
                await rtn.vroot.onQsChange();
                showEvent.detail.qsChange = true;
            }
            await rtn.vroot.onShow(showEvent);
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

    /** --- 根据 name 更新 panel 的方法 --- */
    public async mapNameChange(opt: {
        'action'?: 'forword' | 'back';
        'previous'?: string;
    } = {}): Promise<void> {
        if (!this.props.map) {
            this.mapSelected = '';
            return;
        }
        const name = this.access.nav ? this.access.nav.selected : this.props.modelValue;
        if (name === this.mapSelected) {
            return;
        }
        const from = this.mapSelected.split('?');
        const to = name.split('?');
        // --- 也可能仅仅是 qs 变了 ---
        const event: types.IPanelGoEvent = {
            'go': true,
            preventDefault: function() {
                this.go = false;
            },
            'detail': {
                'from': from[0],
                'to': to[0]
            }
        };
        this.emit('go', event);
        if (!event.go) {
            return;
        }
        /** --- went 事件对象 --- */
        const rtn = await this.go(this.props.map[to[0]], this.rootForm.formHashData, {
            'nav': this.access.nav ? true : false,
            'action': opt.action ?? 'forword',
            'previous': opt.previous ?? ''
        });
        const wentEvent: types.IPanelWentEvent = {
            'detail': {
                'result': rtn,
                'from': event.detail.from,
                'to': event.detail.to
            }
        };
        this.emit('went', wentEvent);
        if (!wentEvent.detail.result) {
            // --- 跳转失败 ---
            return;
        }
        this.mapSelected = name;
        // --- 真正跳转成功，执行 panel 的 onShowed ---
        await this.loaded[this.activeId].vroot.onShowed();
    }

    public onMounted(): void {
        this.access.nav = this.parentByName('nav');
        // --- 等待 rootForm 的 mounted 真正的挂载完成，在执行下面的内容 ---
        this.rootForm.ready(async () => {
            this.watch('modelValue', async () => {
                await this.mapNameChange();
            });
            this.watch('map', async () => {
                await this.mapNameChange();
            }, {
                'deep': true
            });
            if (this.access.nav) {
                this.watch((): string[] => {
                    const hh = clickgo.tool.clone(this.rootForm._historyHash);
                    if (this.rootForm.formHash) {
                        hh.push(this.rootForm.formHash);
                    }
                    return hh;
                }, async (n, o) => {
                    const action = n.length < o.length ? 'back' : 'forword';
                    await this.mapNameChange({
                        'action': action,
                        'previous': o[o.length - 1]
                    });
                }, {
                    'deep': true
                });
            }
            await this.mapNameChange();
        });
    }

    public onBeforeUnmount(): void {
        for (const id in this.loaded) {
            clickgo.form.removePanel(parseInt(id), this.loaded[id].vapp, this.element);
            delete this.loaded[id];
        }
    }

}
