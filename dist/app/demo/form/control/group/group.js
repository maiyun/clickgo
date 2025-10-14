import * as clickgo from 'clickgo';
export default class extends clickgo.form.AbstractForm {
    constructor() {
        super(...arguments);
        this.plain = false;
        this.hover = false;
        this.padding = true;
        this.title = 'The title';
        this.slotTitle = false;
        this.slotRight = false;
        this.slotFooter = false;
        this.position = ['top'];
        this.type = ['default'];
        this.warrow = true;
    }
}
