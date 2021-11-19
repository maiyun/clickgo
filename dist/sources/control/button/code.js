"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.methods = exports.data = exports.watch = exports.computed = exports.props = void 0;
exports.props = {
    'disabled': {
        'default': false
    },
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
        return clickgo.tool.getBoolean(this.checkedData);
    }
};
exports.watch = {
    'checked': function () {
        this.checkedData = this.checked;
    }
};
exports.data = {
    'checkedData': undefined
};
exports.methods = {
    keydown: function (e) {
        if (e.keyCode !== 13) {
            return;
        }
        this.cgTap(e);
    },
    click: function (e) {
        if (this.checkedData !== undefined) {
            this.checkedData = this.isChecked ? false : true;
            this.$emit('update:checked', this.checkedData);
        }
        this.cgTap(e);
    }
};
exports.mounted = function () {
    this.checkedData = this.checked;
};
