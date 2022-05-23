"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounted = exports.methods = exports.computed = exports.data = void 0;
const clickgo = require("clickgo");
exports.data = {
    'watchSizeText': false,
    'watchSizeHeight': true,
    'watchText': false,
    'watchInner': true,
    'watchStyleChange': true,
    'bindGestureText': '',
    'bindGestureWheelText': '',
    'bindLongText': false,
    'moveLeft': 0,
    'moveTop': 0,
    'moveWidth': 25,
    'moveHeight': 25,
};
exports.computed = {
    'isMove': function () {
        return clickgo.dom.is.move;
    },
    'isShift': function () {
        return clickgo.dom.is.shift;
    },
    'isCtrl': function () {
        return clickgo.dom.is.ctrl;
    }
};
exports.methods = {
    setGlobalCursor: function (type) {
        clickgo.dom.setGlobalCursor(type);
    },
    hasTouchButMouse: function (e) {
        clickgo.form.dialog(clickgo.dom.hasTouchButMouse(e) ? 'true' : 'false').catch((e) => { throw e; });
    },
    getStyleCount: function () {
        clickgo.form.dialog(clickgo.dom.getStyleCount(this.taskId, 'form').toString()).catch((e) => { throw e; });
    },
    getSize: function () {
        clickgo.form.dialog(JSON.stringify(clickgo.dom.getSize(this.$refs.getSize.$el))).catch((e) => { throw e; });
    },
    watchSize: function () {
        this.watchSizeText = !this.watchSizeText;
        if (this.watchSizeText) {
            clickgo.dom.watchSize(this.$refs.watchSize.$el, (size) => {
                clickgo.form.dialog(JSON.stringify(size)).catch((e) => { throw e; });
            });
        }
        else {
            clickgo.dom.unwatchSize(this.$refs.watchSize.$el);
        }
    },
    watch: function () {
        this.watchText = !this.watchText;
        if (this.watchText) {
            clickgo.dom.watch(this.$refs.watch.$el, () => {
                clickgo.form.dialog('Changed.').catch((e) => { throw e; });
            });
        }
        else {
            clickgo.dom.unwatch(this.$refs.watch.$el);
        }
    },
    isWatchStyle: function () {
        clickgo.form.dialog(clickgo.dom.isWatchStyle(this.$refs.watchStyle.$el) ? 'true' : 'false').catch((e) => { throw e; });
    },
    bindGesture: function (e) {
        clickgo.dom.bindGesture(e, {
            'dirs': ['top', 'bottom'],
            handler: (dir) => {
                this.bindGestureText = dir.slice(0, 1).toUpperCase() + dir.slice(1);
                const handler = () => __awaiter(this, void 0, void 0, function* () {
                    yield clickgo.tool.sleep(500);
                    this.bindGestureText = '';
                });
                handler().catch((e) => {
                    console.log(e);
                });
            }
        });
    },
    bindGestureWheel: function (e) {
        clickgo.dom.bindGesture(e, {
            'dirs': ['top', 'bottom', 'left', 'right'],
            handler: (dir) => {
                this.bindGestureWheelText = dir.slice(0, 1).toUpperCase() + dir.slice(1);
                const handler = () => __awaiter(this, void 0, void 0, function* () {
                    yield clickgo.tool.sleep(500);
                    this.bindGestureWheelText = '';
                });
                handler().catch((e) => {
                    console.log(e);
                });
            }
        });
    },
    bindLong: function () {
        clickgo.form.dialog('Press and hold this button.').catch((e) => { throw e; });
    },
    bindLongDown: function (e) {
        clickgo.dom.bindLong(e, () => __awaiter(this, void 0, void 0, function* () {
            this.bindLongText = true;
            yield clickgo.tool.sleep(500);
            this.bindLongText = false;
        }));
    },
    bindDragDown: function (e) {
        clickgo.dom.bindDrag(e, {
            'el': this.$refs.bindDrag,
            'data': 'bindDragDownTest'
        });
    },
    dragEnter: function (e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.target.innerText = 'enter';
            yield clickgo.tool.sleep(200);
            e.target.innerText = '';
        });
    },
    dragLeave: function (e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.target.innerText = 'leave';
            yield clickgo.tool.sleep(200);
            e.target.innerText = '';
        });
    },
    drop: function (e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.target.innerText = 'drop';
            yield clickgo.tool.sleep(500);
            e.target.innerText = '';
        });
    },
    bindMoveDown: function (e) {
        clickgo.dom.bindMove(e, {
            'areaObject': e.currentTarget,
            'object': this.$refs.move,
            move: (ox, oy) => {
                this.moveLeft += ox;
                this.moveTop += oy;
            }
        });
    },
    fullscreen: function () {
        clickgo.dom.fullscreen();
    }
};
const mounted = function () {
    clickgo.dom.watchStyle(this.$refs.watchStyle.$el, 'font-size', (n, v) => {
        clickgo.form.dialog('name: ' + n + ', value: ' + v).catch((e) => { throw e; });
    });
};
exports.mounted = mounted;
