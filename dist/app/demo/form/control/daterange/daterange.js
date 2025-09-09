import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.time = true;
        this.zone = true;
        this.cclose = true;
        this.ts = [];
        this.tz = undefined;
        this.disabled = false;
        this.start = false;
        this.bottom = false;
    }
    // --- 指定时间戳 ---
    settime() {
        this.ts[0] = clickgo.tool.rand(1504304812000, 1704304812000);
        this.ts[1] = this.ts[0] + 60_000 * 60 * 24 * 30;
    }
}
