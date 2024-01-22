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
            'map': null
        };
        this.mapSelected = '';
        this.loading = false;
        this.loaded = {};
        this.nav = null;
        this.activeId = 0;
    }
    get navSelected() {
        return this.nav ? this.nav.selected : '';
    }
    hideActive() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.activeId) {
                return;
            }
            clickgo.form.removeActivePanel(this.activeId, this.formId);
            yield this.loaded[this.activeId].vroot.onHide();
            const old = this.element.querySelector('[data-panel-id="' + this.activeId.toString() + '"]');
            old.style.opacity = '0';
            old.style.pointerEvents = 'none';
        });
    }
    go(cls, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.loading) {
                return false;
            }
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
                    this.loading = false;
                    return true;
                }
                yield this.hideActive();
                this.activeId = parseInt(id);
                clickgo.form.setActivePanel(this.activeId, this.formId);
                const n = this.element.querySelector('[data-panel-id="' + id + '"]');
                n.style.opacity = '1';
                n.style.pointerEvents = '';
                yield item.vroot.onShow(data !== null && data !== void 0 ? data : {});
                this.loading = false;
                return true;
            }
            try {
                const rtn = yield clickgo.form.createPanel(cls, this.element);
                yield this.hideActive();
                this.activeId = rtn.id;
                clickgo.form.setActivePanel(this.activeId, this.formId);
                this.loaded[rtn.id] = {
                    'obj': cls,
                    'vapp': rtn.vapp,
                    'vroot': rtn.vroot
                };
                const n = this.element.querySelector('[data-panel-id="' + rtn.id.toString() + '"]');
                n.style.opacity = '1';
                n.style.pointerEvents = '';
                yield rtn.vroot.onShow(data !== null && data !== void 0 ? data : {});
                this.loading = false;
                return true;
            }
            catch (_a) {
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
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.props.map) {
                this.mapSelected = '';
                return;
            }
            const name = this.nav ? this.nav.selected : this.props.modelValue;
            if (name === this.mapSelected) {
                return;
            }
            const event = {
                'go': true,
                preventDefault: function () {
                    this.go = false;
                },
                'detail': {
                    'from': this.mapSelected,
                    'to': name
                }
            };
            this.emit('go', event);
            if (!event.go) {
                return;
            }
            const rtn = yield this.go(this.props.map[name]);
            const wentEvent = {
                'detail': {
                    'result': rtn,
                    'from': event.detail.from,
                    'to': event.detail.to
                }
            };
            this.emit('went', wentEvent);
            if (!rtn) {
                return;
            }
            this.mapSelected = name;
        });
    }
    onMounted() {
        this.nav = this.parentByName('nav');
        this.watch('modelValue', () => __awaiter(this, void 0, void 0, function* () {
            yield this.mapNameChange();
        }), {
            'immediate': true
        });
        this.watch('navSelected', () => __awaiter(this, void 0, void 0, function* () {
            yield this.mapNameChange();
        }));
        this.watch('map', () => __awaiter(this, void 0, void 0, function* () {
            yield this.mapNameChange();
        }), {
            'deep': true,
            'immediate': true
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
