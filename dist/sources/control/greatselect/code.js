"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.methods = exports.computed = exports.props = void 0;
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
    'direction': {
        'default': 'h'
    },
    'flex': {
        'default': ''
    },
    'padding': {
        'default': undefined
    },
    'area': {
        'default': 'all'
    }
};
exports.computed = {
    'isDisabled': function () {
        return clickgo.tool.getBoolean(this.disabled);
    }
};
exports.methods = {
    keydown: function (e) {
        if (e.keyCode !== 13) {
            return;
        }
        if (this.cgSelfPopOpen) {
            this.cgHidePop();
            return;
        }
        this.cgShowPop('v', {
            'size': {
                'width': this.$el.offsetWidth
            }
        });
    },
    click: function (e, area) {
        if (this.disabled) {
            return;
        }
        this.cgTap(e);
        if (this.cgSelfPopOpen) {
            this.cgHidePop();
            return;
        }
        if (this.area === 'arrow' && area === 'left') {
            return;
        }
        this.cgShowPop('v', {
            'size': {
                'width': this.$el.offsetWidth
            }
        });
    }
};
exports.mounted = function () {
    this.cgPopPosition.width = '800px';
};
