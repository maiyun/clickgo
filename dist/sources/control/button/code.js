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
            'plain': false,
            'checked': false,
            'type': 'default',
            'area': 'all'
        };
        this.padding = '';
        this.isSpaceDown = false;
        this.innerFocus = false;
        this.arrowFocus = false;
    }
    get canDoMain() {
        return (this.props.area === 'all' || this.props.area === 'mark') ? true : false;
    }
    get isChildFocus() {
        return this.innerFocus || this.arrowFocus;
    }
    get opMargin() {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
    keydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (this.canDoMain) {
                this.innerClick(e);
                if (!this.slots['pop'] || (this.props.area === 'mark')) {
                    this.element.click();
                    if (this.refs.arrow.dataset.cgPopOpen !== undefined) {
                        clickgo.form.hidePop(this.refs.arrow);
                    }
                }
            }
            else {
                if (this.innerFocus) {
                    this.innerClick(e);
                    this.element.click();
                }
                else {
                    this.arrowClick(e);
                }
            }
        }
        else if (e.key === ' ') {
            e.preventDefault();
            if (this.isSpaceDown) {
                return;
            }
            this.isSpaceDown = true;
            if (this.props.area === 'mark') {
                if (this.refs.arrow.dataset.cgPopOpen !== undefined) {
                    clickgo.form.hidePop(this.refs.arrow);
                }
                clickgo.tool.sleep(300).then(() => {
                    if (!this.isSpaceDown) {
                        return;
                    }
                    this.arrowClick(e);
                }).catch((e) => { console.log(e); });
            }
        }
    }
    keyup(e) {
        if (!this.isSpaceDown) {
            return;
        }
        this.isSpaceDown = false;
        if (this.canDoMain) {
            if (this.refs.arrow.dataset.cgPopOpen !== undefined) {
                return;
            }
            this.innerClick(e);
            if (!this.slots['pop'] || (this.props.area === 'mark')) {
                this.element.click();
            }
        }
        else {
            if (this.innerFocus) {
                this.innerClick(e);
                this.element.click();
            }
            else {
                this.arrowClick(e);
            }
        }
    }
    down(e) {
        if (this.props.area !== 'mark') {
            return;
        }
        clickgo.dom.bindLong(e, () => {
            clickgo.form.showPop(this.refs.arrow, this.refs.pop, 'h');
        });
    }
    innerClick(e) {
        if (!this.slots['pop'] || (this.props.area === 'split' || this.props.area === 'mark')) {
            return;
        }
        e.stopPropagation();
        if (this.element.dataset.cgPopOpen === undefined) {
            clickgo.form.showPop(this.element, this.refs.pop, 'v');
        }
        else {
            clickgo.form.hidePop(this.element);
        }
    }
    arrowClick(e) {
        e.stopPropagation();
        if (this.props.area === 'all') {
            if (this.element.dataset.cgPopOpen === undefined) {
                clickgo.form.showPop(this.element, this.refs.pop, 'v');
            }
            else {
                clickgo.form.hidePop(this.element);
            }
        }
        else {
            if (this.refs.arrow.dataset.cgPopOpen === undefined) {
                clickgo.form.showPop(this.refs.arrow, this.refs.pop, this.props.area === 'split' ? 'v' : 'h');
            }
            else {
                clickgo.form.hidePop(this.refs.arrow);
            }
        }
    }
    onMounted() {
        clickgo.dom.watchStyle(this.element, 'padding', (n, v) => {
            this.padding = v;
        }, true);
    }
}
exports.default = default_1;
