import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    ntab = '';
    lineValue = [100];
    lineCount = 2;
    // --- 1 ---
    sLeft1 = 0;
    sTop1 = 0;
    sWidth1 = 0;
    sHeight1 = 0;
    cWidth1 = 0;
    cHeight1 = 0;
    // --- 2 ---
    sLeft2 = 0;
    sTop2 = 0;
    sWidth2 = 0;
    sHeight2 = 0;
    cWidth2 = 0;
    cHeight2 = 0;
    // --- 3 ---
    sLeft3 = 0;
    sTop3 = 0;
    sWidth3 = 0;
    sHeight3 = 0;
    cWidth3 = 0;
    cHeight3 = 0;
    // --- 4 ---
    sLeft4 = 0;
    sTop4 = 0;
    sWidth4 = 0;
    sHeight4 = 0;
    cWidth4 = 0;
    cHeight4 = 0;
    direction = false;
    // --- 5 ---
    dir5 = 'v';
    sLeft5 = 0;
    sTop5 = 0;
    sWidth5 = 0;
    sHeight5 = 0;
    cWidth5 = 0;
    cHeight5 = 0;
    line5 = 10;
    // --- 6 ---
    cWidth6 = 0;
    is6 = {
        '29': 50,
        '39': 50
    };
    // --- 操作 ---
    gesture = false;
    style = false;
    selection = false;
    content = false;
    area = {};
    get is() {
        const is = [];
        for (let i = 0; i < this.lineCount; ++i) {
            if (i > 0 && i % 10 === 0) {
                is[i] = 30;
                continue;
            }
        }
        return is;
    }
    async onGesture(dir) {
        await clickgo.form.dialog(this, 'onGesture: ' + dir);
    }
}
