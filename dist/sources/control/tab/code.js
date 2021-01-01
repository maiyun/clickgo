"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.watch = exports.computed = exports.data = exports.props = void 0;
exports.props = {
    'width': {
        'default': undefined
    },
    'height': {
        'default': undefined
    },
    'left': {
        'default': 0
    },
    'top': {
        'default': 0
    },
    'zIndex': {
        'default': 0
    },
    'flex': {
        'default': ''
    },
    'tabPosition': {
        'default': 'top'
    },
    'modelValue': {
        'default': ''
    }
};
exports.data = {
    'selected': ''
};
exports.computed = {
    'widthPx': function () {
        var _a;
        if (this.width !== undefined) {
            return this.width + 'px';
        }
        if (this.flex !== '') {
            return ((_a = this.$parent) === null || _a === void 0 ? void 0 : _a.direction) ? (this.$parent.direction === 'v' ? undefined : '0') : undefined;
        }
    },
    'heightPx': function () {
        var _a;
        if (this.height !== undefined) {
            return this.height + 'px';
        }
        if (this.flex !== '') {
            return ((_a = this.$parent) === null || _a === void 0 ? void 0 : _a.direction) ? (this.$parent.direction === 'v' ? '0' : undefined) : undefined;
        }
    },
    'tabs': function () {
        if (!this.$slots.default) {
            return [];
        }
        let tabs = [];
        let list = this.cgSlos();
        for (let item of list) {
            tabs.push({
                'label': item.props.label,
                'name': item.props.name || item.props.label
            });
        }
        return tabs;
    },
    'names': function () {
        let list = [];
        for (let item of this.tabs) {
            list.push(item.name);
        }
        return list;
    }
};
exports.watch = {
    'modelValue': {
        handler: function () {
            if (this.selected !== this.modelValue) {
                this.selected = this.modelValue;
            }
        },
        'immediate': true
    }
};
exports.mounted = function () {
    clickgo.dom.watchDom(this.$el, () => {
        if (this.selected === '') {
            let s = this.names[0] ? this.names[0] : '';
            if (this.selected !== s) {
                this.selected = s;
            }
        }
        else if (this.names.indexOf(this.selected) === -1) {
            let s = this.names[this.names.length - 1] ? this.names[this.names.length - 1] : '';
            if (this.selected !== s) {
                this.selected = s;
            }
        }
    }, 'default', true);
};
