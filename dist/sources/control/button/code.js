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
            'area': 'all',
            'size': 'm',
            'sizeh': false,
            'gutter': 0
        };
        this.isSpaceDown = false;
        this.innerFocus = false;
        this.arrowFocus = false;
        this.index = 0;
        this.inBgroup = false;
    }
    get isDisabled() {
        if (!this.inBgroup) {
            return this.propBoolean('disabled');
        }
        if (this.parent.disabled === undefined) {
            return this.propBoolean('disabled');
        }
        return this.parent.propBoolean('disabled');
    }
    get isPlain() {
        if (!this.inBgroup) {
            return this.propBoolean('plain');
        }
        if (this.parent.plain === undefined) {
            return this.propBoolean('plain');
        }
        return this.parent.propBoolean('plain');
    }
    get typeComp() {
        if (!this.inBgroup) {
            return this.props.type;
        }
        if (this.parent.type === undefined) {
            return this.props.type;
        }
        return this.parent.props.type;
    }
    get sizeComp() {
        if (!this.inBgroup) {
            return this.props.size;
        }
        if (this.parent.size === undefined) {
            return this.props.size;
        }
        return this.parent.props.size;
    }
    get canDoMain() {
        return (this.props.area === 'all' || this.props.area === 'mark') ? true : false;
    }
    get isChildFocus() {
        return this.innerFocus || this.arrowFocus;
    }
    keydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (this.canDoMain) {
                this.innerClick(e);
                if (!this.slots['pop'] || (this.props.area === 'mark')) {
                    this.element.click();
                    if (this.refs.arrow?.dataset.cgPopOpen !== undefined) {
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
                if (this.refs.arrow?.dataset.cgPopOpen !== undefined) {
                    clickgo.form.hidePop(this.refs.arrow);
                }
                clickgo.tool.sleep(300).then(() => {
                    if (!this.isSpaceDown) {
                        return;
                    }
                    this.arrowClick(e);
                }).catch(() => {
                });
            }
        }
    }
    keyup(e) {
        if (!this.isSpaceDown) {
            return;
        }
        this.isSpaceDown = false;
        if (this.canDoMain) {
            if (this.refs.arrow?.dataset.cgPopOpen !== undefined) {
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
            clickgo.form.showPop(this.refs.arrow, this.refs.pop, 'h', {
                'autoScroll': true,
                'way': 'click'
            });
        });
    }
    innerClick(e) {
        if (!this.slots['pop'] || (this.props.area === 'split' || this.props.area === 'mark')) {
            return;
        }
        e.stopPropagation();
        if (this.element.dataset.cgPopOpen === undefined) {
            clickgo.form.showPop(this.element, this.refs.pop, 'v', {
                'autoScroll': true,
                'way': 'click'
            });
        }
        else {
        }
    }
    arrowClick(e) {
        e.stopPropagation();
        if (this.props.area === 'all') {
            if (this.element.dataset.cgPopOpen === undefined) {
                clickgo.form.showPop(this.element, this.refs.pop, 'v', {
                    'autoScroll': true,
                    'way': 'click'
                });
            }
            else {
            }
        }
        else {
            if (this.refs.arrow?.dataset.cgPopOpen === undefined) {
                clickgo.form.showPop(this.refs.arrow, this.refs.pop, this.props.area === 'split' ? 'v' : 'h', {
                    'autoScroll': true,
                    'way': 'click'
                });
            }
            else {
            }
        }
    }
    get bgroupPos() {
        if (!this.inBgroup) {
            return '';
        }
        if (this.index === 0) {
            if (this.parent.itemsLength === 1) {
                return '';
            }
            return 'first';
        }
        if (this.parent.itemsLength === this.index + 1) {
            return 'end';
        }
        return 'center';
    }
    onMounted() {
        if (this.parent.controlName === 'bgroup') {
            this.inBgroup = true;
            this.index = clickgo.dom.index(this.element);
            ++this.parent.itemsLength;
            this.watch(() => {
                return this.parent.itemsLength;
            }, () => {
                this.index = clickgo.dom.index(this.element);
            });
        }
    }
    onUnmounted() {
        if (this.parent.controlName === 'bgroup') {
            --this.parent.itemsLength;
        }
    }
}
exports.default = default_1;
