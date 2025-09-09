import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.controls = false;
        this.loop = false;
        this.muted = false;
        this.play = false;
        // --- 一些属性 ---
        this.volume = 50;
    }
}
