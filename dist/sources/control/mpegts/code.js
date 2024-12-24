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
            'canplay': null,
            'init': null,
            'update:play': null
        };
        this.props = {
            'src': '',
            'text': '',
            'controls': false,
            'volume': 80,
            'play': false,
        };
        this.access = {
            'instance': undefined,
            'mpegts': undefined
        };
        this.notInit = false;
        this.isLoading = true;
        this.isShow = false;
        this.hideTimer = 0;
        this.playData = false;
    }
    toPlay() {
        this.access.instance = this.access.mpegts.createPlayer({
            'type': 'mse',
            'isLive': true,
            'url': this.props.src
        }, {
            'enableStashBuffer': false,
            'stashInitialSize': 128,
            'lazyLoad': false,
            'lazyLoadMaxDuration': 0.2,
            'liveBufferLatencyChasing': true,
            'liveBufferLatencyMinRemain': 0.2,
            'autoCleanupSourceBuffer': true,
            'autoCleanupMaxBackwardDuration': 5,
            'autoCleanupMinBackwardDuration': 5
        });
        this.access.instance.attachMediaElement(this.refs.video);
        this.access.instance.load();
        this.access.instance.play();
    }
    playClick() {
        if (this.playData) {
            if (this.access.instance) {
                this.access.instance.destroy();
                this.access.instance = undefined;
            }
        }
        else {
            this.toPlay();
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
    onCanplay() {
        this.playData = this.propBoolean('play');
        if (this.playData && this.access.instance) {
            this.access.instance.play();
        }
        this.emit('canplay');
    }
    onMounted() {
        return __awaiter(this, void 0, void 0, function* () {
            const mpegts = yield clickgo.core.getModule('mpegts');
            if (!mpegts) {
                this.isLoading = false;
                this.notInit = true;
                return;
            }
            this.access.mpegts = mpegts;
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
                    this.toPlay();
                }
                else {
                    this.access.instance.destroy();
                    this.access.instance = undefined;
                }
            });
            this.playData = this.propBoolean('play');
            this.watch('src', (n, o) => __awaiter(this, void 0, void 0, function* () {
                if (n === o) {
                    return;
                }
                if (!this.props.src) {
                    if (!this.access.instance) {
                        return;
                    }
                    this.access.instance.destroy();
                    this.access.instance = undefined;
                    return;
                }
                if (this.access.instance) {
                    this.access.instance.destroy();
                }
                if (this.playData) {
                    this.toPlay();
                }
            }), {
                'immediate': true
            });
            this.isLoading = false;
            this.emit('init', {
                'mpegts': this.access.mpegts,
                'instance': this.access.instance
            });
        });
    }
    onUnmounted() {
        if (!this.access.instance) {
            return;
        }
        this.access.instance.destroy();
    }
}
exports.default = default_1;
