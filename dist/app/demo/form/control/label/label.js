import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    daten = 1672599845;
    date = true;
    time = true;
    zone = true;
    tz = ['08'];
    addDate() {
        this.daten += clickgo.tool.rand(0, 3600);
    }
    /** --- 是否可复制 --- */
    copy = false;
}
