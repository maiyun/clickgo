import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    value = '';
    nvalue = '';
    isFocus = false;
    nisFocus = false;
    // --- 属性 ---
    selectionStart = 0;
    selectionEnd = 0;
    scrollLeft = 0;
    scrollTop = 0;
    clientHeight = 0;
    clientWidth = 0;
    scrollHeight = 0;
    scrollWidth = 0;
    // --- 操作 ---
    type = ['text'];
    disabled = false;
    placeholder = 'placeholder';
    readonly = false;
    scroll = true;
    wrap = true;
    menu = false;
    gesture = false;
    long = false;
    // --- 样式 ---
    lineHeight = 1;
    fontSize = 12;
    maxlength = 0;
    keyboard = false;
    prepend = false;
    append = false;
    before = false;
    after = false;
    border = 'solid';
    background = undefined;
    phcolor = undefined;
    max = undefined;
    min = undefined;
    plain = false;
    require = false;
    padding = ['m'];
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
    /** --- 是否开启修改拦截 --- */
    beforechange = false;
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
