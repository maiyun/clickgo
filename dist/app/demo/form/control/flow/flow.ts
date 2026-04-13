import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public ntab = '';

    public lineValue = [10];

    public lineCount = 2;

    // --- 1 ---

    public sLeft1 = 0;

    public sTop1 = 0;

    public sWidth1 = 0;

    public sHeight1 = 0;

    public cWidth1 = 0;

    public cHeight1 = 0;

    // --- 2 ---

    public sLeft2 = 0;

    public sTop2 = 0;

    public sWidth2 = 0;

    public sHeight2 = 0;

    public cWidth2 = 0;

    public cHeight2 = 0;

    // --- 3 ---

    public sLeft3 = 0;

    public sTop3 = 0;

    public sWidth3 = 0;

    public sHeight3 = 0;

    public cWidth3 = 0;

    public cHeight3 = 0;

    // --- 4 ---

    public sLeft4 = 0;

    public sTop4 = 0;

    public sWidth4 = 0;

    public sHeight4 = 0;

    public cWidth4 = 0;

    public cHeight4 = 0;

    public direction = false;

    // --- 5 ---

    public dir5 = 'v';

    public sLeft5 = 0;

    public sTop5 = 0;

    public sWidth5 = 0;

    public sHeight5 = 0;

    public cWidth5 = 0;

    public cHeight5 = 0;

    public line5 = 10;

    // --- 6 Eflow state demo ---

    public efState: 'idle' | 'loading' | 'complete' = 'idle';

    public efList: number[] = Array.from({ 'length': 15 }, (_, i) => i + 1);

    // --- 操作 ---

    public gesture = false;

    public style = false;

    public selection = false;

    public sub = false;

    public area = {};

    public async onEfLoad(): Promise<void> {
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

    public changeEfState(newState: 'idle' | 'loading' | 'complete'): void {
        this.efState = newState;
    }

    public async onGesture(dir: string): Promise<void> {
        await clickgo.form.dialog(this, 'onGesture: ' + dir);
    }

}
