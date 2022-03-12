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
exports.methods = exports.props = void 0;
exports.props = {
    'position': {
        'default': 'bottom'
    }
};
exports.methods = {
    down: function (e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (this.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop();
        }
        if (e instanceof TouchEvent) {
            clickgo.dom.bindLong(e, (e) => {
                clickgo.form.showPop(this.$el, this.$refs.pop, e);
            });
        }
    },
    contextmenu: function (e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (clickgo.dom.hasTouchButMouse(e)) {
                return;
            }
            clickgo.form.showPop(this.$el, this.$refs.pop, e);
        });
    }
};
