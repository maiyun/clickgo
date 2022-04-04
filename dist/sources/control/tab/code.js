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
exports.mounted = exports.methods = exports.watch = exports.computed = exports.data = exports.props = void 0;
exports.props = {
    'tabPosition': {
        'default': 'top'
    },
    'modelValue': {
        'default': ''
    }
};
exports.data = {
    'arrow': false,
    'timer': 0,
    'oldTabs': undefined,
    'selected': ''
};
exports.computed = {
    'tabs': function () {
        var _a;
        if (!this.$slots.default) {
            return [];
        }
        const tabs = [];
        for (const item of this.cgSlots()) {
            tabs.push({
                'label': item.props.label,
                'value': (_a = item.props.value) !== null && _a !== void 0 ? _a : item.props.label
            });
        }
        return tabs;
    },
    'values': function () {
        const list = [];
        for (const item of this.tabs) {
            list.push(item.value);
        }
        return list;
    }
};
exports.watch = {
    'modelValue': {
        handler: function () {
            if (this.selected !== this.modelValue) {
                this.selected = this.modelValue;
                this.reSelected();
            }
        },
        'immediate': true
    },
    'tabs': {
        handler: function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.$nextTick();
                this.onResize(clickgo.dom.getSize(this.$refs.tabs[0]));
                this.reSelected();
            });
        },
        'deep': 'true'
    },
    'tabPosition': {
        handler: function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.$nextTick();
                if (this.oldTabs === this.$refs.tabs[0]) {
                    return;
                }
                this.oldTabs = this.$refs.tabs[0];
                clickgo.dom.watchSize(this.$refs.tabs[0], (size) => {
                    this.onResize(size);
                });
            });
        }
    }
};
exports.methods = {
    wheel: function (e) {
        if (this.tabPosition === 'left' || this.tabPosition === 'right') {
            return;
        }
        if (e.deltaX !== 0) {
            return;
        }
        e.preventDefault();
        this.$refs.tabs[0].scrollLeft += e.deltaY;
    },
    tabClick: function (e, item) {
        this.selected = item.value;
        this.$emit('update:modelValue', item.value);
    },
    longDown: function (e, type) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        const num = type === 'start' ? -5 : 5;
        clickgo.dom.bindDown(e, {
            down: () => {
                this.timer = this.cgOnFrame(() => {
                    if (this.tabPosition === 'top' || this.tabPosition === 'bottom') {
                        this.$refs.tabs[0].scrollLeft += num;
                    }
                    else {
                        this.$refs.tabs[0].scrollTop += num;
                    }
                });
            },
            up: () => {
                this.cgOffFrame(this.timer);
                this.timer = 0;
            }
        });
    },
    onResize: function (size) {
        if (this.tabPosition === 'top' || this.tabPosition === 'bottom') {
            const width = this.arrow ? Math.round(size.clientWidth) + 40 : Math.round(size.clientWidth);
            if (size.scrollWidth > width) {
                this.arrow = true;
            }
            else {
                this.arrow = false;
            }
        }
        else {
            const height = this.arrow ? Math.round(size.clientHeight) + 40 : Math.round(size.clientHeight);
            if (size.scrollHeight > height) {
                this.arrow = true;
            }
            else {
                this.arrow = false;
            }
        }
    },
    reSelected: function () {
        if (this.selected === '') {
            const s = this.values[0] ? this.values[0] : '';
            if (this.selected !== s) {
                this.selected = s;
                this.$emit('update:modelValue', this.selected);
            }
        }
        else if (this.values.indexOf(this.selected) === -1) {
            const s = this.values[this.values.length - 1] ? this.values[this.values.length - 1] : '';
            if (this.selected !== s) {
                this.selected = s;
                this.$emit('update:modelValue', this.selected);
            }
        }
    }
};
const mounted = function () {
    this.oldTabs = this.$refs.tabs[0];
    clickgo.dom.watchSize(this.$refs.tabs[0], (size) => {
        this.onResize(size);
    });
    this.reSelected();
};
exports.mounted = mounted;
