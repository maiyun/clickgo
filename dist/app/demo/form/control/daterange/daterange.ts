import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public time: boolean = true;

    public zone: boolean = true;

    public ts: number[] = [];

    public tz?: number = undefined;

    public disabled: boolean = false;

    public start: boolean = false;

    public bottom: boolean = false;

    // --- 指定时间戳 ---
    public settime(): void {
        this.ts[0] = clickgo.tool.rand(1504304812000, 1704304812000);
        this.ts[1] = this.ts[0] + 60_000 * 60 * 24 * 30;
    }

}
