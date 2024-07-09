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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    hideActive() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.activeId) {
                return;
            }
            clickgo.form.removeActivePanel(this.activeId, this.formId);
            yield this.loaded[this.activeId].vroot.onHide();
            const old = this.element.querySelector('[data-panel-id="' + this.activeId.toString() + '"]');
            old.style.display = 'none';
        });
    }
    go(cls_1) {
        return __awaiter(this, arguments, void 0, function* (cls, data = {}, opt = {}) {
            var _a, _b, _c;
            if (this.loading) {
                return false;
            }
            const showEvent = {
                'detail': {
                    'data': data,
                    'nav': (_a = opt.nav) !== null && _a !== void 0 ? _a : false,
                    'action': (_b = opt.action) !== null && _b !== void 0 ? _b : 'forword',
                    'previous': (_c = opt.previous) !== null && _c !== void 0 ? _c : '',
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
                        yield item.vroot.onQsChange();
                    }
                    this.loading = false;
                    return true;
                }
                yield this.hideActive();
                this.activeId = parseInt(id);
                clickgo.form.setActivePanel(this.activeId, this.formId);
                const n = this.element.querySelector('[data-panel-id="' + id + '"]');
                n.style.display = 'flex';
                if (this.access.nav && (JSON.stringify(item.vroot.qs) !== JSON.stringify(this.access.nav.qs))) {
                    item.vroot.qs = clickgo.tool.clone(this.access.nav.qs);
                    yield item.vroot.onQsChange();
                    showEvent.detail.qsChange = true;
                }
                yield item.vroot.onShow(showEvent);
                this.loading = false;
                return true;
            }
            try {
                const rtn = yield clickgo.form.createPanel(this, cls);
                yield this.hideActive();
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
                    yield rtn.vroot.onQsChange();
                    showEvent.detail.qsChange = true;
                }
                yield rtn.vroot.onShow(showEvent);
                this.loading = false;
                return true;
            }
            catch (_d) {
                this.loading = false;
                return false;
            }
        });
    }
    send(data) {
        if (!this.activeId) {
            return;
        }
        this.loaded[this.activeId].vroot.onReceive(data);
    }
    mapNameChange() {
        return __awaiter(this, arguments, void 0, function* (opt = {}) {
            var _a, _b;
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
            const rtn = yield this.go(this.props.map[to[0]], this.rootForm.formHashData, {
                'nav': this.access.nav ? true : false,
                'action': (_a = opt.action) !== null && _a !== void 0 ? _a : 'forword',
                'previous': (_b = opt.previous) !== null && _b !== void 0 ? _b : ''
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
            yield this.loaded[this.activeId].vroot.onShowed();
        });
    }
    onMounted() {
        this.access.nav = this.parentByName('nav');
        this.rootForm.ready(() => __awaiter(this, void 0, void 0, function* () {
            this.watch('modelValue', () => __awaiter(this, void 0, void 0, function* () {
                yield this.mapNameChange();
            }));
            this.watch('map', () => __awaiter(this, void 0, void 0, function* () {
                yield this.mapNameChange();
            }), {
                'deep': true
            });
            if (this.access.nav) {
                this.watch(() => {
                    const hh = clickgo.tool.clone(this.rootForm._historyHash);
                    if (this.rootForm.formHash) {
                        hh.push(this.rootForm.formHash);
                    }
                    return hh;
                }, (n, o) => __awaiter(this, void 0, void 0, function* () {
                    const action = n.length < o.length ? 'back' : 'forword';
                    yield this.mapNameChange({
                        'action': action,
                        'previous': o[o.length - 1]
                    });
                }), {
                    'deep': true
                });
            }
            yield this.mapNameChange();
        }));
    }
    onBeforeUnmount() {
        for (const id in this.loaded) {
            clickgo.form.removePanel(parseInt(id), this.loaded[id].vapp, this.element);
            delete this.loaded[id];
        }
    }
}
exports.default = default_1;
