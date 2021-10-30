"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmounted = exports.mounted = exports.data = exports.props = void 0;
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
    'modelValue': {
        'default': ''
    },
    'language': {
        'default': undefined
    }
};
exports.data = {
    'notInit': false,
};
exports.mounted = function () {
    let monaco = clickgo.core.getModule('monaco');
    if (monaco) {
        this.monacoInstance = monaco.editor.create(this.$refs.monaco);
        clickgo.dom.watchSize(this.$refs.monaco, () => {
            this.monacoInstance.layout();
        });
    }
    else {
        this.notInit = true;
    }
};
exports.unmounted = function () {
    if (this.monacoInstance) {
        this.monacoInstance.dispose();
    }
};
