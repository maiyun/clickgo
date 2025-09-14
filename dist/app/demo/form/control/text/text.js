import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.value = '';
        this.nvalue = '';
        this.isFocus = false;
        this.nisFocus = false;
        // --- 属性 ---
        this.selectionStart = 0;
        this.selectionEnd = 0;
        this.scrollLeft = 0;
        this.scrollTop = 0;
        this.clientHeight = 0;
        this.clientWidth = 0;
        this.scrollHeight = 0;
        this.scrollWidth = 0;
        // --- 操作 ---
        this.type = ['text'];
        this.disabled = false;
        this.placeholder = 'placeholder';
        this.readonly = false;
        this.scroll = true;
        this.wrap = true;
        this.menu = false;
        this.gesture = false;
        this.long = false;
        // --- 样式 ---
        this.lineHeight = 1;
        this.fontSize = 12;
        this.maxlength = 0;
        this.keyboard = false;
        this.prepend = false;
        this.append = false;
        this.before = false;
        this.after = false;
        this.border = 'solid';
        this.background = undefined;
        this.phcolor = undefined;
        this.max = undefined;
        this.min = undefined;
        this.plain = false;
        this.require = false;
        this.padding = ['m'];
        /** --- 是否开启修改拦截 --- */
        this.beforechange = false;
    }
    get textBorder() {
        switch (this.border) {
            case 'underline': {
                return '0 0 .5px 0';
            }
            case 'none': {
                return '0';
            }
        }
        return undefined;
    }
    longClick() {
        this.value = this.long ? 'short\nshort\nshort\nshort\nshort\nshort\nshort\nshort\nshort' : 'long\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\n\n\nlong\nlong\n' + `long


long`;
        this.long = !this.long;
        this.scrollTop = 0;
    }
    async onGesture(dir) {
        await clickgo.form.dialog(this, 'onGesture: ' + dir);
    }
    onBeforechange(e) {
        if (!this.beforechange) {
            return;
        }
        if (e.detail.value === '1345') {
            e.preventDefault();
            return;
        }
        if (e.detail.value === '1346') {
            e.detail.change = '000000';
        }
    }
    onMinMaxChange(e) {
        console.log('onMinMaxChange', e);
    }
}
