import * as clickgo from 'clickgo';
import * as types from '~/types';

export default class extends clickgo.form.AbstractForm {

    public time: boolean = true;

    public zone: boolean = true;

    public ts: number = 0;

    public tz?: number = undefined;

    public disabled: boolean = false;

    public range = undefined;

    // --- 指定时间戳 ---
    public settime(): void {
        this.ts = clickgo.tool.rand(1504304812000, 1704304812000);
    }

    public async onRange(e: types.IDateRangeEvent) {
        await clickgo.form.dialog(JSON.stringify(e));
    }

}
