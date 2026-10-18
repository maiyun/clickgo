import * as clickgo from 'clickgo';

export default class extends clickgo.form.AbstractForm {

    /** --- 同一日期控件的选择粒度 --- */
    public mode: string[] = ['date'];

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

    /** --- 是否禁用 2026 年 4 月，用于组合测试日期及年月模式 --- */
    public disableMonth: boolean = false;

    /** --- 当前控件的实际变更次数 --- */
    public changes: number = 0;

    /** --- 按当前模式生成同一个禁用月份的对应参数 --- */
    public get disabledList(): string[] {
        if (!this.disableMonth) {
            return [];
        }
        if (this.mode[0] === 'month') {
            return ['202604'];
        }
        return Array.from({ 'length': 30 }, (_item, i) => '202604' + (i + 1).toString().padStart(2, '0'));
    }

    // --- 指定时间戳 ---
    public settime(): void {
        this.ts = clickgo.tool.rand(1504304812000, 1704304812000);
    }

}
