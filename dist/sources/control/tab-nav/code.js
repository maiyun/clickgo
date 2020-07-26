"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methods = exports.mounted = exports.data = void 0;
exports.data = {
    "arrow": false,
    "timer": undefined
};
exports.mounted = function () {
    var _this = this;
    ClickGo.watchSize(this.$refs.tabs, function (size) {
        if (_this.$parent.tabPosition === "top" || _this.$parent.tabPosition === "bottom") {
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
        var num = type === "start" ? -20 : 20;
        ClickGo.bindDown(e, {
            down: function () {
                if (_this.timer !== undefined) {
                    clearInterval(_this.timer);
                }
                _this.timer = setInterval(function () {
                    if (_this.$parent.tabPosition === "top" || _this.$parent.tabPosition === "bottom") {
                        _this.$refs.tabs.scrollLeft += num;
                    }
                    else {
                        _this.$refs.tabs.scrollTop += num;
                    }
                }, 50);
            },
            up: function () {
                if (_this.timer !== undefined) {
                    clearInterval(_this.timer);
                    _this.timer = undefined;
                }
            }
        });
    }
};
