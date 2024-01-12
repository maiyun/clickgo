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
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'disabled': false,
            'alt': '',
            'type': '',
            'label': '',
            'modelValue': ''
        };
        this.value = '';
        this.padding = '';
    }
    get opMargin() {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
    enter(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        clickgo.form.showPop(this.element, this.refs.pop, 'h');
    }
    touch() {
        clickgo.form.showPop(this.element, this.refs.pop, 'h');
    }
    click() {
        if (!this.props.type) {
            if (!this.slots['pop']) {
                clickgo.form.hidePop();
            }
            return;
        }
        if (this.props.type) {
            const event = {
                'go': true,
                preventDefault: function () {
                    this.go = false;
                }
            };
            if (this.props.type === 'radio') {
                this.emit('check', event, this.value, this.props.label);
                if (event.go) {
                    this.value = this.props.label;
                    this.emit('update:modelValue', this.value);
                }
            }
            else if (this.props.type === 'check') {
                this.emit('check', event, this.value);
                if (event.go) {
                    this.value = !this.value;
                    this.emit('update:modelValue', this.value);
                }
            }
        }
        clickgo.form.hidePop();
    }
    onBeforeUnmount() {
        const menulist = this.parentByName('menulist');
        if (!menulist) {
            return;
        }
        if (this.props.type) {
            --menulist.hasTypeItemsCount;
        }
    }
    onMounted() {
        this.watch('type', () => {
            const menulist = this.parentByName('menulist');
            if (!menulist) {
                return;
            }
            if (this.props.type) {
                ++menulist.hasTypeItemsCount;
            }
            else {
                --menulist.hasTypeItemsCount;
            }
        }, {
            'immediate': true
        });
        this.watch('modelValue', () => {
            if (this.value === this.props.modelValue) {
                return;
            }
            this.value = this.props.modelValue;
        }, {
            'immediate': true
        });
        clickgo.dom.watchStyle(this.element, 'padding', (n, v) => {
            this.padding = v;
        }, true);
        const menulist = this.parentByName('menulist');
        if (!menulist) {
            return;
        }
        if (this.props.type) {
            ++menulist.hasTypeItemsCount;
        }
    }
}
exports.default = default_1;
