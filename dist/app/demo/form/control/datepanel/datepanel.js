import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.bottom = false;
        this.time = true;
        this.zone = true;
        /** --- 当前选中的时间戳 --- */
        this.ts = undefined;
        /** --- 当前设置的日历组件的时区 --- */
        this.tz = undefined;
        this.disabled = false;
        this.plain = false;
        this.range = false;
        this.start = false;
        this.ym = '';
        this.hm = '';
        this.dlist = false;
    }
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
