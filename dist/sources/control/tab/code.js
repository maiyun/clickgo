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
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'tabPosition': 'top',
            'drag': false,
            'close': false,
            'tabs': [],
            'modelValue': ''
        };
        this.arrow = false;
        this.timer = 0;
        this.tabsData = [];
        this.oldTabs = undefined;
        this.value = '';
        this.rand = '';
    }
    get isDrag() {
        return clickgo.tool.getBoolean(this.props.drag);
    }
    get isClose() {
        return clickgo.tool.getBoolean(this.props.close);
    }
    get tabsComp() {
        var _a, _b, _c;
        const tabs = [];
        for (const item of this.tabsData) {
            if (typeof item !== 'object') {
                tabs.push({
                    'value': item,
                    'drag': this.isDrag,
                    'close': this.isClose
                });
            }
            else {
                tabs.push({
                    'value': (_a = item.value) !== null && _a !== void 0 ? _a : 'error',
                    'drag': (_b = item.drag) !== null && _b !== void 0 ? _b : this.isDrag,
                    'close': (_c = item.close) !== null && _c !== void 0 ? _c : this.isClose
                });
            }
        }
        return tabs;
    }
    get values() {
        const list = [];
        for (const item of this.tabsComp) {
            list.push(item.value);
        }
        return list;
    }
    wheel(e) {
        if (this.props.tabPosition === 'left' || this.props.tabPosition === 'right') {
            return;
        }
        if (e.deltaX !== 0) {
            return;
        }
        e.preventDefault();
        this.refs.tabs[0].scrollLeft += e.deltaY;
    }
    down(e, index) {
        const nval = this.tabsComp[index].value;
        if (this.value !== nval) {
            this.value = nval;
            this.emit('update:modelValue', this.value);
        }
        clickgo.dom.bindDrag(e, {
            'el': e.currentTarget.parentNode,
            'data': {
                'index': index,
                'tab': this.rand
            }
        });
    }
    tabClose(e, index) {
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            }
        };
        this.emit('close', event, index);
        if (!event.go) {
            return;
        }
        e.stopPropagation();
        this.tabsData.splice(index, 1);
        this.emit('update:tabs', this.tabsData);
    }
    drop(e, index) {
        if (typeof e.detail.value !== 'object') {
            return;
        }
        if (e.detail.value.tab !== this.rand) {
            return;
        }
        this.tabsData.splice(index, 0, this.tabsData.splice(e.detail.value.index, 1)[0]);
        this.emit('update:tabs', this.tabsData);
    }
    tabClick(e, item) {
        this.value = item.value;
        this.emit('update:modelValue', this.value);
    }
    longDown(e, type) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        const num = type === 'start' ? -5 : 5;
        clickgo.dom.bindDown(e, {
            down: () => {
                this.timer = clickgo.task.onFrame(() => {
                    if (this.props.tabPosition === 'top' || this.props.tabPosition === 'bottom') {
                        this.refs.tabs[0].scrollLeft += num;
                    }
                    else {
                        this.refs.tabs[0].scrollTop += num;
                    }
                });
            },
            up: () => {
                clickgo.task.offFrame(this.timer);
                this.timer = 0;
            }
        });
    }
    onResize(size) {
        if (this.props.tabPosition === 'top' || this.props.tabPosition === 'bottom') {
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
    }
    refreshValue() {
        if (this.value === '') {
            const v = this.values[0] ? this.values[0] : '';
            if (this.value !== v) {
                this.value = v;
                this.emit('update:modelValue', this.value);
            }
        }
        else if (!this.values.includes(this.value)) {
            const v = this.values[this.values.length - 1] ? this.values[this.values.length - 1] : '';
            if (this.value !== v) {
                this.value = v;
                this.emit('update:modelValue', this.value);
            }
        }
    }
    onMounted() {
        this.watch('modelValue', () => {
            if (this.value !== this.props.modelValue) {
                this.value = this.props.modelValue;
                this.refreshValue();
            }
        }, {
            'immediate': true
        });
        this.watch('tabs', () => {
            this.tabsData = this.props.tabs;
        }, {
            'deep': true
        });
        this.watch('tabsComp', () => {
            this.refreshValue();
            this.nextTick().then(() => {
                this.onResize(clickgo.dom.getSize(this.refs.tabs[0]));
            }).catch(function (e) {
                console.log(e);
            });
        }, {
            'deep': true
        });
        this.watch('tabPosition', () => __awaiter(this, void 0, void 0, function* () {
            yield this.nextTick();
            if (this.oldTabs === this.refs.tabs[0]) {
                return;
            }
            this.oldTabs = this.refs.tabs[0];
            clickgo.dom.watchSize(this.refs.tabs[0], (size) => {
                this.onResize(size);
            });
        }));
        this.rand = clickgo.tool.random(16);
        this.tabsData = this.props.tabs;
        this.oldTabs = this.refs.tabs[0];
        clickgo.dom.watchSize(this.refs.tabs[0], (size) => {
            this.onResize(size);
        });
        this.refreshValue();
    }
}
exports.default = default_1;
