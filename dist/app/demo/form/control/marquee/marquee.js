"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = void 0;
exports.data = {
    'lineCount': 2,
    'style': false,
    'direction': 'top',
    'scroll': false
};
exports.methods = {
    changeDirection: function () {
        switch (this.direction) {
            case 'top': {
                this.direction = 'bottom';
                break;
            }
            case 'bottom': {
                this.direction = 'left';
                break;
            }
            case 'left': {
                this.direction = 'right';
                break;
            }
            default: {
                this.direction = 'top';
            }
        }
    }
};
