"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.data = void 0;
exports.data = {
    'width': 0,
    'height': 0,
    'scale': 4,
    'list': []
};
const mounted = function () {
    this.cgSetSystemEventListener('screenResize', () => {
        const area = clickgo.form.getAvailArea();
        this.width = area.width;
        this.height = area.height;
        if (this.width > 1100 || this.height > 1100) {
            this.scale = 5;
        }
        else if (this.width < 420 || this.height < 420) {
            this.scale = 3;
        }
        else {
            this.scale = 4;
        }
        const date = new Date();
        this.list.unshift({
            'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
            'width': area.width,
            'height': area.height
        });
    });
    const area = clickgo.form.getAvailArea();
    this.width = area.width;
    this.height = area.height;
    if (this.width > 1100 || this.height > 1100) {
        this.scale = 5;
    }
    else if (this.width < 420 || this.height < 420) {
        this.scale = 3;
    }
    else {
        this.scale = 4;
    }
    const date = new Date();
    this.list.unshift({
        'time': date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
        'width': this.width,
        'height': this.height
    });
};
exports.mounted = mounted;
