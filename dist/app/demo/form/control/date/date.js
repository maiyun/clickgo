import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.date = true;
        this.time = true;
        this.zone = true;
        this.cclose = true;
        this.ts = undefined;
        this.tz = undefined;
        this.disabled = false;
        this.start = false;
        this.bottom = false;
        this.ym = '';
        this.hm = '';
    }
    // --- 指定时间戳 ---
    settime() {
        this.ts = clickgo.tool.rand(1504304812000, 1704304812000);
    }
}
