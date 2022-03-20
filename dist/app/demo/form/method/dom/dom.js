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
exports.methods = exports.computed = exports.data = void 0;
exports.data = {
    'bindLongText': false,
    'moveLeft': 0,
    'moveTop': 0,
    'moveWidth': 25,
    'moveHeight': 25,
    'bindGestureText': '',
    'bindGestureWheelText': ''
};
exports.computed = {
    'isMove': function () {
        return clickgo.dom.is.move;
    }
};
exports.methods = {
    setGlobalCursor: function (type) {
        clickgo.dom.setGlobalCursor(type);
    },
    hasTouchButMouse: function (e) {
        clickgo.dom.hasTouchButMouse(e);
    },
    getStyleCount: function () {
        this.cgDialog(clickgo.dom.getStyleCount(this.taskId, 'form').toString()).catch((e) => { throw e; });
    },
    bindLong: function () {
        this.cgDialog('Press and hold this button.').catch((e) => { throw e; });
    },
    bindLongDown: function (e) {
        clickgo.dom.bindLong(e, () => __awaiter(this, void 0, void 0, function* () {
            this.bindLongText = true;
            yield clickgo.tool.sleep(500);
            this.bindLongText = false;
        }));
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
    bindGesture: function (e) {
        clickgo.dom.bindGesture(e, {
            'dirs': ['top', 'bottom'],
            handler: (dir) => __awaiter(this, void 0, void 0, function* () {
                this.bindGestureText = dir.slice(0, 1).toUpperCase() + dir.slice(1);
                yield clickgo.tool.sleep(500);
                this.bindGestureText = '';
            })
        });
    },
    bindGestureWheel: function (e) {
        clickgo.dom.bindGesture(e, {
            'dirs': ['top', 'bottom', 'left', 'right'],
            handler: (dir) => __awaiter(this, void 0, void 0, function* () {
                this.bindGestureWheelText = dir.slice(0, 1).toUpperCase() + dir.slice(1);
                yield clickgo.tool.sleep(500);
                this.bindGestureWheelText = '';
            })
        });
    }
};
