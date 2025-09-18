import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'go': null,
            'went': null
        };
        this.props = {
            'modelValue': '',
            'plain': false,
            'map': null
        };
        /** --- 如果有 map，要看当前真实选中的 key 是谁 --- */
        this.mapSelected = '';
        this.loading = false;
        /** --- 已经加载过的页面列表 --- */
        this.loaded = {};
        this.access = {
            /** --- nav 控件 --- */
            'nav': null
        };
        /** --- 当前 active 的 panel id --- */
        this.activeId = '';
    }
    /** --- 隐藏老 panel --- */
    async hideActive() {
        if (!this.activeId) {
            return;
        }
        clickgo.form.removeActivePanel(this, this.activeId, this.formId);
        await this.loaded[this.activeId].vroot.onHide();
        const old = this.element.querySelector('[data-panel-id="' + this.activeId.toString() + '"]');
        old.style.display = 'none';
        /*
        old.style.opacity = '0';
        old.style.pointerEvents = 'none';
        */
    }
    /**
     * --- 供上层用户调用的，跳转页面 ---
     */
    async go(cls, data = {}, opt = {}) {
        if (this.loading) {
            return false;
        }
        const showEvent = {
            'detail': {
                'data': data,
                'nav': opt.nav ?? false,
                'action': opt.action ?? 'forword',
                'previous': opt.previous ?? '',
                'qsChange': false
            }
        };
        const qsChangeShowEvent = {
            'detail': {
                'action': opt.action ?? 'forword',
                'data': data,
                'nav': opt.nav ?? false,
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
                    qsChangeShowEvent.detail.qsChange = true;
                    await item.vroot.onQsChangeShow(qsChangeShowEvent);
                }
                this.loading = false;
                return true;
            }
            // --- 不是同一个，跳转到现在设置的 ---
            await this.hideActive();
            // --- 显示新的 ---
            this.activeId = id;
            clickgo.form.setActivePanel(this, this.formId, this.activeId);
            const n = this.element.querySelector('[data-panel-id="' + id + '"]');
            n.style.display = 'flex';
            /*
            n.style.opacity = '1';
            n.style.pointerEvents = '';
            */
            if (this.access.nav && (JSON.stringify(item.vroot.qs) !== JSON.stringify(this.access.nav.qs))) {
                item.vroot.qs = clickgo.tool.clone(this.access.nav.qs);
                await item.vroot.onQsChange();
                qsChangeShowEvent.detail.qsChange = true;
                showEvent.detail.qsChange = true;
            }
            await item.vroot.onShow(showEvent);
            await item.vroot.onQsChangeShow(qsChangeShowEvent);
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
            clickgo.form.setActivePanel(this, this.formId, this.activeId);
            this.loaded[rtn.id] = {
                'obj': cls,
                'vapp': rtn.vapp,
                'vroot': rtn.vroot
            };
            const n = this.element.querySelector('[data-panel-id="' + rtn.id.toString() + '"]');
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
            await rtn.vroot.onQsChangeShow(qsChangeShowEvent);
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
    send(data) {
        if (!this.activeId) {
            return;
        }
        this.loaded[this.activeId].vroot.onReceive(data);
    }
    /** --- 根据 name 更新 panel 的方法 --- */
    async mapNameChange(opt = {}) {
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
        const event = {
            'go': true,
            preventDefault: function () {
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
        const wentEvent = {
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
    onMounted() {
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
                this.watch(() => {
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
    onBeforeUnmount() {
        for (const id in this.loaded) {
            clickgo.form.removePanel(id, this.loaded[id].vapp, this.element);
            delete this.loaded[id];
        }
    }
}
