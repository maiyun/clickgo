export const data = {
    'ntab': '',

    'lineValue': 100,
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

    'c6': 0,
    'is6': [],

    'gesture': false,
    'style': false,
    'selection': false,
    'area': {}
};

export const computed = {
    'is': function(this: IVForm): any[] {
        const is = [];
        for (let i = 0; i < this.lineCount; ++i) {
            if (i > 0 && i % 10 === 0) {
                is[i] = 30;
                continue;
            }
        }
        return is;
    }
};

export const mounted = function(this: IVForm): void {
    this.is6[29] = 50;
    this.is6[39] = 50;
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
