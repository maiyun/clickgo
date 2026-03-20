import * as clickgo from 'clickgo';
export default class extends clickgo.control.AbstractControl {
    emits = {
        'check': null,
        'update:modelValue': null,
    };
    props = {
        'disabled': false,
        'alt': '',
        'type': '',
        'label': '',
        'modelValue': ''
    };
    /** --- 当前本地的值 --- */
    value = '';
    down(oe) {
        this.enter(oe);
        clickgo.modules.pointer.click(oe, () => {
            if (!this.props.type) {
                if (!this.slots['pop']) {
                    // --- 没有下层，则隐藏所有 pop ---
                    clickgo.form.hidePop();
                }
                return;
            }
            // --- 有 type ---
            if (this.props.type) {
                const event = {
                    'go': true,
                    preventDefault: function () {
                        this.go = false;
                    },
                    'detail': {
                        'value': this.value,
                        'label': undefined
                    }
                };
                if (this.props.type === 'radio') {
                    event.detail.label = this.props.label;
                    this.emit('check', event, this.value, this.props.label);
                    if (event.go) {
                        this.value = this.props.label;
                        this.emit('update:modelValue', this.value);
                    }
                }
                else if (this.props.type === 'check') {
                    this.emit('check', event, this.value);
                    if (event.go) {
                        this.value = !this.value;
                        this.emit('update:modelValue', this.value);
                    }
                }
            }
            clickgo.form.hidePop();
        });
    }
    enter(oe) {
        clickgo.modules.pointer.hover(oe, {
            enter: () => {
                clickgo.form.showPop(this.element, this.refs.pop, 'h');
            },
        });
    }
    /** --- 显示右侧的快捷键，解析 alt prop 中以 + 分隔的组合键 --- */
    get skeys() {
        if (!this.props.alt) {
            return [];
        }
        const isMac = this.device.os === 'macos';
        const parts = this.props.alt.split('+');
        const modifierSet = new Set(['ctrl', 'alt', 'shift', 'meta']);
        const hasModifier = parts.some(p => modifierSet.has(p.toLowerCase()));
        if (!hasModifier) {
            // --- 向后兼容：无修饰键时自动前置 Ctrl/⌘ ---
            return [isMac ? '⌘' : 'Ctrl', ...parts];
        }
        return parts.map(part => {
            if (!isMac) {
                return part;
            }
            switch (part.toLowerCase()) {
                case 'ctrl': return '⌘';
                case 'alt': return '⌥';
                case 'shift': return '⇧';
                case 'meta': return '⌘';
                default: return part;
            }
        });
    }
    onBeforeUnmount() {
        const menulist = this.parentByName('menulist');
        if (!menulist) {
            return;
        }
        // --- type ---
        if (this.props.type) {
            --menulist.hasTypeItemsCount;
        }
    }
    /** --- 设备信息 ---· */
    device = clickgo.getDevice();
    onMounted() {
        this.watch('type', () => {
            const menulist = this.parentByName('menulist');
            if (!menulist) {
                return;
            }
            if (this.props.type) {
                ++menulist.hasTypeItemsCount;
            }
            else {
                --menulist.hasTypeItemsCount;
            }
        }, {
            'immediate': true
        });
        this.watch('modelValue', () => {
            if (this.value === this.props.modelValue) {
                return;
            }
            this.value = this.props.modelValue;
        }, {
            'immediate': true
        });
        const menulist = this.parentByName('menulist');
        if (!menulist) {
            return;
        }
        if (this.props.type) {
            ++menulist.hasTypeItemsCount;
        }
    }
}
