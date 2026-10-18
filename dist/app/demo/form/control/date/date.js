import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    /** --- 同一日期控件的选择粒度 --- */
    mode = ['date'];
    date = true;
    time = true;
    zone = true;
    cclose = true;
    ts = undefined;
    tz = undefined;
    disabled = false;
    start = false;
    bottom = false;
    ym = '';
    hm = '';
    /** --- 是否禁用 2026 年 4 月，用于组合测试日期及年月模式 --- */
    disableMonth = false;
    /** --- 当前控件的实际变更次数 --- */
    changes = 0;
    /** --- 按当前模式生成同一个禁用月份的对应参数 --- */
    get disabledList() {
        if (!this.disableMonth) {
            return [];
        }
        if (this.mode[0] === 'month') {
            return ['202604'];
        }
        return Array.from({ 'length': 30 }, (_item, i) => '202604' + (i + 1).toString().padStart(2, '0'));
    }
    // --- 指定时间戳 ---
    settime() {
        this.ts = clickgo.tool.rand(1504304812000, 1704304812000);
    }
}
