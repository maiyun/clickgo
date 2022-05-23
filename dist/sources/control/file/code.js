"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.computed = exports.props = void 0;
const clickgo = require("clickgo");
exports.props = {
    'accept': {
        'default': undefined
    },
    'multi': {
        'default': false
    },
    'dir': {
        'default': false
    }
};
exports.computed = {
    'isMulti': function () {
        return clickgo.tool.getBoolean(this.multi);
    },
    'isDir': function () {
        return clickgo.tool.getBoolean(this.dir);
    },
    'acceptComp': function () {
        if (!this.accept) {
            return undefined;
        }
        if (!Array.isArray(this.accept)) {
            return undefined;
        }
        const accept = [];
        for (const item of this.accept) {
            if (typeof item !== 'string') {
                continue;
            }
            accept.push('.' + item);
        }
        return accept.join(',');
    }
};
exports.methods = {
    select: function () {
        this.$refs.input.click();
    },
    change: function (e) {
        e.stopPropagation();
        const inputEl = this.$refs.input;
        this.$emit('change', inputEl.files);
        inputEl.value = '';
    }
};
