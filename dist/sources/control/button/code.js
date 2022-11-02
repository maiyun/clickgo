"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = require("clickgo");
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.props = {
            'disabled': false,
            'plain': false,
            'checked': false,
            'type': 'default',
            'modelValue': undefined,
            'area': 'all'
        };
        this.padding = '';
        this.isKeyDown = false;
        this.innerFocus = false;
        this.arrowFocus = false;
    }
    get isDisabled() {
        return clickgo.tool.getBoolean(this.props.disabled);
    }
    get isPlain() {
        return clickgo.tool.getBoolean(this.props.plain);
    }
    get isChecked() {
        return clickgo.tool.getBoolean(this.props.checked);
    }
    get isAreaAllMark() {
        return this.slots('pop').length > 0 ? (this.props.area === 'all' || this.props.area === 'mark') : true;
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
            if (this.props.area === 'all' || this.props.area === 'mark') {
                this.innerClick(e);
                if (this.slots('pop').length === 0) {
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
        else if (e.key === ' ') {
            e.preventDefault();
            this.isKeyDown = true;
        }
    }
    keyup(e) {
        if (!this.isKeyDown) {
            return;
        }
        this.isKeyDown = false;
        if (this.props.area === 'all' || this.props.area === 'mark') {
            this.innerClick(e);
            if (!this.slots('pop').length) {
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
        if (!this.slots('pop').length || (this.props.area === 'arrow' || this.props.area === 'mark')) {
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
                clickgo.form.showPop(this.refs.arrow, this.refs.pop, this.props.area === 'arrow' ? 'v' : 'h');
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
