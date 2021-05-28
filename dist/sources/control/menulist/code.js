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
    'hasTypeItemsCount': 0,
    'menulist': undefined
};
exports.mounted = function () {
    let menulist = this.cgFindParent('menulist');
    if (menulist) {
        this.menulist = menulist;
        ++menulist.hasSubItemsCount;
    }
};
exports.unmounted = function () {
    if (this.menulist) {
        --this.menulist.hasSubItemsCount;
    }
};
