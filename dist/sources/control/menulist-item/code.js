import * as clickgo from 'clickgo';
export default class MenulistItem extends clickgo.control.AbstractControl {
    /** --- 已由其他菜单项处理的快捷键事件 --- */
    static _$shortcutEvents = new WeakSet();
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
            this._select();
        });
    }
    /**
     * --- 执行菜单项自身的选中逻辑 ---
     */
    _select() {
        if (!this.props.type) {
            if (!this.slots['pop']) {
                // --- 没有下层，则隐藏所有 pop ---
                clickgo.form.hidePop();
            }
            return;
        }
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
        clickgo.form.hidePop();
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
    /**
     * --- 判断键盘事件是否匹配当前快捷键 ---
     * @param e 键盘事件
     * @returns 是否匹配
     */
    _matchShortcut(e) {
        const parts = this.props.alt.split('+').map(part => part.trim()).filter(part => part);
        if (!parts.length) {
            return false;
        }
        const isMac = this.device.os === 'macos';
        const modifiers = {
            'ctrl': false,
            'alt': false,
            'shift': false,
            'meta': false
        };
        let key = '';
        let hasModifier = false;
        for (const part of parts) {
            const lower = part.toLowerCase();
            if (lower === 'ctrl') {
                modifiers[isMac ? 'meta' : 'ctrl'] = true;
                hasModifier = true;
            }
            else if (lower === 'alt') {
                modifiers.alt = true;
                hasModifier = true;
            }
            else if (lower === 'shift') {
                modifiers.shift = true;
                hasModifier = true;
            }
            else if (lower === 'meta') {
                modifiers.meta = true;
                hasModifier = true;
            }
            else {
                if (key) {
                    return false;
                }
                key = lower;
            }
        }
        if (!key) {
            return false;
        }
        if (!hasModifier) {
            modifiers[isMac ? 'meta' : 'ctrl'] = true;
        }
        return (e.key.toLowerCase() === key) &&
            (e.ctrlKey === modifiers.ctrl) &&
            (e.altKey === modifiers.alt) &&
            (e.shiftKey === modifiers.shift) &&
            (e.metaKey === modifiers.meta);
    }
    /**
     * --- 判断菜单项所属的窗体或 Panel 是否正在交互 ---
     * @returns 是否可响应快捷键
     */
    _isActive() {
        if (clickgo.form.getFocus() !== this.formId) {
            return false;
        }
        const root = this.parentByName('root');
        if (!root?.panelId) {
            return true;
        }
        return clickgo.form.getActivePanel(this.formId).includes(root.panelId);
    }
    /**
     * --- 响应快捷键 ---
     * @param e 键盘事件
     */
    _keydown(e) {
        if (e.repeat || e.isComposing || !this.props.alt || this.propBoolean('disabled')) {
            return;
        }
        if (MenulistItem._$shortcutEvents.has(e) || !this._matchShortcut(e) || !this._isActive()) {
            return;
        }
        MenulistItem._$shortcutEvents.add(e);
        e.preventDefault();
        this._select();
        this.element.click();
    }
    onBeforeUnmount() {
        if (this.device.type === 'desktop') {
            window.removeEventListener('keydown', this._keydown);
        }
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
        if (this.device.type === 'desktop') {
            window.addEventListener('keydown', this._keydown);
        }
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
