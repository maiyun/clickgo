"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.watch = exports.computed = exports.data = exports.props = void 0;
exports.props = {
    'src': {
        'default': ''
    },
    'mode': {
        'default': 'default'
    }
};
exports.data = {
    'imgData': '',
    'width': 0,
    'height': 0
};
exports.computed = {
    'backgroundSize': function () {
        if (this.mode === 'default') {
            return this.width.toString() + 'px ' + this.height.toString() + 'px';
        }
        else {
            return this.mode;
        }
    }
};
exports.watch = {
    'src': {
        handler: function () {
            if (this.src === '') {
                this.imgData = undefined;
                return;
            }
            const pre = this.src.slice(0, 6).toLowerCase();
            if (pre === 'http:/' || pre === 'https:' || pre === 'file:/' || pre === 'data:i') {
                this.imgData = `url(${this.src})`;
                return;
            }
            const t = this.cgGetObjectUrl(this.src);
            if (t) {
                this.imgData = 'url(' + t + ')';
                return;
            }
            this.imgData = undefined;
        },
        'immediate': true
    }
};
const mounted = function () {
    clickgo.dom.watchSize(this.$el, (size) => {
        this.width = size.width;
        this.height = size.height;
    }, true);
};
exports.mounted = mounted;
