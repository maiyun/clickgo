import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public ntab = '';

    public lineValue = 100;

    public lineCount = 2;

    public sLeft1 = 0;

    public sTop1 = 0;

    public l1 = 0;

    public c1 = 0;

    public sLeft2 = 0;

    public sTop2 = 0;

    public l2 = 0;

    public c2 = 0;

    public sLeft3 = 0;

    public sTop3 = 0;

    public l3 = 0;

    public c3 = 0;

    public sLeft4 = 0;

    public sTop4 = 0;

    public l4 = 0;

    public c4 = 0;

    public direction = false;

    public dir5 = 'v';

    public sLeft5 = 0;

    public sTop5 = 0;

    public l5 = 0;

    public c5 = 0;

    public line5 = 10;

    public c6 = 0;

    public is6: number[] = [];

    public gesture = false;

    public style = false;

    public selection = false;

    public content = false;

    public area = {};

    public get is(): any[] {
        const is = [];
        for (let i = 0; i < this.lineCount; ++i) {
            if (i > 0 && i % 10 === 0) {
                is[i] = 30;
                continue;
            }
        }
        return is;
    }

    public scrollborder(e: MouseEvent | TouchEvent | WheelEvent, dir: string): void {
        if (!this.gesture) {
            return;
        }
        let dirs: any = [];
        switch (dir) {
            case 'h': {
                dirs = ['left', 'right'];
                break;
            }
            default: {
                dirs = ['top', 'bottom'];
                break;
            }
        }
        clickgo.dom.bindGesture(e, {
            'dirs': dirs,
            'handler': (dir) => {
                switch (dir) {
                    case 'left':
                    case 'top': {
                        this.lineCount -= 10;
                        if (this.lineCount < 0) {
                            this.lineCount = 0;
                        }
                        break;
                    }
                    default: {
                        this.lineCount += this.lineValue;
                    }
                }
            }
        });
    }

    public onMounted(): void {
        this.is6[29] = 50;
        this.is6[39] = 50;
    }

}
