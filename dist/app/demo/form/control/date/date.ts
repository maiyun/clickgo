import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public date: boolean = true;

    public time: boolean = true;

    public zone: boolean = true;

    public ts: number = 0;

    public tz?: number = undefined;

    public disabled: boolean = false;

    // --- 指定时间戳 ---
    public settime(): void {
        this.ts = clickgo.tool.rand(1504304812000, 1704304812000);
    }

}
