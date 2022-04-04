"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.methods = exports.computed = exports.data = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
    },
    'direction': {
        'default': 'h'
    },
    'area': {
        'default': 'all'
    },
    'pop': {
        'default': 'greatlist'
    },
    'data': {
        'default': []
    },
    'modelValue': {
        'default': -1
    }
};
exports.data = {
    'padding': '',
    'isKeyDown': false
};
exports.computed = {
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    },
    'opMargin': function () {
        return this.padding.replace(/(\w+)/g, '-$1');
    }
};
exports.methods = {
    keydown: function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.click('arrow');
        }
        else if (e.key === ' ') {
            e.preventDefault();
            this.isKeyDown = true;
        }
    },
    keyup: function () {
        if (!this.isKeyDown) {
            return;
        }
        this.isKeyDown = false;
        this.click('arrow');
    },
    click: function (e, area) {
        if (this.$el.dataset.cgPopOpen !== undefined) {
            clickgo.form.hidePop(this.$el);
            return;
        }
        if (this.area === 'arrow' && area === 'left') {
            return;
        }
        clickgo.form.showPop(this.$el, this.$refs.pop, 'v', {
            'size': {
                'width': this.$el.offsetWidth
            }
        });
    },
    updateModelValue: function (val) {
        this.$emit('update:modelValue', val);
    },
    itemclick: function (e, arrow) {
        if (arrow) {
            return;
        }
        clickgo.form.hidePop();
    }
};
const mounted = function () {
    clickgo.dom.watchStyle(this.$el, 'padding', (n, v) => {
        this.padding = v;
    }, true);
};
exports.mounted = mounted;
