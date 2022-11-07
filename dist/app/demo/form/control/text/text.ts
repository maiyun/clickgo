import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public value = '';

    public selectionStart = 0;

    public selectionEnd = 0;

    public multi = false;

    public disabled = false;

    public readonly = false;

    public long = false;

    public password = false;

    public wrap = true;

    public menu = false;

    public gesture = false;

    public lineHeight = 1;

    public fontSize = 12;

    public border = 'solid';

    public background = undefined;

    public scrollLeft = 0;

    public scrollTop = 0;

    public length = 0;

    public clientHeight = 0;

    public clientWidth = 0;

    public longClick(): void {
        this.value = this.long ? 'short\nshort\nshort\nshort\nshort\nshort\nshort\nshort\nshort' : 'long\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong\nlong';
        this.long = !this.long;
        this.scrollTop = 0;
    }

    public scrollborder(e: MouseEvent | TouchEvent | WheelEvent): void {
        if (!this.gesture) {
            return;
        }
        clickgo.dom.bindGesture(e, {
            'dirs': this.multi ? ['top', 'bottom'] : ['left', 'right'],
            'handler': (dir) => {
                switch (dir) {
                    case 'left':
                    case 'top': {
                        this.value = this.value.slice(0, -1);
                        break;
                    }
                    default: {
                        this.value += 'A';
                    }
                }
            }
        });
    }

}
