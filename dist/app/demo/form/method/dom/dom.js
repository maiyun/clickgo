"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const clickgo = __importStar(require("clickgo"));
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
        this.watchPositionText = false;
        this.getWatchInfoDisabled = false;
        this.getWatchInfoText = '{}';
        this.scaleX = 0;
        this.scaleY = 0;
        this.scaleS = 1;
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
    get isMeta() {
        return clickgo.dom.is.meta;
    }
    get isFull() {
        return clickgo.dom.is.full;
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
    getWatchSizeCount(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog(clickgo.dom.getWatchSizeCount(taskId).toString());
        });
    }
    watchSize() {
        this.watchSizeText = !this.watchSizeText;
        if (this.watchSizeText) {
            clickgo.dom.watchSize(this.refs.watchSize.$el, () => {
                clickgo.form.dialog(JSON.stringify({
                    'width': this.refs.watchSize.$el.offsetWidth,
                    'height': this.refs.watchSize.$el.offsetHeight
                })).catch((e) => { throw e; });
            });
        }
        else {
            clickgo.dom.unwatchSize(this.refs.watchSize.$el);
        }
    }
    watchPosition() {
        this.watchPositionText = !this.watchPositionText;
        if (this.watchPositionText) {
            clickgo.dom.watchPosition(this.refs.watchPosition.$el, (state) => {
                console.log('watchPosition', state);
            });
        }
        else {
            clickgo.dom.unwatchPosition(this.refs.watchPosition.$el);
        }
    }
    wwatch() {
        this.watchText = !this.watchText;
        if (this.watchText) {
            clickgo.dom.watch(this.refs.watch.$el, () => {
                clickgo.form.dialog('Changed.').catch((e) => { throw e; });
            }, 'text');
        }
        else {
            clickgo.dom.unwatch(this.refs.watch.$el);
        }
    }
    getWatchCount(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.form.dialog(clickgo.dom.getWatchCount(taskId).toString());
        });
    }
    isWatchStyle() {
        clickgo.form.dialog(clickgo.dom.isWatchStyle(this.refs.watchStyle.$el) ? 'true' : 'false').catch((e) => { throw e; });
    }
    getWatchInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            this.getWatchInfoDisabled = true;
            for (let i = 0; i < 40; ++i) {
                const rtn = clickgo.dom.getWatchInfo();
                this.getWatchInfoText = JSON.stringify(rtn, undefined, 4);
                yield clickgo.tool.sleep(500);
            }
            this.getWatchInfoDisabled = false;
        });
    }
    bindGesture(e) {
        clickgo.dom.bindGesture(e, (ne, dir) => {
            if (['top', 'bottom'].includes(dir)) {
                return 1;
            }
            return 0;
        }, (dir) => __awaiter(this, void 0, void 0, function* () {
            this.bindGestureText = dir.slice(0, 1).toUpperCase() + dir.slice(1);
            yield clickgo.tool.sleep(500);
            this.bindGestureText = '';
        }));
    }
    bindGestureWheel(e) {
        clickgo.dom.bindGesture(e, (ne, dir) => {
            if (['top', 'bottom', 'left', 'right'].includes(dir)) {
                return 1;
            }
            return 0;
        }, (dir) => __awaiter(this, void 0, void 0, function* () {
            this.bindGestureWheelText = dir.slice(0, 1).toUpperCase() + dir.slice(1);
            yield clickgo.tool.sleep(500);
            this.bindGestureWheelText = '';
        }));
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
            move: (e, o) => {
                this.moveLeft += o.ox;
                this.moveTop += o.oy;
            }
        });
    }
    moveDown(e) {
        clickgo.dom.bindDblClick(e, () => {
            this.moveWidth = this.moveWidth === 25 ? 50 : 25;
            this.moveHeight = this.moveHeight === 25 ? 50 : 25;
        });
    }
    bindScaleDown(e) {
        clickgo.dom.bindScale(e, (e, scale, cpos) => {
            e.preventDefault();
            this.scaleX += cpos.x;
            this.scaleY += cpos.y;
            this.scaleS *= scale;
        });
    }
    fullscreen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield clickgo.dom.fullscreen();
        });
    }
    onMounted() {
        clickgo.dom.watchStyle(this.refs.watchStyle.$el, 'font-size', (n, v) => {
            clickgo.form.dialog('name: ' + n + ', value: ' + v).catch((e) => { throw e; });
        });
    }
}
exports.default = default_1;
