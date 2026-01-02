import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
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
    // --- 指定时间戳 ---
    settime() {
        this.ts = clickgo.tool.rand(1504304812000, 1704304812000);
    }
}
