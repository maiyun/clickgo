import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public date: boolean = true;

    public time: boolean = true;

    public zone: boolean = true;

    public cclose: boolean = true;

    public ts?: number = undefined;

    public tz?: number = undefined;

    public disabled: boolean = false;

    public start: boolean = false;

    public bottom: boolean = false;

    public ym: string = '';

    public hm: string = '';

    // --- 指定时间戳 ---
    public settime(): void {
        this.ts = clickgo.tool.rand(1504304812000, 1704304812000);
    }

}
