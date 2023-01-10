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
            this.refs.tabs[0].scrollTop += e.deltaY;
            return;
        }
        if (e.deltaX !== 0) {
            this.refs.tabs[0].scrollLeft += e.deltaX;
            return;
        }
        this.refs.tabs[0].scrollLeft += e.deltaY;
    }
    touch(e) {
        clickgo.dom.bindGesture(e, (ne, dir) => {
            switch (dir) {
                case 'top': {
                    if (this.refs.tabs[0].scrollTop > 0) {
                        ne.stopPropagation();
                    }
                    break;
                }
                case 'bottom': {
                    if (Math.round(this.refs.tabs[0].scrollTop) <
                        (this.refs.tabs[0].scrollHeight - this.refs.tabs[0].clientHeight)) {
                        ne.stopPropagation();
                    }
                    break;
                }
                case 'left': {
                    if (this.refs.tabs[0].scrollLeft > 0) {
                        ne.stopPropagation();
                    }
                    break;
                }
                default: {
                    if (Math.round(this.refs.tabs[0].scrollLeft) <
                        (this.refs.tabs[0].scrollWidth - this.refs.tabs[0].clientWidth)) {
                        ne.stopPropagation();
                    }
                }
            }
            return false;
        });
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
    onResize() {
        const tab = this.refs.tabs[0];
        if (this.props.tabPosition === 'top' || this.props.tabPosition === 'bottom') {
            const width = this.arrow ? tab.clientWidth + 40 : tab.clientWidth;
            if (tab.scrollWidth > width) {
                this.arrow = true;
            }
            else {
                this.arrow = false;
            }
        }
        else {
            const height = this.arrow ? tab.clientHeight + 40 : tab.clientHeight;
            if (tab.scrollHeight > height) {
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
                this.onResize();
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
            clickgo.dom.watchSize(this.refs.tabs[0], () => {
                this.onResize();
            });
        }));
        this.rand = clickgo.tool.random(16);
        this.tabsData = this.props.tabs;
        this.oldTabs = this.refs.tabs[0];
        clickgo.dom.watchSize(this.refs.tabs[0], () => {
            this.onResize();
        });
        this.refreshValue();
    }
}
exports.default = default_1;
