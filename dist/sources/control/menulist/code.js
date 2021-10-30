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
    }
};
exports.data = {
    'hasSubItemsCount': 0,
    'hasTypeItemsCount': 0
};
exports.mounted = function () {
    let menulist = this.cgParentByName('menulist');
    if (menulist) {
        ++menulist.hasSubItemsCount;
    }
};
exports.unmounted = function () {
    if (this.cgParentByName('menulist')) {
        --this.cgParentByName('menulist').hasSubItemsCount;
    }
};
