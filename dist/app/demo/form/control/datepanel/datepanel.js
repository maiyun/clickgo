import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    bottom = false;
    time = true;
    zone = true;
    /** --- 当前选中的时间戳 --- */
    ts = undefined;
    /** --- 当前设置的日历组件的时区 --- */
    tz = undefined;
    disabled = false;
    plain = false;
    range = false;
    start = false;
    ym = '';
    hm = '';
    dlist = false;
    // --- 指定时间戳 ---
    settime() {
        this.ts = clickgo.tool.rand(1504304812000, 1704304812000);
    }
    onChanged(e) {
        console.log('onChanged', e, JSON.stringify(e));
    }
    onRange(e) {
        console.log('onRange', e);
    }
}
