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
            'multi': false,
            'direction': 'h',
            'area': 'all',
            'pop': 'greatlist',
            'data': [],
            'sizes': {},
            'modelValue': []
        };
        this.padding = '';
        this.font = '';
        this.isSpaceDown = false;
    }
    get opMargin() {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
    showPop() {
        clickgo.form.showPop(this.element, this.refs.pop, 'v', {
            'size': {
                'width': this.element.offsetWidth
            }
        });
    }
    keydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.click(e, 'arrow');
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isSpaceDown = true;
        }
    }
    keyup(e) {
        if (!this.isSpaceDown) {
            return;
        }
        this.isSpaceDown = false;
        this.click(e, 'arrow');
    }
    click(e, area) {
        if (this.element.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.element);
            return;
        }
        if (this.props.area === 'arrow' && area === 'left') {
            return;
        }
        this.showPop();
    }
    updateModelValue(val) {
        this.emit('update:modelValue', val);
    }
    itemclick(e, arrow) {
        if (arrow) {
            return;
        }
        if (this.propBoolean('multi')) {
            return;
        }
        clickgo.form.hidePop();
    }
    onMounted() {
        clickgo.dom.watchStyle(this.element, ['font', 'padding'], (n, v) => {
            switch (n) {
                case 'font': {
                    this.font = v;
                    break;
                }
                case 'padding': {
                    this.padding = v;
                    break;
                }
            }
        }, true);
    }
}
exports.default = default_1;
