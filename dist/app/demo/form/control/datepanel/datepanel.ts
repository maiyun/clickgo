import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public bottom: boolean = false;

    public time: boolean = true;

    public zone: boolean = true;

    /** --- 当前选中的时间戳 --- */
    public ts: number = 0;

    /** --- 当前设置的日历组件的时区 --- */
    public tz?: number = undefined;

    public disabled: boolean = false;

    public plain: boolean = false;

    // --- 指定时间戳 ---
    public settime(): void {
        this.ts = clickgo.tool.rand(1504304812000, 1704304812000);
    }

}
