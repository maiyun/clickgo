import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.form.AbstractForm {

    public value = '';

    public isFocus = false;

    // --- 属性 ---

    public selectionStart = 0;

    public selectionEnd = 0;

    public scrollLeft = 0;

    public scrollTop = 0;

    public clientHeight = 0;

    public clientWidth = 0;

    public scrollHeight = 0;

    public scrollWidth = 0;

    // --- 操作 ---

    public type = ['text'];

    public disabled = false;

    public readonly = false;

    public adaption = false;

    public scroll = true;

    public wrap = true;

    public menu = false;

    public gesture = false;

    public long = false;

    // --- 样式 ---

    public lineHeight = 1;

    public fontSize = 12;

    public maxlength = 0;

    public prepend = false;

    public append = false;

    public before = false;

    public after = false;

    public border = 'solid';

    public background = undefined;

    public phcolor = undefined;

    public max = undefined;

    public min = undefined;

    public get textBorder(): any {
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

    public longClick(): void {
        this.value = this.long ? 'short\nshort\nshort\nshort\nshort\nshort\nshort\nshort\nshort' : 'long\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\n\n\nlong\nlong\n' + `long


long`;
        this.long = !this.long;
        this.scrollTop = 0;
    }

    public async onGesture(dir: string): Promise<void> {
        await clickgo.form.dialog('onGesture: ' + dir);
    }

    /** --- 是否开启修改拦截 --- */
    public beforechange = false;

    public onBeforechange(e: types.ITextBeforechangeEvent) {
        if (!this.beforechange) {
            return;
        }
        if (e.detail.value === '1345') {
            e.preventDefault();
            return;
        }
        if (e.detail.value === '1346') {
            e.detail.change = '000000'
        }
    }

}
