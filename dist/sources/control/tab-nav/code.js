"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.mounted = exports.data = void 0;
exports.data = {
    'arrow': false,
    'timer': undefined
};
exports.mounted = function () {
    clickgo.element.watchSize(this.$refs.tabs, (size) => {
        if (this.$parent.tabPosition === 'top' || this.$parent.tabPosition === 'bottom') {
            if (size.scrollWidth > size.clientWidth) {
                this.arrow = true;
            }
            else {
                this.arrow = false;
            }
        }
        else {
            if (size.scrollHeight > size.clientHeight) {
                this.arrow = true;
            }
            else {
                this.arrow = false;
            }
        }
    }, true);
};
exports.methods = {
    longDown: function (e, type) {
        let num = type === 'start' ? -5 : 5;
        clickgo.element.bindDown(e, {
            down: () => {
                if (this.timer !== undefined) {
                    this.timer = undefined;
                }
                let cb = () => {
                    if (this.$parent.tabPosition === 'top' || this.$parent.tabPosition === 'bottom') {
                        this.$refs.tabs.scrollLeft += num;
                    }
                    else {
                        this.$refs.tabs.scrollTop += num;
                    }
                    if (this.timer !== undefined) {
                        requestAnimationFrame(cb);
                    }
                };
                this.timer = requestAnimationFrame(cb);
            },
            up: () => {
                if (this.timer !== undefined) {
                    this.timer = undefined;
                }
            }
        });
    },
    wheel: function (e) {
        if (this.$parent.tabPosition === 'left' || this.$parent.tabPosition === 'right') {
            return;
        }
        if (e.deltaX !== 0) {
            return;
        }
        e.preventDefault();
        this.$refs.tabs.scrollLeft += e.deltaY;
    }
};
