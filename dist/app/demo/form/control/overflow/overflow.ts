export const data = {
    'lineValue': 10,
    'lineCount': 2,

    'sLeft1': 0,
    'sTop1': 0,
    'l1': 0,
    'c1': 0,

    'sLeft2': 0,
    'sTop2': 0,
    'l2': 0,
    'c2': 0,

    'sLeft3': 0,
    'sTop3': 0,
    'l3': 0,
    'c3': 0,

    'sLeft4': 0,
    'sTop4': 0,
    'l4': 0,
    'c4': 0,

    'direction': false,

    'dir5': 'v',
    'sLeft5': 0,
    'sTop5': 0,
    'l5': 0,
    'c5': 0,
    'line5': 10,

    'gesture': false,
    'style': false
};

export const methods = {
    scrollborder: function(this: IVForm, e: MouseEvent | TouchEvent | WheelEvent, dir: string): void {
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
                        (this.lineCount as number) += this.lineValue as number;
                    }
                }
            }
        });
    }
};
