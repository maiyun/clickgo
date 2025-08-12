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
Object.defineProperty(exports, "__esModule", { value: true });
const clickgo = __importStar(require("clickgo"));
class default_1 extends clickgo.control.AbstractControl {
    constructor() {
        super(...arguments);
        this.emits = {
            'init': null,
            'connect': null,
            'disconnect': null,
            'password': null,
            'fail': null,
            'desktopresize': null,
            'clipboard': null,
        };
        this.notInit = false;
        this.isLoading = true;
        this.lastActive = 0;
        this.activeTimer = 0;
        this.access = {
            'novnc': undefined,
            'rfb': undefined,
        };
        this.props = {
            'modelValue': {
                'url': '',
                'pwd': '',
            },
        };
    }
    async onMounted() {
        const novnc = await clickgo.core.getModule('novnc');
        if (!novnc) {
            this.isLoading = false;
            this.notInit = true;
            return;
        }
        this.access.novnc = novnc;
        this.watch(() => JSON.stringify(this.props.modelValue), (v, o) => {
            if (v === o) {
                return;
            }
            if (!this.access.novnc) {
                return;
            }
            if (!this.props.modelValue?.url) {
                if (!this.access.rfb) {
                    return;
                }
                this.access.rfb.disconnect();
                this.access.rfb = undefined;
                return;
            }
            this.access.rfb = new this.access.novnc(this.refs.content, this.props.modelValue.url, {
                'credentials': {
                    'password': this.props.modelValue.pwd,
                },
                'viewOnly': this.props.modelValue.view ?? false,
                'clipViewport': false,
                'scaleViewport': true,
            });
            this.access.rfb.addEventListener('connect', () => {
                this.lastActive = Date.now();
                this.emit('connect', {
                    'width': this.access.rfb._fbWidth,
                    'height': this.access.rfb._fbHeight,
                });
            });
            this.access.rfb.addEventListener('disconnect', () => {
                this.emit('disconnect');
            });
            this.access.rfb.addEventListener('credentialsrequired', () => {
                this.emit('password');
            });
            this.access.rfb.addEventListener('securityfailure', () => {
                this.emit('fail');
            });
            this.access.rfb.addEventListener('desktopresize', () => {
                this.emit('desktopresize', {
                    'width': this.access.rfb._fbWidth,
                    'height': this.access.rfb._fbHeight,
                });
            });
            this.access.rfb.addEventListener('clipboard', (e) => {
                this.emit('clipboard', e.detail.text);
            });
        }, {
            'deep': true,
            'immediate': true,
        });
        this.isLoading = false;
        this.emit('init', this.access.novnc);
        this.activeTimer = clickgo.task.createTimer(() => {
            if (!this.access.rfb) {
                return;
            }
            if (Date.now() - this.lastActive < 30_000) {
                return;
            }
            this.access.rfb.sendPointer(0, 0, 0);
            this.lastActive = Date.now();
        }, 5_000);
    }
    onUnmounted() {
        clickgo.task.removeTimer(this.activeTimer);
        if (!this.access.rfb) {
            return;
        }
        this.access.rfb.disconnect();
        this.access.rfb = undefined;
    }
    mousemove() {
        if (!this.access.rfb) {
            return;
        }
        this.lastActive = Date.now();
    }
    sendPassword(pwd) {
        if (!this.access.rfb) {
            return false;
        }
        this.access.rfb.sendCredentials({
            'password': pwd,
        });
        return true;
    }
    sendClipboard(text) {
        if (!this.access.rfb) {
            return false;
        }
        this.access.rfb.clipboardPasteFrom(text);
        return true;
    }
    sendCtrlAltDel() {
        if (!this.access.rfb) {
            return false;
        }
        this.access.rfb.sendCtrlAltDel();
        return true;
    }
}
exports.default = default_1;
