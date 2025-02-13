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
            'close': null,
            'change': null,
            'changed': null,
            'update:tabs': null,
            'update:modelValue': null
        };
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
        var _a, _b, _c, _d, _e, _f;
        const tabs = [];
        for (const item of this.tabsData) {
            if (typeof item !== 'object') {
                tabs.push({
                    'label': item,
                    'value': item,
                    'drag': this.isDrag,
                    'close': this.isClose
                });
            }
            else {
                tabs.push({
                    'label': (_b = (_a = item.label) !== null && _a !== void 0 ? _a : item.value) !== null && _b !== void 0 ? _b : 'error',
                    'value': (_d = (_c = item.value) !== null && _c !== void 0 ? _c : item.label) !== null && _d !== void 0 ? _d : 'error',
                    'drag': (_e = item.drag) !== null && _e !== void 0 ? _e : this.isDrag,
                    'close': (_f = item.close) !== null && _f !== void 0 ? _f : this.isClose
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
    tabClose(e, index, value) {
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'index': index,
                'value': value
            }
        };
        this.emit('close', event);
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
        const event = {
            'go': true,
            preventDefault: function () {
                this.go = false;
            },
            'detail': {
                'value': item.value
            }
        };
        this.emit('change', event);
        if (!event.go) {
            return;
        }
        this.value = item.value;
        this.emit('update:modelValue', this.value);
        const event2 = {
            'detail': {
                'value': item.value
            }
        };
        this.emit('changed', event2);
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
        this.watch('tabs', () => {
            this.tabsData = clickgo.tool.clone(this.props.tabs);
        }, {
            'deep': true,
            'immediate': true
        });
        this.watch('modelValue', () => {
            if (this.value !== this.props.modelValue) {
                this.value = this.props.modelValue;
                this.refreshValue();
            }
        }, {
            'immediate': true
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
        this.oldTabs = this.refs.tabs[0];
        clickgo.dom.watchSize(this.refs.tabs[0], () => {
            this.onResize();
        });
        this.refreshValue();
    }
}
exports.default = default_1;
