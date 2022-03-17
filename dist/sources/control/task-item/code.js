"use strict";
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
exports.methods = exports.computed = exports.props = void 0;
exports.props = {
    'selected': {
        'default': false
    },
    'opened': {
        'default': false
    },
    'multi': {
        'default': false
    }
};
exports.computed = {
    'isSelected': function () {
        return clickgo.tool.getBoolean(this.selected);
    },
    'isOpened': function () {
        return clickgo.tool.getBoolean(this.opened);
    },
    'isMulti': function () {
        return clickgo.tool.getBoolean(this.multi);
    },
    'position': function () {
        var _a, _b;
        return (_b = (_a = this.cgParentByName('task')) === null || _a === void 0 ? void 0 : _a.position) !== null && _b !== void 0 ? _b : 'bottom';
    }
};
exports.methods = {
    click: function () {
        if (!this.$slots.pop) {
            return;
        }
        if (this.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, 'v');
    },
    contextmenu: function (e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (clickgo.dom.hasTouchButMouse(e)) {
                return;
            }
            if (!this.$slots.contextmenu) {
                return;
            }
            clickgo.form.showPop(this.$el, this.$refs.contextmenu, 'v');
        });
    },
    down: function (e) {
        var _a;
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.$el.dataset.cgPopOpen !== undefined) {
            if (((_a = this.$refs.contextmenu) === null || _a === void 0 ? void 0 : _a.dataset.cgOpen) !== undefined) {
                clickgo.form.hidePop();
            }
        }
        if (e instanceof TouchEvent && this.$slots.contextmenu) {
            clickgo.dom.bindLong(e, () => {
                clickgo.form.showPop(this.$el, this.$refs.contextmenu, 'v');
            });
        }
    }
};
