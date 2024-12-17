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
            'changed': null,
            'ok': null,
            'update:modelValue': null,
        };
        this.props = {
            'modelValue': '',
            'mode': 'hsl',
            'ok': false
        };
        this.hsl = {
            'h': 0,
            's': 0,
            'l': 100,
            'a': 1
        };
        this.color = '';
        this.value = '';
        this.localeData = {
            'en': {
                'clear': 'Clear',
                'ok': 'OK',
            },
            'sc': {
                'clear': '清除',
                'ok': '确定',
            },
            'tc': {
                'clear': '清除',
                'ok': '確定',
            },
            'ja': {
                'clear': 'クリア',
                'ok': 'OK',
            },
            'ko': {
                'clear': '지우기',
                'ok': '확인',
            },
            'th': {
                'clear': 'ล้าง',
                'ok': 'ตกลง',
            },
            'es': {
                'clear': 'Claro',
                'ok': 'Aceptar',
            },
            'de': {
                'clear': 'Löschen',
                'ok': 'OK',
            },
            'fr': {
                'clear': 'Effacer',
                'ok': 'Valider',
            },
            'pt': {
                'clear': 'Limpar',
                'ok': 'OK',
            },
            'ru': {
                'clear': 'Очистить',
                'ok': 'ОК',
            },
            'vi': {
                'clear': 'Xóa',
                'ok': 'OK',
            }
        };
        this.leftTop = 0;
        this.leftLeft = 0;
        this.rightTop = 0;
    }
    refreshLeftPosition(e, rect, maxTop, maxLeft) {
        let top = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - rect.top;
        if (top < 0) {
            top = 0;
        }
        else if (top > maxTop) {
            top = maxTop;
        }
        const topRatio = top / maxTop;
        this.leftTop = topRatio * 100;
        let left = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - rect.left;
        if (left < 0) {
            left = 0;
        }
        else if (left > maxLeft) {
            left = maxLeft;
        }
        const leftRatio = left / maxLeft;
        this.leftLeft = leftRatio * 100;
        const hsvValue = 1 - (top / maxTop);
        const hsvSaturation = left / maxLeft;
        const lightness = (hsvValue / 2) * (2 - hsvSaturation);
        const saturation = (hsvValue * hsvSaturation) / (1 - Math.abs(2 * lightness - 1));
        this.hsl.s = saturation ? Math.round(saturation * 100) : 0;
        this.hsl.l = Math.round(lightness * 100);
        this.hsl.a = 1;
        this.updateModelValue();
    }
    leftDown(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        const leftRect = this.refs.left.getBoundingClientRect();
        const maxTop = leftRect.height - 4;
        const maxLeft = leftRect.width - 4;
        this.refreshLeftPosition(e, leftRect, maxTop, maxLeft);
        clickgo.dom.bindDown(e, {
            'move': (ne) => {
                this.refreshLeftPosition(ne, leftRect, maxTop, maxLeft);
            }
        });
    }
    refreshRightPosition(e, rect, maxTop) {
        let top = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - rect.top;
        if (top < 0) {
            top = 0;
        }
        else if (top > maxTop) {
            top = maxTop;
        }
        const ratio = top / maxTop;
        this.rightTop = ratio * 100;
        this.hsl.h = Math.round(ratio * 360);
        this.updateModelValue();
    }
    rightDown(e) {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        const rightRect = this.refs.right.getBoundingClientRect();
        const maxTop = rightRect.height - 4;
        this.refreshRightPosition(e, rightRect, maxTop);
        clickgo.dom.bindDown(e, {
            'move': (ne) => {
                this.refreshRightPosition(ne, rightRect, maxTop);
            }
        });
    }
    updateModelValue() {
        const event = {
            'detail': {
                'value': '',
                'hsl': undefined,
                'rgb': undefined
            }
        };
        event.detail.value = '';
        switch (this.props.mode) {
            case 'hsl': {
                event.detail.hsl = {
                    'h': Math.round(this.hsl.h),
                    's': Math.round(this.hsl.s),
                    'l': Math.round(this.hsl.l),
                    'a': this.hsl.a
                };
                event.detail.value = `hsl${this.hsl.a === 1 ? '' : 'a'}(${event.detail.hsl.h},${event.detail.hsl.s}%,${event.detail.hsl.l}%${event.detail.hsl.a === 1 ? '' : ',' + event.detail.hsl.a})`;
                break;
            }
            case 'rgb': {
                const rgb = clickgo.tool.hsl2rgb(this.hsl.h, this.hsl.s, this.hsl.l, this.hsl.a);
                event.detail.rgb = {
                    'r': Math.round(rgb.r),
                    'g': Math.round(rgb.g),
                    'b': Math.round(rgb.b),
                    'a': rgb.a
                };
                event.detail.value = rgb.rgb;
                break;
            }
            default: {
                const rgb = clickgo.tool.hsl2rgb(this.hsl.h, this.hsl.s, this.hsl.l, this.hsl.a);
                const hex = clickgo.tool.rgb2hex(rgb.r, rgb.g, rgb.b, rgb.a);
                event.detail.value = '#' + hex;
            }
        }
        if (this.value === event.detail.value) {
            return;
        }
        this.color = event.detail.value;
        this.value = this.color;
        this.emit('update:modelValue', event.detail.value);
        this.emit('changed', event);
    }
    formatColor(color) {
        var _a;
        if (!color) {
            const event = {
                'detail': {
                    'value': '',
                    'hsl': undefined,
                    'rgb': undefined
                }
            };
            this.color = '';
            this.value = '';
            this.emit('update:modelValue', event.detail.value);
            this.emit('changed', event);
            return;
        }
        const v = color.toLowerCase();
        if (v.startsWith('hsl')) {
            const f = clickgo.tool.formatColor(v);
            this.hsl.h = Math.round(f[0]);
            this.hsl.s = Math.round(f[1]);
            this.hsl.l = Math.round(f[2]);
            this.hsl.a = (_a = f[3]) !== null && _a !== void 0 ? _a : 1;
        }
        else if (v.startsWith('rgb')) {
            const f = clickgo.tool.formatColor(v);
            const hsl = clickgo.tool.rgb2hsl(f[0], f[1], f[2], f[3], true);
            this.hsl.h = hsl.h;
            this.hsl.s = hsl.s;
            this.hsl.l = hsl.l;
            this.hsl.a = hsl.a;
        }
        else {
            const rgb = clickgo.tool.hex2rgb(v);
            const hsl = clickgo.tool.rgb2hsl(rgb.r, rgb.g, rgb.b, rgb.a, true);
            this.hsl.h = hsl.h;
            this.hsl.s = hsl.s;
            this.hsl.l = hsl.l;
            this.hsl.a = hsl.a;
        }
        const leftRect = this.refs.left.getBoundingClientRect();
        const maxTop = leftRect.height - 4;
        const maxLeft = leftRect.width - 4;
        const hsvV = this.hsl.l + (this.hsl.s / 100) * Math.min(this.hsl.l, 100 - this.hsl.l);
        const hsvS = hsvV === 0 ? 0 : 2 * (1 - this.hsl.l / hsvV) * 100;
        const top = (1 - hsvV / 100) * maxTop;
        const topRatio = top / maxTop;
        this.leftTop = topRatio * 100;
        const left = hsvS / 100 * maxLeft;
        const leftRatio = left / maxLeft;
        this.leftLeft = leftRatio * 100;
        this.rightTop = this.hsl.h / 360 * 100;
        this.updateModelValue();
    }
    input() {
        if (this.color === this.value) {
            return;
        }
        this.formatColor(this.color);
    }
    onMounted() {
        this.watch('modelValue', () => {
            if (this.props.modelValue === this.value) {
                return;
            }
            this.color = this.props.modelValue;
            this.value = this.color;
            this.formatColor(this.value);
        }, {
            'immediate': true
        });
        this.watch('mode', () => {
            if (!this.value) {
                return;
            }
            this.updateModelValue();
        });
    }
}
exports.default = default_1;
