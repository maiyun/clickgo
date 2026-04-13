import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    ntab = '';
    lineValue = [10];
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
    // --- 6 Eflow state demo ---
    efState = 'idle';
    efList = Array.from({ 'length': 15 }, (_, i) => i + 1);
    // --- 操作 ---
    gesture = false;
    style = false;
    selection = false;
    sub = false;
    area = {};
    async onEfLoad() {
        this.efState = 'loading';
        // --- 模拟异步加载 ---
        await new Promise(resolve => setTimeout(resolve, 1500));
        // --- 加载更多数据 ---
        const newItems = Array.from({ 'length': 10 }, (_, i) => this.efList[this.efList.length - 1] + i + 1);
        this.efList.push(...newItems);
        // --- 演示目的：加载 2 次后标记为完毕 ---
        if (this.efList.length >= 35) {
            this.efState = 'complete';
        }
        else {
            this.efState = 'idle';
        }
    }
    changeEfState(newState) {
        this.efState = newState;
    }
    async onGesture(dir) {
        await clickgo.form.dialog(this, 'onGesture: ' + dir);
    }
}
