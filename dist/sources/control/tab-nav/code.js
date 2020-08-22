"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.mounted = exports.data = void 0;
exports.data = {
    'arrow': false,
    'timer': undefined
};
exports.mounted = function () {
    var _this = this;
    clickgo.element.watchSize(this.$refs.tabs, function (size) {
        if (_this.$parent.tabPosition === 'top' || _this.$parent.tabPosition === 'bottom') {
            if (size.scrollWidth > size.clientWidth) {
                _this.arrow = true;
            }
            else {
                _this.arrow = false;
            }
        }
        else {
            if (size.scrollHeight > size.clientHeight) {
                _this.arrow = true;
            }
            else {
                _this.arrow = false;
            }
        }
    }, true);
};
exports.methods = {
    longDown: function (e, type) {
        var _this = this;
        var num = type === 'start' ? -5 : 5;
        clickgo.element.bindDown(e, {
            down: function () {
                if (_this.timer !== undefined) {
                    _this.timer = undefined;
                }
                var cb = function () {
                    if (_this.$parent.tabPosition === 'top' || _this.$parent.tabPosition === 'bottom') {
                        _this.$refs.tabs.scrollLeft += num;
                    }
                    else {
                        _this.$refs.tabs.scrollTop += num;
                    }
                    if (_this.timer !== undefined) {
                        requestAnimationFrame(cb);
                    }
                };
                _this.timer = requestAnimationFrame(cb);
            },
            up: function () {
                if (_this.timer !== undefined) {
                    _this.timer = undefined;
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
