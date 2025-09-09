import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.ntab = '';
        this.lineValue = [10];
        this.lineCount = 2;
        // --- 1 ---
        this.sLeft1 = 0;
        this.sTop1 = 0;
        this.sWidth1 = 0;
        this.sHeight1 = 0;
        this.cWidth1 = 0;
        this.cHeight1 = 0;
        // --- 2 ---
        this.sLeft2 = 0;
        this.sTop2 = 0;
        this.sWidth2 = 0;
        this.sHeight2 = 0;
        this.cWidth2 = 0;
        this.cHeight2 = 0;
        // --- 3 ---
        this.sLeft3 = 0;
        this.sTop3 = 0;
        this.sWidth3 = 0;
        this.sHeight3 = 0;
        this.cWidth3 = 0;
        this.cHeight3 = 0;
        // --- 4 ---
        this.sLeft4 = 0;
        this.sTop4 = 0;
        this.sWidth4 = 0;
        this.sHeight4 = 0;
        this.cWidth4 = 0;
        this.cHeight4 = 0;
        this.direction = false;
        // --- 5 ---
        this.dir5 = 'v';
        this.sLeft5 = 0;
        this.sTop5 = 0;
        this.sWidth5 = 0;
        this.sHeight5 = 0;
        this.cWidth5 = 0;
        this.cHeight5 = 0;
        this.line5 = 10;
        // --- 操作 ---
        this.gesture = false;
        this.style = false;
        this.selection = false;
        this.sub = false;
        this.area = {};
    }
    async onGesture(dir) {
        await clickgo.form.dialog(this, 'onGesture: ' + dir);
    }
}
