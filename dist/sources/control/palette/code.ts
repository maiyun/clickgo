import * as clickgo from 'clickgo';

export default class extends clickgo.control.AbstractControl {

    public emits = {
        'changed': null,
        'ok': null,

        'update:modelValue': null,
    };

    public props: {
        'modelValue': string;
        'mode': 'hsl' | 'rgb' | 'hex';
        'ok': boolean;
    } = {
            'modelValue': '',
            'mode': 'hsl',
            'ok': false
        };

    /** --- 最终值 --- */
    public hsl = {
        'h': 0,
        /** --- 百分比，如 100 --- */
        's': 0,
        /** --- 百分比，如 50 --- */
        'l': 100,
        /** --- 透明度 --- */
        'a': 1
    };

    /** --- color 文本框的值 --- */
    public color = '';

    /** --- 用户的值 --- */
    public value = '';

    /** --- 语言包 --- */
    public localeData = {
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

    // --- 左侧 ---

    /** --- 左侧顶部 --- */
    public leftTop: number = 0;

    /** --- 左侧左侧 --- */
    public leftLeft: number = 0;

    public refreshLeftPosition(e: MouseEvent | TouchEvent, rect: DOMRect, maxTop: number, maxLeft: number): void {
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

    /** --- sv down --- */
    public leftDown(e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        /** --- right 的 rect 对象 --- */
        const leftRect = this.refs.left.getBoundingClientRect();
        /** --- 最大 top --- */
        const maxTop = leftRect.height - 4;
        const maxLeft = leftRect.width - 4;

        this.refreshLeftPosition(e, leftRect, maxTop, maxLeft);
        clickgo.dom.bindDown(e, {
            'move': (ne) => {
                this.refreshLeftPosition(ne, leftRect, maxTop, maxLeft);
            }
        });
    }

    /** --- 右侧顶部 --- */
    public rightTop: number = 0;

    public refreshRightPosition(e: MouseEvent | TouchEvent, rect: DOMRect, maxTop: number): void {
        /** --- 上面的位置 --- */
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

    /** --- h down --- */
    public rightDown(e: MouseEvent | TouchEvent): void {
        if (clickgo.dom.hasTouchButMouse(e)) {
            return;
        }
        /** --- right 的 rect 对象 --- */
        const rightRect = this.refs.right.getBoundingClientRect();
        /** --- 最大 top --- */
        const maxTop = rightRect.height - 4;

        this.refreshRightPosition(e, rightRect, maxTop);
        clickgo.dom.bindDown(e, {
            'move': (ne) => {
                this.refreshRightPosition(ne, rightRect, maxTop);
            }
        });
    }

    /** --- 更新值 --- */
    public updateModelValue(): void {
        const event: clickgo.control.IPaletteChangedEvent = {
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
                // --- hex ---
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

    /** --- 用户输入和 modelValue --- */
    public formatColor(color: string): void {
        if (!color) {
            const event: clickgo.control.IPaletteChangedEvent = {
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
            this.hsl.a = f[3] ?? 1;
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
            // --- hex ---
            const rgb = clickgo.tool.hex2rgb(v);
            const hsl = clickgo.tool.rgb2hsl(rgb.r, rgb.g, rgb.b, rgb.a, true);
            this.hsl.h = hsl.h;
            this.hsl.s = hsl.s;
            this.hsl.l = hsl.l;
            this.hsl.a = hsl.a;
        }

        // --- 将 sl 转换为 x, y 坐标 ---
        const leftRect = this.refs.left.getBoundingClientRect();
        /** --- 最大 top --- */
        const maxTop = leftRect.height - 4;
        const maxLeft = leftRect.width - 4;
        // --- 代码 ---
        const hsvV = this.hsl.l + (this.hsl.s / 100) * Math.min(this.hsl.l, 100 - this.hsl.l);
        const hsvS = hsvV === 0 ? 0 : 2 * (1 - this.hsl.l / hsvV) * 100;

        const top = (1 - hsvV / 100) * maxTop;
        const topRatio = top / maxTop;
        this.leftTop = topRatio * 100;

        const left = hsvS / 100 * maxLeft;
        const leftRatio = left / maxLeft;
        this.leftLeft = leftRatio * 100;

        // --- 再转换 h ---
        this.rightTop = this.hsl.h / 360 * 100;

        this.updateModelValue();
    }

    /** --- color 文本框输入 --- */
    public input(): void {
        if (this.color === this.value) {
            return;
        }
        // --- 格式化 ---
        this.formatColor(this.color);
    }

    public onMounted(): void | Promise<void> {
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
