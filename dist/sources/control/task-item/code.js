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
        this.props = {
            'selected': false,
            'opened': false,
            'multi': false
        };
    }
    get isSelected() {
        return clickgo.tool.getBoolean(this.props.selected);
    }
    get isOpened() {
        return clickgo.tool.getBoolean(this.props.opened);
    }
    get isMulti() {
        return clickgo.tool.getBoolean(this.props.multi);
    }
    get position() {
        var _a, _b;
        return (_b = (_a = this.parentByName('task')) === null || _a === void 0 ? void 0 : _a.position) !== null && _b !== void 0 ? _b : 'bottom';
    }
    click() {
        if (!this.slots['pop']) {
            return;
        }
        if (this.element.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'v');
    }
    contextmenu(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.slots['contextmenu']) {
            return;
        }
        clickgo.form.showPop(this.element, this.refs.contextmenu, 'v');
    }
    down(e) {
        var _a;
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.element.dataset.cgPopOpen !== undefined) {
            if (e instanceof MouseEvent && e.button === 2) {
                if (this.element.dataset.cgPopOpen !== undefined) {
                    clickgo.form.hidePop();
                }
            }
            else {
                if (((_a = this.refs.contextmenu) === null || _a === void 0 ? void 0 : _a.dataset.cgOpen) !== undefined) {
                    clickgo.form.hidePop();
                }
            }
        }
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, () => {
                var _a;
                if (((_a = this.refs.pop) === null || _a === void 0 ? void 0 : _a.dataset.cgOpen) !== undefined) {
                    clickgo.form.hidePop();
                }
                clickgo.form.showPop(this.element, this.refs.contextmenu, 'v');
            });
        }
    }
}
exports.default = default_1;
