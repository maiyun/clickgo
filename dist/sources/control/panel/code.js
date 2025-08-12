"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.control.AbstractControl {
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
        this.mapSelected = '';
        this.loading = false;
        this.loaded = {};
        this.access = {
            'nav': null
        };
        this.activeId = 0;
    }
    async hideActive() {
        if (!this.activeId) {
            return;
        }
        clickgo.form.removeActivePanel(this.activeId, this.formId);
        await this.loaded[this.activeId].vroot.onHide();
        const old = this.element.querySelector('[data-panel-id="' + this.activeId.toString() + '"]');
        old.style.display = 'none';
    }
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
        for (const id in this.loaded) {
            const item = this.loaded[id];
            if (item.obj !== cls) {
                continue;
            }
            if (this.activeId.toString() === id) {
                if (this.access.nav) {
                    item.vroot.qs = clickgo.tool.clone(this.access.nav.qs);
                    await item.vroot.onQsChange();
                    qsChangeShowEvent.detail.qsChange = true;
                    await item.vroot.onQsChangeShow(qsChangeShowEvent);
                }
                this.loading = false;
                return true;
            }
            await this.hideActive();
            this.activeId = parseInt(id);
            clickgo.form.setActivePanel(this.activeId, this.formId);
            const n = this.element.querySelector('[data-panel-id="' + id + '"]');
            n.style.display = 'flex';
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
        try {
            const rtn = await clickgo.form.createPanel(this, cls);
            await this.hideActive();
            this.activeId = rtn.id;
            clickgo.form.setActivePanel(this.activeId, this.formId);
            this.loaded[rtn.id] = {
                'obj': cls,
                'vapp': rtn.vapp,
                'vroot': rtn.vroot
            };
            const n = this.element.querySelector('[data-panel-id="' + rtn.id.toString() + '"]');
            n.style.display = 'flex';
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
    send(data) {
        if (!this.activeId) {
            return;
        }
        this.loaded[this.activeId].vroot.onReceive(data);
    }
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
            return;
        }
        this.mapSelected = name;
        await this.loaded[this.activeId].vroot.onShowed();
    }
    onMounted() {
        this.access.nav = this.parentByName('nav');
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
            clickgo.form.removePanel(parseInt(id), this.loaded[id].vapp, this.element);
            delete this.loaded[id];
        }
    }
}
exports.default = default_1;
