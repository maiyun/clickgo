import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.daten = 1672599845;
        this.date = true;
        this.time = true;
        this.zone = true;
        this.tz = ['08'];
        /** --- 是否可复制 --- */
        this.copy = false;
    }
    addDate() {
        this.daten += clickgo.tool.rand(0, 3600);
    }
}
