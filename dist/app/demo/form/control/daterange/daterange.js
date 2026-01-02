import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    time = true;
    zone = true;
    cclose = true;
    ts = [];
    tz = undefined;
    disabled = false;
    start = false;
    bottom = false;
    // --- 指定时间戳 ---
    settime() {
        this.ts[0] = clickgo.tool.rand(1504304812000, 1704304812000);
        this.ts[1] = this.ts[0] + 60_000 * 60 * 24 * 30;
    }
}
