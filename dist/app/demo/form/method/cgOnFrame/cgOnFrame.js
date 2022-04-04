"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.data = void 0;
exports.data = {
    'timer': 0,
    'count': 0
};
exports.methods = {
    start: function (v) {
        let opt = {};
        switch (v) {
            case 0: {
                opt = {
                    'count': 1
                };
                break;
            }
            case 1: {
                opt = {
                    'count': 100
                };
                break;
            }
            case 3: {
                opt = {
                    'scope': 'task'
                };
                break;
            }
        }
        this.timer = this.cgOnFrame(() => {
            ++this.count;
            console.log('this.count', this.count);
        }, opt);
    },
    end: function () {
        this.cgOffFrame(this.timer);
        this.count = 0;
        this.timer = 0;
    }
};
