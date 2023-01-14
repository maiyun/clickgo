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
        this.loading = false;
        this.loaded = {};
        this.activeId = 0;
    }
    hideActive() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.activeId) {
                return;
            }
            clickgo.form.removeActivePanel(this.activeId, this.formId);
            const old = this.element.querySelector('[data-panel-id="' + this.activeId.toString() + '"]');
            old.style.display = 'none';
            yield this.loaded[this.activeId].vroot.onHide();
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
                n.style.display = 'flex';
                yield item.vroot.onShow(data !== null && data !== void 0 ? data : {});
                this.loading = false;
                return true;
            }
            try {
                const rtn = yield clickgo.form.createPanel(cls, this.element, this.formId);
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
    onBeforeUnmount() {
        for (const id in this.loaded) {
            clickgo.form.removePanel(parseInt(id), this.loaded[id].vapp, this.element);
            delete this.loaded[id];
        }
    }
}
exports.default = default_1;
