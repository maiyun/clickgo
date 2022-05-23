"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.methods = exports.data = exports.computed = exports.props = void 0;
const clickgo = require("clickgo");
exports.props = {
    'disabled': {
        'default': false
    },
    'type': {
        'default': 'default'
    },
    'plain': {
        'default': false
    },
    'checked': {
        'default': undefined
    },
    'modelValue': {
        'default': undefined
    },
    'area': {
        'default': 'all'
    }
};
exports.computed = {
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'isPlain': function () {
        return clickgo.tool.getBoolean(this.plain);
    },
    'isChecked': function () {
        return clickgo.tool.getBoolean(this.checked);
    },
    'isAreaAllMark': function () {
        return this.$slots.pop ? (this.area === 'all' || this.area === 'mark') : true;
    },
    'isChildFocus': function () {
        return this.innerFocus || this.arrowFocus;
    },
    'opMargin': function () {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
};
exports.data = {
    'padding': '',
    'isKeyDown': false,
    'innerFocus': false,
    'arrowFocus': false
};
exports.methods = {
    keydown: function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (this.area === 'all' || this.area === 'mark') {
                this.innerClick(e);
                if (!this.$slots.pop) {
                    this.$el.click();
                }
            }
            else {
                if (this.innerFocus) {
                    this.innerClick(e);
                    this.$el.click();
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
    },
    keyup: function (e) {
        if (!this.isKeyDown) {
            return;
        }
        this.isKeyDown = false;
        if (this.area === 'all' || this.area === 'mark') {
            this.innerClick(e);
            if (!this.$slots.pop) {
                this.$el.click();
            }
        }
        else {
            if (this.innerFocus) {
                this.innerClick(e);
                this.$el.click();
            }
            else {
                this.arrowClick(e);
            }
        }
    },
    down: function (e) {
        if (this.area !== 'mark') {
            return;
        }
        clickgo.dom.bindLong(e, () => {
            clickgo.form.showPop(this.$refs.arrow, this.$refs.pop, 'h');
        });
    },
    innerClick: function (e) {
        if (!this.$slots.pop || (this.area === 'arrow' || this.area === 'mark')) {
            return;
        }
        e.stopPropagation();
        if (this.$el.dataset.cgPopOpen === undefined) {
            clickgo.form.showPop(this.$el, this.$refs.pop, 'v');
        }
        else {
            clickgo.form.hidePop(this.$el);
        }
    },
    arrowClick: function (e) {
        e.stopPropagation();
        if (this.area === 'all') {
            if (this.$el.dataset.cgPopOpen === undefined) {
                clickgo.form.showPop(this.$el, this.$refs.pop, 'v');
            }
            else {
                clickgo.form.hidePop(this.$el);
            }
        }
        else {
            if (this.$refs.arrow.dataset.cgPopOpen === undefined) {
                clickgo.form.showPop(this.$refs.arrow, this.$refs.pop, this.area === 'arrow' ? 'v' : 'h');
            }
            else {
                clickgo.form.hidePop(this.$refs.arrow);
            }
        }
    }
};
const mounted = function () {
    clickgo.dom.watchStyle(this.$el, 'padding', (n, v) => {
        this.padding = v;
    }, true);
};
exports.mounted = mounted;
