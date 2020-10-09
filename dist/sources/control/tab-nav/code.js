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
exports.mounted = exports.methods = exports.watch = exports.data = exports.props = void 0;
exports.props = {
    'tabs': {
        'default': []
    }
};
exports.data = {
    'arrow': false,
    'timer': undefined
};
exports.watch = {
    'tabs': {
        handler: function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.$nextTick();
                this.onResize(clickgo.element.getSize(this.$refs.tabs));
            });
        },
        'deep': true
    }
};
exports.methods = {
    longDown: function (e, type) {
        if (!this.$parent) {
            return;
        }
        let num = type === 'start' ? -5 : 5;
        clickgo.element.bindDown(e, {
            down: () => {
                if (this.timer !== undefined) {
                    this.timer = undefined;
                }
                let cb = () => {
                    if (this.$parent.tabPosition === 'top' || this.$parent.tabPosition === 'bottom') {
                        this.$refs.tabs.scrollLeft += num;
                    }
                    else {
                        this.$refs.tabs.scrollTop += num;
                    }
                    if (this.timer !== undefined) {
                        requestAnimationFrame(cb);
                    }
                };
                this.timer = requestAnimationFrame(cb);
            },
            up: () => {
                if (this.timer !== undefined) {
                    this.timer = undefined;
                }
            }
        });
    },
    wheel: function (e) {
        if (!this.$parent) {
            return;
        }
        if (this.$parent.tabPosition === 'left' || this.$parent.tabPosition === 'right') {
            return;
        }
        if (e.deltaX !== 0) {
            return;
        }
        e.preventDefault();
        this.$refs.tabs.scrollLeft += e.deltaY;
    },
    onResize: function (size) {
        if (this.$parent.tabPosition === 'top' || this.$parent.tabPosition === 'bottom') {
            if (size.scrollWidth > size.clientWidth) {
                this.arrow = true;
            }
            else {
                this.arrow = false;
            }
        }
        else {
            if (size.scrollHeight > size.clientHeight) {
                this.arrow = true;
            }
            else {
                this.arrow = false;
            }
        }
    }
};
exports.mounted = function () {
    if (!this.$parent) {
        return;
    }
    clickgo.element.watchSize(this.$refs.tabs, (size) => {
        this.onResize(size);
    });
};
