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
const clickgo = require("clickgo");
class default_1 extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.watchSizeText = false;
        this.watchSizeHeight = true;
        this.watchText = false;
        this.watchInner = true;
        this.watchStyleChange = true;
        this.bindGestureText = '';
        this.bindGestureWheelText = '';
        this.bindLongText = false;
        this.moveLeft = 0;
        this.moveTop = 0;
        this.moveWidth = 25;
        this.moveHeight = 25;
    }
    get isMove() {
        return clickgo.dom.is.move;
    }
    get isShift() {
        return clickgo.dom.is.shift;
    }
    get isCtrl() {
        return clickgo.dom.is.ctrl;
    }
    setGlobalCursor(type) {
        clickgo.dom.setGlobalCursor(type);
    }
    hasTouchButMouse(e) {
        clickgo.form.dialog(clickgo.dom.hasTouchButMouse(e) ? 'true' : 'false').catch((e) => { throw e; });
    }
    getStyleCount() {
        clickgo.form.dialog(clickgo.dom.getStyleCount(this.taskId, 'form').toString()).catch((e) => { throw e; });
    }
    getSize() {
        clickgo.form.dialog(JSON.stringify(clickgo.dom.getSize(this.refs.getSize.$el))).catch((e) => { throw e; });
    }
    watchSize() {
        this.watchSizeText = !this.watchSizeText;
        if (this.watchSizeText) {
            clickgo.dom.watchSize(this.refs.watchSize.$el, (size) => {
                clickgo.form.dialog(JSON.stringify(size)).catch((e) => { throw e; });
            });
        }
        else {
            clickgo.dom.unwatchSize(this.refs.watchSize.$el);
        }
    }
    wwatch() {
        this.watchText = !this.watchText;
        if (this.watchText) {
            clickgo.dom.watch(this.refs.watch.$el, () => {
                clickgo.form.dialog('Changed.').catch((e) => { throw e; });
            });
        }
        else {
            clickgo.dom.unwatch(this.refs.watch.$el);
        }
    }
    isWatchStyle() {
        clickgo.form.dialog(clickgo.dom.isWatchStyle(this.refs.watchStyle.$el) ? 'true' : 'false').catch((e) => { throw e; });
    }
    bindGesture(e) {
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
    }
    bindGestureWheel(e) {
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
    }
    bindLong() {
        clickgo.form.dialog('Press and hold this button.').catch((e) => { throw e; });
    }
    bindLongDown(e) {
        clickgo.dom.bindLong(e, () => __awaiter(this, void 0, void 0, function* () {
            this.bindLongText = true;
            yield clickgo.tool.sleep(500);
            this.bindLongText = false;
        }));
    }
    bindDragDown(e) {
        clickgo.dom.bindDrag(e, {
            'el': this.refs.bindDrag,
            'data': 'bindDragDownTest'
        });
    }
    dragEnter(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.target.innerText = 'enter';
            yield clickgo.tool.sleep(200);
            e.target.innerText = '';
        });
    }
    dragLeave(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.target.innerText = 'leave';
            yield clickgo.tool.sleep(200);
            e.target.innerText = '';
        });
    }
    drop(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.target.innerText = 'drop';
            yield clickgo.tool.sleep(500);
            e.target.innerText = '';
        });
    }
    bindMoveDown(e) {
        clickgo.dom.bindMove(e, {
            'areaObject': e.currentTarget,
            'object': this.refs.move,
            move: (ox, oy) => {
                this.moveLeft += ox;
                this.moveTop += oy;
            }
        });
    }
    fullscreen() {
        clickgo.dom.fullscreen();
    }
    onMounted() {
        clickgo.dom.watchStyle(this.refs.watchStyle.$el, 'font-size', (n, v) => {
            clickgo.form.dialog('name: ' + n + ', value: ' + v).catch((e) => { throw e; });
        });
    }
}
exports.default = default_1;
