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
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'durationchange': null,
            'canplay': null,
            'canplaythrough': null,
            'emptied': null,
            'ended': null,
            'error': null,
            'loadeddata': null,
            'loadedmetadata': null,
            'loadstart': null,
            'playing': null,
            'progress': null,
            'ratechange': null,
            'readystatechange': null,
            'seeked': null,
            'seeking': null,
            'stalled': null,
            'suspend': null,
            'waiting': null,
            'update:current': null,
            'update:play': null
        };
        this.props = {
            'src': '',
            'controls': false,
            'loop': false,
            'muted': false,
            'mode': 'default',
            'volume': 50,
            'play': false,
            'current': 0
        };
        this.srcData = '';
        this.isBlob = false;
        this.count = 0;
        this.duration = 0;
        this.inBar = false;
        this.hideTimer = 0;
        this.isShow = false;
        this.currentData = 0;
        this._currentTimer = 0;
        this.playData = false;
        this.bcurrent = 0;
    }
    onDurationchange() {
        if (!this.refs.video) {
            return;
        }
        this.duration = this.refs.video.duration;
        this.emit('durationchange', this.duration);
    }
    get durations() {
        return clickgo.tool.formatSecond(this.duration);
    }
    currentUpdateStart() {
        if (this._currentTimer) {
            return;
        }
        this._currentTimer = clickgo.task.onFrame(() => {
            if (this.currentData === this.refs.video.currentTime) {
                return;
            }
            this.currentData = this.refs.video.currentTime;
            this.emit('update:current', this.currentData);
        }, {
            'formId': this.formId
        });
    }
    currentUpdateEnd() {
        if (!this._currentTimer) {
            return;
        }
        clickgo.task.offFrame(this._currentTimer);
        this._currentTimer = 0;
    }
    get currents() {
        return clickgo.tool.formatSecond(this.currentData);
    }
    onPlay() {
        if (this.playData) {
            return;
        }
        this.currentUpdateStart();
        this.playData = true;
        this.emit('update:play', this.playData);
    }
    onPause() {
        if (!this.playData) {
            return;
        }
        this.currentUpdateEnd();
        this.playData = false;
        this.emit('update:play', this.playData);
    }
    playClick() {
        if (this.playData) {
            this.refs.video.pause();
            this.currentUpdateEnd();
        }
        else {
            this.refs.video.play();
            this.currentUpdateStart();
        }
        this.playData = !this.playData;
        this.emit('update:play', this.playData);
    }
    fullClick() {
        return __awaiter(this, void 0, void 0, function* () {
            if (clickgo.dom.is.full) {
                yield clickgo.dom.exitFullscreen();
                return;
            }
            yield this.element.requestFullscreen();
        });
    }
    get isFull() {
        return clickgo.dom.is.full;
    }
    onMouseEnter(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.propBoolean('controls')) {
            return;
        }
        this.isShow = true;
        if (this.hideTimer) {
            clickgo.task.removeTimer(this.hideTimer);
            this.hideTimer = 0;
        }
    }
    onMouseLeave(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        if (!this.propBoolean('controls')) {
            return;
        }
        this.hideTimer = clickgo.task.sleep(() => {
            this.isShow = false;
        }, 800);
    }
    onTouch(e) {
        if (!this.propBoolean('controls')) {
            return;
        }
        clickgo.dom.bindDown(e, {
            down: () => {
                this.isShow = true;
                if (this.hideTimer) {
                    clickgo.task.removeTimer(this.hideTimer);
                    this.hideTimer = 0;
                }
            },
            up: () => {
                this.hideTimer = clickgo.task.sleep(() => {
                    this.isShow = false;
                }, 800);
            }
        });
    }
    get bcurrents() {
        return clickgo.tool.formatSecond(this.bcurrent);
    }
    onBMove(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.inBar = true;
        const bcr = this.refs.top.getBoundingClientRect();
        const x = e.clientX - bcr.left;
        this.bcurrent = x / bcr.width * this.duration;
    }
    onBLeave(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.inBar = false;
    }
    onBClick(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        this.currentData = this.bcurrent;
        this.refs.video.currentTime = this.currentData;
        this.emit('update:current', this.currentData);
    }
    onBTouch(e) {
        const bcr = this.refs.top.getBoundingClientRect();
        clickgo.dom.bindDown(e, {
            move: (e2) => {
                this.inBar = true;
                const x = e2.touches[0].clientX - bcr.left;
                this.bcurrent = x / bcr.width * this.duration;
            },
            up: () => {
                this.inBar = false;
                this.currentData = this.bcurrent;
                this.refs.video.currentTime = this.currentData;
                this.emit('update:current', this.currentData);
            }
        });
    }
    onCanplay() {
        this.playData = this.propBoolean('play');
        if (this.playData && !this._currentTimer) {
            this.refs.video.play();
            this.currentUpdateStart();
        }
        this.emit('canplay');
    }
    onMounted() {
        this.watch('src', () => __awaiter(this, void 0, void 0, function* () {
            const count = ++this.count;
            if (typeof this.props.src !== 'string' || this.props.src === '') {
                if (this.isBlob) {
                    this.isBlob = false;
                    URL.revokeObjectURL(this.srcData);
                }
                this.srcData = '';
                return;
            }
            const pre = this.props.src.slice(0, 6).toLowerCase();
            if (pre === 'file:/') {
                if (this.isBlob) {
                    this.isBlob = false;
                    URL.revokeObjectURL(this.srcData);
                }
                this.srcData = '';
                return;
            }
            if (pre === 'http:/' || pre === 'https:' || pre.startsWith('data:')) {
                if (this.isBlob) {
                    this.isBlob = false;
                    URL.revokeObjectURL(this.srcData);
                }
                this.srcData = this.props.src;
                return;
            }
            const path = clickgo.tool.urlResolve('/package' + this.path + '/', this.props.src);
            const blob = yield clickgo.fs.getContent(path);
            if ((count !== this.count) || !blob || typeof blob === 'string') {
                return;
            }
            if (this.isBlob) {
                URL.revokeObjectURL(this.srcData);
            }
            const t = URL.createObjectURL(blob);
            this.srcData = t;
        }), {
            'immediate': true
        });
        this.watch('volume', () => {
            this.refs.video.volume = this.propInt('volume') / 100;
        }, {
            'immediate': true
        });
        this.watch('controls', () => {
            if (this.propBoolean('controls')) {
                this.isShow = true;
                this.hideTimer = clickgo.task.sleep(() => {
                    this.isShow = false;
                }, 800);
            }
            else {
                if (this.hideTimer) {
                    clickgo.task.removeTimer(this.hideTimer);
                    this.hideTimer = 0;
                }
            }
        }, {
            'immediate': true
        });
        this.watch('play', () => {
            if (this.playData === this.propBoolean('play')) {
                return;
            }
            this.playData = this.propBoolean('play');
            if (this.playData) {
                this.refs.video.play();
                this.currentUpdateStart();
            }
            else {
                this.refs.video.pause();
                this.currentUpdateEnd();
            }
        });
    }
    onUnmounted() {
        if (this.isBlob) {
            URL.revokeObjectURL(this.srcData);
        }
    }
}
exports.default = default_1;
