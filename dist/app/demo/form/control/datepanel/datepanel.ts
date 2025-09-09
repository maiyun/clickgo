import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    public bottom: boolean = false;

    public time: boolean = true;

    public zone: boolean = true;

    /** --- 当前选中的时间戳 --- */
    public ts?: number = undefined;

    /** --- 当前设置的日历组件的时区 --- */
    public tz?: number = undefined;

    public disabled: boolean = false;

    public plain: boolean = false;

    public range: boolean = false;

    public start: boolean = false;

    public ym: string = '';

    public hm: string = '';

    public dlist: boolean = false;

    // --- 指定时间戳 ---
    public settime(): void {
        this.ts = clickgo.tool.rand(1504304812000, 1704304812000);
    }

    public onChanged(e: clickgo.control.IDatepanelChangedEvent): void {
        console.log('onChanged', e, JSON.stringify(e));
    }

    public onRange(e: clickgo.control.IDatepanelRangeEvent): void {
        console.log('onRange', e);
    }

}
