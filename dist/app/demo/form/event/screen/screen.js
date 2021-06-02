"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.data = void 0;
exports.data = {
    'width': 0,
    'height': 0,
    'scale': 4,
    'list': []
};
exports.mounted = function () {
    this.cgSetSystemEventListener('screenResize', (width, height) => {
        this.width = width;
        this.height = height;
        if (this.width > 1100 || this.height > 1100) {
            this.scale = 5;
        }
        else if (this.width < 420 || this.height < 420) {
            this.scale = 3;
        }
        else {
            this.scale = 4;
        }
        let date = new Date();
        this.list.unshift({
            'time': date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
            'width': width,
            'height': height
        });
    });
    let pos = clickgo.getPosition();
    this.width = pos.width;
    this.height = pos.height;
    if (this.width > 1100 || this.height > 1100) {
        this.scale = 5;
    }
    else if (this.width < 420 || this.height < 420) {
        this.scale = 3;
    }
    else {
        this.scale = 4;
    }
    let date = new Date();
    this.list.unshift({
        'time': date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
        'width': this.width,
        'height': this.height
    });
};
